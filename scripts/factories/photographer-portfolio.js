/***************| |***************/
function photographerHeaderFactory(target, data) {
  target.innerHTML = `
        <div>
          <h2 class="test">${data.name}</h2>
          <h3>${data.city} ${data.country}</h3>
          <p>${data.tagline}</p>
          <p class="price">${data.price}€/jour</p>
        </div>
        <div id="bloc-contact">
          <button class="contact_button" onclick="displayModal()">Contactez-moi</button>
        </div>
        <div id="bloc-picture">
          <img src="assets/photographers/${data.portrait}" alt="photo de ${data.name}">
        </div>
      `;
}

/***************| construction des cards|***************/
function carrouselFactory(target, dataMedia, dataPhotographer) {
  target.innerHTML = dataMedia
    .map(
      (mediaPhoto) =>
        `
  <article class="media-card"  > 
    <div class = "bloc-img">
    ${
      mediaPhoto.image
        ? `<button onclick="zoom(${mediaPhoto.id})"> <img class="for-zoom"    src="assets/images/media/${dataPhotographer.name}/${mediaPhoto.image}" alt="photo de ${dataPhotographer.name}-${mediaPhoto.title}"></img></button>`
        : `<button onclick="zoom(${mediaPhoto.id})"><img class="arrow-video" src="./assets/icons/play-button-svgrepo-com.svg" alt=""><video class="for-zoom"><source src="assets/images/media/${dataPhotographer.name}/${mediaPhoto.video}" type="video/mp4" alt="vidéo de ${dataPhotographer.name}"></video></button>`
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