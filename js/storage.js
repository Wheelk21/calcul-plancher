const STORAGE_KEY_PLANCHES="calcul-plancher-planches-actives";
const STORAGE_KEY_RAPPORT="calcul-plancher-rapport-journee";
function sauvegarderPlanchesActives(planches){localStorage.setItem(STORAGE_KEY_PLANCHES,JSON.stringify(planches));}
function chargerPlanchesActives(){try{const v=localStorage.getItem(STORAGE_KEY_PLANCHES);if(!v)return[...CONFIG.planches];const p=JSON.parse(v);return Array.isArray(p)?p:[...CONFIG.planches];}catch{return[...CONFIG.planches];}}
function sauvegarderRapport(wagons){localStorage.setItem(STORAGE_KEY_RAPPORT,JSON.stringify(wagons));}
function chargerRapport(){try{const v=localStorage.getItem(STORAGE_KEY_RAPPORT);if(!v)return[];const w=JSON.parse(v);return Array.isArray(w)?w:[];}catch{return[];}}
