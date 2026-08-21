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
  const STORAGE_KEY_WAGONS = "calcul-plancher-wagons";

  function genererIdWagon() {
    return "w" + Date.now() + "-" + Math.floor(Math.random() * 1000);
  }

  // Compatibilite avec l'ancien rapport (une ligne figee par wagon) : au tout
  // premier chargement du nouveau modele, on convertit les wagons deja
  // enregistres pour ne rien perdre. Ne s'execute qu'une seule fois car le
  // nouveau stockage prend le relais ensuite.
  function migrerAncienRapportVersWagons() {
    const ancien = chargerRapport();
    if (!ancien.length) return [];
    return ancien.map(w => ({
      id: "w" + w.id,
      type: "",
      numeroSerie: w.numero,
      dateCreation: w.id,
      dateMiseAJour: w.id,
      planchesChangees: w.nb || 0,
      interventions: [],
      commentaire: w.commentaire || "",
      statut: "termine"
    }));
  }

  function sauvegarderWagons(wagons) {
    localStorage.setItem(STORAGE_KEY_WAGONS, JSON.stringify(wagons));
  }

  function chargerWagons() {
    try {
      const valeur = localStorage.getItem(STORAGE_KEY_WAGONS);
      if (valeur) {
        const wagons = JSON.parse(valeur);
        return Array.isArray(wagons) ? wagons : [];
      }
    } catch {
      return [];
    }

    const migres = migrerAncienRapportVersWagons();
    if (migres.length) sauvegarderWagons(migres);
    return migres;
  }

  function creerWagon({ type, numeroSerie, interventions }) {
    const maintenant = Date.now();
    return {
      id: genererIdWagon(),
      type: (type || "").trim(),
      numeroSerie: (numeroSerie || "").trim(),
      dateCreation: maintenant,
      dateMiseAJour: maintenant,
      planchesChangees: 0,
      interventions: (interventions || []).map((libelle, i) => ({
        id: "i" + maintenant + "-" + i,
        libelle,
        faite: false,
        ajoutee: false
      })),
      commentaire: "",
      statut: "en_cours"
    };
  }

  function trouverWagon(wagons, id) {
    return wagons.find(w => w.id === id) || null;
  }

  function mettreAJourWagon(wagons, id, changements) {
    const wagon = trouverWagon(wagons, id);
    if (!wagon) return wagons;
    Object.assign(wagon, changements, { dateMiseAJour: Date.now() });
    return wagons;
  }

  function ajouterInterventionWagon(wagons, id, libelle) {
    const wagon = trouverWagon(wagons, id);
    if (!wagon || !libelle.trim()) return wagons;
    wagon.interventions.push({
      id: "i" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      libelle: libelle.trim(),
      faite: false,
      ajoutee: true
    });
    wagon.dateMiseAJour = Date.now();
    return wagons;
  }

  function basculerInterventionWagon(wagons, id, interventionId) {
    const wagon = trouverWagon(wagons, id);
    if (!wagon) return wagons;
    const intervention = wagon.interventions.find(i => i.id === interventionId);
    if (!intervention) return wagons;
    intervention.faite = !intervention.faite;
    wagon.dateMiseAJour = Date.now();
    return wagons;
  }

  function supprimerWagonParId(wagons, id) {
    return wagons.filter(w => w.id !== id);
  }
