"use strict";

const DAMAGE_CALCULATION_STRATEGIES=Object.freeze({
  contract_only:Object.freeze({
    id:"contract_only",
    provisional:true,
    calculate(){return {rawDamage:null,mitigatedDamage:null,finalDamage:null}}
  })
});

function cloneDamageCalculationValue(value){
  if(typeof structuredClone==="function")return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function damageCalculationReferences(options={}){
  return {
    monsterData:options.monsterData||(typeof MONSTER_DATA_RUNTIME!=="undefined"?MONSTER_DATA_RUNTIME:null),
    abilityData:options.abilityData||(typeof ABILITY_DATA_RUNTIME!=="undefined"?ABILITY_DATA_RUNTIME:null),
    statusData:options.statusData||(typeof STATUS_DATA_RUNTIME!=="undefined"?STATUS_DATA_RUNTIME:null),
    damageTypeData:options.damageTypeData||(typeof DAMAGE_TYPE_DATA_RUNTIME!=="undefined"?DAMAGE_TYPE_DATA_RUNTIME:null)
  };
}

function calculateDamage(input,options={}){
  if(typeof assertValidDamageCalculationInput!=="function")throw new Error("damage-calculation-validation.js must load before damage-calculation.js");
  const references=damageCalculationReferences(options);
  const validation=assertValidDamageCalculationInput(input,references);
  const strategyId=options.strategyId||"contract_only";
  const strategy=DAMAGE_CALCULATION_STRATEGIES[strategyId];
  if(!strategy)throw new Error(`Unknown trusted damage strategy '${strategyId}'`);
  const offensiveStatId=validation.selection.offensiveStatId;
  const defensiveStatId=validation.selection.defensiveStatId;
  const offensiveValue=offensiveStatId===null?null:input.attacker.currentStats[offensiveStatId];
  const defensiveValue=defensiveStatId===null?null:input.defender.currentStats[defensiveStatId];
  const context={isCritical:input.context?.isCritical??false,externalModifiers:cloneDamageCalculationValue(input.context?.externalModifiers||[])};
  const calculated=strategy.calculate({offensiveValue,defensiveValue,ability:input.ability,damageType:input.damageType,context});
  const result={
    attackerId:input.attacker.actorId,
    defenderId:input.defender.actorId,
    abilityId:input.ability.id,
    damageTypeId:input.damageType.id,
    strategyId,
    provisional:strategy.provisional,
    offensiveStatId,
    defensiveStatId,
    offensiveValue,
    defensiveValue,
    basePower:input.ability.basePower,
    multiplier:input.ability.multiplier,
    rawDamage:calculated.rawDamage,
    mitigatedDamage:calculated.mitigatedDamage,
    finalDamage:calculated.finalDamage,
    isCritical:context.isCritical,
    breakdown:{
      offense:{statId:offensiveStatId,value:offensiveValue},
      attack:{basePower:input.ability.basePower,multiplier:input.ability.multiplier},
      defense:{statId:defensiveStatId,value:defensiveValue},
      modifiers:context.externalModifiers
    }
  };
  assertValidDamageCalculationResult(result);
  return result;
}

function calculatePhysicalDamage(input,options={}){
  if(input?.damageType?.id!=="physical")throw new Error("Physical damage calculation requires the physical damage type");
  return calculateDamage(input,options);
}

function calculateMagicalDamage(input,options={}){
  if(input?.damageType?.id!=="magical")throw new Error("Magical damage calculation requires the magical damage type");
  return calculateDamage(input,options);
}

function calculateTrueDamage(input,options={}){
  if(input?.damageType?.id!=="true")throw new Error("True damage calculation requires the true damage type");
  return calculateDamage(input,options);
}
