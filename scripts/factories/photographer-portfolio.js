
/***************| contenu de Photographer-header|***************/
async function addPhotographerInHeader(photographerInfo, photographerHeader ) {
    const photographerInfo = await getPhotographerInfo();
    const photographerHeader = document.getElementById("photograph-header");
    photographerHeader.innerHTML =
     `
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


async function addPhotographerInHeader() {
  }