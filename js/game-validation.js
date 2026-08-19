"use strict";

const GAME_DATA_STAT_IDS=["HP","PA","PD","MA","MD","SP"];
const GAME_DATA_SLOT_IDS=["main_hand","off_hand","body","head","boots","accessory"];
const GAME_DATA_ID_PATTERN=/^[a-z][a-z0-9_]*$/;
const GAME_DATA_STAT_ID_PATTERN=/^[A-Z][A-Z0-9_]*$/;

function validateGameData(gameData,assetRegistry){
  const errors=[];
  const duplicateIds=[];
  const unknownStatKeys=[];
  const unknownSlotIds=[];
  const missingAssetIds=[];
  const addError=(code,path,message)=>errors.push({code,path,message});
  const core=gameData?.core;
  const equipmentData=gameData?.equipment;
  const setData=gameData?.equipmentSets;
  const stats=Array.isArray(core?.stats)?core.stats:[];
  const slots=Array.isArray(core?.equipmentSlots)?core.equipmentSlots:[];
  const equipment=Array.isArray(equipmentData?.equipment)?equipmentData.equipment:[];
  const sets=Array.isArray(setData?.equipmentSets)?setData.equipmentSets:[];
  if(!core||!Array.isArray(core.stats)||!Array.isArray(core.equipmentSlots))addError("invalid_core","core","game-core requires stats and equipmentSlots arrays");
  if(!equipmentData||!Array.isArray(equipmentData.equipment))addError("invalid_equipment_collection","equipment","equipment requires an equipment array");
  if(!setData||!Array.isArray(setData.equipmentSets))addError("invalid_set_collection","equipmentSets","equipment-sets requires an equipmentSets array");

  function indexUnique(items,kind,pattern=GAME_DATA_ID_PATTERN){
    const index=new Map();
    items.forEach((item,i)=>{
      const path=`${kind}[${i}]`;
      if(!item||typeof item.id!=="string"||!pattern.test(item.id))addError("invalid_id",`${path}.id`,`${kind} ID must be stable and ASCII-safe`);
      if(index.has(item?.id)){
        duplicateIds.push(item.id);
        addError("duplicate_id",`${path}.id`,`${kind} ID '${item.id}' is duplicated`);
      }else if(item?.id)index.set(item.id,item);
    });
    return index;
  }

  const statIndex=indexUnique(stats,"stats",GAME_DATA_STAT_ID_PATTERN);
  const slotIndex=indexUnique(slots,"equipmentSlots");
  const equipmentIndex=indexUnique(equipment,"equipment");
  const setIndex=indexUnique(sets,"equipmentSets");
  const assetItems=Array.isArray(assetRegistry?.equipment)?assetRegistry.equipment:[];
  const assetIndex=indexUnique(assetItems,"assetRegistry.equipment");

  GAME_DATA_STAT_IDS.forEach(id=>{if(!statIndex.has(id))addError("missing_canonical_stat","core.stats",`Missing canonical stat '${id}'`)});
  statIndex.forEach((_,id)=>{if(!GAME_DATA_STAT_IDS.includes(id)){unknownStatKeys.push(id);addError("unknown_stat_id","core.stats",`Unknown stat ID '${id}'`)}});
  GAME_DATA_SLOT_IDS.forEach(id=>{if(!slotIndex.has(id))addError("missing_canonical_slot","core.equipmentSlots",`Missing canonical slot '${id}'`)});
  slotIndex.forEach((_,id)=>{if(!GAME_DATA_SLOT_IDS.includes(id)){unknownSlotIds.push(id);addError("unknown_slot_id","core.equipmentSlots",`Unknown slot ID '${id}'`)}});

  equipment.forEach((item,i)=>{
    const path=`equipment[${i}]`;
    ["id","displayName","slotId","setId","assetId"].forEach(field=>{if(typeof item?.[field]!=="string"||!item[field])addError("missing_required_field",`${path}.${field}`,`Equipment requires ${field}`)});
    if(!slotIndex.has(item?.slotId)){unknownSlotIds.push(item?.slotId);addError("unknown_slot_id",`${path}.slotId`,`Unknown slot '${item?.slotId}'`)}
    if(!setIndex.has(item?.setId))addError("unknown_set_id",`${path}.setId`,`Unknown set '${item?.setId}'`);
    if(!item?.assetId){missingAssetIds.push(item?.id||path);addError("missing_asset_id",`${path}.assetId`,"Equipment requires assetId")}
    else if(!assetIndex.has(item.assetId)){missingAssetIds.push(item.assetId);addError("unknown_asset_id",`${path}.assetId`,`Unknown asset '${item.assetId}'`)}
    if(!item?.statProfile||typeof item.statProfile!=="object"||Array.isArray(item.statProfile))addError("invalid_stat_profile",`${path}.statProfile`,"statProfile must be an object");
    const profileKeys=item?.statProfile&&typeof item.statProfile==="object"&&!Array.isArray(item.statProfile)?Object.keys(item.statProfile):[];
    GAME_DATA_STAT_IDS.forEach(id=>{if(!profileKeys.includes(id))addError("missing_stat_key",`${path}.statProfile`,`Missing stat '${id}'`)});
    profileKeys.forEach(id=>{
      if(!GAME_DATA_STAT_IDS.includes(id)){unknownStatKeys.push(id);addError("unknown_stat_key",`${path}.statProfile.${id}`,`Unknown stat '${id}'`)}
      if(!Number.isFinite(item.statProfile[id]))addError("non_finite_stat",`${path}.statProfile.${id}`,`Stat '${id}' must be finite`);
    });
    ["grantedAttackIds","passiveIds","tags"].forEach(field=>{if(!Array.isArray(item?.[field]))addError("invalid_array",`${path}.${field}`,`${field} must be an array`)});
  });

  const membershipCounts=new Map();
  sets.forEach((set,i)=>{
    const path=`equipmentSets[${i}]`;
    if(typeof set?.displayName!=="string"||!set.displayName)addError("missing_required_field",`${path}.displayName`,"Set requires displayName");
    if(!set?.equipmentBySlot||typeof set.equipmentBySlot!=="object"||Array.isArray(set.equipmentBySlot))addError("invalid_equipment_by_slot",`${path}.equipmentBySlot`,"Set requires equipmentBySlot");
    const bySlot=set?.equipmentBySlot&&typeof set.equipmentBySlot==="object"&&!Array.isArray(set.equipmentBySlot)?set.equipmentBySlot:{};
    const seen=new Set();
    GAME_DATA_SLOT_IDS.forEach(slotId=>{
      if(!Object.prototype.hasOwnProperty.call(bySlot,slotId)){addError("missing_set_slot",`${path}.equipmentBySlot`,`Set is missing slot '${slotId}'`);return}
      const equipmentId=bySlot[slotId];
      if(seen.has(equipmentId))addError("duplicate_set_equipment",`${path}.equipmentBySlot.${slotId}`,`Equipment '${equipmentId}' occupies multiple slots`);
      seen.add(equipmentId);
      const item=equipmentIndex.get(equipmentId);
      if(!item)addError("unknown_equipment_reference",`${path}.equipmentBySlot.${slotId}`,`Unknown equipment '${equipmentId}'`);
      else{
        membershipCounts.set(equipmentId,(membershipCounts.get(equipmentId)||0)+1);
        if(item.slotId!==slotId)addError("set_slot_mismatch",`${path}.equipmentBySlot.${slotId}`,`Equipment '${equipmentId}' belongs to '${item.slotId}', not '${slotId}'`);
        if(item.setId!==set.id)addError("equipment_set_mismatch",`${path}.equipmentBySlot.${slotId}`,`Equipment '${equipmentId}' references set '${item.setId}'`);
      }
    });
    Object.keys(bySlot).forEach(slotId=>{if(!GAME_DATA_SLOT_IDS.includes(slotId)){unknownSlotIds.push(slotId);addError("unknown_set_slot",`${path}.equipmentBySlot.${slotId}`,`Unknown set slot '${slotId}'`)}});
    if(set?.collectionUnlockId!==null)addError("collection_unlock_not_null",`${path}.collectionUnlockId`,"collectionUnlockId must remain null in Phase 5");
    if(!Array.isArray(set?.tags))addError("invalid_array",`${path}.tags`,"tags must be an array");
  });
  equipment.forEach(item=>{
    const count=membershipCounts.get(item.id)||0;
    if(count!==1)addError("invalid_set_membership","equipmentSets",`Equipment '${item.id}' must appear in exactly one set slot; found ${count}`);
  });

  const assetResolved=equipment.filter(item=>item?.assetId&&assetIndex.has(item.assetId)).length;
  const setMembershipResolved=equipment.filter(item=>(membershipCounts.get(item.id)||0)===1).length;
  return {
    valid:errors.length===0,
    errors,
    duplicateIds:[...new Set(duplicateIds)],
    unknownStatKeys:[...new Set(unknownStatKeys.filter(Boolean))],
    unknownSlotIds:[...new Set(unknownSlotIds.filter(Boolean))],
    missingAssetIds:[...new Set(missingAssetIds.filter(Boolean))],
    counts:{stats:stats.length,slots:slots.length,equipment:equipment.length,equipmentSets:sets.length,assetReferencesResolved:assetResolved,setMembershipResolved}
  };
}

function assertValidGameData(gameData,assetRegistry){
  const result=validateGameData(gameData,assetRegistry);
  if(!result.valid){
    const error=new Error(`Game data validation failed with ${result.errors.length} error(s)`);
    error.validation=result;
    throw error;
  }
  return result;
}
