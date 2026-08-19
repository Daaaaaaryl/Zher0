"use strict";

const MONSTER_DATA_PATHS={core:"data/monster-core.json",monsters:"data/monsters.json"};
let MONSTER_DATA_RUNTIME=null;
let MONSTER_DATA_VALIDATION=null;
let MONSTER_DATA_INDEX=null;

function deepFreezeMonsterData(value){
  if(!value||typeof value!=="object"||Object.isFrozen(value))return value;
  Object.freeze(value);
  Object.values(value).forEach(deepFreezeMonsterData);
  return value;
}

function buildMonsterIndex(items,label){
  const index=new Map();
  items.forEach(item=>{
    if(index.has(item.id))throw new Error(`Duplicate ${label} ID '${item.id}'`);
    index.set(item.id,item);
  });
  return index;
}

async function fetchMonsterJSON(path){
  const response=await fetch(path,{cache:"no-store"});
  if(!response.ok)throw new Error(`Unable to load ${path}: HTTP ${response.status}`);
  return response.json();
}

async function loadMonsterData(options={}){
  const paths={...MONSTER_DATA_PATHS,...(options.paths||{})};
  const gameData=options.gameData||(typeof getGameData==="function"?getGameData():null);
  const statusData=options.statusData||(typeof STATUS_DATA_RUNTIME!=="undefined"?STATUS_DATA_RUNTIME:null);
  if(!gameData)throw new Error("Canonical game data must be loaded or supplied before monster data");
  const [core,monsters]=await Promise.all([fetchMonsterJSON(paths.core),fetchMonsterJSON(paths.monsters)]);
  const source={core,monsters};
  if(typeof assertValidMonsterData!=="function")throw new Error("monster-validation.js must load before monster-runtime.js");
  MONSTER_DATA_VALIDATION=deepFreezeMonsterData(assertValidMonsterData(source,gameData,statusData));
  MONSTER_DATA_RUNTIME=deepFreezeMonsterData(source);
  MONSTER_DATA_INDEX={
    families:buildMonsterIndex(core.families,"monster family"),
    roles:buildMonsterIndex(core.roles,"monster role"),
    tiers:buildMonsterIndex(core.tiers,"monster tier"),
    monsters:buildMonsterIndex(monsters.monsters,"monster")
  };
  return MONSTER_DATA_RUNTIME;
}

function requireMonsterData(){
  if(!MONSTER_DATA_RUNTIME)throw new Error("Monster data has not been loaded");
  return MONSTER_DATA_RUNTIME;
}

function getMonster(id){requireMonsterData();return MONSTER_DATA_INDEX.monsters.get(id)||null}
function getMonsters(){return requireMonsterData().monsters.monsters}
function getMonstersByFamily(familyId){return getMonsters().filter(item=>item.familyId===familyId)}
function getMonstersByRole(roleId){return getMonsters().filter(item=>item.roleId===roleId)}
function getMonsterFamily(id){requireMonsterData();return MONSTER_DATA_INDEX.families.get(id)||null}
function getMonsterRole(id){requireMonsterData();return MONSTER_DATA_INDEX.roles.get(id)||null}
function getMonsterTier(id){requireMonsterData();return MONSTER_DATA_INDEX.tiers.get(id)||null}
function getMonsterDataValidation(){return MONSTER_DATA_VALIDATION}
