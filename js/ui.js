function textePlanche(n) {
  return n + " planche" + (n > 1 ? "s" : "");
}

function creerCheckboxes() {
  const c = document.getElementById("planches");
  const actives = chargerPlanchesActives();
  c.innerHTML = CONFIG.planches.map(p => `
    <label class="check">
      <input type="checkbox" class="plank-check" value="${p.libelle}" ${actives.includes(p.libelle) ? "checked" : ""}>
      <span>${p.libelle} mm</span>
    </label>
  `).join("");
}

function creerTaillesReelles() {
  const c = document.getElementById("taillesReelles");
  const tailles = chargerTaillesReelles();
  c.innerHTML = CONFIG.planches.map(p => `
    <div class="real-row">
      <span>${p.libelle}</span>
      <input class="real-input" data-libelle="${p.libelle}" inputmode="numeric" pattern="[0-9]*" value="${tailles[p.libelle]}">
      <span>mm</span>
    </div>
  `).join("");
}

function taillesReellesDepuisInputs() {
  const tailles = {};
  document.querySelectorAll(".real-input").forEach(input => {
    const libelle = parseInt(input.dataset.libelle, 10);
    const valeur = parseInt(input.value, 10);
    const defaut = CONFIG.planches.find(p => p.libelle === libelle).reelDefaut;
    tailles[libelle] = Number.isFinite(valeur) && valeur > 0 ? valeur : defaut;
  });
  return tailles;
}

function planchesActives() {
  return Array.from(document.querySelectorAll(".plank-check"))
    .filter(c => c.checked)
    .map(c => parseInt(c.value, 10))
    .sort((a, b) => b - a);
}

function ordrePose(s, actives) {
  const o = [];
  for (const l of actives) {
    for (let i = 0; i < (s.counts[l] || 0); i++) o.push(l);
  }
  return o;
}

function renderRows(s) {
  return CONFIG.planches.map(p => `
    <div class="row">
      <span>${p.libelle} mm</span>
      <span class="value">${textePlanche(s.counts[p.libelle] || 0)}</span>
    </div>
  `).join("");
}

function renderSolution(s, index, actives) {
  const titre = index === 0 ? "Solution idéale" : "Alternative " + index;
  const badge = index === 0 ? "Meilleure" : "Conforme";
  const bc = index === 0 ? "badge" : "badge alt";
  const best = index === 0 ? "solution best" : "solution";
  const chips = ordrePose(s, actives).map(x => `<span class="chip">${x}</span>`).join("");

  return `
    <article class="${best}">
      <h2><span>${titre}</span><span class="${bc}">${badge}</span></h2>
      <div class="rows">
        ${renderRows(s)}
        <div class="sep"></div>
        <div class="row"><span>Total</span><span class="value">${textePlanche(s.total)}</span></div>
        <div class="row"><span>Largeur réelle obtenue</span><span class="value">${s.obtenu} mm</span></div>
        <div class="row"><span>Écart réel</span><span class="value good">${s.ecart} mm</span></div>
        <div class="row"><span>Écart maximum</span><span class="value">${CONFIG.ecartMaxFixe} mm</span></div>
           </div>
      <div class="chips">${chips}</div>
    </article>
  `;
}
