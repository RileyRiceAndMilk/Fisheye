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

    const lightboxMedia = createMediaElement(mediaItems[currentIndex], photographerId);
    lightboxMedia.className = 'lightbox-media';
    lightboxMedia.tabIndex = 0;
    lightboxMedia.focus();

    const lightboxClose = createCloseButton();
    const prevArrow = createNavigationArrow('prev', 'previous image');
    const nextArrow = createNavigationArrow('next', 'next image');

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
    document.addEventListener('keydown', handleKeydown);

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
        const newMedia = createMediaElement(mediaItems[currentIndex], photographerId);
        newMedia.className = 'lightbox-media';
        newMedia.tabIndex = 0;
        newMedia.focus();

        const currentMedia = lightbox.querySelector('.lightbox-media');
        if (currentMedia) {
            currentMedia.parentNode.replaceChild(newMedia, currentMedia);
        }
    }

    function createMediaElement(mediaItem, photographerId) {
        const mediaElement = mediaItem.image
            ? document.createElement('img')
            : document.createElement('video');

        mediaElement.src = mediaItem.image
            ? `Photographie/${photographerId}/${mediaItem.image}`
            : `Photographie/${photographerId}/${mediaItem.video}`;

        if (mediaItem.image) {
            mediaElement.alt = mediaItem.title || 'Media Overview';
        } else {
            mediaElement.controls = true;
            mediaElement.load();
            mediaElement.setAttribute('aria-label', mediaItem.title || 'Untitled media');
        }

        return mediaElement;
    }

    function createCloseButton() {
        const closeButton = document.createElement('span');
        closeButton.className = 'lightbox-close';
        closeButton.innerHTML = '&times;';
        closeButton.setAttribute('aria-label', 'close dialog');
        closeButton.tabIndex = 0;
        closeButton.addEventListener('click', closeLightbox);
        closeButton.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') closeLightbox();
        });
        return closeButton;
    }

    function createNavigationArrow(direction, label) {
        const arrow = document.createElement('span');
        arrow.className = `lightbox-${direction}`;
        arrow.innerHTML = direction === 'prev' ? '&#10094;' : '&#10095;';
        arrow.setAttribute('aria-label', label);
        arrow.tabIndex = 0;
        arrow.addEventListener('click', direction === 'prev' ? showPreviousMedia : showNextMedia);
        arrow.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') direction === 'prev' ? showPreviousMedia() : showNextMedia();
        });
        return arrow;
    }
} 
