"use strict";

function cloneCombatValue(value){
  if(typeof structuredClone==="function")return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function combatStateReferences(options={}){
  return {
    monsterData:options.monsterData||(typeof MONSTER_DATA_RUNTIME!=="undefined"?MONSTER_DATA_RUNTIME:null),
    abilityData:options.abilityData||(typeof ABILITY_DATA_RUNTIME!=="undefined"?ABILITY_DATA_RUNTIME:null),
    statusData:options.statusData||(typeof STATUS_DATA_RUNTIME!=="undefined"?STATUS_DATA_RUNTIME:null)
  };
}

// Canonical definitions are read-only inputs. Every object placed on an actor is
// cloned so the returned battle instance can evolve without mutating its source.
function createCombatActor(config,options={}){
  if(!config||typeof config!=="object"||Array.isArray(config))throw new Error("Combat actor config must be an object");
  const suppliedStats=config.baseStats||config.stats;
  const baseStats=cloneCombatValue(suppliedStats||{});
  const currentStats=cloneCombatValue(config.currentStats||baseStats);
  const actor={
    actorId:config.actorId,
    sourceType:config.sourceType,
    sourceId:config.sourceId,
    teamId:config.teamId,
    baseStats,
    currentStats,
    currentHP:config.currentHP===undefined?currentStats.HP:config.currentHP,
    abilityIds:cloneCombatValue(config.abilityIds||[]),
    activeStatuses:cloneCombatValue(config.activeStatuses||[]),
    cooldowns:cloneCombatValue(config.cooldowns||{}),
    temporaryModifiers:cloneCombatValue(config.temporaryModifiers||[]),
    state:config.state||"active"
  };
  if(typeof assertValidCombatActor!=="function")throw new Error("combat-state-validation.js must load before combat-state.js");
  assertValidCombatActor(actor,combatStateReferences(options));
  return actor;
}

function createMonsterCombatActor(monsterId,budget,options={}){
  if(typeof getMonster!=="function"||typeof calculateMonsterStats!=="function")throw new Error("Monster and monster-stat runtimes must load before creating a monster combat actor");
  const monster=getMonster(monsterId);
  if(!monster)throw new Error(`Unknown monster '${monsterId}'`);
  const stats=calculateMonsterStats(monsterId,budget,options.statModifiers||{});
  return createCombatActor({
    actorId:options.actorId,
    sourceType:"monster",
    sourceId:monster.id,
    teamId:options.teamId,
    baseStats:stats,
    currentStats:stats,
    currentHP:stats.HP,
    abilityIds:[...monster.attackIds,...monster.passiveIds],
    activeStatuses:[],
    cooldowns:{},
    temporaryModifiers:[],
    state:"active"
  },options);
}

function createBattleState(config={},options={}){
  // Battle state is intentionally mutable runtime state; callers can clone it
  // explicitly when they need an isolated snapshot.
  const battleState={
    battleId:config.battleId||"battle",
    actors:cloneCombatValue(config.actors||[]),
    round:config.round===undefined?0:config.round,
    turn:config.turn===undefined?0:config.turn,
    activeActorId:config.activeActorId===undefined?null:config.activeActorId,
    status:config.status||"setup",
    eventLog:cloneCombatValue(config.eventLog||[])
  };
  if(typeof assertValidBattleState!=="function")throw new Error("combat-state-validation.js must load before combat-state.js");
  assertValidBattleState(battleState,combatStateReferences(options));
  return battleState;
}

function getCombatActor(battleState,actorId){return battleState.actors.find(actor=>actor.actorId===actorId)||null}
function getCombatActorsByTeam(battleState,teamId){return battleState.actors.filter(actor=>actor.teamId===teamId)}
function getLivingCombatActors(battleState){return battleState.actors.filter(actor=>actor.state==="active"&&actor.currentHP>0)}
function getDefeatedCombatActors(battleState){return battleState.actors.filter(actor=>actor.state==="defeated"&&actor.currentHP===0)}
function cloneCombatState(battleState){return cloneCombatValue(battleState)}
