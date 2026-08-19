"use strict";

const BATTLE_ACTION_PRIORITY_RANKS=Object.freeze({urgent:3,high:2,normal:1,low:0});

function cloneBattleActionValue(value){
  if(typeof structuredClone==="function")return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function battleActionReferences(options={}){
  return {
    battleState:options.battleState,
    abilityData:options.abilityData||(typeof ABILITY_DATA_RUNTIME!=="undefined"?ABILITY_DATA_RUNTIME:null),
    equipmentData:options.equipmentData||(typeof GAME_DATA_RUNTIME!=="undefined"?GAME_DATA_RUNTIME.equipment:null)
  };
}

function calculateSPOutput(actor,modifiers=[]){
  if(!actor||!actor.currentStats)throw new Error("SP Output requires a combat actor");
  if(!Number.isInteger(actor.currentStats.SP)||actor.currentStats.SP<0)throw new Error("Actor SP must be a non-negative integer");
  if(!Array.isArray(modifiers))throw new Error("SP modifiers must be an array");
  const adjustment=modifiers.reduce((sum,modifier,index)=>{
    if(!modifier||typeof modifier!=="object"||Array.isArray(modifier)||typeof modifier.source!=="string"||!modifier.source||!Number.isInteger(modifier.value))throw new Error(`Invalid SP modifier at index ${index}`);
    return sum+modifier.value;
  },0);
  return Math.max(0,actor.currentStats.SP+adjustment);
}

function createBattleAction(config,options={}){
  if(!config||typeof config!=="object"||Array.isArray(config))throw new Error("Battle Action config must be an object");
  const references=battleActionReferences(options);
  const actor=(references.battleState?.actors||[]).find(item=>item.actorId===config.actorId);
  if(!actor)throw new Error(`Unknown battle actor '${config.actorId}'`);
  const spModifiers=cloneBattleActionValue(config.spModifiers||[]);
  const action={
    actionId:config.actionId,
    actorId:config.actorId,
    actionType:config.actionType,
    abilityId:config.abilityId===undefined?null:config.abilityId,
    equipmentId:config.equipmentId===undefined?null:config.equipmentId,
    targetActorIds:cloneBattleActionValue(config.targetActorIds||[]),
    priority:config.priority,
    baseSP:actor.currentStats.SP,
    spModifiers,
    spOutput:calculateSPOutput(actor,spModifiers),
    state:"committed"
  };
  if(typeof assertValidBattleAction!=="function")throw new Error("battle-action-validation.js must load before battle-action.js");
  assertValidBattleAction(action,references);
  return action;
}

function compareActionPriority(actionA,actionB){
  const rankA=BATTLE_ACTION_PRIORITY_RANKS[actionA.priority],rankB=BATTLE_ACTION_PRIORITY_RANKS[actionB.priority];
  if(rankA===undefined||rankB===undefined)throw new Error("Cannot compare an unknown Priority tier");
  if(rankA===rankB)return {result:"tie",reason:"equal_priority",priority:actionA.priority};
  return {result:rankA>rankB?"a_first":"b_first",reason:"higher_priority",priorityA:actionA.priority,priorityB:actionB.priority};
}

function compareSPOutput(actionA,actionB){
  if(!Number.isFinite(actionA.spOutput)||!Number.isFinite(actionB.spOutput))throw new Error("Cannot compare malformed SP Output");
  if(actionA.spOutput===actionB.spOutput)return {result:"tie",reason:"equal_sp_output",spOutput:actionA.spOutput};
  return {result:actionA.spOutput>actionB.spOutput?"a_first":"b_first",reason:"higher_sp_output",spOutputA:actionA.spOutput,spOutputB:actionB.spOutput};
}

function compareBattleActions(actionA,actionB){
  const priority=compareActionPriority(actionA,actionB);
  if(priority.result!=="tie")return priority;
  const sp=compareSPOutput(actionA,actionB);
  if(sp.result!=="tie")return sp;
  return {result:"tie",reason:"equal_priority_and_sp_output",priority:actionA.priority,spOutput:actionA.spOutput};
}

function orderBattleActions(actions,references={}){
  if(typeof assertValidBattleActions!=="function")throw new Error("battle-action-validation.js must load before battle-action.js");
  assertValidBattleActions(actions,references);
  const groups=new Map();
  actions.forEach(action=>{
    const key=`${action.priority}|${action.spOutput}`;
    if(!groups.has(key))groups.set(key,{priority:action.priority,spOutput:action.spOutput,actions:[]});
    groups.get(key).actions.push(action);
  });
  return [...groups.values()]
    .sort((a,b)=>BATTLE_ACTION_PRIORITY_RANKS[b.priority]-BATTLE_ACTION_PRIORITY_RANKS[a.priority]||b.spOutput-a.spOutput)
    .map(group=>({result:group.actions.length>1?"tie":"ordered",reason:group.actions.length>1?"equal_priority_and_sp_output":"ordered_by_priority_and_sp_output",priority:group.priority,spOutput:group.spOutput,actions:cloneBattleActionValue(group.actions)}));
}
