creerCheckboxes();

const input = document.getElementById("largeur");
const resultats = document.getElementById("resultats");

function calculer() {
  const largeur = parseInt(input.value, 10);
  const actives = planchesActives();

  sauvegarderPlanchesActives(actives);

  if (!largeur || largeur < 1) {
    resultats.classList.add("hidden");
    resultats.innerHTML = "";
    return;
  }

  if (actives.length === 0) {
    resultats.innerHTML = `
      <section class="card">
        <div class="error">Aucune planche sélectionnée.<br>Coche au moins un type de planche.</div>
      </section>
    `;
    resultats.classList.remove("hidden");
    return;
  }

  const solutions = calculerSolutions(largeur, actives);

  if (solutions.length === 0) {
    resultats.innerHTML = `
      <section class="card">
        <div class="error">
          Aucune combinaison conforme avec les planches sélectionnées.<br>
          La largeur ne doit jamais être dépassée et l'écart maximum est de ${CONFIG.ecartMaxFixe} mm.
        </div>
      </section>
    `;
    resultats.classList.remove("hidden");
    return;
  }

  resultats.innerHTML = solutions.map((s, i) => renderSolution(s, i, actives)).join("");
  resultats.classList.remove("hidden");
}

input.addEventListener("input", calculer);

document.querySelectorAll(".plank-check").forEach(check => {
  check.addEventListener("change", calculer);
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js");
}
