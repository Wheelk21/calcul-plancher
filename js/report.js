let rapportWagons = chargerRapport();

function nbPlanches() {
  const valeur = parseInt(document.getElementById("nbPlanches").value, 10);
  return Number.isFinite(valeur) && valeur > 0 ? valeur : 0;
}

function setNbPlanches(valeur) {
  document.getElementById("nbPlanches").value = Math.max(0, valeur);
}

function incrementerPlanches(delta) {
  setNbPlanches(nbPlanches() + delta);
}

function viderFormulaireRapport() {
  document.getElementById("wagonNumero").value = "";
  setNbPlanches(0);
  document.getElementById("commentaire").value = "";
}

function ajouterWagonRapport() {
  const numero = document.getElementById("wagonNumero").value.trim();
  if (!numero) {
    alert("Saisis le numéro du wagon.");
    return;
  }

  rapportWagons.unshift({
    id: Date.now(),
    numero,
    nb: nbPlanches(),
    commentaire: document.getElementById("commentaire").value.trim()
  });
  sauvegarderRapport(rapportWagons);
  viderFormulaireRapport();
  afficherRapport();
}

function supprimerWagon(id) {
  rapportWagons = rapportWagons.filter(wagon => wagon.id !== id);
  sauvegarderRapport(rapportWagons);
  afficherRapport();
}

function totalPlanchesRapport() {
  return rapportWagons.reduce((total, wagon) => total + wagon.nb, 0);
}

function echapperHtml(texte) {
  return String(texte)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function afficherTotaux() {
  document.getElementById("totauxRapport").innerHTML = `
    <div class="row"><span>Wagons</span><span class="value">${rapportWagons.length}</span></div>
    <div class="row"><span>Total planches changées</span><span class="value">${totalPlanchesRapport()}</span></div>
  `;
}

function afficherListeWagons() {
  const liste = document.getElementById("listeWagons");
  if (rapportWagons.length === 0) {
    liste.innerHTML = '<div class="empty">Aucun wagon ajouté pour le moment.</div>';
    return;
  }

  liste.innerHTML = rapportWagons.map(wagon => `
    <article class="wagon-card">
      <h2>
        <span>Wagon ${echapperHtml(wagon.numero)}</span>
        <button class="delete" type="button" data-wagon-id="${wagon.id}">Supprimer</button>
      </h2>
      <div class="rows">
        <div class="row"><span>Planches changées</span><span class="value">${wagon.nb}</span></div>
      </div>
      ${wagon.commentaire ? `<div class="comment">${echapperHtml(wagon.commentaire)}</div>` : ""}
    </article>
  `).join("");
}

function texteRapport() {
  const date = new Date().toLocaleDateString("fr-FR");
  const lignes = [`Rapport planchers - ${date}`, ""];

  for (const wagon of rapportWagons.slice().reverse()) {
    lignes.push(`Wagon ${wagon.numero}`, `Planches changées : ${wagon.nb}`);
    if (wagon.commentaire) lignes.push(`Commentaire : ${wagon.commentaire}`);
    lignes.push("");
  }

  lignes.push(
    "Total journée",
    `Wagons : ${rapportWagons.length}`,
    `Total planches changées : ${totalPlanchesRapport()}`
  );
  return lignes.join("\n");
}

async function copierRapport() {
  const texte = texteRapport();
  try {
    await navigator.clipboard.writeText(texte);
    alert("Rapport copié.");
  } catch {
    prompt("Copie le rapport :", texte);
  }
}

function nouvelleJournee() {
  if (!confirm("Effacer le rapport de la journée ?")) return;
  rapportWagons = [];
  sauvegarderRapport(rapportWagons);
  afficherRapport();
}

function afficherRapport() {
  afficherTotaux();
  afficherListeWagons();
}

document.getElementById("listeWagons").addEventListener("click", event => {
  const bouton = event.target.closest("[data-wagon-id]");
  if (bouton) supprimerWagon(Number(bouton.dataset.wagonId));
});
