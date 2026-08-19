"use strict";

const ABILITY_DATA_PATH="data/abilities.json";
let ABILITY_DATA_RUNTIME=null;
let ABILITY_DATA_VALIDATION=null;
let ABILITY_DATA_INDEX=null;

function deepFreezeAbilityData(value){
  if(!value||typeof value!=="object"||Object.isFrozen(value))return value;
  Object.freeze(value);
  Object.values(value).forEach(deepFreezeAbilityData);
  return value;
}

async function loadAbilities(options={}){
  const path=options.path||ABILITY_DATA_PATH;
  const gameData=options.gameData||(typeof getGameData==="function"?getGameData():null);
  const monsterData=options.monsterData||(typeof requireMonsterData==="function"?requireMonsterData():null);
  const statusData=options.statusData||(typeof STATUS_DATA_RUNTIME!=="undefined"?STATUS_DATA_RUNTIME:null);
  const damageTypeData=options.damageTypeData||(typeof DAMAGE_TYPE_DATA_RUNTIME!=="undefined"?DAMAGE_TYPE_DATA_RUNTIME:null);
  if(!gameData)throw new Error("Canonical game data must be loaded or supplied before abilities");
  if(!monsterData)throw new Error("Canonical monster data must be loaded or supplied before abilities");
  if(typeof assertValidAbilityData!=="function")throw new Error("ability-validation.js must load before ability-runtime.js");
  const response=await fetch(path,{cache:"no-store"});
  if(!response.ok)throw new Error(`Unable to load ${path}: HTTP ${response.status}`);
  const source=await response.json();
  ABILITY_DATA_VALIDATION=deepFreezeAbilityData(assertValidAbilityData(source,gameData,monsterData,statusData,damageTypeData));
  ABILITY_DATA_RUNTIME=deepFreezeAbilityData(source);
  const byId=new Map();
  source.abilities.forEach(ability=>{
    if(byId.has(ability.id))throw new Error(`Duplicate ability ID '${ability.id}'`);
    byId.set(ability.id,ability);
  });
  ABILITY_DATA_INDEX=byId;
  return ABILITY_DATA_RUNTIME;
}

function requireAbilities(){
  if(!ABILITY_DATA_RUNTIME)throw new Error("Ability data has not been loaded");
  return ABILITY_DATA_RUNTIME;
}

function getAbilities(){return requireAbilities().abilities}
function getAbility(id){requireAbilities();return ABILITY_DATA_INDEX.get(id)||null}
function getAbilitiesByKind(kind){return getAbilities().filter(ability=>ability.kind===kind)}
function getAttacks(){return getAbilitiesByKind("attack")}
function getPassives(){return getAbilitiesByKind("passive")}
function getAbilitiesBySourceType(sourceType){return getAbilities().filter(ability=>ability.sourceTypes.includes(sourceType))}
function getAbilityValidation(){return ABILITY_DATA_VALIDATION}
