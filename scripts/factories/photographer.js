function photographerFactory(target, data) {
  target.innerHTML = data
    .map(
      (photographer) =>
        `
    <article>
      <a href="./photographer.html?id=${photographer.id}">
       <img src="assets/photographers/${photographer.portrait}" alt="photo de ${photographer.name}">
        <h2>${photographer.name}</h2>
      </a>
      <div>
        <h3>${photographer.city}${photographer.country}</h3>
        <p>${photographer.tagline}</p>
        <p class="price">${photographer.price}€/jour</p>
      </div>
    </article>
    `
    )
    .join("");
}
