"use strict";

const MONSTER_ID_PATTERN=/^[a-z][a-z0-9_]*$/;

function validateMonsterData(monsterData,gameData,statusData=null){
  const errors=[];
  const duplicateIds=[];
  const addError=(code,path,message)=>errors.push({code,path,message});
  const core=monsterData?.core;
  const collection=monsterData?.monsters;
  const families=Array.isArray(core?.families)?core.families:[];
  const roles=Array.isArray(core?.roles)?core.roles:[];
  const tiers=Array.isArray(core?.tiers)?core.tiers:[];
  const monsters=Array.isArray(collection?.monsters)?collection.monsters:[];
  const statIds=new Set((gameData?.core?.stats||[]).map(item=>item.id));
  const statusIds=new Set((statusData?.statusEffects||[]).map(item=>item.id));

  if(!core||!Array.isArray(core.families)||!Array.isArray(core.roles)||!Array.isArray(core.tiers))addError("invalid_monster_core","core","monster-core requires families, roles, and tiers arrays");
  if(!collection||!Array.isArray(collection.monsters))addError("invalid_monster_collection","monsters","monsters requires a monsters array");

  function indexUnique(items,kind){
    const index=new Map();
    items.forEach((item,i)=>{
      const path=`${kind}[${i}]`;
      if(!item||typeof item.id!=="string"||!MONSTER_ID_PATTERN.test(item.id))addError("invalid_canonical_id",`${path}.id`,`${kind} ID must be stable and ASCII-safe`);
      if(index.has(item?.id)){
        duplicateIds.push(`${kind}:${item.id}`);
        addError("duplicate_id",`${path}.id`,`${kind} ID '${item.id}' is duplicated`);
      }else if(item?.id)index.set(item.id,item);
    });
    return index;
  }

  const familyIndex=indexUnique(families,"families");
  const roleIndex=indexUnique(roles,"roles");
  const tierIndex=indexUnique(tiers,"tiers");
  indexUnique(monsters,"monsters");

  families.forEach((item,i)=>{
    ["id","displayName","summary"].forEach(field=>{if(typeof item?.[field]!=="string"||!item[field])addError("missing_required_field",`families[${i}].${field}`,`Family requires ${field}`)});
    if(!Array.isArray(item?.tags))addError("malformed_field",`families[${i}].tags`,"Family tags must be an array");
  });

  roles.forEach((item,i)=>{
    ["id","displayName","description"].forEach(field=>{if(typeof item?.[field]!=="string"||!item[field])addError("missing_required_field",`roles[${i}].${field}`,`Role requires ${field}`)});
    ["strongStatTendencies","weakStatTendencies"].forEach(field=>{
      if(!Array.isArray(item?.[field]))addError("malformed_field",`roles[${i}].${field}`,`${field} must be an array`);
      else item[field].forEach((statId,j)=>{if(!statIds.has(statId))addError("unknown_stat",`roles[${i}].${field}[${j}]`,`Unknown canonical stat '${statId}'`)});
    });
  });

  tiers.forEach((item,i)=>["id","displayName","description"].forEach(field=>{
    if(typeof item?.[field]!=="string"||!item[field])addError("missing_required_field",`tiers[${i}].${field}`,`Tier requires ${field}`);
  }));

  monsters.forEach((item,i)=>{
    const path=`monsters[${i}]`;
    ["id","displayName","familyId","roleId","status"].forEach(field=>{if(typeof item?.[field]!=="string"||!item[field])addError("missing_required_field",`${path}.${field}`,`Monster requires ${field}`)});
    if(!familyIndex.has(item?.familyId))addError("unknown_family",`${path}.familyId`,`Unknown family '${item?.familyId}'`);
    if(!roleIndex.has(item?.roleId))addError("unknown_role",`${path}.roleId`,`Unknown role '${item?.roleId}'`);
    if(item?.tierId!==null&&!tierIndex.has(item?.tierId))addError("unknown_tier",`${path}.tierId`,`Unknown tier '${item?.tierId}'`);
    ["strongStatIds","weakStatIds"].forEach(field=>{
      if(!Array.isArray(item?.[field]))addError("malformed_field",`${path}.${field}`,`${field} must be an array`);
      else{
        const seen=new Set();
        item[field].forEach((statId,j)=>{
          if(!statIds.has(statId))addError("unknown_stat",`${path}.${field}[${j}]`,`Unknown canonical stat '${statId}'`);
          if(seen.has(statId))addError(field==="strongStatIds"?"duplicate_strong_stat":"duplicate_weak_stat",`${path}.${field}[${j}]`,`Stat '${statId}' is duplicated in ${field}`);
          seen.add(statId);
        });
      }
    });
    const strong=new Set(Array.isArray(item?.strongStatIds)?item.strongStatIds:[]);
    (Array.isArray(item?.weakStatIds)?item.weakStatIds:[]).forEach((statId,j)=>{if(strong.has(statId))addError("conflicting_stat_tendency",`${path}.weakStatIds[${j}]`,`Stat '${statId}' cannot be both strong and weak`)});
    if(item?.baseStatBudget!==null&&(!Number.isFinite(item?.baseStatBudget)||item.baseStatBudget<0))addError("invalid_numeric_field",`${path}.baseStatBudget`,"baseStatBudget must be null or a finite non-negative number");
    ["attackIds","passiveIds","statusImmunityIds"].forEach(field=>{
      if(!Array.isArray(item?.[field]))addError("malformed_future_reference",`${path}.${field}`,`${field} must be an array`);
      else if(field==="statusImmunityIds")item[field].forEach((statusId,statusIndex)=>{if(!statusIds.has(statusId))addError("unknown_status_immunity",`${path}.${field}[${statusIndex}]`,`Unknown canonical status effect '${statusId}'`)});
    });
    ["statProfileId","dropTableId","assetId"].forEach(field=>{
      if(item?.[field]!==null)addError("premature_future_reference",`${path}.${field}`,`${field} must remain null until its canonical system exists`);
    });
    if(!Array.isArray(item?.tags))addError("malformed_field",`${path}.tags`,"tags must be an array");
    if(!item?.design||typeof item.design!=="object"||Array.isArray(item.design))addError("missing_required_field",`${path}.design`,"Monster requires a design object");
    else ["combatIdentity","visualConcept","notes"].forEach(field=>{if(typeof item.design[field]!=="string")addError("missing_required_field",`${path}.design.${field}`,`Monster design requires ${field}`)});
  });

  return {
    valid:errors.length===0,
    counts:{families:families.length,roles:roles.length,tiers:tiers.length,monsters:monsters.length},
    errors,
    duplicateIds:[...new Set(duplicateIds)]
  };
}

function assertValidMonsterData(monsterData,gameData,statusData=null){
  const result=validateMonsterData(monsterData,gameData,statusData);
  if(!result.valid){
    const error=new Error(`Monster validation failed: ${result.errors.map(item=>item.message).join("; ")}`);
    error.validation=result;
    throw error;
  }
  return result;
}
