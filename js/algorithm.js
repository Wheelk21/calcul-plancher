function scoreSolution(solution) {
  return [
    Math.abs(solution.ecart - CONFIG.ecartIdeal),
    solution.ecart,
    solution.total,
    -(solution.counts[240] || 0),
    -(solution.counts[210] || 0),
    -(solution.counts[170] || 0)
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

function genererCombinaisons(planchesActives, index, largeurMax, counts, solutions) {
  if (index >= planchesActives.length) {
    let obtenu = 0;
    let total = 0;

    for (const largeur of planchesActives) {
      const nb = counts[largeur] || 0;
      obtenu += nb * largeur;
      total += nb;
    }

    if (total === 0 || obtenu > largeurMax) return;

    const ecart = largeurMax - obtenu;
    if (ecart > CONFIG.ecartMaxFixe) return;

    solutions.push({ counts: { ...counts }, total, obtenu, ecart });
    return;
  }

  const largeurPlanche = planchesActives[index];
  const max = Math.floor(largeurMax / largeurPlanche);

  for (let n = 0; n <= max; n++) {
    counts[largeurPlanche] = n;
    genererCombinaisons(planchesActives, index + 1, largeurMax, counts, solutions);
  }

  counts[largeurPlanche] = 0;
}

function calculerSolutions(largeurMax, planchesActives) {
  if (!planchesActives.length) return [];

  const solutions = [];
  const counts = {};
  CONFIG.planches.forEach(p => counts[p] = 0);

  genererCombinaisons(planchesActives, 0, largeurMax, counts, solutions);

  return solutions.sort(comparerScores).slice(0, CONFIG.nombreSolutions);
}
