"use strict";

const STATUS_DATA_PATH="data/status-effects.json";
let STATUS_DATA_RUNTIME=null;
let STATUS_DATA_VALIDATION=null;
let STATUS_DATA_INDEX=null;

function deepFreezeStatusData(value){
  if(!value||typeof value!=="object"||Object.isFrozen(value))return value;
  Object.freeze(value);
  Object.values(value).forEach(deepFreezeStatusData);
  return value;
}

async function loadStatusEffects(options={}){
  const path=options.path||STATUS_DATA_PATH;
  const gameData=options.gameData||(typeof getGameData==="function"?getGameData():null);
  const damageTypeData=options.damageTypeData||(typeof DAMAGE_TYPE_DATA_RUNTIME!=="undefined"?DAMAGE_TYPE_DATA_RUNTIME:null);
  if(!gameData)throw new Error("Canonical game data must be loaded or supplied before status effects");
  if(typeof assertValidStatusEffects!=="function")throw new Error("status-validation.js must load before status-runtime.js");
  const response=await fetch(path,{cache:"no-store"});
  if(!response.ok)throw new Error(`Unable to load ${path}: HTTP ${response.status}`);
  const source=await response.json();
  STATUS_DATA_VALIDATION=deepFreezeStatusData(assertValidStatusEffects(source,gameData,damageTypeData));
  STATUS_DATA_RUNTIME=deepFreezeStatusData(source);
  const byId=new Map();
  source.statusEffects.forEach(status=>{if(byId.has(status.id))throw new Error(`Duplicate status ID '${status.id}'`);byId.set(status.id,status)});
  STATUS_DATA_INDEX=byId;
  return STATUS_DATA_RUNTIME;
}

function requireStatusEffects(){if(!STATUS_DATA_RUNTIME)throw new Error("Status effect data has not been loaded");return STATUS_DATA_RUNTIME}
function getStatusEffects(){return requireStatusEffects().statusEffects}
function getStatusEffect(id){requireStatusEffects();return STATUS_DATA_INDEX.get(id)||null}
function getStatusEffectsByCategory(category){return getStatusEffects().filter(status=>status.category===category)}
function getStatusEffectsByTag(tag){return getStatusEffects().filter(status=>status.tags.includes(tag))}
function getStatusValidation(){return STATUS_DATA_VALIDATION}
