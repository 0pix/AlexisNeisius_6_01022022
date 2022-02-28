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
        <h3>${photographerInfo.city} ${photographerInfo.country}</h3>
        <p>${photographerInfo.tagline}</p>
        <p class="price">${photographerInfo.price}€/jour</p>
      </div>
      <div id="bloc-contact">
        <button class="contact_button" onclick="displayModal()">Contactez-moi</button>
      </div>
      <div id="bloc-picture">
        <img src="assets/photographers/${photographerInfo.portrait}" alt="photo de ${photographerInfo.name}">
      </div>
    `;
}

/***************|Carrousel et tag|***************/
async function carrousel(media) {
  const photographCarrousel = document.getElementById("carrousel");
  const photographerInfo = await getPhotographerInfo();
  media = media ?? (await getTablerLikes());
  console.log(media);

  photographCarrousel.innerHTML = media
    .map(
      (mediaPhoto) =>
        `
<article class="media-card"  > 
  <div class = "bloc-img">
  ${
    mediaPhoto.image
      ? `<button onclick="zoom(${mediaPhoto.id})"> <img class="for-zoom"    src="assets/images/media/${photographerInfo.name}/${mediaPhoto.image}" alt="photo de ${photographerInfo.name}-${mediaPhoto.title}"></img></button>`
      : `<button onclick="zoom(${mediaPhoto.id})"><img class="arrow-video" src="./assets/icons/play-button-svgrepo-com.svg" alt=""><video class="for-zoom"><source src="assets/images/media/${photographerInfo.name}/${mediaPhoto.video}" type="video/mp4" alt="vidéo de ${photographerInfo.name}"></video></button>`
  }
  </div>

  <div class="text-likes">
    <p>${mediaPhoto.title}</p>
    <div class ="heart-likes">
      <p class="p-likes" id="p-likes">${mediaPhoto.likes}</p>
      <button class="like-test" name="bouton j'aime"  onclick="plusLike(${
        mediaPhoto.id
      })"  id="heart-card-${mediaPhoto.id}">
        <img src="./assets/icons/heart-solid-red.svg" alt="bouton like en forme de coeur">
      </button>
    </div>
  </div>

</article>
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


async function getGoodMedias() {
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
  return goodMedias;
}

async function onSelectOption() {
  const goodMedias = await getGoodMedias();
  await carrousel(goodMedias);
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
      <p id="allNumberLike">${allLikes}</p>
      <img src="./assets/icons/heart-solid.svg" alt="">
    </div>

    <div class="price-day">
      <p>${photographerInfo.price}€ / jour</p>
    </div>

  `;
}

/***************|Likes++|***************/
async function plusLike(id) {
  const heartImg = document.getElementById("heart-card-" + id);
  let likeElement = heartImg.previousElementSibling;
  let likeContent = likeElement.textContent;
  console.log(likeContent);
  likeElement.textContent = ++likeContent;
  const allNumberLike = document.getElementById("allNumberLike");
  let allLike = document.getElementById("allNumberLike").textContent;

  allNumberLike.textContent = ++allLike;
}

/***************|Zoom Image|***************/
async function zoom(id) {
  const photographerInfo = await getPhotographerInfo();
  const goodMedias = await getGoodMedias();
  const imgAndTitle = document.getElementById("image-title");
  const zoomModal = document.getElementById("zoom-modal");
  const leftArrow = document.getElementById("left-arrow");
  const rightArrow = document.getElementById("right-arrow");
  const thePicture = goodMedias.find((element) => element.id === id);
  let indexImg = goodMedias.indexOf(thePicture);
  zoomModal.style.display = "flex";
  buildImageCarrousel(goodMedias, photographerInfo, imgAndTitle, indexImg);

  // Click on arrow
  leftArrow.addEventListener("click", () => {
    indexImg = previousImage(
      indexImg,
      goodMedias,
      photographerInfo,
      imgAndTitle
    );
  });

  rightArrow.addEventListener("click", () => {
    indexImg = nextImage(indexImg, goodMedias, photographerInfo, imgAndTitle);
  });


  // With arrow from keyboard
  window.addEventListener("keydown", (e) => {
    if (zoomModal.style.display === "flex" && e.key === "ArrowLeft") {
      indexImg = previousImage(
        indexImg,
        goodMedias,
        photographerInfo,
        imgAndTitle
      );
    } else if (zoomModal.style.display === "flex" && e.key === "ArrowRight") {
      indexImg = nextImage(indexImg, goodMedias, photographerInfo, imgAndTitle);
    
    }
  });
}

function previousImage(indexImg, goodMedias, photographerInfo, imgAndTitle) {
  if (indexImg === 0) {
    indexImg = goodMedias.length - 1;
  } else {
    indexImg--;
  }
  buildImageCarrousel(goodMedias, photographerInfo, imgAndTitle, indexImg);
  return indexImg;
}

function nextImage(indexImg, goodMedias, photographerInfo, imgAndTitle) {
  if (indexImg === goodMedias.length - 1) {
    indexImg = 0;
  } else {
    indexImg++;
  }
  buildImageCarrousel(goodMedias, photographerInfo, imgAndTitle, indexImg);
  return indexImg;
}

function buildImageCarrousel(goodMedias, photographerInfo, element, index) {
  element.innerHTML = `
  ${
    goodMedias[index].image
      ? `<img src="./assets/images/media/${photographerInfo.name}/${goodMedias[index].image}" id="zoom-img" alt="">`
      : `<video  controls autoplay id="zoom-video"><source src="assets/images/media/${photographerInfo.name}/${goodMedias[index].video}" id="zoom-video" type="video/mp4" alt="photo de ${photographerInfo.name}"></video>`
  }
<h2>${goodMedias[index].title}</h2>
  `;
}

function closeZoom() {
  const zoomModal = document.getElementById("zoom-modal");
  zoomModal.style.display = "none";
}

window.addEventListener ("keydown", (e) =>{
  const zoomModal = document.getElementById("zoom-modal");
  if (zoomModal.style.display = "flex" && e.key === "Escape") {
    closeZoom();
  }
});

window.addEventListener("click", (event) => {
  const modal = document.getElementById("zoom-modal");
  if(event.target == modal) {
    closeZoom()
  }
});


/***************|Name on contact form|***************/
async function nameOnContactForm(){
const photographerInfo = await getPhotographerInfo();
const nameContactForm =  document.getElementById("name-contact-form");
nameContactForm.textContent = 
`
${photographerInfo.name}
`
}

/***************|Fonction INIT pour appeler les fonctions|***************/
function init() {
  carrousel();
  likeAndPrice();
  getAllLikes();
  addPhotographerInHeader();
  nameOnContactForm()
}


init();


