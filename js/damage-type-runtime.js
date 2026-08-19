"use strict";

const DAMAGE_TYPE_DATA_PATH="data/damage-types.json";
let DAMAGE_TYPE_DATA_RUNTIME=null;
let DAMAGE_TYPE_DATA_VALIDATION=null;
let DAMAGE_TYPE_DATA_INDEX=null;

function deepFreezeDamageTypeData(value){
  if(!value||typeof value!=="object"||Object.isFrozen(value))return value;
  Object.freeze(value);
  Object.values(value).forEach(deepFreezeDamageTypeData);
  return value;
}

async function loadDamageTypes(options={}){
  const path=options.path||DAMAGE_TYPE_DATA_PATH;
  const gameData=options.gameData||(typeof getGameData==="function"?getGameData():null);
  if(!gameData)throw new Error("Canonical game data must be loaded or supplied before damage types");
  if(typeof assertValidDamageTypes!=="function")throw new Error("damage-type-validation.js must load before damage-type-runtime.js");
  const response=await fetch(path,{cache:"no-store"});
  if(!response.ok)throw new Error(`Unable to load ${path}: HTTP ${response.status}`);
  const source=await response.json();
  DAMAGE_TYPE_DATA_VALIDATION=deepFreezeDamageTypeData(assertValidDamageTypes(source,gameData));
  DAMAGE_TYPE_DATA_RUNTIME=deepFreezeDamageTypeData(source);
  const byId=new Map();
  source.damageTypes.forEach(damageType=>{if(byId.has(damageType.id))throw new Error(`Duplicate damage type ID '${damageType.id}'`);byId.set(damageType.id,damageType)});
  DAMAGE_TYPE_DATA_INDEX=byId;
  return DAMAGE_TYPE_DATA_RUNTIME;
}

function requireDamageTypes(){if(!DAMAGE_TYPE_DATA_RUNTIME)throw new Error("Damage type data has not been loaded");return DAMAGE_TYPE_DATA_RUNTIME}
function getDamageTypes(){return requireDamageTypes().damageTypes}
function getDamageType(id){requireDamageTypes();return DAMAGE_TYPE_DATA_INDEX.get(id)||null}
function getDamageTypesByCategory(category){return getDamageTypes().filter(damageType=>damageType.category===category)}
function getDamageTypeValidation(){return DAMAGE_TYPE_DATA_VALIDATION}
