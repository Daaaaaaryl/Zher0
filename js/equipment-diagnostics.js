"use strict";

let lastRuntimeError="";

function localStorageAvailable(){
  try{
    const k="__esd_debug_test__";
    localStorage.setItem(k,"1");localStorage.removeItem(k);return true;
  }catch(e){return false}
}

function debugReportObject(){
  const equipmentAssetDiagnostics=Object.values(EQUIPMENT_ASSETS||{}).map(asset=>{
    const masterResolved=asset.masterArtwork?assetUrl(asset.masterArtwork):"";
    const tunerResolved=asset.tunerArtwork?assetUrl(asset.tunerArtwork):"";
    return {
      id:asset.id||"",
      displayName:asset.displayName||"",
      slot:asset.slot||"",
      masterArtwork:asset.masterArtwork||null,
      resolvedMasterArtwork:masterResolved||null,
      masterLoadState:masterResolved?(equipmentAssetLoadState.get(observedEquipmentAssetUrl(masterResolved))||"not-observed"):"missing",
      tunerArtwork:asset.tunerArtwork||null,
      resolvedTunerArtwork:tunerResolved||null,
      tunerLoadState:tunerResolved?(equipmentAssetLoadState.get(observedEquipmentAssetUrl(tunerResolved))||"not-observed"):"pending",
      icon:asset.icon||null,
      reference:asset.reference||null,
      assetVersion:assetRegistryDebug?.assetVersion||null
    };
  });
  return {
    generatedAt:new Date().toISOString(),
    frontendVersion:VERSION,
    buildVersion:BUILD_VERSION,
    backendContract:BACKEND_VERSION,
    pageUrl:location.href,
    protocol:location.protocol,
    storageKey:STORAGE_KEY,
    localStorageAvailable:localStorageAvailable(),
    recordId:state?.currentRecordId||"",
    recordName:q("recordName")?.value||"",
    equipmentSetName:q("equipmentSetName")?.value||"",
    focusModeActive:typeof focusModeActive!=="undefined"?focusModeActive:false,
    focusPanel:typeof focusPanel!=="undefined"?focusPanel:"",
    finalTweakOpen:typeof finalTweakOpen!=="undefined"?finalTweakOpen:false,
    finalizedSetCount:Array.isArray(finalizedSets)?finalizedSets.length:0,
    sheetEndpoint:GOOGLE_SHEET_API,
    assetRegistryPath:EQUIPMENT_ASSET_REGISTRY_PATH,
    assetRegistryResolvedUrl:assetRegistryDebug?.url||"",
    assetRegistryStatus:assetRegistryDebug?.status||"unknown",
    assetRegistrySchemaVersion:assetRegistryDebug?.schemaVersion||"",
    assetRegistryAssetVersion:assetRegistryDebug?.assetVersion||"",
    assetRegistryLoadedCount:assetRegistryDebug?.loadedCount??Object.keys(EQUIPMENT_ASSETS||{}).length,
    assetRegistryLastError:assetRegistryDebug?.lastError||"",
    loadedAssetIds:Object.keys(EQUIPMENT_ASSETS||{}),
    equipmentAssetDiagnostics,
    missingEquipmentAssetLookups:[...missingEquipmentAssetLookups],
    lastRuntimeError:lastRuntimeError||""
  };
}

function updateSystemDiagnostics(){
  const set=(id,val)=>{const el=q(id);if(el)el.textContent=(val===undefined||val===null||val==="")?"—":String(val)};
  const d=debugReportObject();
  set("dbgBuildVersion",`${d.buildVersion} · core ${d.frontendVersion}`);
  set("dbgBackendVersion",d.backendContract);
  set("dbgProtocol",d.protocol);
  set("dbgAssetStatus",`${d.assetRegistryStatus}${d.assetRegistryAssetVersion?` · v${d.assetRegistryAssetVersion}`:""}`);
  set("dbgAssetCount",d.assetRegistryLoadedCount);
  set("dbgFinalizedCount",d.finalizedSetCount);
  set("dbgFocusState",d.focusModeActive?`Focus: ${d.focusPanel}`:(d.finalTweakOpen?"Show All · Final Tweak open":"Show All"));
  set("dbgStorageState",d.localStorageAvailable?`Available · ${d.storageKey}`:"Unavailable");
  set("dbgPageUrl",d.pageUrl);
  set("dbgSheetPath",d.sheetEndpoint);
  set("dbgAssetPath",`${d.assetRegistryPath}${d.assetRegistryResolvedUrl?` → ${d.assetRegistryResolvedUrl}`:""}`);
  set("dbgAssetIds",d.loadedAssetIds.join(", "));
  set("dbgAssetDetails",JSON.stringify(d.equipmentAssetDiagnostics,null,2));
  set("dbgLastError",d.lastRuntimeError||d.assetRegistryLastError||"None");
}

async function copyDebugReport(){
  const text=JSON.stringify(debugReportObject(),null,2);
  let ok=false;
  try{
    await navigator.clipboard.writeText(text);ok=true;
  }catch(e){
    try{
      const ta=document.createElement("textarea");
      ta.value=text;ta.style.position="fixed";ta.style.opacity="0";
      document.body.appendChild(ta);ta.select();ok=document.execCommand("copy");ta.remove();
    }catch(_){}
  }
  const st=q("debugCopyStatus");
  if(st){st.textContent=ok?"Copied":"Copy failed";setTimeout(()=>{st.textContent=""},1800)}
}
