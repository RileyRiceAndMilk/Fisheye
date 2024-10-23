async function fetchPhotographers() {
    const response = await fetch('data/photographers.json');
    const data = await response.json();
    return data.photographers || [];
}

async function fetchMedia() {
    const response = await fetch('data/photographers.json');
    const data = await response.json();
    return data.media || [];
}

async function displayPhotographer(photographerId) {
    const photographers = await fetchPhotographers();
    const media = await fetchMedia();
    const photographer = photographers.find(p => p.id === photographerId);

    if (!photographer) {
        console.error("Photographe non trouvé");
        return;
    }

    const photographerHeader = document.querySelector('.photograph-header');
    photographerHeader.innerHTML = '';

    const headerContent = document.createElement('div');
    headerContent.className = 'header-content';

    const photographerInfo = document.createElement('div');
    photographerInfo.className = 'photographer-info';

    const photographerName = document.createElement('h2');
    photographerName.className = 'photographer-name';
    photographerName.textContent = photographer.name;

    const location = document.createElement('p');
    location.className = 'location';
    location.textContent = `${photographer.city}, ${photographer.country}`;

    const tagline = document.createElement('p');
    tagline.className = 'photographer-tagline';
    tagline.textContent = photographer.tagline;

    const contactButton = document.createElement('button');
    contactButton.id = 'contact-button';
    contactButton.className = 'contact_button';
    contactButton.textContent = 'Contactez-moi';
    contactButton.setAttribute('aria-label', 'Ouvrir le formulaire de contact');


    photographerInfo.appendChild(photographerName);
    photographerInfo.appendChild(location);
    photographerInfo.appendChild(tagline);
    headerContent.appendChild(photographerInfo);
    headerContent.appendChild(contactButton);
    photographerHeader.appendChild(headerContent);

    const portraitImg = document.createElement('img');
    portraitImg.className = 'photographer-portrait';
    portraitImg.src = `Photographers ID Photos/${photographer.portrait}`;
    portraitImg.alt = `Portrait de ${photographer.name}`;
    photographerHeader.appendChild(portraitImg);

    const mainElement = document.getElementById('main');

    const mediaContainer = document.createElement('div');
    mediaContainer.classList.add('media_section');
    mainElement.appendChild(mediaContainer);

    const sortContainer = document.createElement('div');
    sortContainer.classList.add('sort-container');

    const sortLabel = document.createElement('span');
    sortLabel.textContent = 'Trier par: ';
    sortLabel.setAttribute('aria-label', 'Trier par');

    const sortSelect = document.createElement('select');
    sortSelect.id = 'sortOptions';
    sortSelect.setAttribute('aria-label', 'Options de tri');

    const optionDate = document.createElement('option');
    optionDate.value = 'date';
    optionDate.textContent = 'Date';

    const optionName = document.createElement('option');
    optionName.value = 'nom';
    optionName.textContent = 'Nom';

    const optionPopularity = document.createElement('option');
    optionPopularity.value = 'popularite';
    optionPopularity.textContent = 'Popularité';

    sortSelect.appendChild(optionDate);
    sortSelect.appendChild(optionName);
    sortSelect.appendChild(optionPopularity);

    sortContainer.appendChild(sortLabel);
    sortContainer.appendChild(sortSelect);
    mainElement.insertBefore(sortContainer, mediaContainer);

    const photographerMedia = media.filter(m => m.photographerId === photographerId);
    let totalLikes = 0;

    displayMedia(photographerMedia);

    contactButton.addEventListener('click', () => openModal(photographer.name));

    sortSelect.addEventListener('change', function () {
        const sortedMedia = sortMedia(photographerMedia, this.value);
        displayMedia(sortedMedia);
    });

    function displayMedia(mediaItems) {
        mediaContainer.innerHTML = '';
        totalLikes = 0;

        mediaItems.forEach(mediaItem => {
            totalLikes += mediaItem.likes;

            const mediaElement = document.createElement('div');
            mediaElement.classList.add('media-item');

            const mediaContent = document.createElement('div');
            mediaContent.classList.add('media-content');

            let media;
            if (mediaItem.image) {
                media = document.createElement('img');
                media.src = `${photographer.id}/${mediaItem.image}`;
                media.alt = mediaItem.title || 'Media overview';
                media.dataset.src = `${photographer.id}/${mediaItem.image}`;
                media.setAttribute('aria-label', mediaItem.title || 'Untitled media');
            } else {
                media = document.createElement('video');
                media.src = `${photographer.id}/${mediaItem.video}`;
                media.controls = true;
                media.alt = mediaItem.title || 'Media overview';
                media.dataset.src = `${photographer.id}/${mediaItem.video}`;
                media.setAttribute('aria-label', mediaItem.title || 'Untitled media');
            }

            media.classList.add('media');
            mediaContent.appendChild(media);

            const mediaTitleAndLike = document.createElement('div');
            mediaTitleAndLike.className = 'media-title-and-like';

            const mediaTitle = document.createElement('div');
            mediaTitle.className = 'media-title';
            mediaTitle.textContent = mediaItem.title;

            const mediaLikes = document.createElement('div');
            mediaLikes.className = 'media-likes';

            const likeCount = document.createElement('span');
            likeCount.className = 'like-count';
            likeCount.textContent = mediaItem.likes;

            const likeButton = document.createElement('span');
            likeButton.className = 'like-button';
            likeButton.setAttribute('role', 'img');
            likeButton.setAttribute('aria-label', 'Likes');

            const likeIcon = document.createElement('i');
            likeIcon.className = 'far fa-heart';
            likeIcon.setAttribute('aria-label', 'Likes');
            likeButton.appendChild(likeIcon);


            mediaLikes.appendChild(likeCount);
            mediaLikes.appendChild(likeButton);
            mediaTitleAndLike.appendChild(mediaTitle);
            mediaTitleAndLike.appendChild(mediaLikes);
            mediaContent.appendChild(mediaTitleAndLike);
            mediaElement.appendChild(mediaContent);
            mediaContainer.appendChild(mediaElement);

            likeButton.addEventListener('click', () => {
                const liked = likeIcon.classList.contains('fas');
                if (!liked) {
                    let likeCountValue = parseInt(likeCount.textContent, 10);
                    likeCountValue++;
                    likeCount.textContent = likeCountValue;
                    likeIcon.classList.remove('far');
                    likeIcon.classList.add('fas');
                    totalLikes++;
                    updateTotalLikes(totalLikes);
                    likeButton.setAttribute('aria-label', 'Aimer ce média');
                } else {
                    let likeCountValue = parseInt(likeCount.textContent, 10);
                    likeCountValue--;
                    likeCount.textContent = likeCountValue;
                    likeIcon.classList.remove('fas');
                    likeIcon.classList.add('far');
                    totalLikes--;
                    updateTotalLikes(totalLikes);
                    likeButton.setAttribute('aria-label', 'Ne plus aimer ce média');
                }
            });


            media.addEventListener('click', () => {
                openLightbox(mediaItems.indexOf(mediaItem), mediaItems, photographer.id);
            });
        });

        const likesAndPrice = document.createElement('div');
        likesAndPrice.className = 'likes-and-price';

        const totalLikesDiv = document.createElement('div');
        totalLikesDiv.className = 'total-likes';
        const likesCount = document.createElement('span');
        likesCount.id = 'total-likes-count';
        likesCount.textContent = totalLikes;

        const heartIcon = document.createElement('i');
        heartIcon.className = 'fas fa-heart';
        totalLikesDiv.appendChild(likesCount);
        totalLikesDiv.appendChild(heartIcon);

        const priceDiv = document.createElement('div');
        priceDiv.className = 'price';
        priceDiv.textContent = `${photographer.price}€ / jour`;

        likesAndPrice.appendChild(totalLikesDiv);
        likesAndPrice.appendChild(priceDiv);
        mainElement.appendChild(likesAndPrice);
    }
}

function updateTotalLikes(likes) {
    const totalLikesCount = document.getElementById('total-likes-count');
    totalLikesCount.textContent = likes;
}

function openModal(photographerName) {
    const modal = document.getElementById('contact_modal');
    modal.style.display = 'flex';

    const modalContent = `
        <header>
            <h2 id="modal-title">Contactez-moi</h2>
            <img src="assets/icons/close.svg" class="close" onclick="closeModal()" alt="Fermer" aria-label="close contact form">
        </header>
        <p class="photographer-name-modal">${photographerName}</p>
        <form id="contact-form" aria-labelledby="modal-title">
            <div>
                <label for="prenom">Prénom</label>
                <input type="text" id="prenom" name="prenom" required aria-label="First name field">
                <span class="error-message" id="prenom-error" aria-live="polite"></span>
            </div>
            <div>
                <label for="nom">Nom</label>
                <input type="text" id="nom" name="nom" required aria-label="Last Name field">
                <span class="error-message" id="nom-error" aria-live="polite"></span>
            </div>
            <div>
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required aria-label="Email field">
                <span class="error-message" id="email-error" aria-live="polite"></span>
            </div>
            <div>
                <label for="message">Votre message</label>
                <textarea id="message" name="message" required aria-label="Message field"></textarea>
                <span class="error-message" id="message-error" aria-live="polite"></span>
            </div>
            <button type="button" class="contact_button_modal" onclick="submitForm()" aria-label="Send the contact form">Envoyer</button>
        </form>
    `;

    modal.innerHTML = modalContent;
}

function closeModal() {
    const modal = document.getElementById('contact_modal');
    modal.style.display = 'none';
}

function submitForm() {
    const form = document.getElementById('contact-form');
    const prenom = form.prenom.value;
    const nom = form.nom.value;
    const email = form.email.value;
    const message = form.message.value;

    let valid = true;

    if (!prenom) {
        document.getElementById('prenom-error').textContent = 'Ce champ est requis.';
        valid = false;
    } else {
        document.getElementById('prenom-error').textContent = '';
    }

    if (!nom) {
        document.getElementById('nom-error').textContent = 'Ce champ est requis.';
        valid = false;
    } else {
        document.getElementById('nom-error').textContent = '';
    }

    if (!email) {
        document.getElementById('email-error').textContent = 'Ce champ est requis.';
        valid = false;
    }
    else if (!/^[^\s@]+@(gmail|hotmail|yahoo|outlook)\.(com|fr|net|org)$/i.test(email)) {
        document.getElementById('email-error').textContent = 'Veuillez entrer un email valide';
        valid = false;
    }
    else {
        document.getElementById('email-error').textContent = '';
    }

    if (!message) {
        document.getElementById('message-error').textContent = 'Ce champ est requis.';
        valid = false;
    } else {
        document.getElementById('message-error').textContent = '';
    }

    if (valid) {
        const thankYouMessage = document.createElement('div');
        thankYouMessage.className = 'thank-you-message';

        const messageText = document.createElement('p');
        messageText.textContent = 'Merci pour votre message!';

        const closeButton = document.createElement('button');
        closeButton.className = 'close-thank-you';
        closeButton.textContent = 'Fermer';

        thankYouMessage.appendChild(messageText);
        thankYouMessage.appendChild(closeButton);

        document.body.appendChild(thankYouMessage);
        console.log('Message de remerciement ajouté');

        form.reset();
        closeModal();

        closeButton.addEventListener('click', () => {
            document.body.removeChild(thankYouMessage);
        });
    }
}

function sortMedia(mediaItems, criteria) {
    switch (criteria) {
        case 'date':
            return mediaItems.sort((a, b) => new Date(b.date) - new Date(a.date));
        case 'nom':
            return mediaItems.sort((a, b) => a.title.localeCompare(b.title));
        case 'popularite':
            return mediaItems.sort((a, b) => b.likes - a.likes);
        default:
            return mediaItems;
    }
}

let currentIndex = 0;
function openLightbox(index, mediaItems, photographerId) {
    let currentIndex = index;

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-label', 'image closeup view');

    const lightboxContent = document.createElement('div');
    lightboxContent.className = 'lightbox-content';

    const lightboxMedia = document.createElement(mediaItems[currentIndex].image ? 'img' : 'video');
    lightboxMedia.className = 'lightbox-media';
    lightboxMedia.src = mediaItems[currentIndex].image
        ? `${photographerId}/${mediaItems[currentIndex].image}`
        : `${photographerId}/${mediaItems[currentIndex].video}`;

    if (mediaItems[currentIndex].image) {
        lightboxMedia.alt = mediaItems[currentIndex].title || 'Media Overview'; 
    }

   
    if (!mediaItems[currentIndex].image) {
        lightboxMedia.controls = true;
        lightboxMedia.load();
        lightboxMedia.setAttribute('aria-label', mediaItems[currentIndex].title || 'Untitled media');
    }

    lightboxContent.appendChild(lightboxMedia);
    lightbox.appendChild(lightboxContent);
    document.body.appendChild(lightbox);
    lightbox.focus();


    const lightboxClose = document.createElement('span');
    lightboxClose.className = 'lightbox-close';
    lightboxClose.innerHTML = '&times;';
    lightboxClose.setAttribute('aria-label', 'close dialog');
    lightboxClose.addEventListener('click', closeLightbox);

    const prevArrow = document.createElement('span');
    prevArrow.className = 'lightbox-prev';
    prevArrow.innerHTML = '&#10094;';
    prevArrow.setAttribute('aria-label', 'previous image');
    prevArrow.addEventListener('click', showPreviousMedia);

    const nextArrow = document.createElement('span');
    nextArrow.className = 'lightbox-next';
    nextArrow.innerHTML = '&#10095;';
    nextArrow.setAttribute('aria-label', 'next image');
    nextArrow.addEventListener('click', showNextMedia);

    lightboxContent.appendChild(lightboxClose);
    lightboxContent.appendChild(prevArrow);
    lightboxContent.appendChild(lightboxMedia);
    lightboxContent.appendChild(nextArrow);

    lightbox.appendChild(lightboxContent);
    document.body.appendChild(lightbox);
    lightbox.focus();

    document.addEventListener('keydown', handleKeydown);

    function handleKeydown(event) {
        if (event.key === 'Escape') {
            closeLightbox();
        } else if (event.key === 'ArrowRight') {
            showNextMedia();
        } else if (event.key === 'ArrowLeft') {
            showPreviousMedia();
        }
    }

    function closeLightbox() {
        document.body.removeChild(lightbox);
        document.removeEventListener('keydown', handleKeydown);
    }

    function showPreviousMedia() {
        currentIndex = (currentIndex - 1 + mediaItems.length) % mediaItems.length;
        updateLightbox();
    }

    function showNextMedia() {
        currentIndex = (currentIndex + 1) % mediaItems.length;
        updateLightbox();
    }

    function updateLightbox() {
        const newMedia = document.createElement(mediaItems[currentIndex].image ? 'img' : 'video');
        newMedia.className = 'lightbox-media';
        newMedia.src = mediaItems[currentIndex].image
            ? `${photographerId}/${mediaItems[currentIndex].image}`
            : `${photographerId}/${mediaItems[currentIndex].video}`;
    
        if (mediaItems[currentIndex].image) {
            newMedia.alt = mediaItems[currentIndex].title || 'Media Overview'; 
            newMedia.setAttribute('aria-label', mediaItems[currentIndex].title || 'Untitled media');
        }
    
        if (!mediaItems[currentIndex].image) {
            newMedia.controls = true;
            newMedia.load();
            newMedia.alt = mediaItems[currentIndex].title || 'Media Overview';
            newMedia.setAttribute('aria-label', mediaItems[currentIndex].title || 'Untitled media');
        }
    
        const currentMedia = document.querySelector('.lightbox-media');
        currentMedia.parentNode.replaceChild(newMedia, currentMedia);
    }
}  

const params = new URLSearchParams(window.location.search);
const photographerId = parseInt(params.get("id"));
displayPhotographer(photographerId);
