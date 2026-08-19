"use strict";

const DAMAGE_CALCULATION_STAT_IDS=["HP","PA","PD","MA","MD","SP"];

function damageCalculationContainsExecutable(value,seen=new Set()){
  if(typeof value==="function")return true;
  if(!value||typeof value!=="object"||seen.has(value))return false;
  seen.add(value);
  return Object.values(value).some(item=>damageCalculationContainsExecutable(item,seen));
}

function validateDamageCalculationInput(input,references={}){
  const errors=[];
  const addError=(code,path,message)=>errors.push({code,path,message});
  const damageTypes=new Map((references?.damageTypeData?.damageTypes||[]).map(item=>[item.id,item]));

  if(!input||typeof input!=="object"||Array.isArray(input))return {valid:false,errors:[{code:"malformed_calculation_input",path:"input",message:"Damage calculation input must be an object"}]};
  if(!input.attacker)addError("missing_attacker","input.attacker","Damage calculation requires an attacker");
  else if(typeof validateCombatActor!=="function")addError("combat_validator_unavailable","input.attacker","Combat actor validation must be loaded first");
  else validateCombatActor(input.attacker,references).errors.forEach(error=>addError("invalid_attacker",`input.attacker.${error.path.replace(/^actor\.?/,"")}`,error.message));
  if(!input.defender)addError("missing_defender","input.defender","Damage calculation requires a defender");
  else if(typeof validateCombatActor!=="function")addError("combat_validator_unavailable","input.defender","Combat actor validation must be loaded first");
  else validateCombatActor(input.defender,references).errors.forEach(error=>addError("invalid_defender",`input.defender.${error.path.replace(/^actor\.?/,"")}`,error.message));
  if(input.attacker&&input.defender&&input.attacker.actorId===input.defender.actorId)addError("same_actor","input.defender.actorId","Attacker and defender must be distinct battle actors");

  const ability=input.ability;
  if(!ability||typeof ability!=="object"||Array.isArray(ability))addError("missing_ability","input.ability","Damage calculation requires an attack ability definition");
  else{
    if(typeof ability.id!=="string"||!ability.id)addError("invalid_ability","input.ability.id","Ability requires an ID");
    if(ability.kind!=="attack")addError("invalid_ability","input.ability.kind","Damage calculation requires an attack ability");
    if(typeof ability.damageTypeId!=="string"||!ability.damageTypeId)addError("invalid_ability","input.ability.damageTypeId","Attack ability requires a damage type ID");
    if(ability.scalingStat!==null&&!DAMAGE_CALCULATION_STAT_IDS.includes(ability.scalingStat))addError("malformed_scaling_stat","input.ability.scalingStat",`Unknown scaling stat '${ability.scalingStat}'`);
    if(ability.basePower!==null&&(typeof ability.basePower!=="number"||!Number.isFinite(ability.basePower)||ability.basePower<0))addError("malformed_base_power","input.ability.basePower","basePower must be null or finite and non-negative");
    if(ability.multiplier!==null&&(typeof ability.multiplier!=="number"||!Number.isFinite(ability.multiplier)||ability.multiplier<0))addError("malformed_multiplier","input.ability.multiplier","multiplier must be null or finite and non-negative");
    if(damageCalculationContainsExecutable(ability))addError("executable_value","input.ability","Ability input cannot contain executable values");
  }

  const damageType=input.damageType;
  if(!damageType||typeof damageType!=="object"||Array.isArray(damageType)||typeof damageType.id!=="string"||!damageTypes.has(damageType.id))addError("unknown_damage_type","input.damageType","Damage calculation requires a canonical damage type");
  else{
    const canonical=damageTypes.get(damageType.id);
    if(ability?.damageTypeId!==damageType.id)addError("mismatched_ability_damage_type","input.damageType.id","Ability and supplied damage type must match");
    if(damageType.offensiveStatId!==canonical.offensiveStatId||damageType.defensiveStatId!==canonical.defensiveStatId)addError("invalid_damage_type","input.damageType","Damage type stat relationships must match canonical metadata");
    if(damageCalculationContainsExecutable(damageType))addError("executable_value","input.damageType","Damage type input cannot contain executable values");
  }

  const offensiveStatId=ability?.scalingStat||damageType?.offensiveStatId||null;
  const defensiveStatId=damageType?.defensiveStatId||null;
  if(offensiveStatId!==null){
    if(!Object.prototype.hasOwnProperty.call(input.attacker?.currentStats||{},offensiveStatId))addError("missing_offensive_stat",`input.attacker.currentStats.${offensiveStatId}`,`Attacker is missing '${offensiveStatId}'`);
    else if(typeof input.attacker.currentStats[offensiveStatId]!=="number"||!Number.isFinite(input.attacker.currentStats[offensiveStatId]))addError("non_finite_offensive_value",`input.attacker.currentStats.${offensiveStatId}`,"Offensive value must be finite");
    else if(input.attacker.currentStats[offensiveStatId]<0)addError("negative_stat",`input.attacker.currentStats.${offensiveStatId}`,"Offensive value cannot be negative");
  }
  if(defensiveStatId!==null){
    if(!Object.prototype.hasOwnProperty.call(input.defender?.currentStats||{},defensiveStatId))addError("missing_defensive_stat",`input.defender.currentStats.${defensiveStatId}`,`Defender is missing '${defensiveStatId}'`);
    else if(typeof input.defender.currentStats[defensiveStatId]!=="number"||!Number.isFinite(input.defender.currentStats[defensiveStatId]))addError("non_finite_defensive_value",`input.defender.currentStats.${defensiveStatId}`,"Defensive value must be finite");
    else if(input.defender.currentStats[defensiveStatId]<0)addError("negative_stat",`input.defender.currentStats.${defensiveStatId}`,"Defensive value cannot be negative");
  }

  const context=input.context===undefined?{}:input.context;
  if(!context||typeof context!=="object"||Array.isArray(context)||typeof (context.isCritical??false)!=="boolean"||!Array.isArray(context.externalModifiers||[])||damageCalculationContainsExecutable(context))addError("malformed_context","input.context","Context must be data-only with isCritical and externalModifiers fields");
  return {valid:errors.length===0,selection:{offensiveStatId,defensiveStatId},errors};
}

function assertValidDamageCalculationInput(input,references={}){
  const result=validateDamageCalculationInput(input,references);
  if(!result.valid){const error=new Error(`Damage calculation input validation failed with ${result.errors.length} error(s)`);error.validation=result;throw error}
  return result;
}

function validateDamageCalculationResult(result){
  const errors=[];
  const addError=(code,path,message)=>errors.push({code,path,message});
  if(!result||typeof result!=="object"||Array.isArray(result))return {valid:false,errors:[{code:"malformed_damage_result",path:"result",message:"Damage result must be an object"}]};
  ["attackerId","defenderId","abilityId","damageTypeId","strategyId"].forEach(field=>{if(typeof result[field]!=="string"||!result[field])addError("malformed_damage_result",`result.${field}`,`${field} must be a non-empty string`)});
  ["offensiveStatId","defensiveStatId"].forEach(field=>{if(result[field]!==null&&!DAMAGE_CALCULATION_STAT_IDS.includes(result[field]))addError("malformed_damage_result",`result.${field}`,`${field} must be null or a canonical stat ID`)});
  if(typeof result.provisional!=="boolean"||typeof result.isCritical!=="boolean")addError("malformed_damage_result","result","Damage result flags must be boolean");
  if(!result.breakdown||typeof result.breakdown!=="object"||Array.isArray(result.breakdown)||!Array.isArray(result.breakdown.modifiers))addError("malformed_damage_result","result.breakdown","Damage result requires an auditable data-only breakdown");
  ["offensiveValue","defensiveValue","basePower","multiplier","rawDamage","mitigatedDamage","finalDamage"].forEach(field=>{
    const value=result[field];
    if(value!==null&&(typeof value!=="number"||!Number.isFinite(value)))addError("non_finite_result",`result.${field}`,`${field} must be null or finite`);
  });
  if(typeof result.finalDamage==="number"&&result.finalDamage<0)addError("negative_final_damage","result.finalDamage","finalDamage cannot be negative");
  if(damageCalculationContainsExecutable(result))addError("executable_value","result","Damage result must be data-only");
  return {valid:errors.length===0,errors};
}

function assertValidDamageCalculationResult(result){
  const validation=validateDamageCalculationResult(result);
  if(!validation.valid){const error=new Error(`Damage calculation result validation failed with ${validation.errors.length} error(s)`);error.validation=validation;throw error}
  return validation;
}
