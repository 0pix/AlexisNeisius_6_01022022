/* eslint-disable no-undef */

/** *************|récuperer chaque photographe et sa data|***************/
async function getPhotographers () {
  let data = []
  await fetch('./../../data/photographers.json').then(
    (res) => (data = res.json())
  )
  return data
}

/** *************|Afficher les photographes sur l'accueil|***************/
// avec la fonction photographerFactory(target,data) qui construit le bloc html du photographe.
async function userDisplay () {
  const photographerInfo = await getPhotographers()
  const photographersSection = document.querySelector('.photographer_section')
  await getPhotographers()

  photographerFactory(photographersSection, photographerInfo.photographers)
}
userDisplay()
