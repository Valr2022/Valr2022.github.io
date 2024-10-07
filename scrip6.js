const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Recuperar la puntuación del nivel anterior o inicializarla si no existe
let score = parseInt(localStorage.getItem('score')) || 0;
document.getElementById('scoreDisplay').innerText = `Puntuación: ${score}`;

// Recuperar el personaje seleccionado del nivel anterior
const selectedCharacter = localStorage.getItem('selectedCharacter') || 'female';

// Definir los sprites del personaje
const sprites = {
    female: ['1imagen.png', '2imagen.png', '3imagen.png', '4imagen.png', '5imagen.png'],
    male: ['posesmasculino1izquierda.png', 'posesmasculino2izquierda.png', 'posesmasculino3izquierda.png', 'posesmasculino4izquierda.png', 'posesmasculino5izquierda.png']
};

let currentCharacterImage = new Image();
currentCharacterImage.src = sprites[selectedCharacter][0];
let characterX = 120;
let characterY = 400;

// Cargar la imagen de fondo inicial
let backgroundImage = new Image();
backgroundImage.src = 'background5.png'; // Ruta de la imagen inicial del fondo

// Función para dibujar el fondo
function drawBackground() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

// Función para cambiar el fondo
function changeBackground(imageSrc) {
    backgroundImage.src = imageSrc; // Cambiar la imagen de fondo
    backgroundImage.onload = function () {
        drawBackground(); // Redibujar el fondo después de cargar la nueva imagen
    };
}

// Elegir opción
function chooseOption(option) {
    if (option === 1) {
        // Opción incorrecta
        showFeedback("¡Recuerda! Dejar las luces encendidas consume energía innecesaria. Prueba la otra opción.");
        changeBackground('luzencendida.png'); // Cambiar fondo a luz encendida
    } else if (option === 2) {
        // Opción correcta
        showFeedback("¡Excelente! Apagar las luces cuando no las necesitas ayuda a conservar energía.");
        changeBackground('luzapagada.png'); // Cambiar fondo a luz apagada
        score += 100; // Incrementar la puntuación
        localStorage.setItem('score', score); // Guardar la nueva puntuación
        // Redirigir al siguiente nivel
        setTimeout(() => {
            window.location.href = "lolograste.html"; // Redirigir al siguiente nivel
        }, 3000); // Esperar 3 segundos antes de redirigir
    }
}

// Mostrar retroalimentación
function showFeedback(message) {
    const feedback = document.getElementById('feedback');
    feedback.innerText = message;
    feedback.style.display = 'block';

    setTimeout(() => {
        feedback.style.display = 'none';
    }, 3000); // Ocultar el mensaje después de 3 segundos
}

// Dibujar el fondo y el personaje
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar el fondo
    drawBackground();

    // Dibujar el personaje
    ctx.drawImage(currentCharacterImage, characterX, characterY, 90, 150);

    requestAnimationFrame(draw);
}

// Iniciar el juego
backgroundImage.onload = function () {
    draw(); // Solo iniciar el juego después de cargar el fondo inicial
};
