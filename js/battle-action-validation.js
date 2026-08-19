"use strict";

const BATTLE_ACTION_ID_PATTERN=/^[a-z][a-z0-9_]*$/;
const BATTLE_ACTION_TYPES=new Set(["attack","defend"]);
const BATTLE_ACTION_PRIORITIES=new Set(["urgent","high","normal","low"]);
const BATTLE_ACTION_STATES=new Set(["committed"]);

function battleActionContainsExecutable(value,seen=new Set()){
  if(typeof value==="function")return true;
  if(!value||typeof value!=="object"||seen.has(value))return false;
  seen.add(value);
  return Object.values(value).some(item=>battleActionContainsExecutable(item,seen));
}

function validateBattleAction(action,references={}){
  const errors=[];
  const addError=(code,path,message)=>errors.push({code,path,message});
  const actors=new Map((references?.battleState?.actors||[]).map(item=>[item.actorId,item]));
  const abilities=new Set((references?.abilityData?.abilities||[]).map(item=>item.id));
  const equipment=new Set((references?.equipmentData?.equipment||[]).map(item=>item.id));
  if(!action||typeof action!=="object"||Array.isArray(action))return {valid:false,errors:[{code:"malformed_action",path:"action",message:"Battle Action must be an object"}]};
  if(typeof action.actionId!=="string"||!BATTLE_ACTION_ID_PATTERN.test(action.actionId))addError("malformed_action_id","action.actionId","actionId must be stable and ASCII-safe");
  if(typeof action.actorId!=="string"||!BATTLE_ACTION_ID_PATTERN.test(action.actorId))addError("malformed_actor_id","action.actorId","actorId must be stable and ASCII-safe");
  const actor=actors.get(action.actorId);
  if(!actor)addError("unknown_actor","action.actorId",`Unknown battle actor '${action.actorId}'`);
  if(!BATTLE_ACTION_TYPES.has(action.actionType))addError("invalid_action_type","action.actionType",`Unknown action type '${action.actionType}'`);
  if(action.actionType==="attack"){
    if(typeof action.abilityId!=="string"||!BATTLE_ACTION_ID_PATTERN.test(action.abilityId))addError("malformed_ability_reference","action.abilityId","Attack action requires an ASCII-safe ability ID");
    else if(!abilities.has(action.abilityId))addError("unknown_ability","action.abilityId",`Unknown ability '${action.abilityId}'`);
  }else if(action.abilityId!==null)addError("malformed_ability_reference","action.abilityId","Non-attack action abilityId must be null");
  if(action.equipmentId!==null){
    if(typeof action.equipmentId!=="string"||!BATTLE_ACTION_ID_PATTERN.test(action.equipmentId))addError("malformed_equipment_reference","action.equipmentId","equipmentId must be null or ASCII-safe");
    else if(equipment.size&&!equipment.has(action.equipmentId))addError("unknown_equipment","action.equipmentId",`Unknown equipment '${action.equipmentId}'`);
  }
  if(!Array.isArray(action.targetActorIds))addError("malformed_target_list","action.targetActorIds","targetActorIds must be an array");
  else{
    const seen=new Set();
    action.targetActorIds.forEach((targetId,index)=>{
      if(typeof targetId!=="string"||!BATTLE_ACTION_ID_PATTERN.test(targetId)||!actors.has(targetId))addError("unknown_target",`action.targetActorIds[${index}]`,`Unknown target actor '${targetId}'`);
      if(seen.has(targetId))addError("duplicate_target",`action.targetActorIds[${index}]`,`Target '${targetId}' is duplicated`);else seen.add(targetId);
    });
  }
  if(!BATTLE_ACTION_PRIORITIES.has(action.priority))addError("invalid_priority","action.priority",`Unknown Priority '${action.priority}'`);
  if(typeof action.baseSP!=="number"||!Number.isFinite(action.baseSP)||!Number.isInteger(action.baseSP)||action.baseSP<0)addError("malformed_base_sp","action.baseSP","baseSP must be a finite non-negative integer");
  else if(actor&&action.baseSP!==actor.currentStats.SP)addError("inconsistent_actor_action","action.baseSP","baseSP must snapshot actor.currentStats.SP");
  if(!Array.isArray(action.spModifiers))addError("malformed_sp_modifier","action.spModifiers","spModifiers must be an array");
  else action.spModifiers.forEach((modifier,index)=>{
    const path=`action.spModifiers[${index}]`;
    if(!modifier||typeof modifier!=="object"||Array.isArray(modifier)||typeof modifier.source!=="string"||!modifier.source||typeof modifier.value!=="number")addError("malformed_sp_modifier",path,"SP modifier requires a non-empty source and numeric value");
    else if(!Number.isFinite(modifier.value))addError("non_finite_sp_modifier",`${path}.value`,"SP modifier must be finite");
    else if(!Number.isInteger(modifier.value))addError("malformed_sp_modifier",`${path}.value`,"SP modifier must be an integer");
  });
  if(typeof action.spOutput!=="number"||!Number.isFinite(action.spOutput)||!Number.isInteger(action.spOutput))addError("malformed_sp_output","action.spOutput","SP Output must be a finite integer");
  else if(action.spOutput<0)addError("negative_sp_output","action.spOutput","SP Output cannot be negative");
  else if(Number.isFinite(action.baseSP)&&Array.isArray(action.spModifiers)&&action.spModifiers.every(item=>Number.isInteger(item?.value))&&action.spOutput!==Math.max(0,action.baseSP+action.spModifiers.reduce((sum,item)=>sum+item.value,0)))addError("inconsistent_sp_output","action.spOutput","SP Output must equal clamped baseSP plus modifiers");
  if(!BATTLE_ACTION_STATES.has(action.state))addError("invalid_action_state","action.state",`Unknown action state '${action.state}'`);
  if(battleActionContainsExecutable(action))addError("executable_value","action","Battle Action must be data-only");
  return {valid:errors.length===0,errors};
}

function assertValidBattleAction(action,references={}){
  const result=validateBattleAction(action,references);
  if(!result.valid){const error=new Error(`Battle Action validation failed with ${result.errors.length} error(s)`);error.validation=result;throw error}
  return result;
}

function validateBattleActions(actions,references={}){
  if(!Array.isArray(actions))return {valid:false,errors:[{code:"malformed_action_list",path:"actions",message:"Battle Actions must be an array"}]};
  const errors=[],ids=new Set();
  actions.forEach((action,index)=>{
    validateBattleAction(action,references).errors.forEach(error=>errors.push({...error,path:`actions[${index}].${error.path.replace(/^action\.?/,"")}`}));
    if(ids.has(action?.actionId))errors.push({code:"duplicate_action_id",path:`actions[${index}].actionId`,message:`Action '${action?.actionId}' is duplicated`});else if(action?.actionId)ids.add(action.actionId);
  });
  return {valid:errors.length===0,count:actions.length,errors};
}

function assertValidBattleActions(actions,references={}){
  const result=validateBattleActions(actions,references);
  if(!result.valid){const error=new Error(`Battle Action list validation failed with ${result.errors.length} error(s)`);error.validation=result;throw error}
  return result;
}
