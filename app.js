const input = document.getElementById("largeur");
const resultats = document.getElementById("resultats");

function textePlanche(n) {
  return n + " planche" + (n > 1 ? "s" : "");
}

function ordrePose(solution) {
  const ordre = [];
  for (const largeur of CONFIG.planches) {
    for (let i = 0; i < solution.counts[largeur]; i++) {
      ordre.push(largeur);
    }
  }
  return ordre;
}

function renderSolution(solution, index) {
  const titre = index === 0 ? "Solution idéale" : "Alternative " + index;
  const badge = index === 0 ? "Meilleure" : "Conforme";
  const badgeClass = index === 0 ? "badge" : "badge alt";
  const bestClass = index === 0 ? "solution best" : "solution";
  const chips = ordrePose(solution).map(x => `<span class="chip">${x}</span>`).join("");

  return `
    <article class="${bestClass}">
      <h2>
        <span>${titre}</span>
        <span class="${badgeClass}">${badge}</span>
      </h2>

      <div class="rows">
        <div class="row"><span>240 mm</span><span class="value">${textePlanche(solution.counts[240])}</span></div>
        <div class="row"><span>210 mm</span><span class="value">${textePlanche(solution.counts[210])}</span></div>
        <div class="row"><span>170 mm</span><span class="value">${textePlanche(solution.counts[170])}</span></div>

        <div class="sep"></div>

        <div class="row"><span>Total</span><span class="value">${textePlanche(solution.total)}</span></div>
        <div class="row"><span>Largeur obtenue</span><span class="value">${solution.obtenu} mm</span></div>
        <div class="row"><span>Écart réel</span><span class="value good">${solution.ecart} mm</span></div>
        <div class="row"><span>Écart maximum</span><span class="value">${CONFIG.ecartMaxFixe} mm</span></div>
        <div class="row"><span>Dépassement</span><span class="value good">0 mm</span></div>
      </div>

      <div class="chips">${chips}</div>
    </article>
  `;
}

function calculer() {
  const largeur = parseInt(input.value, 10);

  if (!largeur || largeur < 170) {
    resultats.classList.add("hidden");
    resultats.innerHTML = "";
    return;
  }

  const solutions = calculerSolutions(largeur);

  if (solutions.length === 0) {
    resultats.innerHTML = `
      <section class="card">
        <div class="error">
          Aucune combinaison conforme.<br>
          La largeur ne doit jamais être dépassée et l'écart maximum fixe est de ${CONFIG.ecartMaxFixe} mm.
        </div>
      </section>
    `;
    resultats.classList.remove("hidden");
    return;
  }

  resultats.innerHTML = solutions.map(renderSolution).join("");
  resultats.classList.remove("hidden");
}

input.addEventListener("input", calculer);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js");
}
