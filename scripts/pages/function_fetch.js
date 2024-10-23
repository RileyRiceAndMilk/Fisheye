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