// Mettre le code JavaScript lié à la page photographer.html
// async function test2() {
//   let onVerra = await getPhotographers();
//   console.log(onVerra);
// }
// test2();

/***************|Récuperer tout les photogaphes sur le  Json***************/
async function getPhotographers() {
  await fetch("./../../data/photographers.json")
    .then((res) => res.json())
    .then((data) => (photographers = data.photographers));
  return {
    photographers,
  };
}

/***************|Récuperer tout les médias sur le Json***************/
async function getMedia() {
  await fetch("./../../data/photographers.json")
    .then((res) => res.json())
    .then((data) => (media = data.media));
  // .then(console.log);
  return {
    media,
  };
}

/***************|Récuperer L'id du photographe via L'URL|***************/
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
console.log("l'id de le page actuelle est : " + getIdFromUrl());
// if (!photographerNumberId) window.history.go(-1)

/***************|Récupérer le bon photographe de la page via JSON|***************/
async function getPhotographerInfo() {
  const id = getIdFromUrl();
  const thePhotographers = await getPhotographers();
  const photographerInfo = thePhotographers.photographers.find(
    (element) => element.id === id
  );
  return photographerInfo;
}

/***************|Récupérer les bon médias du photographe avec l'id|***************/
async function getGoodMediasWithId() {
  const id = getIdFromUrl();
  const allMedia = await getMedia();
  const mediaPhotographer = allMedia.media.filter(
    (element) => element.photographerId === id
  );
  return mediaPhotographer;
}

/***************| contenu de Photographer-header|***************/
async function addPhotographerInHeader() {
  const photographerInfo = await getPhotographerInfo();
  const photographerHeader = document.getElementById("photograph-header");
  photographerHeader.innerHTML = `
      <div>
        <h2 class="test">${photographerInfo.name}</h2>
        <h3>${photographerInfo.city}${photographerInfo.country}</h3>
        <p>${photographerInfo.tagline}</p>
        <p class="price">${photographerInfo.price}€/jour</p>
      </div>

      <button class="contact_button" onclick="displayModal()">Contactez-moi</button>

      <img src="assets/photographers/${photographerInfo.portrait}" alt="photo de ${photographerInfo.name}">
    `;
}

/***************|Carrousel et tag|***************/
async function carrousel(media) {
  const photographCarrousel = document.getElementById("carrousel");
  const photographerInfo = await getPhotographerInfo();
  const selectFilters = document.getElementById("pet-select");
  if (media === null || media === undefined) {
    media = await getTablerLikes();
  }
  photographCarrousel.innerHTML = media
    .map(
      (mediaPhoto) =>
        `
<div class="media-card">
  <div class = "bloc-img">
  ${
    mediaPhoto.image
      ? `<img class="for-zoom" src="assets/images/media/${photographerInfo.name}/${mediaPhoto.image}" alt="photo de ${photographerInfo.name}"></img>`
      : `<video class="for-zoom" controls><source src="assets/images/media/${photographerInfo.name}/${mediaPhoto.video}" type="video/mp4" alt="photo de ${photographerInfo.name}"></video>`
  }
  </div>

  <div class="text-likes">
    <p>${mediaPhoto.title}</p>
    <div class ="heart-likes">
      <p class="p-likes">${mediaPhoto.likes}</p>
      <img  src="./assets/icons/heart-solid.svg" class="heart-card"  id="heart-card" alt="">
    </div>
  </div>

</div>
`
    )
    .join("");
}

/***************|Trier les médias par likes|***************/
async function getTablerLikes() {
  let goodMedias = await getGoodMediasWithId();

  return goodMedias.sort((a, b) => b.likes - a.likes);
}
/***************|Trier les médias par Dates|***************/
async function getTablerDates() {
  let goodMedias = await getGoodMediasWithId();
  return goodMedias.sort(
    (a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf()
  );
}
/***************|Trier les médias par Titre|***************/
async function getTablerTitles() {
  let goodMedias = await getGoodMediasWithId();

  return goodMedias.sort((a, b) => {
    if (a.title > b.title) {
      return 1;
    } else if (b.title > a.title) {
      return -1;
    } else {
      return 0;
    }
  });
}

async function onSelectOption() {
  const selectFilters = document.getElementById("pet-select");
  let goodMedias = [];
  if (selectFilters.value === "popularity") {
    goodMedias = await getTablerLikes();
  }
  if (selectFilters.value === "date") {
    goodMedias = await getTablerDates();
  }
  if (selectFilters.value === "title") {
    goodMedias = await getTablerTitles();
  }
  await carrousel(goodMedias);
  console.log(goodMedias);
}

/***************|Récuper et afficher le Nombre Total de likes pour le petit encadré en bas|***************/
async function getAllLikes() {
  const goodMedias = await getGoodMediasWithId();
  let likes = 0;
  for (let i = 0; i < goodMedias.length; i++) {
    likes += goodMedias[i].likes;
  }

  console.log("nombre total de likes : " + likes);
  return likes;
}

async function likeAndPrice() {
  const allLikes = await getAllLikes();
  const photographerInfo = await getPhotographerInfo();
  const mediaPhotographer = await getGoodMediasWithId();
  const likesPrice = document.getElementById("likes-price");
  likesPrice.innerHTML = `
    <div class="like">
      <p>${allLikes}</p>
      <img src="./assets/icons/heart-solid.svg" alt="">
    </div>

    <div class="price-day">
      <p>${photographerInfo.price}€ / jour</p>
    </div>

  `;
}

/***************|Zoom Image|***************/
async function zoom() {
  await onSelectOption();
  const mediaForZoom = await getGoodMediasWithId();
  // const mediaForZoom = document.querySelectorAll(".for-zoom");
  for (i = 0; i < mediaForZoom.length; i++) {
    mediaForZoom[i].onclick = function (e) {
      let onVerra = e.target.id;
      console.log(onVerra);
    };
  }
  // mediaForZoom.addEventListener("click", function (e) {
  //   console.log(e.target.id);
  // });
  // console.log(mediaForZoom[2].id);
  // mediaForZoom.addEventListener("click", (e) => {
  //   console.log(e.target.id);
  // });
  console.log(mediaForZoom);
}
zoom();

/***************|Fonction INIT pour appeler les fonctions|***************/
function init() {
  carrousel();
  likeAndPrice();
  getAllLikes();
  addPhotographerInHeader();
}

init();
