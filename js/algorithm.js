function tailleReelle(libelle) {
  const tailles = chargerTaillesReelles();
  const defaut = CONFIG.planches.find(p => p.libelle === libelle).reelDefaut;
  return tailles[libelle] || defaut;
}

function scoreSolution(solution) {
  return [
    Math.abs(solution.ecart - CONFIG.ecartIdeal),
    solution.ecart,
    solution.total,
    ...CONFIG.planches.map(p => -(solution.counts[p.libelle] || 0))
  ];
}

function comparerScores(a, b) {
  const sa = scoreSolution(a);
  const sb = scoreSolution(b);
  for (let i = 0; i < sa.length; i++) {
    if (sa[i] < sb[i]) return -1;
    if (sa[i] > sb[i]) return 1;
  }
  return 0;
}

function genererCombinaisons(actives, index, largeurMax, counts, solutions) {
  if (index >= actives.length) {
    let obtenu = 0;
    let total = 0;

    for (const libelle of actives) {
      const nb = counts[libelle] || 0;
      obtenu += nb * tailleReelle(libelle);
      total += nb;
    }

    if (total === 0 || obtenu > largeurMax) return;

    const ecart = largeurMax - obtenu;
    if (ecart > CONFIG.ecartMaxFixe) return;

    solutions.push({ counts: { ...counts }, total, obtenu, ecart });
    return;
  }

  const libelle = actives[index];
  const max = Math.floor(largeurMax / tailleReelle(libelle));

  for (let n = 0; n <= max; n++) {
    counts[libelle] = n;
    genererCombinaisons(actives, index + 1, largeurMax, counts, solutions);
  }

  counts[libelle] = 0;
}

function calculerSolutions(largeurMax, actives) {
  if (!actives.length) return [];
  const solutions = [];
  const counts = {};
  CONFIG.planches.forEach(p => counts[p.libelle] = 0);
  genererCombinaisons(actives, 0, largeurMax, counts, solutions);
  return solutions.sort(comparerScores).slice(0, CONFIG.nombreSolutions);
}
