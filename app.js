const PLANCHES = [240, 210, 170];
const ECART_IDEAL_MM = 5;
const ECART_MAX_POUR_3000_MM = 40;

function textePlanche(n) {
  return n + " planche" + (n > 1 ? "s" : "");
}

function ecartMaxAutorise(largeur) {
  return largeur * ECART_MAX_POUR_3000_MM / 3000;
}

function meilleureCombinaison(largeurMax) {
  const ecartMax = ecartMaxAutorise(largeurMax);
  let meilleur = null;

  for (let n240 = 0; n240 <= Math.floor(largeurMax / 240); n240++) {
    for (let n210 = 0; n210 <= Math.floor(largeurMax / 210); n210++) {
      for (let n170 = 0; n170 <= Math.floor(largeurMax / 170); n170++) {
        const obtenu = n240 * 240 + n210 * 210 + n170 * 170;

        // Règle absolue : jamais de dépassement.
        if (obtenu > largeurMax) continue;

        const ecart = largeurMax - obtenu;

        // Tolérance proportionnelle : 40 mm maximum pour 3000 mm cumulés.
        if (ecart > ecartMax) continue;

        const total = n240 + n210 + n170;
        const distanceIdeal = Math.abs(ecart - ECART_IDEAL_MM);

        const candidat = {
          n240,
          n210,
          n170,
          obtenu,
          ecart,
          ecartMax,
          total,
          distanceIdeal
        };

        if (
          meilleur === null ||
          candidat.distanceIdeal < meilleur.distanceIdeal ||
          (candidat.distanceIdeal === meilleur.distanceIdeal && candidat.total < meilleur.total) ||
          (candidat.distanceIdeal === meilleur.distanceIdeal && candidat.total === meilleur.total && candidat.n240 > meilleur.n240) ||
          (candidat.distanceIdeal === meilleur.distanceIdeal && candidat.total === meilleur.total && candidat.n240 === meilleur.n240 && candidat.n210 > meilleur.n210)
        ) {
          meilleur = candidat;
        }
      }
    }
  }

  return meilleur;
}

function afficherAucuneSolution(largeur) {
  const result = document.getElementById("result");
  const ecartMax = ecartMaxAutorise(largeur);

  document.getElementById("r240").textContent = "0 planche";
  document.getElementById("r210").textContent = "0 planche";
  document.getElementById("r170").textContent = "0 planche";
  document.getElementById("rtotal").textContent = "0 planche";
  document.getElementById("robt").textContent = "0 mm";
  document.getElementById("recart").textContent = "-";
  document.getElementById("rmax").textContent = ecartMax.toFixed(1) + " mm";
  document.getElementById("chips").innerHTML = "";
  document.getElementById("message").className = "message bad";
  document.getElementById("message").textContent = "Aucune combinaison conforme : soit elle dépasse, soit l'écart est supérieur à la tolérance autorisée.";
  result.style.display = "block";
}

function calculer() {
  const largeur = parseInt(document.getElementById("largeur").value, 10);
  const result = document.getElementById("result");

  if (!largeur || largeur < 170) {
    result.style.display = "none";
    return;
  }

  const r = meilleureCombinaison(largeur);

  if (!r) {
    afficherAucuneSolution(largeur);
    return;
  }

  document.getElementById("r240").textContent = textePlanche(r.n240);
  document.getElementById("r210").textContent = textePlanche(r.n210);
  document.getElementById("r170").textContent = textePlanche(r.n170);
  document.getElementById("rtotal").textContent = textePlanche(r.total);
  document.getElementById("robt").textContent = r.obtenu + " mm";
  document.getElementById("recart").textContent = r.ecart + " mm";
  document.getElementById("rmax").textContent = r.ecartMax.toFixed(1) + " mm";

  const ordre = [];
  for (let i = 0; i < r.n240; i++) ordre.push(240);
  for (let i = 0; i < r.n210; i++) ordre.push(210);
  for (let i = 0; i < r.n170; i++) ordre.push(170);

  document.getElementById("chips").innerHTML = ordre.map(x => '<span class="chip">' + x + '</span>').join("");

  const message = document.getElementById("message");
  message.className = "message good";
  message.textContent = "Combinaison conforme : aucun dépassement, écart dans la tolérance, au plus proche de 5 mm.";

  result.style.display = "block";
}

document.getElementById("btn").addEventListener("click", calculer);
document.getElementById("largeur").addEventListener("input", calculer);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js");
}
