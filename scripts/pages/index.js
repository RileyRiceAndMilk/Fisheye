
const photographerSection = document.querySelector('.photographer_section');


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
        card.setAttribute('aria-labelledby', `photographer-${photographer.id}`);


        const cardContent = `
            <a href="photographer.html?id=${photographer.id}" aria-label="Voir le profil de ${photographer.name}">
                <img src="Photographie/Photographers ID Photos/${photographer.portrait}" alt="Portrait de ${photographer.name}" class="photographer-portrait" tabindex="3" />
                <h2 id="photographer-${photographer.id}">${photographer.name}</h2>
                <p class="tagline">${photographer.tagline}</p>
                <p class="location">${photographer.city}, ${photographer.country}</p>
                <p class="price">${photographer.price}€/jour</p>
            </a>
        `;


        card.innerHTML = cardContent;


        photographerSection.appendChild(card);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    loadPhotographers();
});




