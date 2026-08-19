"use strict";

const GAME_DATA_PATHS={
  core:"data/game-core.json",
  equipment:"data/equipment.json",
  equipmentSets:"data/equipment-sets.json",
  equipmentAssets:"assets/equipment/equipment-assets.json"
};

let GAME_DATA_RUNTIME=null;
let GAME_DATA_VALIDATION=null;
let GAME_DATA_INDEX=null;

function deepFreezeGameData(value){
  if(!value||typeof value!=="object"||Object.isFrozen(value))return value;
  Object.freeze(value);
  Object.values(value).forEach(deepFreezeGameData);
  return value;
}

function buildGameDataIndex(items,label){
  const index=new Map();
  items.forEach(item=>{
    if(index.has(item.id))throw new Error(`Duplicate ${label} ID '${item.id}'`);
    index.set(item.id,item);
  });
  return index;
}

async function fetchGameDataJSON(path){
  const response=await fetch(path,{cache:"no-store"});
  if(!response.ok)throw new Error(`Unable to load ${path}: HTTP ${response.status}`);
  return response.json();
}

async function loadGameData(paths={}){
  const resolved={...GAME_DATA_PATHS,...paths};
  const [core,equipment,equipmentSets,equipmentAssets]=await Promise.all([
    fetchGameDataJSON(resolved.core),
    fetchGameDataJSON(resolved.equipment),
    fetchGameDataJSON(resolved.equipmentSets),
    fetchGameDataJSON(resolved.equipmentAssets)
  ]);
  const source={core,equipment,equipmentSets};
  if(typeof validateGameData!=="function")throw new Error("game-validation.js must load before game-data.js");
  GAME_DATA_VALIDATION=deepFreezeGameData(assertValidGameData(source,equipmentAssets));
  const frozen=deepFreezeGameData(source);
  GAME_DATA_INDEX=Object.freeze({
    stats:buildGameDataIndex(frozen.core.stats,"stat"),
    slots:buildGameDataIndex(frozen.core.equipmentSlots,"slot"),
    equipment:buildGameDataIndex(frozen.equipment.equipment,"equipment"),
    equipmentSets:buildGameDataIndex(frozen.equipmentSets.equipmentSets,"equipment set")
  });
  GAME_DATA_RUNTIME=frozen;
  return GAME_DATA_RUNTIME;
}

function requireGameData(){
  if(!GAME_DATA_RUNTIME)throw new Error("Game data has not been loaded");
  return GAME_DATA_RUNTIME;
}

function getGameData(){return requireGameData()}
function getEquipmentDefinition(id){requireGameData();return GAME_DATA_INDEX.equipment.get(id)||null}
function getEquipmentSet(id){requireGameData();return GAME_DATA_INDEX.equipmentSets.get(id)||null}
function getStatDefinition(id){requireGameData();return GAME_DATA_INDEX.stats.get(id)||null}
function getSlotDefinition(id){requireGameData();return GAME_DATA_INDEX.slots.get(id)||null}
function getGameDataValidation(){return GAME_DATA_VALIDATION}
