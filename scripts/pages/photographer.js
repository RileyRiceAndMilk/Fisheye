import { fetchPhotographers, fetchMedia, listenForSpaceToScroll, enableEnterClick } from './functionfetch.js';

let totalLikes = 0;

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
    photographerName.setAttribute('tabindex', '2');

    const location = document.createElement('h3');
    location.className = 'location';
    location.textContent = `${photographer.city}, ${photographer.country}`;
    location.setAttribute('tabindex', '3');

    const tagline = document.createElement('h3');
    tagline.className = 'photographer-tagline';
    tagline.textContent = photographer.tagline;
    tagline.setAttribute('tabindex', '3');

    const contactButton = document.createElement('button');
    contactButton.id = 'contact-button';
    contactButton.className = 'contact_button';
    contactButton.textContent = 'Contactez-moi';
    contactButton.setAttribute('aria-label', 'Ouvrir le formulaire de contact');
    contactButton.setAttribute('tabindex', '4');

    photographerInfo.append(photographerName, location, tagline);
    headerContent.append(photographerInfo, contactButton);
    photographerHeader.appendChild(headerContent);

    const portraitImg = document.createElement('img');
    portraitImg.className = 'photographer-portrait';
    portraitImg.src = `Photographie/Photographers ID Photos/${photographer.portrait}`;
    portraitImg.alt = `Portrait de ${photographer.name}`;
    photographerHeader.appendChild(portraitImg);
    portraitImg.setAttribute('tabindex', '5');

    const mainElement = document.getElementById('main');

    const mediaContainer = document.createElement('div');
    mediaContainer.classList.add('media_section');
    mainElement.appendChild(mediaContainer);

    const sortContainer = document.createElement('div');
    sortContainer.classList.add('sort-container');

    const sortLabel = document.createElement('span');
    sortLabel.textContent = 'Trier par: ';
    sortLabel.setAttribute('aria-label', 'Trier par');
    sortLabel.setAttribute('tabindex', '7');

    const sortSelect = document.createElement('select');
    sortSelect.id = 'sortOptions';
    sortSelect.setAttribute('aria-label', 'Options de tri');
    sortSelect.setAttribute('tabindex', '8');

    const sortOptions = [
        { value: 'date', text: 'Date' },
        { value: 'nom', text: 'Nom' },
        { value: 'popularite', text: 'Popularité' },
    ];

    sortOptions.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option.value;
        opt.textContent = option.text;
        sortSelect.appendChild(opt);
    });

    sortContainer.append(sortLabel, sortSelect);
    mainElement.insertBefore(sortContainer, mediaContainer);

    const photographerMedia = media.filter(m => m.photographerId === photographerId);
    totalLikes = photographerMedia.reduce((sum, item) => sum + item.likes, 0);

    displayMedia(photographerMedia, photographer, mainElement);

    contactButton.addEventListener('click', () => openModal(photographer.name));

    sortSelect.addEventListener('change', function () {
        const sortedMedia = sortMedia(photographerMedia, this.value);
        displayMedia(sortedMedia, photographer, mainElement);
    });
}

function mediaFactory(mediaItem, photographerId) {
    let media;
    if (mediaItem.image) {
        media = document.createElement('img');
        media.src = `Photographie/${photographerId}/${mediaItem.image}`;
        media.alt = mediaItem.title || 'Media overview';
    } else {
        media = document.createElement('video');
        media.src = `Photographie/${photographerId}/${mediaItem.video}`;
        media.controls = false;  
        media.alt = mediaItem.title || 'Media overview';
    }
    media.classList.add('media');
    media.setAttribute('aria-label', mediaItem.title || 'Untitled media');
    media.setAttribute('tabindex', '0');
    return media;
}

function displayMedia(mediaItems, photographer, mainElement) {
    const mediaContainer = document.querySelector('.media_section');
    mediaContainer.innerHTML = '';

    mediaItems.forEach(mediaItem => {
        const mediaElement = document.createElement('div');
        mediaElement.classList.add('media-item');

        const mediaContent = document.createElement('div');
        mediaContent.classList.add('media-content');

        const media = mediaFactory(mediaItem, photographer.id);

        mediaContent.appendChild(media);

        const mediaTitleAndLike = document.createElement('div');
        mediaTitleAndLike.className = 'media-title-and-like';
        mediaTitleAndLike.setAttribute('tabindex', '0');

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
        likeButton.setAttribute('tabindex', '0');

        const likeIcon = document.createElement('i');
        likeIcon.className = 'far fa-heart';
        likeButton.appendChild(likeIcon);

        likeButton.addEventListener('click', () => toggleLike(likeButton, likeIcon, likeCount));

        likeButton.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                toggleLike(likeButton, likeIcon, likeCount);
            }
        });

        mediaLikes.append(likeCount, likeButton);
        mediaTitleAndLike.append(mediaTitle, mediaLikes);
        mediaContent.appendChild(mediaTitleAndLike);
        mediaElement.appendChild(mediaContent);
        mediaContainer.appendChild(mediaElement);

        media.addEventListener('click', () => {
            if (mediaItem.image) {
                openLightbox(mediaItems.indexOf(mediaItem), mediaItems, mediaItem.photographerId);
            } else if (mediaItem.video) {
                openLightbox(mediaItems.indexOf(mediaItem), mediaItems, mediaItem.photographerId, true); // Passer `true` pour indiquer qu'il s'agit d'une vidéo
            }
        });

        media.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                if (mediaItem.image) {
                    openLightbox(mediaItems.indexOf(mediaItem), mediaItems, mediaItem.photographerId);
                } else if (mediaItem.video) {
                    openLightbox(mediaItems.indexOf(mediaItem), mediaItems, mediaItem.photographerId, true);
                }
            }
        });
    });

    const likesAndPrice = document.createElement('div');
    likesAndPrice.className = 'likes-and-price';
    likesAndPrice.setAttribute('tabindex', '6');

    const totalLikesDiv = document.createElement('div');
    totalLikesDiv.className = 'total-likes';

    const likesCount = document.createElement('span');
    likesCount.id = 'total-likes-count';
    likesCount.textContent = totalLikes;

    const heartIcon = document.createElement('i');
    heartIcon.className = 'fas fa-heart';
    totalLikesDiv.append(likesCount, heartIcon);

    const priceDiv = document.createElement('div');
    priceDiv.className = 'price';
    priceDiv.textContent = `${photographer.price}€ / jour`;

    likesAndPrice.append(totalLikesDiv, priceDiv);
    mainElement.appendChild(likesAndPrice);
}

function toggleLike(likeButton, likeIcon, likeCount) {
    const liked = likeIcon.classList.contains('fas');
    let likeCountValue = parseInt(likeCount.textContent, 10);

    if (!liked) {
        likeCountValue++;
        likeIcon.classList.remove('far');
        likeIcon.classList.add('fas');
        totalLikes++;
    } else {
        likeCountValue--;
        likeIcon.classList.remove('fas');
        likeIcon.classList.add('far');
        totalLikes--;
    }

    likeCount.textContent = likeCountValue;
    updateTotalLikes(totalLikes);
    likeButton.setAttribute('aria-label', liked ? 'Ne plus aimer ce média' : 'Aimer ce média');
}

function updateTotalLikes(likes) {
    const totalLikesCount = document.getElementById('total-likes-count');
    totalLikesCount.textContent = likes;
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

const params = new URLSearchParams(window.location.search);
const photographerId = parseInt(params.get("id"));
displayPhotographer(photographerId);
