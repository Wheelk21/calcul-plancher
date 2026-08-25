const memoInterventions = [
  { code: "PIC 299", libelle: "Plancher" },
  { code: "PIC 035", libelle: "Contrôle des gaines de ranchers" },
  { code: "PIC 099", libelle: "TAG" },
  { code: "PIC 122", libelle: "Contrôle des lisoirs" },
  { code: "PIC 115", libelle: "Thermostat (plaquette type A et B)" },
  { code: "PIC 127", libelle: "TAG" },
  { code: "PIC 170", libelle: "Broche (axe de rancher wg S03/S04)" },
  { code: "PIC 183", libelle: "Broche (axe de rancher wg S06)" },
  { code: "PIC 190", libelle: "Enlever 90° et mettre S dans le tableau de charge" },
  { code: "PIC 200", libelle: "Changer le nom du propriétaire, SNCF RESEAU" },
  { code: "PIC 203", libelle: "Contrôle des rancher (wg S03/S04)" },
  { code: "PIC 243", libelle: "Enlever cavaliers sur levier vide/charge (wg S05)" },
  { code: "PIC 244", libelle: "Changer le tonnage du tableau de charge 37t à passer à 47t" },
  { code: "PIC 270", libelle: "KN (1.86 pour semelle fontes)" },
  { code: "PIF 125", libelle: "Axes de timonerie" },
];

function comparerCodesMemo(a, b) {
  const decouper = (c) => {
    const m = c.match(/^([A-Z]+)\s*(\d+)$/);
    return m ? [m[1], parseInt(m[2], 10)] : [c, 0];
  };
  const [prefA, numA] = decouper(a.code);
  const [prefB, numB] = decouper(b.code);
  if (prefA !== prefB) return prefA < prefB ? -1 : 1;
  return numA - numB;
}

function normaliserMemo(texte) {
  return texte.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function afficherMemo() {
  const conteneur = document.getElementById("memoListe");
  if (!conteneur) return;
  const champ = document.getElementById("memoRecherche");
  const filtre = champ ? normaliserMemo(champ.value.trim()) : "";
  const trie = memoInterventions.slice().sort(comparerCodesMemo);
  const resultats = filtre
    ? trie.filter(i => normaliserMemo(i.code).includes(filtre) || normaliserMemo(i.libelle).includes(filtre))
    : trie;
  if (!resultats.length) {
    conteneur.innerHTML = '<div class="empty">Aucune intervention trouvée.</div>';
    return;
  }
  conteneur.innerHTML = resultats.map(i =>
    '<div class="memo-item"><span class="memo-code">' + echapperHtml(i.code) + '</span><span class="memo-label">' + echapperHtml(i.libelle) + '</span></div>'
  ).join("");
}

const champRechercheMemo = document.getElementById("memoRecherche");
if (champRechercheMemo) champRechercheMemo.addEventListener("input", afficherMemo);
afficherMemo();
