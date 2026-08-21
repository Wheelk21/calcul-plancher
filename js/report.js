function echapperHtml(texte) {
  return String(texte)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function estAujourdHui(timestamp) {
  if (!timestamp) return false;
  const d = new Date(timestamp);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

function wagonsDuJour() {
  return (typeof wagons !== "undefined" ? wagons : []).filter(w => estAujourdHui(w.dateCreation));
}

function texteRapportJour() {
  const date = new Date().toLocaleDateString("fr-FR");
  const wagonsJour = wagonsDuJour();
  const lignesRapport = ["Rapport planchers - " + date, ""];

  if (!wagonsJour.length) {
    lignesRapport.push("Aucun wagon traité aujourd'hui.");
    return lignesRapport.join("\n");
  }

  let totalPlanches = 0;
  for (const w of wagonsJour) {
    const entete = w.type ? (w.type + " - " + w.numeroSerie) : w.numeroSerie;
    lignesRapport.push("Wagon " + entete + " (" + statutLabelWagon(w.statut) + ")");
    lignesRapport.push("Planches changées : " + w.planchesChangees);
    totalPlanches += w.planchesChangees;
    for (const i of w.interventions) {
      const coche = i.faite ? "x" : " ";
      const suffixe = i.ajoutee ? " (ajoutée)" : "";
      lignesRapport.push("  [" + coche + "] " + i.libelle + suffixe);
    }
    if (w.commentaire) lignesRapport.push("Commentaire : " + w.commentaire);
    lignesRapport.push("");
  }

  lignesRapport.push("Total journée");
  lignesRapport.push("Wagons : " + wagonsJour.length);
  lignesRapport.push("Total planches changées : " + totalPlanches);
  return lignesRapport.join("\n");
}

async function copierRapportJour() {
  const texte = texteRapportJour();
  try {
    await navigator.clipboard.writeText(texte);
    alert("Rapport copié.");
  } catch {
    prompt("Copie le rapport :", texte);
  }
}

const boutonCopierRapport = document.getElementById("copierRapportBtn");
if (boutonCopierRapport) boutonCopierRapport.addEventListener("click", copierRapportJour);
