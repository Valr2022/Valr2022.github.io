const femaleCharacter = document.getElementById("female-character");
const maleCharacter = document.getElementById("male-character");
const selectionText = document.getElementById("selection-text");

let currentCharacter = 'female'; // Variable para rastrear el personaje actual

femaleCharacter.onclick = function() {
    currentCharacter = 'female';
    selectionText.innerHTML = 'Seleccionaste: Personaje Femenino';
    animateSelection();
}

maleCharacter.onclick = function() {
    currentCharacter = 'male';
    selectionText.innerHTML = 'Seleccionaste: Personaje Masculino';
    animateSelection();
}

function animateSelection() {
    // Animación de texto al seleccionar un personaje
    selectionText.style.animation = 'none'; // Reiniciar la animación
    selectionText.offsetHeight; // Trigger reflow
    selectionText.style.animation = 'fadeIn 1s'; // Aplicar de nuevo la animación
}

document.getElementById("display-confetti").onclick = function() {
    // Guarda la selección en localStorage
    localStorage.setItem('selectedCharacter', currentCharacter);

    // Mensaje de introducción sobre el juego
    alert("¡Bienvenido a Eco Saga!\n\n" +
          "En este juego, aprenderás sobre prácticas sostenibles, la conservación de energía, " +
          "y cómo reciclar de manera efectiva. \n" +
          "A través de diferentes niveles, te enfrentarás a situaciones donde deberás tomar decisiones " +
          "que afectarán o beneficiarán positivamente el medio ambiente.\n" +
          "¡Diviértete mientras contribuyes a un mundo más sostenible!");

    setTimeout(() => {
        window.location.href = "loading.html"; 
    }, 500);
}
