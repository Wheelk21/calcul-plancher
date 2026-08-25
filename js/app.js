creerCheckboxes();
creerTaillesReelles();
const input = document.getElementById("largeur");
const resultats = document.getElementById("resultats");

function afficherOnglet(nom) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById("tab-" + nom).classList.add("active");
  document.getElementById("page-" + nom).classList.add("active");
}

function calculer() {
  const largeur = parseInt(input.value, 10);
  const actives = planchesActives();
  sauvegarderPlanchesActives(actives);
  sauvegarderTaillesReelles(taillesReellesDepuisInputs());
  if (!largeur || largeur < 1) {
    resultats.classList.add("hidden");
    resultats.innerHTML = "";
    return;
  }
  if (actives.length === 0) {
    resultats.innerHTML = `<section class="card"><div class="error">Aucune planche sélectionnée.<br>Coche au moins un type de planche.</div></section>`;
    resultats.classList.remove("hidden");
    return;
  }
  const solutions = calculerSolutions(largeur, actives);
  if (solutions.length === 0) {
    resultats.innerHTML = `<section class="card"><div class="error">Aucune combinaison conforme avec les planches sélectionnées.<br>La largeur ne doit jamais être dépassée et l'écart maximum est de ${CONFIG.ecartMaxFixe} mm.</div></section>`;
    resultats.classList.remove("hidden");
    return;
  }
  resultats.innerHTML = solutions.map((s, i) => renderSolution(s, i, actives)).join("");
  resultats.classList.remove("hidden");
}

document.getElementById("tab-calculateur").addEventListener("click", () => afficherOnglet("calculateur"));
document.getElementById("tab-wagons").addEventListener("click", () => afficherOnglet("wagons"));
document.getElementById("tab-memo").addEventListener("click", () => afficherOnglet("memo"));
input.addEventListener("input", calculer);
document.querySelectorAll(".plank-check").forEach(c => c.addEventListener("change", calculer));
document.querySelectorAll(".real-input").forEach(i => i.addEventListener("input", calculer));
document.getElementById("creerWagonBtn").addEventListener("click", creerWagonDepuisFormulaire);
afficherWagons();
rendreChoixMemo();
if ("serviceWorker" in navigator) navigator.serviceWorker.register("./service-worker.js");
