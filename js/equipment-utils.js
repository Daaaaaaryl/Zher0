function normalizeEquipmentId(value){
  return String(value||"").trim().toLowerCase()
    .normalize("NFKD").replace(/[\u0300-\u036f]/g,"")
    .replace(/[^\w]+/g,"-").replace(/^-+|-+$/g,"");
}

function clamp(v,a,b){return Math.max(a,Math.min(b,v))}

function fmt(v){
  v=Number(v)||0;
  return Math.abs(v-Math.round(v))<1e-9?String(Math.round(v)):v.toFixed(2);
}

function safe(s){return s.replace(/[^a-z0-9]/gi,"_")}

function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}

function sumObj(o){return Object.values(o||{}).reduce((a,v)=>a+(Number(v)||0),0)}
