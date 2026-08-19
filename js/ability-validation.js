"use strict";

const ABILITY_ID_PATTERN=/^[a-z][a-z0-9_]*$/;
const ABILITY_KINDS=new Set(["attack","passive"]);
const ABILITY_SOURCE_TYPES=new Set(["monster","equipment","character"]);
const ABILITY_TARGET_TYPES=new Set(["self","single_enemy","all_enemies","single_ally","all_allies"]);
const ABILITY_STAT_IDS=new Set(["HP","PA","PD","MA","MD","SP"]);
const ABILITY_STATUSES=new Set(["provisional"]);

function containsExecutableValue(value,seen=new Set()){
  if(typeof value==="function")return true;
  if(!value||typeof value!=="object"||seen.has(value))return false;
  seen.add(value);
  return Object.values(value).some(item=>containsExecutableValue(item,seen));
}

function validateAbilityData(abilityData,gameData,monsterData,statusData=null,damageTypeData=null){
  const errors=[];
  const duplicateIds=[];
  const addError=(code,path,message)=>errors.push({code,path,message});
  const abilities=Array.isArray(abilityData?.abilities)?abilityData.abilities:[];
  const abilityIndex=new Map();
  const canonicalStats=new Set((gameData?.core?.stats||[]).map(item=>item.id));
  const canonicalStatuses=new Set((statusData?.statusEffects||[]).map(item=>item.id));
  const canonicalDamageTypes=new Set((damageTypeData?.damageTypes||[]).map(item=>item.id));

  if(!abilityData||!Array.isArray(abilityData.abilities))addError("invalid_ability_collection","abilities","Ability data requires an abilities array");
  abilities.forEach((ability,index)=>{
    const path=`abilities[${index}]`;
    ["id","displayName","kind","status"].forEach(field=>{
      if(typeof ability?.[field]!=="string"||!ability[field])addError("missing_required_field",`${path}.${field}`,`Ability requires ${field}`);
    });
    if(typeof ability?.id!=="string"||!ABILITY_ID_PATTERN.test(ability.id))addError("invalid_ability_id",`${path}.id`,"Ability ID must be stable and ASCII-safe");
    if(abilityIndex.has(ability?.id)){
      duplicateIds.push(ability.id);
      addError("duplicate_ability_id",`${path}.id`,`Ability ID '${ability.id}' is duplicated`);
    }else if(ability?.id)abilityIndex.set(ability.id,ability);
    if(!ABILITY_KINDS.has(ability?.kind))addError("invalid_ability_kind",`${path}.kind`,`Unknown ability kind '${ability?.kind}'`);
    if(!ABILITY_STATUSES.has(ability?.status))addError("invalid_ability_status",`${path}.status`,`Invalid ability status '${ability?.status}'`);
    if(!Array.isArray(ability?.sourceTypes)||!ability.sourceTypes.length)addError("invalid_source_types",`${path}.sourceTypes`,"Ability sourceTypes must be a non-empty array");
    else ability.sourceTypes.forEach((sourceType,i)=>{if(!ABILITY_SOURCE_TYPES.has(sourceType))addError("invalid_source_type",`${path}.sourceTypes[${i}]`,`Unknown source type '${sourceType}'`)});
    if(ability?.behaviorKey!==null&&(typeof ability?.behaviorKey!=="string"||!ABILITY_ID_PATTERN.test(ability.behaviorKey)))addError("invalid_behavior_key",`${path}.behaviorKey`,"behaviorKey must be null or an ASCII-safe identifier");
    if(containsExecutableValue(ability))addError("executable_value",path,"Canonical ability data cannot contain executable function values");
    if(!ability?.design||typeof ability.design!=="object"||Array.isArray(ability.design))addError("invalid_design",`${path}.design`,"Ability requires a design object");
    else ["combatPurpose","notes"].forEach(field=>{if(typeof ability.design[field]!=="string")addError("missing_required_field",`${path}.design.${field}`,`Ability design requires ${field}`)});
    if(!Array.isArray(ability?.tags))addError("invalid_tags",`${path}.tags`,"Ability tags must be an array");

    if(ability?.kind==="attack"){
      ["damageTypeId","basePower","scalingStat","multiplier","accuracy","criticalModifier","resourceCost","cooldown","targetType","effectIds","behaviorKey"].forEach(field=>{
        if(!Object.prototype.hasOwnProperty.call(ability,field))addError("missing_required_field",`${path}.${field}`,`Attack requires ${field}`);
      });
      if(ability.scalingStat!==null&&(!ABILITY_STAT_IDS.has(ability.scalingStat)||!canonicalStats.has(ability.scalingStat)))addError("unknown_scaling_stat",`${path}.scalingStat`,`Unknown scaling stat '${ability.scalingStat}'`);
      if(ability.targetType!==null&&!ABILITY_TARGET_TYPES.has(ability.targetType))addError("invalid_target_type",`${path}.targetType`,`Unknown target type '${ability.targetType}'`);
      ["basePower","multiplier","accuracy","criticalModifier"].forEach(field=>{
        if(ability[field]!==null&&(typeof ability[field]!=="number"||!Number.isFinite(ability[field])))addError("invalid_numeric_field",`${path}.${field}`,`${field} must be null or finite`);
      });
      if(ability.cooldown!==null&&(typeof ability.cooldown!=="number"||!Number.isFinite(ability.cooldown)||ability.cooldown<0))addError("invalid_cooldown",`${path}.cooldown`,"cooldown must be null or a finite non-negative number");
      if(ability.damageTypeId!==null&&!canonicalDamageTypes.has(ability.damageTypeId))addError("unknown_damage_type",`${path}.damageTypeId`,`Unknown canonical damage type '${ability.damageTypeId}'`);
      if(ability.resourceCost!==null){
        const cost=ability.resourceCost;
        if(!cost||typeof cost!=="object"||Array.isArray(cost)||typeof cost.resourceId!=="string"||!ABILITY_ID_PATTERN.test(cost.resourceId)||typeof cost.amount!=="number"||!Number.isFinite(cost.amount)||cost.amount<0)addError("invalid_resource_cost",`${path}.resourceCost`,"resourceCost must be null or contain a valid resourceId and finite non-negative amount");
      }
      if(!Array.isArray(ability.effectIds))addError("invalid_effect_ids",`${path}.effectIds`,"effectIds must be an array");
      else ability.effectIds.forEach((effectId,effectIndex)=>{if(!canonicalStatuses.has(effectId))addError("unknown_effect_id",`${path}.effectIds[${effectIndex}]`,`Unknown canonical status effect '${effectId}'`)});
    }

    if(ability?.kind==="passive"){
      ["triggerIds","behaviorKey","parameters"].forEach(field=>{if(!Object.prototype.hasOwnProperty.call(ability,field))addError("missing_required_field",`${path}.${field}`,`Passive requires ${field}`)});
      if(!Array.isArray(ability.triggerIds))addError("invalid_trigger_ids",`${path}.triggerIds`,"triggerIds must be an array");
      if(!ability.parameters||typeof ability.parameters!=="object"||Array.isArray(ability.parameters))addError("invalid_parameters",`${path}.parameters`,"Passive parameters must be an object");
    }
  });

  let attackReferences=0;
  let passiveReferences=0;
  (monsterData?.monsters?.monsters||[]).forEach((monster,index)=>{
    [["attackIds","attack"],["passiveIds","passive"]].forEach(([field,expectedKind])=>{
      if(!Array.isArray(monster?.[field])){addError("invalid_monster_ability_references",`monsters[${index}].${field}`,`${field} must be an array`);return}
      monster[field].forEach((abilityId,referenceIndex)=>{
        const ability=abilityIndex.get(abilityId);
        if(!ability)addError(expectedKind==="attack"?"missing_monster_attack":"missing_monster_passive",`monsters[${index}].${field}[${referenceIndex}]`,`Unknown ${expectedKind} '${abilityId}'`);
        else if(ability.kind!==expectedKind)addError(expectedKind==="attack"?"passive_in_attack_ids":"attack_in_passive_ids",`monsters[${index}].${field}[${referenceIndex}]`,`Ability '${abilityId}' is '${ability.kind}', not '${expectedKind}'`);
        else if(expectedKind==="attack")attackReferences++;
        else passiveReferences++;
      });
    });
  });

  return {
    valid:errors.length===0,
    counts:{abilities:abilities.length,attacks:abilities.filter(item=>item.kind==="attack").length,passives:abilities.filter(item=>item.kind==="passive").length,monsterAttackReferences:attackReferences,monsterPassiveReferences:passiveReferences},
    errors,
    duplicateIds:[...new Set(duplicateIds)]
  };
}

function assertValidAbilityData(abilityData,gameData,monsterData,statusData=null,damageTypeData=null){
  const result=validateAbilityData(abilityData,gameData,monsterData,statusData,damageTypeData);
  if(!result.valid){
    const error=new Error(`Ability validation failed with ${result.errors.length} error(s)`);
    error.validation=result;
    throw error;
  }
  return result;
}
