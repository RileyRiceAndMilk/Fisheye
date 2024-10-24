
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
