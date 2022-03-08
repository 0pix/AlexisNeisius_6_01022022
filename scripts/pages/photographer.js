/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

/** *************|Récuperer tout les photogaphes sur le  Json***************/
async function getPhotographers () {
  await fetch('./../../data/photographers.json')
    .then((res) => res.json())
    .then((data) => (photographers = data.photographers))
  return {
    photographers
  }
}

/** *************|Récuperer L'id du photographe via L'URL|***************/
function getIdFromUrl () {
  const urlSearch = document.location.search
  const searchParams = new URLSearchParams(urlSearch)
  if (searchParams.has('id')) {
    photographerId = parseInt(searchParams.get('id'), 10)
    if (typeof photographerId === 'number' && photographerId > 0) {
      return photographerId
    }
  }
  return null
}
console.log("l'id de le page actuelle est : " + getIdFromUrl())
// if (!photographerNumberId) window.history.go(-1)

/** *************|Récupérer les informations du bon photographe de la page via JSON avec l'id|***************/
async function getPhotographerInfo () {
  const id = getIdFromUrl()
  const thePhotographers = await getPhotographers()
  const photographerInfo = thePhotographers.photographers.find(
    (element) => element.id === id
  )
  return photographerInfo
}

/** *************| contenu de Photographer-header|***************/
async function addPhotographerInHeader () {
  const photographerInfo = await getPhotographerInfo()
  const photographerHeader = document.getElementById('photograph-header')
  photographerHeaderFactory(photographerHeader, photographerInfo)
}

/** *************|Récuperer tout les médias sur le Json***************/
async function getMedia () {
  await fetch('./../../data/photographers.json')
    .then((res) => res.json())
    .then((data) => (media = data.media))
  return {
    media
  }
}

/** *************|Récupérer les bon médias du photographe avec l'id|***************/
async function getGoodMediasWithId () {
  const id = getIdFromUrl()
  const allMedia = await getMedia()
  const mediaPhotographer = allMedia.media.filter(
    (element) => element.photographerId === id
  )
  return mediaPhotographer
}

/** *************|Trier les médias par likes|***************/
async function getTagLikes () {
  const goodMedias = await getGoodMediasWithId()
  return goodMedias.sort((a, b) => b.likes - a.likes)
}

/** *************|Trier les médias par Dates|***************/
async function getTagDates () {
  const goodMedias = await getGoodMediasWithId()
  return goodMedias.sort(
    (a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf()
  )
}

/** *************|Trier les médias par Titre|***************/
async function getTagTitles () {
  const goodMedias = await getGoodMediasWithId()
  return goodMedias.sort((a, b) => {
    if (a.title > b.title) {
      return 1
    } else if (b.title > a.title) {
      return -1
    } else {
      return 0
    }
  })
}

/** *************|Récuperer le bon tableau des média triés en fontion du tag choisis|***************/
async function getGoodMedias () {
  const selectFilters = document.getElementById('pet-select')
  let goodMedias = []
  if (selectFilters.value === 'popularity') {
    goodMedias = await getTagLikes()
  }
  if (selectFilters.value === 'date') {
    goodMedias = await getTagDates()
  }
  if (selectFilters.value === 'title') {
    goodMedias = await getTagTitles()
  }
  return goodMedias
}

/** *************| afficher Carrousel |***************/
async function carrousel (media) {
  const photographCarrousel = document.getElementById('carrousel')
  const photographerInfo = await getPhotographerInfo()
  media = media ?? (await getTagLikes())
  carrouselFactory(photographCarrousel, media, photographerInfo)
}

async function onSelectOption () {
  const goodMedias = await getGoodMedias()
  await carrousel(goodMedias)
}

/** *************|Récuper et afficher le Nombre Total de likes pour le petit encadré en bas|***************/
async function getAllLikes () {
  const goodMedias = await getGoodMediasWithId()
  let likes = 0
  for (let i = 0; i < goodMedias.length; i++) {
    likes += goodMedias[i].likes
  }
  console.log('nombre total de likes : ' + likes)
  return likes
}

async function likeAndPrice () {
  const allLikes = await getAllLikes()
  const photographerInfo = await getPhotographerInfo()
  const likesPrice = document.getElementById('likes-price')
  likesPrice.innerHTML = `
    <div class="like">
      <p id="allNumberLike">${allLikes}</p>
      <img src="./assets/icons/heart-solid.svg" alt="">
    </div>
    
    <div class="price-day">
      <p>${photographerInfo.price}€ / jour</p>
    </div>
  `
}

/** *************|Likes++|***************/
async function plusLike (id) {
  const heartImg = document.getElementById('heart-card-' + id)
  const likeElement = heartImg.previousElementSibling
  let likeContent = likeElement.textContent
  console.log(likeContent)
  likeElement.textContent = ++likeContent
  const allNumberLike = document.getElementById('allNumberLike')
  let allLike = document.getElementById('allNumberLike').textContent
  allNumberLike.textContent = ++allLike
}

/** *************|Zoom Image|***************/
async function zoom (id) {
  const photographerInfo = await getPhotographerInfo()
  const goodMedias = await getGoodMedias()
  const imgAndTitle = document.getElementById('image-title')
  const zoomModal = document.getElementById('zoom-modal')
  const leftArrow = document.getElementById('left-arrow')
  const rightArrow = document.getElementById('right-arrow')
  const thePicture = goodMedias.find((element) => element.id === id)
  let indexImg = goodMedias.indexOf(thePicture)
  zoomModal.style.display = 'flex'
  buildImageZoom(goodMedias, photographerInfo, imgAndTitle, indexImg)

  // clic sur les boutons flêches
  leftArrow.addEventListener('click', () => {
    indexImg = previousImage(indexImg, goodMedias, photographerInfo, imgAndTitle)
  })

  rightArrow.addEventListener('click', () => {
    indexImg = nextImage(indexImg, goodMedias, photographerInfo, imgAndTitle)
  })

  // flêches du clavier
  window.addEventListener('keydown', (e) => {
    if (zoomModal.style.display === 'flex' && e.key === 'ArrowLeft') {
      indexImg = previousImage(indexImg, goodMedias, photographerInfo, imgAndTitle)
    } else if (zoomModal.style.display === 'flex' && e.key === 'ArrowRight') {
      indexImg = nextImage(indexImg, goodMedias, photographerInfo, imgAndTitle)
    }
  })
  noScroll()
}

/** *************|Pas de scroll quand la modal est ouverte|***************/
function noScroll () {
  const zoomModal = document.getElementById('zoom-modal')
  const body = document.querySelector('body')
  if (zoomModal.style.display === 'flex') {
    body.style.overflowY = 'hidden'
    console.log('coucou')
  }
  body.style.overflowY = 'hidden'
}

/** *************|Fermer la modal|***************/
function closeZoom () {
  const zoomModal = document.getElementById('zoom-modal')
  const body = document.querySelector('body')
  zoomModal.style.display = 'none'
  body.style.overflowY = 'auto'
}

/** *************|Fermer la modal avec la touche echap|***************/
window.addEventListener('keydown', (e) => {
  const zoomModal = document.getElementById('zoom-modal')
  // eslint-disable-next-line no-cond-assign
  if (zoomModal.style.display = 'flex' && e.key === 'Escape') {
    closeZoom()
  }
})

/** *************|Fermer la modal en cliquant à coté |***************/
window.addEventListener('click', (event) => {
  const modal = document.getElementById('zoom-modal')
  if (event.target === modal) {
    closeZoom()
  }
})

/** *************|Name on contact form|***************/
async function nameOnContactForm () {
  const photographerInfo = await getPhotographerInfo()
  const nameContactForm = document.getElementById('name-contact-form')
  nameContactForm.textContent =
`
${photographerInfo.name}
`
}

/** *************|Fonction INIT pour appeler les fonctions|***************/
function init () {
  carrousel()
  likeAndPrice()
  getAllLikes()
  addPhotographerInHeader()
  nameOnContactForm()
}

init()
