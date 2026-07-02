const STORAGE_KEY_PLANCHES = "calcul-plancher-planches-actives";
const STORAGE_KEY_RAPPORT = "calcul-plancher-rapport-journee";
const STORAGE_KEY_TAILLES = "calcul-plancher-tailles-reelles";

function libellesPlanches() {
  return CONFIG.planches.map(p => p.libelle);
}

function sauvegarderPlanchesActives(planches) {
  localStorage.setItem(STORAGE_KEY_PLANCHES, JSON.stringify(planches));
}

function chargerPlanchesActives() {
  try {
    const valeur = localStorage.getItem(STORAGE_KEY_PLANCHES);
    if (!valeur) return libellesPlanches();
    const planches = JSON.parse(valeur);
    return Array.isArray(planches) ? planches : libellesPlanches();
  } catch {
    return libellesPlanches();
  }
}

function sauvegarderRapport(wagons) {
  localStorage.setItem(STORAGE_KEY_RAPPORT, JSON.stringify(wagons));
}

function chargerRapport() {
  try {
    const valeur = localStorage.getItem(STORAGE_KEY_RAPPORT);
    if (!valeur) return [];
    const wagons = JSON.parse(valeur);
    return Array.isArray(wagons) ? wagons : [];
  } catch {
    return [];
  }
}

function chargerTaillesReelles() {
  try {
    const valeur = localStorage.getItem(STORAGE_KEY_TAILLES);
    const saved = valeur ? JSON.parse(valeur) : {};
    const tailles = {};
    CONFIG.planches.forEach(p => {
      const v = parseInt(saved[p.libelle], 10);
      tailles[p.libelle] = Number.isFinite(v) && v > 0 ? v : p.reelDefaut;
    });
    return tailles;
  } catch {
    const tailles = {};
    CONFIG.planches.forEach(p => tailles[p.libelle] = p.reelDefaut);
    return tailles;
  }
}

function sauvegarderTaillesReelles(tailles) {
  localStorage.setItem(STORAGE_KEY_TAILLES, JSON.stringify(tailles));
}
