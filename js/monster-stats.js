"use strict";

const MONSTER_STAT_PROFILE_PATH="data/monster-stat-profiles.json";
let MONSTER_STAT_PROFILE_RUNTIME=null;
let MONSTER_STAT_PROFILE_VALIDATION=null;
let MONSTER_STAT_PROFILE_INDEX=null;
let MONSTER_STAT_ROLE_PROFILE_INDEX=null;

function deepFreezeMonsterStats(value){
  if(!value||typeof value!=="object"||Object.isFrozen(value))return value;
  Object.freeze(value);
  Object.values(value).forEach(deepFreezeMonsterStats);
  return value;
}

async function loadMonsterStatProfiles(options={}){
  const path=options.path||MONSTER_STAT_PROFILE_PATH;
  const monsterData=options.monsterData||(typeof requireMonsterData==="function"?requireMonsterData():null);
  if(!monsterData)throw new Error("Canonical monster data must be loaded or supplied before monster stat profiles");
  if(typeof assertValidMonsterStatProfiles!=="function")throw new Error("monster-stats-validation.js must load before monster-stats.js");
  const response=await fetch(path,{cache:"no-store"});
  if(!response.ok)throw new Error(`Unable to load ${path}: HTTP ${response.status}`);
  const source=await response.json();
  MONSTER_STAT_PROFILE_VALIDATION=deepFreezeMonsterStats(assertValidMonsterStatProfiles(source,monsterData));
  MONSTER_STAT_PROFILE_RUNTIME=deepFreezeMonsterStats(source);
  MONSTER_STAT_PROFILE_INDEX=new Map(source.profiles.map(profile=>[profile.id,profile]));
  MONSTER_STAT_ROLE_PROFILE_INDEX=new Map(source.profiles.map(profile=>[profile.roleId,profile]));
  return MONSTER_STAT_PROFILE_RUNTIME;
}

function requireMonsterStatProfiles(){
  if(!MONSTER_STAT_PROFILE_RUNTIME)throw new Error("Monster stat profiles have not been loaded");
  return MONSTER_STAT_PROFILE_RUNTIME;
}

function getMonsterStatProfiles(){return requireMonsterStatProfiles().profiles}
function getMonsterStatProfile(id){requireMonsterStatProfiles();return MONSTER_STAT_PROFILE_INDEX.get(id)||null}
function getMonsterStatProfileForRole(roleId){requireMonsterStatProfiles();return MONSTER_STAT_ROLE_PROFILE_INDEX.get(roleId)||null}
function getMonsterStatProfileValidation(){return MONSTER_STAT_PROFILE_VALIDATION}

function distributeMonsterStats(budget,profile,modifiers={}){
  if(typeof assertValidMonsterStatDistributionInput!=="function")throw new Error("monster-stats-validation.js must load before monster-stats.js");
  assertValidMonsterStatDistributionInput(budget,profile,modifiers);

  // Modifiers adjust profile weights before normalization. A sufficiently negative
  // adjustment floors that weight at zero; it can never create a negative final stat.
  const adjustedWeights=MONSTER_STAT_IDS.map(statId=>Math.max(0,profile.weights[statId]+(modifiers[statId]||0)));
  const adjustedTotal=adjustedWeights.reduce((sum,value)=>sum+value,0);
  if(adjustedTotal<=0)throw new Error("Adjusted monster stat weights must contain at least one positive value");

  const allocations=adjustedWeights.map((weight,index)=>{
    const exact=budget*weight/adjustedTotal;
    return {statId:MONSTER_STAT_IDS[index],index,value:Math.floor(exact),remainder:exact-Math.floor(exact)};
  });
  let remaining=budget-allocations.reduce((sum,item)=>sum+item.value,0);
  // Largest remainder wins; exact ties follow canonical HP, PA, PD, MA, MD, SP order.
  const ranked=[...allocations].sort((a,b)=>(b.remainder-a.remainder)||(a.index-b.index));
  for(let index=0;index<remaining;index++)ranked[index].value+=1;

  const result=Object.fromEntries(allocations.map(item=>[item.statId,item.value]));
  assertValidMonsterStatDistributionResult(result,budget);
  return result;
}

function calculateMonsterStats(monsterId,budget,modifiers={}){
  if(typeof getMonster!=="function")throw new Error("monster-runtime.js must load before calculating monster stats");
  const monster=getMonster(monsterId);
  if(!monster)throw new Error(`Unknown monster '${monsterId}'`);
  const profile=monster.statProfileId?getMonsterStatProfile(monster.statProfileId):getMonsterStatProfileForRole(monster.roleId);
  if(!profile)throw new Error(`No monster stat profile resolves for '${monsterId}'`);
  return distributeMonsterStats(budget,profile,modifiers);
}
