
document.querySelectorAll('.media-thumbnail').forEach((media, index) => {
    media.tabIndex = 0;
    media.addEventListener('click', () => openLightbox(index, mediaItems, photographerId));
    media.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') openLightbox(index, mediaItems, photographerId);
    });
});

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
    lightboxMedia.tabIndex = 0; 
    lightboxMedia.focus(); 

    if (mediaItems[currentIndex].image) {
        lightboxMedia.alt = mediaItems[currentIndex].title || 'Media Overview';
    } else {
        lightboxMedia.controls = true;
        lightboxMedia.load();
        lightboxMedia.setAttribute('aria-label', mediaItems[currentIndex].title || 'Untitled media');
    }

   
    const lightboxClose = document.createElement('span');
    lightboxClose.className = 'lightbox-close';
    lightboxClose.innerHTML = '&times;';
    lightboxClose.setAttribute('aria-label', 'close dialog');
    lightboxClose.tabIndex = 0;
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxClose.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') closeLightbox();
    });

    
    const prevArrow = document.createElement('span');
    prevArrow.className = 'lightbox-prev';
    prevArrow.innerHTML = '&#10094;';
    prevArrow.setAttribute('aria-label', 'previous image');
    prevArrow.tabIndex = 0;
    prevArrow.addEventListener('click', showPreviousMedia);
    prevArrow.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') showPreviousMedia();
    });

   
    const nextArrow = document.createElement('span');
    nextArrow.className = 'lightbox-next';
    nextArrow.innerHTML = '&#10095;';
    nextArrow.setAttribute('aria-label', 'next image');
    nextArrow.tabIndex = 0;
    nextArrow.addEventListener('click', showNextMedia);
    nextArrow.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') showNextMedia();
    });

   
    lightboxContent.appendChild(lightboxClose);
    lightboxContent.appendChild(prevArrow);
    lightboxContent.appendChild(lightboxMedia);
    lightboxContent.appendChild(nextArrow);

    lightbox.appendChild(lightboxContent);
    document.body.appendChild(lightbox);

    
    const focusableElements = lightbox.querySelectorAll('.lightbox-close, .lightbox-prev, .lightbox-next, .lightbox-media');
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];
    firstFocusableElement.focus();

    lightbox.addEventListener('keydown', trapFocus);

    function trapFocus(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    e.preventDefault();
                    lastFocusableElement.focus();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    e.preventDefault();
                    firstFocusableElement.focus();
                }
            }
        }
    }

   
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
        lightbox.removeEventListener('keydown', trapFocus);
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
        newMedia.tabIndex = 0;
        newMedia.focus();

        if (mediaItems[currentIndex].image) {
            newMedia.alt = mediaItems[currentIndex].title || 'Media Overview';
        } else {
            newMedia.controls = true;
            newMedia.load();
            newMedia.setAttribute('aria-label', mediaItems[currentIndex].title || 'Untitled media');
        }

        const currentMedia = document.querySelector('.lightbox-media');
        currentMedia.parentNode.replaceChild(newMedia, currentMedia);
    }
}  
