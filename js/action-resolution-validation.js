"use strict";

const ACTION_RESOLUTION_PRIORITIES=new Set(["urgent","high","normal","low"]);
const ACTION_RESOLUTION_MODES=new Set(["ordered","simultaneous"]);
const ACTION_RESOLUTION_ID_PATTERN=/^[a-z][a-z0-9_]*$/;
const ACTION_RESOLUTION_VALIDATION_PRIORITY_RANKS=Object.freeze({urgent:3,high:2,normal:1,low:0});

function actionResolutionValidationContainsExecutable(value,seen=new Set()){
  if(typeof value==="function")return true;
  if(!value||typeof value!=="object"||seen.has(value))return false;
  seen.add(value);
  return Object.values(value).some(item=>actionResolutionValidationContainsExecutable(item,seen));
}

function validateCommittedAction(action){
  const errors=[];
  const addError=(code,path,message)=>errors.push({code,path,message});
  if(!action||typeof action!=="object"||Array.isArray(action))return {valid:false,errors:[{code:"malformed_action",path:"action",message:"Committed action must be an object"}]};
  if(typeof action.actionId!=="string"||!ACTION_RESOLUTION_ID_PATTERN.test(action.actionId))addError("malformed_action_id","action.actionId","actionId must be stable and ASCII-safe");
  if(!ACTION_RESOLUTION_PRIORITIES.has(action.priority))addError("invalid_priority","action.priority",`Unknown Priority '${action.priority}'`);
  if(typeof action.spOutput!=="number"||!Number.isFinite(action.spOutput)||!Number.isInteger(action.spOutput)||action.spOutput<0)addError("invalid_sp_output","action.spOutput","SP Output must be a finite non-negative integer");
  if(action.state!=="committed")addError("non_committed_action","action.state","Resolution planning requires a committed action");
  if(actionResolutionValidationContainsExecutable(action))addError("executable_value","action","Committed action must be data-only");
  return {valid:errors.length===0,errors};
}

function validateCommittedActions(actions){
  if(!Array.isArray(actions))return {valid:false,errors:[{code:"malformed_action_list",path:"actions",message:"Committed actions must be an array"}]};
  const errors=[],ids=new Set();
  actions.forEach((action,index)=>{
    validateCommittedAction(action).errors.forEach(error=>errors.push({...error,path:`actions[${index}].${error.path.replace(/^action\\.?/,"")}`}));
    if(ids.has(action?.actionId))errors.push({code:"duplicate_action_id",path:`actions[${index}].actionId`,message:`Action '${action?.actionId}' is duplicated`});
    else if(typeof action?.actionId==="string")ids.add(action.actionId);
  });
  return {valid:errors.length===0,count:actions.length,errors};
}

function assertValidCommittedActions(actions){
  const result=validateCommittedActions(actions);
  if(!result.valid){const error=new Error(`Committed action validation failed with ${result.errors.length} error(s)`);error.validation=result;throw error}
  return result;
}

function validateActionResolutionPlan(plan,actions=[]){
  const errors=[];
  const addError=(code,path,message)=>errors.push({code,path,message});
  if(!plan||typeof plan!=="object"||Array.isArray(plan))return {valid:false,errors:[{code:"malformed_plan",path:"plan",message:"Resolution plan must be an object"}]};
  if(actionResolutionValidationContainsExecutable(plan))addError("executable_value","plan","Resolution plan must be data-only");
  if(!Array.isArray(plan.groups)){addError("malformed_plan","plan.groups","Resolution plan groups must be an array");return {valid:false,errors}}
  const actionValidation=validateCommittedActions(actions);
  actionValidation.errors.forEach(error=>addError(error.code,error.path,error.message));
  const actionIds=new Set((actions||[]).map(action=>action?.actionId).filter(id=>typeof id==="string"));
  const referenced=new Set();
  let previous=null;
  plan.groups.forEach((group,index)=>{
    const path=`plan.groups[${index}]`;
    if(!group||typeof group!=="object"||Array.isArray(group)){addError("malformed_group",path,"Resolution group must be an object");return}
    if(!ACTION_RESOLUTION_PRIORITIES.has(group.priority))addError("invalid_priority",`${path}.priority`,`Unknown Priority '${group.priority}'`);
    if(typeof group.spOutput!=="number"||!Number.isFinite(group.spOutput)||!Number.isInteger(group.spOutput)||group.spOutput<0)addError("invalid_sp_output",`${path}.spOutput`,"SP Output must be a finite non-negative integer");
    if(!ACTION_RESOLUTION_MODES.has(group.mode))addError("invalid_mode",`${path}.mode`,"Resolution group mode must be ordered or simultaneous");
    if(!Array.isArray(group.actionIds))addError("malformed_group",`${path}.actionIds`,"Resolution group actionIds must be an array");
    else{
      if(group.mode==="simultaneous"&&group.actionIds.length<2)addError("invalid_cardinality",`${path}.actionIds`,"Simultaneous groups require at least two actions");
      if(group.mode==="ordered"&&group.actionIds.length!==1)addError("invalid_cardinality",`${path}.actionIds`,"Ordered groups require exactly one action");
      group.actionIds.forEach((actionId,actionIndex)=>{
        const actionPath=`${path}.actionIds[${actionIndex}]`;
        if(typeof actionId!=="string"||!ACTION_RESOLUTION_ID_PATTERN.test(actionId))addError("malformed_action_reference",actionPath,"Action reference must be stable and ASCII-safe");
        if(referenced.has(actionId))addError("duplicate_action_reference",actionPath,`Action '${actionId}' is referenced more than once`);
        referenced.add(actionId);
        if(actions.length&&!actionIds.has(actionId))addError("missing_action_reference",actionPath,`Action '${actionId}' is not supplied to validation`);
      });
    }
    if(previous&&ACTION_RESOLUTION_PRIORITIES.has(group.priority)&&ACTION_RESOLUTION_PRIORITIES.has(previous.priority)){
      const priorityDifference=ACTION_RESOLUTION_VALIDATION_PRIORITY_RANKS[previous.priority]-ACTION_RESOLUTION_VALIDATION_PRIORITY_RANKS[group.priority];
      if(priorityDifference<0)addError("incorrect_group_order",path,"Groups must be ordered from higher Priority to lower Priority");
      else if(priorityDifference===0&&previous.spOutput<group.spOutput)addError("incorrect_group_order",path,"Groups with equal Priority must be ordered from higher SP Output to lower SP Output");
    }
    previous=group;
  });
  if(actions.length)actionIds.forEach(actionId=>{if(!referenced.has(actionId))addError("missing_action_reference","plan.groups",`Committed action '${actionId}' is missing from the plan`)});
  return {valid:errors.length===0,errors};
}

function assertValidActionResolutionPlan(plan,actions=[]){
  const result=validateActionResolutionPlan(plan,actions);
  if(!result.valid){const error=new Error(`Action resolution plan validation failed with ${result.errors.length} error(s)`);error.validation=result;throw error}
  return result;
}
