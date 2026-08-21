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

  // Programmation dynamique (sac a dos non borne) : pour chaque largeur
  // atteignable entre 0 et largeurMax, on calcule la combinaison utilisant
  // le moins de planches, en favorisant les planches les plus grandes en cas
  // d'egalite (actives est deja trie du plus grand au plus petit libelle).
  // Complexite : O(largeurMax * nombre de types actifs), au lieu
  // d'exponentielle avec l'ancienne recherche combinatoire brute.
  function calculerMeilleuresCombinaisons(largeurMax, actives) {
    const dp = new Array(largeurMax + 1).fill(null);
    dp[0] = { total: 0, counts: {} };

    for (let w = 1; w <= largeurMax; w++) {
      for (const libelle of actives) {
        const taille = tailleReelle(libelle);
        if (taille > w) continue;
        const precedent = dp[w - taille];
        if (!precedent) continue;
        const total = precedent.total + 1;
        if (!dp[w] || total < dp[w].total) {
          const counts = { ...precedent.counts };
          counts[libelle] = (counts[libelle] || 0) + 1;
          dp[w] = { total, counts };
        }
      }
    }

    return dp;
  }

  function calculerSolutions(largeurMax, actives) {
    if (!actives.length) return [];

    const dp = calculerMeilleuresCombinaisons(largeurMax, actives);
    const solutions = [];
    const largeurMin = Math.max(0, largeurMax - CONFIG.ecartMaxFixe);

    for (let w = largeurMax; w >= largeurMin; w--) {
      const entree = dp[w];
      if (!entree || entree.total === 0) continue;
      solutions.push({
        counts: entree.counts,
        total: entree.total,
        obtenu: w,
        ecart: largeurMax - w
      });
    }

    return solutions.sort(comparerScores).slice(0, CONFIG.nombreSolutions);
  }
