// Mettre le code JavaScript lié à la page photographer.html

/***************|Récuperer le Json***************/
let photographers = [];
async function getPhotographers() {
  await fetch("./../../data/photographers.json")
    .then((res) => res.json())
    .then((data) => (photographers = data.photographers));
  // et bien retourner le tableau photographers seulement une fois
  return {
    photographers,
  };
}

/***************|Récuperer L'id de L'URL|***************/
function getIdFromUrl() {
  let urlSearch = document.location.search;
  let searchParams = new URLSearchParams(urlSearch);
  if (searchParams.has("id")) {
    photographerId = parseInt(searchParams.get("id"), 10);
    if (typeof photographerId === "number" && photographerId > 0) {
      return photographerId;
    }
  }
  return null;
}
const photographerNumberId = getIdFromUrl();
// if (!photographerNumberId) window.history.go(-1)
console.log("l'id de le page actuelle est : " + photographerNumberId);

/***************|Récupérer élément du JSON|***************/
async function getElement(id) {
  await getPhotographers();
  const resultat = photographers.find((element) => element.id === id);
  return resultat;
}

(async () => {
  const element = await getElement(photographerNumberId);
  console.log(element);
})();
