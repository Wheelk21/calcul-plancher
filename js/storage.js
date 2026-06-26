const STORAGE_KEY="calcul-plancher-planches-actives";
function sauvegarderPlanchesActives(planches){localStorage.setItem(STORAGE_KEY,JSON.stringify(planches));}
function chargerPlanchesActives(){try{const valeur=localStorage.getItem(STORAGE_KEY);if(!valeur)return[...CONFIG.planches];const planches=JSON.parse(valeur);return Array.isArray(planches)?planches:[...CONFIG.planches];}catch{return[...CONFIG.planches];}}
