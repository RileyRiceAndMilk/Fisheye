const photographerSection = document.querySelector('.photographer_section');

import { fetchPhotographers, fetchMedia, listenForSpaceToScroll, enableEnterClick } from './functionfetch.js';


async function loadPhotographers() {
    try {

        const response = await fetch('data/photographers.json');
        const data = await response.json();


        displayPhotographers(data.photographers);
    } catch (error) {
        console.error('Erreur lors du chargement des photographes:', error);
    }
}


function displayPhotographers(photographers) {

    if (!photographerSection) {
        console.error("L'élément 'photographer_section' est introuvable.");
        return;
    }


    photographerSection.innerHTML = '';


    photographers.forEach(photographer => {
        const card = document.createElement('article');
        card.classList.add('photographer-card');
        card.setAttribute('aria-labelledby', `${photographer.id}`);


        const cardContent = `
            <a href="photographer.html?id=${photographer.id}" aria-label="Voir le profil de ${photographer.name}">
                <img src="Photographie/Photographers ID Photos/${photographer.portrait}" alt="Portrait de ${photographer.name}" class="photographer-portrait" tabindex="3" />
                <h2 id="photographer-${photographer.id}" tabindex="3">${photographer.name}</h2>
                <h3 class="tagline" tabindex="3" role="button">${photographer.tagline}</h1>
                <h3 class="location" tabindex="3" role="button">${photographer.city}, ${photographer.country}</h1>
                <h3 class="price" tabindex="3" role="button">${photographer.price}€/jour</h1>
            </a>
        `;


        card.innerHTML = cardContent;


        photographerSection.appendChild(card);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    loadPhotographers();
});




