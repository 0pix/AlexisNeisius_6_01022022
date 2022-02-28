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


// Afficher les photographes sur l'accueil
async function userDisplay() {
  const photographerInfo = await getPhotographers();
  const photographersSection = document.querySelector(".photographer_section");
  await getPhotographers();
  photographerFactory(photographersSection, photographerInfo.photographers);
}
userDisplay();



