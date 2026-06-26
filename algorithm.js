function ecartMaxAutorise(largeur) {
  return largeur * CONFIG.ecartMaxPour3000 / 3000;
}

function scoreSolution(solution) {
  return [
    Math.abs(solution.ecart - CONFIG.ecartIdeal),
    solution.total,
    -solution.counts[240],
    -solution.counts[210],
    -solution.counts[170]
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

function signature(solution) {
  return CONFIG.planches.map(p => solution.counts[p] || 0).join("-");
}

function calculerSolutions(largeurMax) {
  const ecartMax = ecartMaxAutorise(largeurMax);
  const solutions = [];

  const max240 = Math.floor(largeurMax / 240);
  const max210 = Math.floor(largeurMax / 210);
  const max170 = Math.floor(largeurMax / 170);

  for (let n240 = 0; n240 <= max240; n240++) {
    for (let n210 = 0; n210 <= max210; n210++) {
      for (let n170 = 0; n170 <= max170; n170++) {
        const obtenu = n240 * 240 + n210 * 210 + n170 * 170;

        if (obtenu > largeurMax) continue;

        const ecart = largeurMax - obtenu;

        if (ecart > ecartMax) continue;

        const total = n240 + n210 + n170;
        if (total === 0) continue;

        solutions.push({
          counts: {
            240: n240,
            210: n210,
            170: n170
          },
          total,
          obtenu,
          ecart,
          ecartMax
        });
      }
    }
  }

  const uniques = [];
  const vus = new Set();

  solutions.sort(comparerScores);

  for (const sol of solutions) {
    const sig = signature(sol);
    if (!vus.has(sig)) {
      vus.add(sig);
      uniques.push(sol);
    }
    if (uniques.length >= CONFIG.nombreSolutions) break;
  }

  return uniques;
}
