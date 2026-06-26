const input = document.getElementById("largeur");
const resultats = document.getElementById("resultats");
const checks = Array.from(document.querySelectorAll(".plank-check"));

function planchesActives() {
  return checks
    .filter(check => check.checked)
    .map(check => parseInt(check.value, 10))
    .sort((a, b) => b - a);
}

function textePlanche(n) {
  return n + " planche" + (n > 1 ? "s" : "");
}

function ordrePose(solution, actives) {
  const ordre = [];
  for (const largeur of actives) {
    for (let i = 0; i < (solution.counts[largeur] || 0); i++) ordre.push(largeur);
  }
  return ordre;
}

function renderRows(solution) {
  return CONFIG.planches.map(largeur => {
    return `<div class="row"><span>${largeur} mm</span><span class="value">${textePlanche(solution.counts[largeur] || 0)}</span></div>`;
  }).join("");
}

function renderSolution(solution, index, actives) {
  const titre = index === 0 ? "Solution idéale" : "Alternative " + index;
  const badge = index === 0 ? "Meilleure" : "Conforme";
  const badgeClass = index === 0 ? "badge" : "badge alt";
  const bestClass = index === 0 ? "solution best" : "solution";
  const chips = ordrePose(solution, actives).map(x => `<span class="chip">${x}</span>`).join("");

  return `
    <article class="${bestClass}">
      <h2><span>${titre}</span><span class="${badgeClass}">${badge}</span></h2>
      <div class="rows">
        ${renderRows(solution)}
        <div class="sep"></div>
        <div class="row"><span>Total</span><span class="value">${textePlanche(solution.total)}</span></div>
        <div class="row"><span>Largeur obtenue</span><span class="value">${solution.obtenu} mm</span></div>
        <div class="row"><span>Écart réel</span><span class="value good">${solution.ecart} mm</span></div>
        <div class="row"><span>Écart maximum</span><span class="value">${CONFIG.ecartMaxFixe} mm</span></div>
        <div class="row"><span>Dépassement</span><span class="value good">0 mm</span></div>
      </div>
      <div class="chips">${chips}</div>
    </article>`;
}

function calculer() {
  const largeur = parseInt(input.value, 10);
  const actives = planchesActives();

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
    resultats.innerHTML = `<section class="card"><div class="error">Aucune combinaison conforme avec les planches sélectionnées.<br>La largeur ne doit jamais être dépassée et l'écart maximum fixe est de ${CONFIG.ecartMaxFixe} mm.</div></section>`;
    resultats.classList.remove("hidden");
    return;
  }

  resultats.innerHTML = solutions.map((solution, index) => renderSolution(solution, index, actives)).join("");
  resultats.classList.remove("hidden");
}

input.addEventListener("input", calculer);
checks.forEach(check => check.addEventListener("change", calculer));

if ("serviceWorker" in navigator) navigator.serviceWorker.register("./service-worker.js");
