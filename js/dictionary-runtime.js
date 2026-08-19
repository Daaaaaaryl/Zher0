"use strict";

const DICTIONARY_DATA_PATH="data/dictionary.json";
const DICTIONARY_ID_PATTERN=/^[a-z][a-z0-9_]*$/;
const DICTIONARY_REFERENCE_CATEGORIES=Object.freeze({
  stat:"stat",
  slot:"equipment_slot",
  equipment_set:"equipment_set",
  equipment:"equipment",
  monster_family:"monster_family",
  monster_role:"monster_role",
  monster_tier:"monster_tier",
  monster:"monster",
  ability:"ability",
  status_effect:"status_effect"
});

let DICTIONARY_RUNTIME=null;
let DICTIONARY_VALIDATION=null;
let DICTIONARY_INDEX=null;

function deepFreezeDictionary(value){
  if(!value||typeof value!=="object"||Object.isFrozen(value))return value;
  Object.freeze(value);
  Object.values(value).forEach(deepFreezeDictionary);
  return value;
}

function canonicalDictionaryReferences(gameData,monsterData=null,abilityData=null,statusData=null){
  return {
    stat:new Set((gameData?.core?.stats||[]).map(item=>item.id)),
    slot:new Set((gameData?.core?.equipmentSlots||[]).map(item=>item.id)),
    equipment_set:new Set((gameData?.equipmentSets?.equipmentSets||[]).map(item=>item.id)),
    equipment:new Set((gameData?.equipment?.equipment||[]).map(item=>item.id)),
    monster_family:new Set((monsterData?.core?.families||[]).map(item=>item.id)),
    monster_role:new Set((monsterData?.core?.roles||[]).map(item=>item.id)),
    monster_tier:new Set((monsterData?.core?.tiers||[]).map(item=>item.id)),
    monster:new Set((monsterData?.monsters?.monsters||[]).map(item=>item.id)),
    ability:new Set((abilityData?.abilities||[]).map(item=>item.id)),
    status_effect:new Set((statusData?.statusEffects||[]).map(item=>item.id))
  };
}

function validateDictionaryData(dictionaryData,gameData,monsterData=null,abilityData=null,statusData=null){
  const errors=[];
  const duplicateIds=[];
  const missingCanonicalReferences=[];
  const duplicateCanonicalCoverage=[];
  const entries=Array.isArray(dictionaryData?.entries)?dictionaryData.entries:[];
  const canonical=canonicalDictionaryReferences(gameData,monsterData,abilityData,statusData);
  const entryIndex=new Map();
  const referenceIndex=new Map();
  const counts={stat:0,equipment_slot:0,equipment_set:0,equipment:0,monster_family:0,monster_role:0,monster_tier:0,monster:0,ability:0,status_effect:0};
  const addError=(code,path,message)=>errors.push({code,path,message});

  if(!dictionaryData||!Array.isArray(dictionaryData.entries))addError("invalid_dictionary","entries","dictionary requires an entries array");
  entries.forEach((entry,i)=>{
    const path=`entries[${i}]`;
    ["id","displayName","category","referenceType","referenceId","summary","description"].forEach(field=>{
      if(typeof entry?.[field]!=="string"||!entry[field])addError("missing_required_field",`${path}.${field}`,`Dictionary entry requires ${field}`);
    });
    if(!entry||!("lore" in entry))addError("missing_required_field",`${path}.lore`,"Dictionary entry requires lore");
    if(!Array.isArray(entry?.relatedEntryIds))addError("missing_required_field",`${path}.relatedEntryIds`,"Dictionary entry requires relatedEntryIds array");
    if(typeof entry?.id!=="string"||!DICTIONARY_ID_PATTERN.test(entry.id))addError("invalid_id",`${path}.id`,"Dictionary ID must be stable and ASCII-safe");
    if(entryIndex.has(entry?.id)){
      duplicateIds.push(entry.id);
      addError("duplicate_id",`${path}.id`,`Dictionary ID '${entry.id}' is duplicated`);
    }else if(entry?.id)entryIndex.set(entry.id,entry);
    if(Object.prototype.hasOwnProperty.call(counts,entry?.category))counts[entry.category]++;

    const expectedCategory=DICTIONARY_REFERENCE_CATEGORIES[entry?.referenceType];
    if(!expectedCategory)addError("invalid_reference_type",`${path}.referenceType`,`Unknown reference type '${entry?.referenceType}'`);
    else{
      if(entry.category!==expectedCategory)addError("reference_category_mismatch",`${path}.category`,`Reference type '${entry.referenceType}' requires category '${expectedCategory}'`);
      if(!canonical[entry.referenceType].has(entry.referenceId)){
        missingCanonicalReferences.push(`${entry.referenceType}:${entry.referenceId}`);
        addError("missing_canonical_reference",`${path}.referenceId`,`Unknown canonical ${entry.referenceType} '${entry.referenceId}'`);
      }
      const key=`${entry.referenceType}:${entry.referenceId}`;
      if(referenceIndex.has(key)){
        duplicateCanonicalCoverage.push(key);
        addError("duplicate_canonical_coverage",`${path}.referenceId`,`Canonical reference '${key}' is covered more than once`);
      }else referenceIndex.set(key,entry);
    }
  });

  entries.forEach((entry,i)=>{
    if(!Array.isArray(entry?.relatedEntryIds))return;
    entry.relatedEntryIds.forEach((relatedId,j)=>{
      if(relatedId===entry.id)addError("self_reference",`entries[${i}].relatedEntryIds[${j}]`,"Dictionary entries cannot reference themselves");
      else if(!entryIndex.has(relatedId))addError("invalid_related_id",`entries[${i}].relatedEntryIds[${j}]`,`Unknown related dictionary ID '${relatedId}'`);
    });
  });

  Object.entries(canonical).forEach(([referenceType,ids])=>ids.forEach(referenceId=>{
    const key=`${referenceType}:${referenceId}`;
    if(!referenceIndex.has(key)){
      missingCanonicalReferences.push(key);
      addError("orphaned_canonical_entry","entries",`Canonical reference '${key}' has no dictionary entry`);
    }
  }));

  return {
    valid:errors.length===0,
    entryCount:entries.length,
    counts,
    errors,
    duplicateIds:[...new Set(duplicateIds)],
    missingCanonicalReferences:[...new Set(missingCanonicalReferences)],
    duplicateCanonicalCoverage:[...new Set(duplicateCanonicalCoverage)]
  };
}

function assertValidDictionaryData(dictionaryData,gameData,monsterData=null,abilityData=null,statusData=null){
  const result=validateDictionaryData(dictionaryData,gameData,monsterData,abilityData,statusData);
  if(!result.valid){
    const error=new Error(`Dictionary validation failed: ${result.errors.map(item=>item.message).join("; ")}`);
    error.validation=result;
    throw error;
  }
  return result;
}

async function loadDictionary(options={}){
  const path=options.path||DICTIONARY_DATA_PATH;
  const gameData=options.gameData||(typeof getGameData==="function"?getGameData():null);
  const monsterData=options.monsterData||(typeof MONSTER_DATA_RUNTIME!=="undefined"?MONSTER_DATA_RUNTIME:null);
  const abilityData=options.abilityData||(typeof ABILITY_DATA_RUNTIME!=="undefined"?ABILITY_DATA_RUNTIME:null);
  const statusData=options.statusData||(typeof STATUS_DATA_RUNTIME!=="undefined"?STATUS_DATA_RUNTIME:null);
  if(!gameData)throw new Error("Canonical game data must be loaded or supplied before the dictionary");
  if(!monsterData)throw new Error("Canonical monster data must be loaded or supplied before the dictionary");
  if(!abilityData)throw new Error("Canonical ability data must be loaded or supplied before the dictionary");
  if(!statusData)throw new Error("Canonical status data must be loaded or supplied before the dictionary");
  const response=await fetch(path,{cache:"no-store"});
  if(!response.ok)throw new Error(`Unable to load ${path}: HTTP ${response.status}`);
  const source=await response.json();
  DICTIONARY_VALIDATION=deepFreezeDictionary(assertValidDictionaryData(source,gameData,monsterData,abilityData,statusData));
  DICTIONARY_RUNTIME=deepFreezeDictionary(source);
  const byId=new Map();
  const byCategory=new Map();
  const byReference=new Map();
  DICTIONARY_RUNTIME.entries.forEach(entry=>{
    byId.set(entry.id,entry);
    if(!byCategory.has(entry.category))byCategory.set(entry.category,[]);
    byCategory.get(entry.category).push(entry);
    byReference.set(`${entry.referenceType}:${entry.referenceId}`,entry);
  });
  byCategory.forEach(entries=>Object.freeze(entries));
  DICTIONARY_INDEX={byId,byCategory,byReference};
  return DICTIONARY_RUNTIME;
}

function requireDictionary(){
  if(!DICTIONARY_RUNTIME)throw new Error("Dictionary data has not been loaded");
  return DICTIONARY_RUNTIME;
}

function getDictionaryEntry(id){requireDictionary();return DICTIONARY_INDEX.byId.get(id)||null}
function getDictionaryEntriesByCategory(category){requireDictionary();return DICTIONARY_INDEX.byCategory.get(category)||Object.freeze([])}
function getDictionaryEntryByReference(referenceType,referenceId){requireDictionary();return DICTIONARY_INDEX.byReference.get(`${referenceType}:${referenceId}`)||null}
function getDictionaryValidation(){return DICTIONARY_VALIDATION}
