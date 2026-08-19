"use strict";

const STATUS_ID_PATTERN=/^[a-z][a-z0-9_]*$/;
const STATUS_CATEGORIES=new Set(["debuff","buff","control","damage_over_time","utility"]);
const STATUS_DURATION_TYPES=new Set(["turns","actions","until_removed","instant"]);
const STATUS_STACKING_MODES=new Set(["none","refresh","add","replace"]);
const STATUS_STAT_IDS=new Set(["HP","PA","PD","MA","MD","SP"]);
const STATUS_MODIFIER_OPERATIONS=new Set(["add","multiply","replace"]);
const STATUS_MARKERS=new Set(["provisional"]);

function statusContainsExecutable(value,seen=new Set()){
  if(typeof value==="function")return true;
  if(!value||typeof value!=="object"||seen.has(value))return false;
  seen.add(value);
  return Object.values(value).some(item=>statusContainsExecutable(item,seen));
}

function validateStatusEffects(statusData,gameData,damageTypeData=null){
  const errors=[];
  const duplicateIds=[];
  const addError=(code,path,message)=>errors.push({code,path,message});
  const statuses=Array.isArray(statusData?.statusEffects)?statusData.statusEffects:[];
  const ids=new Set();
  const canonicalStats=new Set((gameData?.core?.stats||[]).map(item=>item.id));
  const canonicalDamageTypes=new Set((damageTypeData?.damageTypes||[]).map(item=>item.id));
  if(!statusData||!Array.isArray(statusData.statusEffects))addError("invalid_status_collection","statusEffects","Status data requires a statusEffects array");

  statuses.forEach((status,index)=>{
    const path=`statusEffects[${index}]`;
    ["id","displayName","category","durationType","status"].forEach(field=>{if(typeof status?.[field]!=="string"||!status[field])addError("missing_required_field",`${path}.${field}`,`Status effect requires ${field}`)});
    if(typeof status?.id!=="string"||!STATUS_ID_PATTERN.test(status.id))addError("invalid_status_id",`${path}.id`,"Status ID must be stable and ASCII-safe");
    if(ids.has(status?.id)){duplicateIds.push(status.id);addError("duplicate_status_id",`${path}.id`,`Status ID '${status.id}' is duplicated`)}else if(status?.id)ids.add(status.id);
    if(!STATUS_CATEGORIES.has(status?.category))addError("invalid_category",`${path}.category`,`Unknown status category '${status?.category}'`);
    if(!STATUS_DURATION_TYPES.has(status?.durationType))addError("invalid_duration_type",`${path}.durationType`,`Unknown duration type '${status?.durationType}'`);
    if(!STATUS_MARKERS.has(status?.status))addError("invalid_status_marker",`${path}.status`,`Invalid status marker '${status?.status}'`);
    if(status?.baseDuration!==null&&(typeof status.baseDuration!=="number"||!Number.isFinite(status.baseDuration)||!Number.isInteger(status.baseDuration)||status.baseDuration<0))addError("invalid_base_duration",`${path}.baseDuration`,"baseDuration must be null or a non-negative integer");
    if(status?.applicationChance!==null&&(typeof status.applicationChance!=="number"||!Number.isFinite(status.applicationChance)||status.applicationChance<0||status.applicationChance>1))addError("invalid_application_chance",`${path}.applicationChance`,"applicationChance must be null or between 0 and 1");
    if(status?.resistanceTypeId!==null&&(typeof status.resistanceTypeId!=="string"||!STATUS_ID_PATTERN.test(status.resistanceTypeId)))addError("invalid_resistance_type",`${path}.resistanceTypeId`,"resistanceTypeId must be null or an ASCII-safe identifier");
    if(status?.behaviorKey!==null&&(typeof status.behaviorKey!=="string"||!STATUS_ID_PATTERN.test(status.behaviorKey)))addError("invalid_behavior_key",`${path}.behaviorKey`,"behaviorKey must be null or an ASCII-safe identifier");
    if(statusContainsExecutable(status))addError("executable_value",path,"Canonical status data cannot contain executable function values");

    if(!status?.stacking||typeof status.stacking!=="object"||Array.isArray(status.stacking))addError("malformed_stacking",`${path}.stacking`,"stacking must be an object");
    else{
      if(!STATUS_STACKING_MODES.has(status.stacking.mode))addError("invalid_stacking_mode",`${path}.stacking.mode`,`Unknown stacking mode '${status.stacking.mode}'`);
      if(status.stacking.maxStacks!==null&&(typeof status.stacking.maxStacks!=="number"||!Number.isFinite(status.stacking.maxStacks)||!Number.isInteger(status.stacking.maxStacks)||status.stacking.maxStacks<1))addError("invalid_max_stacks",`${path}.stacking.maxStacks`,"maxStacks must be null or a positive integer");
    }

    if(status?.periodicEffect!==null){
      const effect=status.periodicEffect;
      if(!effect||typeof effect!=="object"||Array.isArray(effect))addError("malformed_periodic_effect",`${path}.periodicEffect`,"periodicEffect must be null or an object");
      else{
        if(effect.behaviorKey!==null&&(typeof effect.behaviorKey!=="string"||!STATUS_ID_PATTERN.test(effect.behaviorKey)))addError("malformed_periodic_effect",`${path}.periodicEffect.behaviorKey`,"Periodic behaviorKey must be null or ASCII-safe");
        if(effect.scalingStat!==null&&!STATUS_STAT_IDS.has(effect.scalingStat))addError("unknown_stat_id",`${path}.periodicEffect.scalingStat`,`Unknown canonical stat '${effect.scalingStat}'`);
        if(effect.damageTypeId!==null&&!canonicalDamageTypes.has(effect.damageTypeId))addError("unknown_damage_type",`${path}.periodicEffect.damageTypeId`,`Unknown canonical damage type '${effect.damageTypeId}'`);
        if(effect.multiplier!==null&&(typeof effect.multiplier!=="number"||!Number.isFinite(effect.multiplier)))addError("malformed_periodic_effect",`${path}.periodicEffect.multiplier`,"Periodic multiplier must be null or finite");
      }
    }

    if(!Array.isArray(status?.statModifiers))addError("malformed_stat_modifiers",`${path}.statModifiers`,"statModifiers must be an array");
    else status.statModifiers.forEach((modifier,modifierIndex)=>{
      const modifierPath=`${path}.statModifiers[${modifierIndex}]`;
      if(!modifier||typeof modifier!=="object"||Array.isArray(modifier))addError("malformed_stat_modifier",modifierPath,"Stat modifier must be an object");
      else{
        if(!STATUS_STAT_IDS.has(modifier.statId)||!canonicalStats.has(modifier.statId))addError("unknown_stat_id",`${modifierPath}.statId`,`Unknown canonical stat '${modifier.statId}'`);
        if(!STATUS_MODIFIER_OPERATIONS.has(modifier.operation))addError("malformed_stat_modifier",`${modifierPath}.operation`,`Unknown modifier operation '${modifier.operation}'`);
        if(typeof modifier.value!=="number"||!Number.isFinite(modifier.value))addError("malformed_stat_modifier",`${modifierPath}.value`,"Modifier value must be finite");
      }
    });
    if(!Array.isArray(status?.removalConditions))addError("malformed_removal_conditions",`${path}.removalConditions`,"removalConditions must be an array");
    if(!Array.isArray(status?.tags))addError("malformed_tags",`${path}.tags`,"tags must be an array");
    else{
      const tags=new Set();
      status.tags.forEach((tag,tagIndex)=>{if(tags.has(tag))addError("duplicate_tag",`${path}.tags[${tagIndex}]`,`Tag '${tag}' is duplicated`);tags.add(tag)});
    }
    if(!status?.design||typeof status.design!=="object"||Array.isArray(status.design))addError("malformed_design",`${path}.design`,"Status effect requires a design object");
    else ["combatPurpose","notes"].forEach(field=>{if(typeof status.design[field]!=="string")addError("missing_required_field",`${path}.design.${field}`,`Status design requires ${field}`)});
  });
  return {valid:errors.length===0,count:statuses.length,errors,duplicateIds:[...new Set(duplicateIds)]};
}

function assertValidStatusEffects(statusData,gameData,damageTypeData=null){
  const result=validateStatusEffects(statusData,gameData,damageTypeData);
  if(!result.valid){const error=new Error(`Status validation failed with ${result.errors.length} error(s)`);error.validation=result;throw error}
  return result;
}
