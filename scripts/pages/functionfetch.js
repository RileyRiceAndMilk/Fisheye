export async function fetchPhotographers() {
    const response = await fetch('data/photographers.json');
    const data = await response.json();
    return data.photographers || [];
}

export async function fetchMedia() {
    const response = await fetch('data/photographers.json');
    const data = await response.json();
    return data.media || [];
}

export function listenForSpaceToScroll() {
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space' || event.keyCode === 32) {
            
            event.preventDefault();
            
            
            window.scrollBy({
                top: 100, 
                left: 0,
                behavior: 'smooth' 
            });
        }
    });
}

export function enableEnterClick() {
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Enter' || event.key === 'Enter') {
            const focusedElement = document.activeElement;
            if (focusedElement.tagName === 'BUTTON' || focusedElement.tagName === 'A') {
                focusedElement.click();
            }
        }
    });
}


enableEnterClick();

