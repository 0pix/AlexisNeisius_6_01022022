async function getPhotographers() {
  let data = [];
  await fetch("./../../data/photographers.json").then(
    (res) => (data = res.json())
  );
  return data;
}

async function test2() {
  let onVerra = await getPhotographers();
  console.log(onVerra);
}
test2();

// async function getPhotographers() {
//   await fetch("./../../data/photographers.json")
//     .then((res) => res.json())
//     .then((data) => (photographers = data.photographers));
//   // et bien retourner le tableau photographers seulement une fois
//   return {
//     photographers,
//   };
// }

// import {getDescription} from "./helpers.js";

// Afficher les photographes sur l'accueil
async function userDisplay() {
  const photographerInfo = await getPhotographers();
  const photographersSection = document.querySelector(".photographer_section");
  await getPhotographers();
  photographerFactory(photographersSection, photographerInfo.photographers);
}
userDisplay();

// async function linkName() {
//   await getPhotographers();
//   const linkPagePhotographer = document.querySelectorAll("a");
//   console.log(linkPagePhotographer);
// }
// linkName();

// affiche les photographes
// async function displayData(photographers) {
//   const photographersSection = document.querySelector(".photographer_section");

//   photographers.forEach((photographer) => {
//     const photographerModel = photographerFactory(photographer);
//     const userCardDOM = photographerModel.getUserCardDOM();
//     photographersSection.appendChild(userCardDOM);
//   });
// }

// async function init() {
//   // Récupère les datas des photographes
//   const { photographers } = await getPhotographers();
//   displayData(photographers);
// }

// init();

// async function userDisplay() {
//   const photographersSection = document.querySelector(".photographer_section");
//   await getPhotographers();

//   photographersSection.innerHTML = photographers
//     .map(
//       (photographer) =>
//         `
//     <article>
//       <a href="./photographer.html?id=${photographer.id}">
//        <img src="assets/photographers/${photographer.portrait}" alt="photo de ${photographer.name}">
//         <h2>${photographer.name}</h2>
//       </a>
//       <div>
//         <h3>${photographer.city}${photographer.country}</h3>
//         <p>${photographer.tagline}</p>
//         <p class="price">${photographer.price}€/jour</p>
//       </div>
//     </article>
//     `
//     )
//     .join("");
// }
// userDisplay();
