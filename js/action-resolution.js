"use strict";

const ACTION_RESOLUTION_PRIORITY_RANKS=Object.freeze({urgent:3,high:2,normal:1,low:0});

function cloneActionResolutionValue(value){
  if(typeof structuredClone==="function")return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function actionResolutionContainsExecutable(value,seen=new Set()){
  if(typeof value==="function")return true;
  if(!value||typeof value!=="object"||seen.has(value))return false;
  seen.add(value);
  return Object.values(value).some(item=>actionResolutionContainsExecutable(item,seen));
}

function groupCommittedActions(actions){
  if(typeof assertValidCommittedActions!=="function")throw new Error("action-resolution-validation.js must load before action-resolution.js");
  assertValidCommittedActions(actions);
  const grouped=new Map();
  actions.forEach(action=>{
    const key=`${action.priority}|${action.spOutput}`;
    if(!grouped.has(key))grouped.set(key,{priority:action.priority,spOutput:action.spOutput,actions:[]});
    grouped.get(key).actions.push(action);
  });
  return [...grouped.values()]
    .sort((left,right)=>ACTION_RESOLUTION_PRIORITY_RANKS[right.priority]-ACTION_RESOLUTION_PRIORITY_RANKS[left.priority]||right.spOutput-left.spOutput)
    .map(group=>{
      const actionIds=group.actions.map(action=>action.actionId);
      const simultaneous=actionIds.length>1;
      return {
        priority:group.priority,
        spOutput:group.spOutput,
        mode:simultaneous?"simultaneous":"ordered",
        actionIds
      };
    });
}

function createActionResolutionPlan(actions,options={}){
  if(options!==undefined&&(!options||typeof options!=="object"||Array.isArray(options)))throw new Error("Action resolution options must be an object");
  if(actionResolutionContainsExecutable(options))throw new Error("Action resolution options must be data-only");
  const plan={groups:groupCommittedActions(actions)};
  if(typeof assertValidActionResolutionPlan!=="function")throw new Error("action-resolution-validation.js must load before action-resolution.js");
  assertValidActionResolutionPlan(plan,actions);
  return cloneActionResolutionValue(plan);
}

function getResolutionGroups(plan){
  if(typeof assertValidActionResolutionPlan!=="function")throw new Error("action-resolution-validation.js must load before action-resolution.js");
  assertValidActionResolutionPlan(plan);
  return cloneActionResolutionValue(plan.groups);
}

function getSimultaneousGroups(plan){
  return getResolutionGroups(plan).filter(group=>group.mode==="simultaneous");
}

function getOrderedGroups(plan){
  return getResolutionGroups(plan).filter(group=>group.mode==="ordered");
}
