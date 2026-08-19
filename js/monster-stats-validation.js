"use strict";

const MONSTER_STAT_IDS=["HP","PA","PD","MA","MD","SP"];
const MONSTER_STAT_PROFILE_ID_PATTERN=/^[a-z][a-z0-9_]*$/;
const MONSTER_STAT_PROFILE_STATUSES=new Set(["provisional"]);

function validateMonsterStatProfiles(profileData,monsterData){
  const errors=[];
  const addError=(code,path,message)=>errors.push({code,path,message});
  const profiles=Array.isArray(profileData?.profiles)?profileData.profiles:[];
  const roles=Array.isArray(monsterData?.core?.roles)?monsterData.core.roles:[];
  const roleIds=new Set(roles.map(item=>item.id));
  const profileIds=new Set();
  const profiledRoles=new Set();

  if(!profileData||!Array.isArray(profileData.profiles))addError("invalid_profile_collection","profiles","Monster stat profiles require a profiles array");

  profiles.forEach((profile,index)=>{
    const path=`profiles[${index}]`;
    if(typeof profile?.id!=="string"||!MONSTER_STAT_PROFILE_ID_PATTERN.test(profile.id))addError("invalid_profile_id",`${path}.id`,"Profile ID must be stable and ASCII-safe");
    if(profileIds.has(profile?.id))addError("duplicate_profile_id",`${path}.id`,`Profile ID '${profile?.id}' is duplicated`);
    else if(profile?.id)profileIds.add(profile.id);
    ["displayName","roleId","status","notes"].forEach(field=>{
      if(typeof profile?.[field]!=="string"||!profile[field])addError("missing_required_field",`${path}.${field}`,`Profile requires ${field}`);
    });
    if(profile?.roleId&&!roleIds.has(profile.roleId))addError("unknown_role",`${path}.roleId`,`Unknown monster role '${profile.roleId}'`);
    if(profiledRoles.has(profile?.roleId))addError("duplicate_role_profile",`${path}.roleId`,`Role '${profile?.roleId}' has more than one profile`);
    else if(profile?.roleId)profiledRoles.add(profile.roleId);
    if(!MONSTER_STAT_PROFILE_STATUSES.has(profile?.status))addError("invalid_profile_status",`${path}.status`,`Invalid profile status '${profile?.status}'`);

    const weights=profile?.weights;
    if(!weights||typeof weights!=="object"||Array.isArray(weights)){
      addError("invalid_weights",`${path}.weights`,"Profile weights must be an object");
      return;
    }
    const keys=Object.keys(weights);
    MONSTER_STAT_IDS.forEach(statId=>{if(!keys.includes(statId))addError("missing_stat_key",`${path}.weights`,`Missing stat '${statId}'`)});
    keys.forEach(statId=>{
      if(!MONSTER_STAT_IDS.includes(statId))addError("extra_stat_key",`${path}.weights.${statId}`,`Unknown stat '${statId}'`);
      const value=weights[statId];
      if(typeof value!=="number")addError("non_numeric_weight",`${path}.weights.${statId}`,`Weight '${statId}' must be numeric`);
      else if(!Number.isFinite(value))addError("non_finite_weight",`${path}.weights.${statId}`,`Weight '${statId}' must be finite`);
      else if(value<0)addError("negative_weight",`${path}.weights.${statId}`,`Weight '${statId}' cannot be negative`);
    });
    if(MONSTER_STAT_IDS.every(statId=>Number.isFinite(weights[statId]))){
      const total=MONSTER_STAT_IDS.reduce((sum,statId)=>sum+weights[statId],0);
      if(total!==100)addError("invalid_weight_total",`${path}.weights`,`Profile weights total ${total}, expected 100`);
    }
  });

  roles.forEach(role=>{if(!profiledRoles.has(role.id))addError("missing_role_profile","profiles",`Role '${role.id}' has no stat profile`)});
  return {valid:errors.length===0,counts:{profiles:profiles.length,roles:roles.length},errors};
}

function assertValidMonsterStatProfiles(profileData,monsterData){
  const result=validateMonsterStatProfiles(profileData,monsterData);
  if(!result.valid){
    const error=new Error(`Monster stat profile validation failed with ${result.errors.length} error(s)`);
    error.validation=result;
    throw error;
  }
  return result;
}

function validateMonsterStatDistributionInput(budget,profile,modifiers={}){
  const errors=[];
  const addError=(code,path,message)=>errors.push({code,path,message});
  if(typeof budget!=="number"||!Number.isFinite(budget)||!Number.isInteger(budget)||budget<=0)addError("invalid_budget","budget","Budget must be a positive finite integer");
  if(!profile||typeof profile!=="object"||Array.isArray(profile)||!profile.weights||typeof profile.weights!=="object"||Array.isArray(profile.weights))addError("invalid_profile","profile","A profile with weights is required");
  if(!modifiers||typeof modifiers!=="object"||Array.isArray(modifiers))addError("malformed_modifiers","modifiers","Modifiers must be an object");
  else Object.keys(modifiers).forEach(statId=>{
    if(!MONSTER_STAT_IDS.includes(statId))addError("unknown_modifier_stat",`modifiers.${statId}`,`Unknown modifier stat '${statId}'`);
    else if(typeof modifiers[statId]!=="number"||!Number.isFinite(modifiers[statId]))addError("non_finite_modifier",`modifiers.${statId}`,`Modifier '${statId}' must be a finite number`);
  });
  return {valid:errors.length===0,errors};
}

function assertValidMonsterStatDistributionInput(budget,profile,modifiers={}){
  const result=validateMonsterStatDistributionInput(budget,profile,modifiers);
  if(!result.valid){
    const error=new Error(`Monster stat distribution input validation failed with ${result.errors.length} error(s)`);
    error.validation=result;
    throw error;
  }
  return result;
}

function validateMonsterStatDistributionResult(result,budget){
  const errors=[];
  const addError=(code,path,message)=>errors.push({code,path,message});
  if(!result||typeof result!=="object"||Array.isArray(result))addError("invalid_distribution","result","Distribution must be an object");
  else{
    const keys=Object.keys(result);
    MONSTER_STAT_IDS.forEach(statId=>{
      if(!keys.includes(statId))addError("missing_final_stat",`result.${statId}`,`Missing final stat '${statId}'`);
      else if(!Number.isInteger(result[statId]))addError("non_integer_final_stat",`result.${statId}`,`Final stat '${statId}' must be an integer`);
      else if(result[statId]<0)addError("negative_final_stat",`result.${statId}`,`Final stat '${statId}' cannot be negative`);
    });
    keys.forEach(statId=>{if(!MONSTER_STAT_IDS.includes(statId))addError("extra_final_stat",`result.${statId}`,`Unknown final stat '${statId}'`)});
    if(MONSTER_STAT_IDS.every(statId=>Number.isInteger(result[statId]))){
      const total=MONSTER_STAT_IDS.reduce((sum,statId)=>sum+result[statId],0);
      if(total!==budget)addError("distribution_total_mismatch","result",`Distribution total ${total}, expected ${budget}`);
    }
  }
  return {valid:errors.length===0,errors};
}

function assertValidMonsterStatDistributionResult(result,budget){
  const validation=validateMonsterStatDistributionResult(result,budget);
  if(!validation.valid){
    const error=new Error(`Monster stat distribution result validation failed with ${validation.errors.length} error(s)`);
    error.validation=validation;
    throw error;
  }
  return validation;
}
