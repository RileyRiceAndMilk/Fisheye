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