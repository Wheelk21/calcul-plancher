let wagons = chargerWagons();
let wagonDetailId = null;

function on(id, evenement, gestionnaire) {
  const el = document.getElementById(id);
  if (el) el.addEventListener(evenement, gestionnaire);
}

function statutLabelWagon(statut) {
  return statut === "termine" ? "Terminé" : "En cours";
}

function creerWagonDepuisFormulaire() {
  const type = document.getElementById("wagonType").value.trim();
  const numeroSerie = document.getElementById("wagonNumeroSerie").value.trim();
  if (!numeroSerie) {
    alert("Saisis le numéro de série du wagon.");
    return;
  }
  const brut = document.getElementById("wagonInterventions").value;
  const interventions = brut.split("\n").map(l => l.trim()).filter(Boolean);

  wagons.unshift(creerWagon({ type, numeroSerie, interventions }));
  sauvegarderWagons(wagons);
  viderFormulaireWagon();
  afficherWagons();
}

function viderFormulaireWagon() {
  document.getElementById("wagonType").value = "";
  document.getElementById("wagonNumeroSerie").value = "";
  document.getElementById("wagonInterventions").value = "";
}

function supprimerWagonUI(id) {
  if (!confirm("Supprimer ce wagon ?")) return;
  wagons = supprimerWagonParId(wagons, id);
  sauvegarderWagons(wagons);
  afficherWagons();
}

function basculerStatutWagon(id) {
  const wagon = trouverWagon(wagons, id);
  if (!wagon) return;
  mettreAJourWagon(wagons, id, { statut: wagon.statut === "termine" ? "en_cours" : "termine" });
  sauvegarderWagons(wagons);
  afficherWagons();
}

function rendreWagonCard(w) {
  const total = w.interventions.length;
  const faites = w.interventions.filter(i => i.faite).length;
  const entete = w.type ? (echapperHtml(w.type) + " · " + echapperHtml(w.numeroSerie)) : echapperHtml(w.numeroSerie);
  const badgeClasse = w.statut === "termine" ? "badge" : "badge alt";
  const statutTexte = statutLabelWagon(w.statut);
  const boutonStatutTexte = w.statut === "termine" ? "Rouvrir" : "Marquer terminé";
  const morceaux = [];
  morceaux.push('<article class="wagon-card" style="cursor:pointer" data-wagon-id="' + w.id + '">');
  morceaux.push('<h2>');
  morceaux.push('<span>' + entete + '</span>');
  morceaux.push('<span class="' + badgeClasse + '">' + statutTexte + '</span>');
  morceaux.push('</h2>');
  morceaux.push('<div class="rows">');
  morceaux.push('<div class="row"><span>Planches changées</span><span class="value">' + w.planchesChangees + '</span></div>');
  morceaux.push('<div class="row"><span>Interventions</span><span class="value">' + faites + '/' + total + '</span></div>');
  morceaux.push('</div>');
  morceaux.push('<div class="actions">');
  morceaux.push('<button class="secondary toggle-statut" type="button" data-wagon-id="' + w.id + '">' + boutonStatutTexte + '</button>');
  morceaux.push('<button class="danger delete-wagon" type="button" data-wagon-id="' + w.id + '">Supprimer</button>');
  morceaux.push('</div>');
  morceaux.push('</article>');
  return morceaux.join("");
}

function afficherWagons() {
  const liste = document.getElementById("wagonsListe");
  if (!wagons.length) {
    liste.innerHTML = '<div class="empty">Aucun wagon pour le moment.</div>';
    return;
  }
  liste.innerHTML = wagons.map(rendreWagonCard).join("");
}

function wagonCourant() {
  return trouverWagon(wagons, wagonDetailId);
}

function ouvrirDetailWagon(id) {
  wagonDetailId = id;
  const pageDetail = document.getElementById("page-wagon-detail");
  if (!pageDetail) return;
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  pageDetail.classList.add("active");
  rendreDetailWagon();
}

function fermerDetailWagon() {
  wagonDetailId = null;
  const ongletWagons = document.getElementById("tab-wagons");
  if (ongletWagons) ongletWagons.click();
  afficherWagons();
}

function rendreDetailWagon() {
  const w = wagonCourant();
  if (!w) { fermerDetailWagon(); return; }
  const titre = document.getElementById("detailTitre");
  if (titre) titre.textContent = w.type ? (w.type + " · " + w.numeroSerie) : w.numeroSerie;
  const badge = document.getElementById("detailBadge");
  if (badge) {
    badge.textContent = statutLabelWagon(w.statut);
    badge.className = w.statut === "termine" ? "badge" : "badge alt";
  }
  const boutonStatut = document.getElementById("detailToggleStatut");
  if (boutonStatut) boutonStatut.textContent = w.statut === "termine" ? "Rouvrir le wagon" : "Marquer terminé";
  const champPlanches = document.getElementById("detailNbPlanches");
  if (champPlanches) champPlanches.value = w.planchesChangees;
  const champCommentaire = document.getElementById("detailCommentaire");
  if (champCommentaire) champCommentaire.value = w.commentaire || "";
  rendreInterventionsDetail(w);
}

function rendreInterventionsDetail(w) {
  const conteneur = document.getElementById("detailInterventions");
  if (!conteneur) return;
  if (!w.interventions.length) {
    conteneur.innerHTML = '<div class="empty">Aucune intervention pour ce wagon.</div>';
    return;
  }
  const morceaux = w.interventions.map(i => {
    const suffixe = i.ajoutee ? ' <span class="chip">ajoutée</span>' : "";
    const coche = i.faite ? " checked" : "";
    return '<label class="check"><input type="checkbox" class="intervention-check" data-intervention-id="' + i.id + '"' + coche + ' />' + echapperHtml(i.libelle) + suffixe + '</label>';
  });
  conteneur.innerHTML = morceaux.join("");
}

function majPlanchesDetail(delta) {
  const w = wagonCourant();
  if (!w) return;
  const valeur = Math.max(0, w.planchesChangees + delta);
  mettreAJourWagon(wagons, w.id, { planchesChangees: valeur });
  sauvegarderWagons(wagons);
  const champ = document.getElementById("detailNbPlanches");
  if (champ) champ.value = valeur;
}

function majCommentaireDetail() {
  const w = wagonCourant();
  if (!w) return;
  const champ = document.getElementById("detailCommentaire");
  if (!champ) return;
  mettreAJourWagon(wagons, w.id, { commentaire: champ.value });
  sauvegarderWagons(wagons);
}

function ajouterInterventionDetail() {
  const w = wagonCourant();
  if (!w) return;
  const input = document.getElementById("detailNouvelleIntervention");
  if (!input) return;
  const libelle = input.value.trim();
  if (!libelle) return;
  ajouterInterventionWagon(wagons, w.id, libelle);
  sauvegarderWagons(wagons);
  input.value = "";
  rendreInterventionsDetail(wagonCourant());
}

function toggleStatutDetail() {
  const w = wagonCourant();
  if (!w) return;
  basculerStatutWagon(w.id);
  rendreDetailWagon();
}

document.getElementById("wagonsListe").addEventListener("click", event => {
  const toggleBtn = event.target.closest(".toggle-statut");
  if (toggleBtn) { basculerStatutWagon(toggleBtn.dataset.wagonId); return; }
  const delBtn = event.target.closest(".delete-wagon");
  if (delBtn) { supprimerWagonUI(delBtn.dataset.wagonId); return; }
  const carte = event.target.closest(".wagon-card");
  if (carte) { ouvrirDetailWagon(carte.dataset.wagonId); }
});

on("detailRetour", "click", fermerDetailWagon);
on("detailToggleStatut", "click", toggleStatutDetail);
on("detailMoinsPlanche", "click", () => majPlanchesDetail(-1));
on("detailPlusPlanche", "click", () => majPlanchesDetail(1));
on("detailCommentaire", "input", majCommentaireDetail);
on("detailAjouterIntervention", "click", ajouterInterventionDetail);
on("detailInterventions", "change", event => {
  const cb = event.target.closest(".intervention-check");
  if (!cb) return;
  const w = wagonCourant();
  if (!w) return;
  basculerInterventionWagon(wagons, w.id, cb.dataset.interventionId);
  sauvegarderWagons(wagons);
});
on("detailAllerCalculateur", "click", () => {
  const ongletCalc = document.getElementById("tab-calculateur");
  if (ongletCalc) ongletCalc.click();
});
