"use strict";

const DAMAGE_TYPE_ID_PATTERN=/^[a-z][a-z0-9_]*$/;
const DAMAGE_TYPE_CATEGORIES=new Set(["standard","special"]);
const DAMAGE_TYPE_STATUSES=new Set(["provisional"]);

function damageTypeContainsExecutable(value,seen=new Set()){
  if(typeof value==="function")return true;
  if(!value||typeof value!=="object"||seen.has(value))return false;
  seen.add(value);
  return Object.values(value).some(item=>damageTypeContainsExecutable(item,seen));
}

function validateDamageTypes(damageTypeData,gameData){
  const errors=[];
  const duplicateIds=[];
  const addError=(code,path,message)=>errors.push({code,path,message});
  const damageTypes=Array.isArray(damageTypeData?.damageTypes)?damageTypeData.damageTypes:[];
  const canonicalStats=new Set((gameData?.core?.stats||[]).map(item=>item.id));
  const ids=new Set();
  if(!damageTypeData||!Array.isArray(damageTypeData.damageTypes))addError("invalid_damage_type_collection","damageTypes","Damage type data requires a damageTypes array");

  damageTypes.forEach((damageType,index)=>{
    const path=`damageTypes[${index}]`;
    ["id","displayName","category","behaviorKey","status"].forEach(field=>{if(typeof damageType?.[field]!=="string"||!damageType[field])addError("missing_required_field",`${path}.${field}`,`Damage type requires ${field}`)});
    ["offensiveStatId","defensiveStatId","tags","design"].forEach(field=>{if(!Object.prototype.hasOwnProperty.call(damageType||{},field))addError("missing_required_field",`${path}.${field}`,`Damage type requires ${field}`)});
    if(typeof damageType?.id!=="string"||!DAMAGE_TYPE_ID_PATTERN.test(damageType.id))addError("invalid_damage_type_id",`${path}.id`,"Damage type ID must be stable and ASCII-safe");
    if(ids.has(damageType?.id)){duplicateIds.push(damageType.id);addError("duplicate_damage_type_id",`${path}.id`,`Damage type ID '${damageType.id}' is duplicated`)}else if(damageType?.id)ids.add(damageType.id);
    if(!DAMAGE_TYPE_CATEGORIES.has(damageType?.category))addError("invalid_damage_type_category",`${path}.category`,`Unknown damage type category '${damageType?.category}'`);
    if(typeof damageType?.behaviorKey!=="string"||!DAMAGE_TYPE_ID_PATTERN.test(damageType.behaviorKey))addError("invalid_behavior_key",`${path}.behaviorKey`,"behaviorKey must be an ASCII-safe identifier");
    if(!DAMAGE_TYPE_STATUSES.has(damageType?.status))addError("invalid_status_marker",`${path}.status`,`Invalid status marker '${damageType?.status}'`);
    if(damageTypeContainsExecutable(damageType))addError("executable_value",path,"Canonical damage type data cannot contain executable values");

    const offensive=damageType?.offensiveStatId;
    const defensive=damageType?.defensiveStatId;
    if(offensive!==null&&!canonicalStats.has(offensive))addError("unknown_offensive_stat",`${path}.offensiveStatId`,`Unknown offensive stat '${offensive}'`);
    if(defensive!==null&&!canonicalStats.has(defensive))addError("unknown_defensive_stat",`${path}.defensiveStatId`,`Unknown defensive stat '${defensive}'`);
    if((offensive===null)!==(defensive===null))addError("invalid_nullable_relationship",path,"Offensive and defensive stat references must either both be null or both be canonical stats");
    if(damageType?.category==="standard"&&(offensive===null||defensive===null))addError("invalid_nullable_relationship",path,"Standard damage types require offensive and defensive stat references");

    if(!Array.isArray(damageType?.tags))addError("malformed_tags",`${path}.tags`,"tags must be an array");
    else{
      const tags=new Set();
      damageType.tags.forEach((tag,tagIndex)=>{if(tags.has(tag))addError("duplicate_tag",`${path}.tags[${tagIndex}]`,`Tag '${tag}' is duplicated`);tags.add(tag)});
    }
    if(!damageType?.design||typeof damageType.design!=="object"||Array.isArray(damageType.design))addError("malformed_design",`${path}.design`,"Damage type requires a design object");
    else ["summary","notes"].forEach(field=>{if(typeof damageType.design[field]!=="string")addError("missing_required_field",`${path}.design.${field}`,`Damage type design requires ${field}`)});
  });
  return {valid:errors.length===0,count:damageTypes.length,errors,duplicateIds:[...new Set(duplicateIds)]};
}

function assertValidDamageTypes(damageTypeData,gameData){
  const result=validateDamageTypes(damageTypeData,gameData);
  if(!result.valid){const error=new Error(`Damage type validation failed with ${result.errors.length} error(s)`);error.validation=result;throw error}
  return result;
}
