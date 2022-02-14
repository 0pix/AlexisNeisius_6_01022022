// Mettre le code JavaScript lié à la page photographer.html

/***************|Récuperer tout les photogaphes sur le  Json***************/
async function getPhotographers() {
  await fetch("./../../data/photographers.json")
    .then((res) => res.json())
    .then((data) => (photographers = data.photographers));
  return {
    photographers,
  };
}

// async function test2() {
//   let onVerra = await getPhotographers();
//   console.log(onVerra);
// }
// test2();

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
console.log("l'id de le page actuelle est : " + getIdFromUrl());
// if (!photographerNumberId) window.history.go(-1)

/***************|Récupérer le photographe de la page du JSON|***************/
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
async function carrousel() {
  const photographerInfo = await getPhotographerInfo();
  const mediaPhotographer = await getGoodMediasWithId();
  const photographCarrousel = document.getElementById("carrousel");

  photographCarrousel.innerHTML = mediaPhotographer
    .map(
      (mediaPhoto) =>
        `
<div class="media-card">
  <div>
  ${
    mediaPhoto.image
      ? `<img src="assets/images/media/${photographerInfo.name}/${mediaPhoto.image}" alt="photo de ${photographerInfo.name}"></img>`
      : `<video controls><source src="assets/images/media/${photographerInfo.name}/${mediaPhoto.video}" type="video/mp4" alt="photo de ${photographerInfo.name}"></video>`
  }
  </div>

  <div class="text-likes">
  <p>${mediaPhoto.title}</p>
  </div>

</div>
`
    )
    .join("");
}

/***************|like classé dans l'ordres dans tableau|***************/
async function getTablerLikes() {
  let goodMedias = await getGoodMediasWithId();
  console.log(goodMedias);

  goodMedias.sort((a, b) => a.likes - b.likes);
}
// getTablerLikes();

/***************|date classé dans l'ordres dans tableau|***************/
async function getTablerDates() {
  let goodMedias = await getGoodMediasWithId();
  console.log(goodMedias);
  goodMedias.sort(
    (a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf()
  );
}
// getTablerDates();

/***************|titre classé dans l'ordres dans tableau|***************/
async function getTablerTitles() {
  let goodMedias = await getGoodMediasWithId();
  console.log(goodMedias);

  goodMedias.sort((a, b) => {
    if (a.title > b.title) {
      return 1;
    } else if (b.title > a.title) {
      return -1;
    } else {
      return 0;
    }
  });
}
// getTablerTitles();

function carrouselFilter() {}

/***************|Ouvrir les filtres|***************/
const buttonFilter = document.getElementById("buttonOpenCloseFilter");

buttonFilter.addEventListener("click", function () {
  const ulFilter = document.getElementById("ul-filter");
  ulFilter.innerHTML = `
            <li class="carrousel-filters">Popularité</li>
            <span class="line"></span>
            <li class="carrousel-filters">Date</li>
            <span class="line"></span>
            <li class="carrousel-filters">Titre</li>
    `;
});

/***************|like/Price|***************/
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

function init() {
  getGoodMediasWithId();
  addPhotographerInHeader();
  carrousel();
  likeAndPrice();
  getAllLikes();
}

init();
