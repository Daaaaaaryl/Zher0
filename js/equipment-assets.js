const EQUIPMENT_ASSET_REGISTRY_PATH="assets/equipment/equipment-assets.json";
const EQUIPMENT_ASSET_RAW_BASE="https://raw.githubusercontent.com/Daaaaaaryl/Zher0/main/";
let assetRegistryDebug={
  status:"fallback",
  url:"",
  schemaVersion:"",
  assetVersion:"",
  loadedCount:1,
  lastError:""
};
let EQUIPMENT_ASSETS={
  katana:{
    id:"katana",
    displayName:"Katana",
    slot:"Main Hand",
    masterArtwork:"assets/equipment/katana/katana_master.png",
    tunerArtwork:"assets/equipment/katana/katana_tuner.png",
    icon:null,
    reference:"assets/equipment/katana/katana_reference.md"
  }
};
const equipmentAssetLoadState=new Map();
const missingEquipmentAssetLookups=new Set();

function assetUrl(path){
  if(!path)return "";
  const resolved=/^https?:\/\//i.test(path)
    ? path
    : (location.protocol==="file:" ? EQUIPMENT_ASSET_RAW_BASE+path : path);
  const version=assetRegistryDebug.assetVersion;
  if(!version)return resolved;
  return `${resolved}${resolved.includes("?")?"&":"?"}v=${encodeURIComponent(version)}`;
}
function observedEquipmentAssetUrl(url){
  try{return new URL(url,location.href).href}catch(e){return String(url||"")}
}
function recordEquipmentAssetLoad(url,loaded){
  if(url)equipmentAssetLoadState.set(observedEquipmentAssetUrl(url),loaded?"loaded":"failed");
  try{updateSystemDiagnostics()}catch(e){}
}
async function loadEquipmentAssetRegistry(){
  const registryUrl=location.protocol==="file:"
    ? EQUIPMENT_ASSET_RAW_BASE+EQUIPMENT_ASSET_REGISTRY_PATH
    : EQUIPMENT_ASSET_REGISTRY_PATH;
  assetRegistryDebug.status="loading";
  assetRegistryDebug.url=registryUrl;
  assetRegistryDebug.lastError="";
  try{
    const res=await fetch(registryUrl,{cache:"no-store"});
    if(!res.ok)throw new Error(`Asset registry ${res.status}`);
    const data=await res.json();
    if(!Array.isArray(data?.equipment))throw new Error("Invalid equipment asset registry");
    const loaded={};
    data.equipment.forEach(item=>{
      if(!item?.id)return;
      loaded[normalizeEquipmentId(item.id)]={...item};
    });
    if(Object.keys(loaded).length)EQUIPMENT_ASSETS=loaded;
    assetRegistryDebug.status="loaded";
    assetRegistryDebug.schemaVersion=data?.schemaVersion??"";
    assetRegistryDebug.assetVersion=data?.assetVersion??data?.version??"";
    assetRegistryDebug.loadedCount=Object.keys(EQUIPMENT_ASSETS).length;
  }catch(e){
    assetRegistryDebug.status="fallback";
    assetRegistryDebug.loadedCount=Object.keys(EQUIPMENT_ASSETS).length;
    assetRegistryDebug.lastError=String(e?.message||e);
    console.warn("Equipment asset registry unavailable; using built-in fallback.",e);
  }finally{
    // Preserve Finalized Equipment UI state when artwork is refreshed.
    if(typeof renderStatTuner==="function" && q("tunerFocus")?.innerHTML){
      try{renderStatTuner()}catch(e){}
    }
    if(typeof renderFinalizedSets==="function" && Array.isArray(finalizedSets) && finalizedSets.length){
      try{renderFinalizedSets()}catch(e){}
    }
    try{updateSystemDiagnostics()}catch(e){}
  }
}
function equipmentAsset(name,slot=""){
  const id=normalizeEquipmentId(name);
  if(EQUIPMENT_ASSETS[id])return EQUIPMENT_ASSETS[id];
  const found=Object.values(EQUIPMENT_ASSETS).find(x=>
    normalizeEquipmentId(x.displayName)===id ||
    (x.slot===slot && normalizeEquipmentId(name)===normalizeEquipmentId(x.displayName))
  )||null;
  if(!found && (name||slot))missingEquipmentAssetLookups.add(`${slot||"Unknown slot"}: ${name||"Unknown equipment"}`);
  return found;
}
function equipmentArtworkUrl(name,slot=""){
  const a=equipmentAsset(name,slot);
  return a?.masterArtwork?assetUrl(a.masterArtwork):"";
}
function equipmentTunerArtworkUrl(name,slot=""){
  const a=equipmentAsset(name,slot);
  return a?.tunerArtwork?assetUrl(a.tunerArtwork):"";
}
function equipmentIconUrl(name,slot=""){
  const a=equipmentAsset(name,slot);
  return a?.icon?assetUrl(a.icon):"";
}
