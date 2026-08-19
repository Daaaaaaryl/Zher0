"use strict";

const COMBAT_STATE_ID_PATTERN=/^[a-z][a-z0-9_]*$/;
const COMBAT_STAT_IDS=["HP","PA","PD","MA","MD","SP"];
const COMBAT_SOURCE_TYPES=new Set(["monster","player"]);
const COMBAT_ACTOR_STATES=new Set(["active","defeated"]);
const COMBAT_BATTLE_STATUSES=new Set(["setup","active","complete"]);
const COMBAT_MODIFIER_OPERATIONS=new Set(["add","multiply","replace"]);

function validateCombatActor(actor,references={}){
  const errors=[];
  const addError=(code,path,message)=>errors.push({code,path,message});
  const monsters=new Set((references?.monsterData?.monsters?.monsters||[]).map(item=>item.id));
  const abilities=new Set((references?.abilityData?.abilities||[]).map(item=>item.id));
  const statuses=new Set((references?.statusData?.statusEffects||[]).map(item=>item.id));

  if(!actor||typeof actor!=="object"||Array.isArray(actor))return {valid:false,errors:[{code:"malformed_actor",path:"actor",message:"Combat actor must be an object"}]};
  if(typeof actor.actorId!=="string"||!COMBAT_STATE_ID_PATTERN.test(actor.actorId))addError("malformed_actor_id","actor.actorId","actorId must be stable and ASCII-safe");
  if(!COMBAT_SOURCE_TYPES.has(actor.sourceType))addError("invalid_source_type","actor.sourceType",`Unknown actor source type '${actor.sourceType}'`);
  if(typeof actor.sourceId!=="string"||!COMBAT_STATE_ID_PATTERN.test(actor.sourceId))addError("missing_source_id","actor.sourceId","sourceId must be a stable non-empty identifier");
  else if(actor.sourceType==="monster"&&!monsters.has(actor.sourceId))addError("unknown_monster_source","actor.sourceId",`Unknown monster source '${actor.sourceId}'`);
  if(typeof actor.teamId!=="string"||!COMBAT_STATE_ID_PATTERN.test(actor.teamId))addError("malformed_team_id","actor.teamId","teamId must be stable and ASCII-safe");

  ["baseStats","currentStats"].forEach(field=>{
    const stats=actor[field];
    if(!stats||typeof stats!=="object"||Array.isArray(stats)){addError("malformed_stats",`actor.${field}`,`${field} must be an object`);return}
    const keys=Object.keys(stats);
    COMBAT_STAT_IDS.forEach(statId=>{
      if(!keys.includes(statId))addError("missing_stat",`actor.${field}`,`${field} is missing '${statId}'`);
      else if(typeof stats[statId]!=="number"||!Number.isFinite(stats[statId]))addError("non_finite_stat",`actor.${field}.${statId}`,`${statId} must be finite`);
      else if(!Number.isInteger(stats[statId]))addError("non_integer_stat",`actor.${field}.${statId}`,`${statId} must be an integer`);
      else if(stats[statId]<0)addError("negative_stat",`actor.${field}.${statId}`,`${statId} cannot be negative`);
    });
    keys.forEach(statId=>{if(!COMBAT_STAT_IDS.includes(statId))addError("extra_stat",`actor.${field}.${statId}`,`Unknown stat '${statId}'`)});
  });

  if(typeof actor.currentHP!=="number"||!Number.isFinite(actor.currentHP)||!Number.isInteger(actor.currentHP)||actor.currentHP<0)addError("invalid_current_hp","actor.currentHP","currentHP must be a non-negative finite integer");
  else if(Number.isFinite(actor.currentStats?.HP)&&actor.currentHP>actor.currentStats.HP)addError("current_hp_above_max","actor.currentHP","currentHP cannot exceed currentStats.HP");
  if(!COMBAT_ACTOR_STATES.has(actor.state))addError("invalid_actor_state","actor.state",`Unknown actor state '${actor.state}'`);
  else if(actor.state==="active"&&actor.currentHP===0)addError("actor_state_hp_mismatch","actor.state","An active actor must have positive currentHP");
  else if(actor.state==="defeated"&&actor.currentHP>0)addError("actor_state_hp_mismatch","actor.state","A defeated actor must have zero currentHP");

  if(!Array.isArray(actor.abilityIds))addError("malformed_ability_ids","actor.abilityIds","abilityIds must be an array");
  else{
    const seen=new Set();
    actor.abilityIds.forEach((abilityId,index)=>{
      if(!abilities.has(abilityId))addError("unknown_ability",`actor.abilityIds[${index}]`,`Unknown ability '${abilityId}'`);
      if(seen.has(abilityId))addError("duplicate_ability",`actor.abilityIds[${index}]`,`Ability '${abilityId}' is duplicated`);
      seen.add(abilityId);
    });
  }

  if(!Array.isArray(actor.activeStatuses))addError("malformed_active_statuses","actor.activeStatuses","activeStatuses must be an array");
  else{
    const instanceIds=new Set();
    actor.activeStatuses.forEach((instance,index)=>{
      const path=`actor.activeStatuses[${index}]`;
      if(!instance||typeof instance!=="object"||Array.isArray(instance)){addError("malformed_active_status",path,"Active status instance must be an object");return}
      if(typeof instance.instanceId!=="string"||!COMBAT_STATE_ID_PATTERN.test(instance.instanceId))addError("malformed_active_status",`${path}.instanceId`,"Status instanceId must be ASCII-safe");
      if(instanceIds.has(instance.instanceId))addError("duplicate_status_instance_id",`${path}.instanceId`,`Status instance '${instance.instanceId}' is duplicated`);else instanceIds.add(instance.instanceId);
      if(!statuses.has(instance.statusId))addError("unknown_status",`${path}.statusId`,`Unknown status '${instance.statusId}'`);
      if(typeof instance.sourceActorId!=="string"||!COMBAT_STATE_ID_PATTERN.test(instance.sourceActorId))addError("malformed_active_status",`${path}.sourceActorId`,"sourceActorId must be ASCII-safe");
      if(instance.remainingDuration!==null&&(!Number.isInteger(instance.remainingDuration)||instance.remainingDuration<0))addError("malformed_active_status",`${path}.remainingDuration`,"remainingDuration must be null or a non-negative integer");
      if(!Number.isInteger(instance.stacks)||instance.stacks<1)addError("malformed_active_status",`${path}.stacks`,"stacks must be a positive integer");
    });
  }

  if(!actor.cooldowns||typeof actor.cooldowns!=="object"||Array.isArray(actor.cooldowns))addError("malformed_cooldown_map","actor.cooldowns","cooldowns must be an object");
  else Object.entries(actor.cooldowns).forEach(([abilityId,value])=>{
    if(!abilities.has(abilityId))addError("unknown_cooldown_ability",`actor.cooldowns.${abilityId}`,`Unknown cooldown ability '${abilityId}'`);
    if(!Number.isInteger(value)||value<0)addError("negative_cooldown",`actor.cooldowns.${abilityId}`,"Cooldown must be a non-negative integer");
  });

  if(!Array.isArray(actor.temporaryModifiers))addError("malformed_temporary_modifiers","actor.temporaryModifiers","temporaryModifiers must be an array");
  else actor.temporaryModifiers.forEach((modifier,index)=>{
    const path=`actor.temporaryModifiers[${index}]`;
    if(!modifier||typeof modifier!=="object"||Array.isArray(modifier)||!COMBAT_STAT_IDS.includes(modifier.statId)||!COMBAT_MODIFIER_OPERATIONS.has(modifier.operation)||typeof modifier.value!=="number"||!Number.isFinite(modifier.value))addError("malformed_temporary_modifier",path,"Temporary modifier requires a canonical statId, supported operation, and finite value");
  });
  return {valid:errors.length===0,errors};
}

function assertValidCombatActor(actor,references={}){
  const result=validateCombatActor(actor,references);
  if(!result.valid){const error=new Error(`Combat actor validation failed with ${result.errors.length} error(s)`);error.validation=result;throw error}
  return result;
}

function validateBattleState(battleState,references={}){
  const errors=[];
  const addError=(code,path,message)=>errors.push({code,path,message});
  if(!battleState||typeof battleState!=="object"||Array.isArray(battleState))return {valid:false,errors:[{code:"malformed_battle_state",path:"battleState",message:"Battle state must be an object"}]};
  if(typeof battleState.battleId!=="string"||!COMBAT_STATE_ID_PATTERN.test(battleState.battleId))addError("invalid_battle_id","battleState.battleId","battleId must be stable and ASCII-safe");
  if(!COMBAT_BATTLE_STATUSES.has(battleState.status))addError("invalid_battle_status","battleState.status",`Unknown battle status '${battleState.status}'`);
  ["round","turn"].forEach(field=>{if(!Number.isInteger(battleState[field])||battleState[field]<0)addError("invalid_battle_counter",`battleState.${field}`,`${field} must be a non-negative integer`)});
  if(!Array.isArray(battleState.eventLog))addError("malformed_event_log","battleState.eventLog","eventLog must be an array");
  const actors=Array.isArray(battleState.actors)?battleState.actors:[];
  if(!Array.isArray(battleState.actors))addError("malformed_battle_actors","battleState.actors","actors must be an array");
  const actorIds=new Set();
  actors.forEach((actor,index)=>{
    const validation=validateCombatActor(actor,references);
    validation.errors.forEach(error=>addError(error.code,`battleState.actors[${index}].${error.path.replace(/^actor\.?/,"")}`,error.message));
    if(actorIds.has(actor?.actorId))addError("duplicate_battle_actor",`battleState.actors[${index}].actorId`,`Actor '${actor?.actorId}' is duplicated`);else if(actor?.actorId)actorIds.add(actor.actorId);
  });
  if(battleState.activeActorId!==null&&!actorIds.has(battleState.activeActorId))addError("invalid_active_actor_id","battleState.activeActorId",`Unknown active actor '${battleState.activeActorId}'`);
  return {valid:errors.length===0,counts:{actors:actors.length},errors};
}

function assertValidBattleState(battleState,references={}){
  const result=validateBattleState(battleState,references);
  if(!result.valid){const error=new Error(`Battle state validation failed with ${result.errors.length} error(s)`);error.validation=result;throw error}
  return result;
}
