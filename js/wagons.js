let wagons = chargerWagons();

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
  morceaux.push('<article class="wagon-card" data-wagon-id="' + w.id + '">');
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

document.getElementById("wagonsListe").addEventListener("click", event => {
  const toggleBtn = event.target.closest(".toggle-statut");
  if (toggleBtn) { basculerStatutWagon(toggleBtn.dataset.wagonId); return; }
  const delBtn = event.target.closest(".delete-wagon");
  if (delBtn) { supprimerWagonUI(delBtn.dataset.wagonId); return; }
});
