const photographerSection = document.querySelector('.photographer_section');

import { fetchPhotographers, fetchMedia, listenForSpaceToScroll, enableEnterClick } from './functionfetch.js';

class PhotographerCard {
    constructor(photographer) {
        this.photographer = photographer;
    }

    static createCard(photographer) {
        const card = new PhotographerCard(photographer);
        return card.createCardContent();
    }

 
    createCardContent() {
        const card = document.createElement('article');
        card.classList.add('photographer-card');
        card.setAttribute('aria-labelledby', `photographer-${this.photographer.id}`);

        const cardContent = `
            <a href="photographer.html?id=${this.photographer.id}" aria-label="Voir le profil de ${this.photographer.name}">
                <img src="Photographie/Photographers ID Photos/${this.photographer.portrait}" 
                     alt="Portrait de ${this.photographer.name}" 
                     class="photographer-portrait" tabindex="3" />
                <h2 id="photographer-${this.photographer.id}" tabindex="3">${this.photographer.name}</h2>
                <h3 class="tagline" tabindex="3">${this.photographer.tagline}</h3>
                <h3 class="location" tabindex="3">${this.photographer.city}, ${this.photographer.country}</h3>
                <h3 class="price" tabindex="3">${this.photographer.price}€/jour</h3>
            </a>
        `;
        
        card.innerHTML = cardContent;
        return card;
    }
}

async function loadPhotographers() {
    try {
    
        const response = await fetch('data/photographers.json');
        const data = await response.json();

       
        if (data && data.photographers) {
            displayPhotographers(data.photographers);
        } else {
            console.error('Données des photographes non trouvées dans le fichier JSON');
        }
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
        const card = PhotographerCard.createCard(photographer);
        photographerSection.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadPhotographers();
});




