// Obtener el canvas y el contexto de renderizado 2D
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Cargar la imagen de fondo
const background = new Image();
background.src = 'fondojuego.png'; // Cambia esto a la ruta correcta

// Obtener el personaje seleccionado del localStorage
const selectedCharacter = localStorage.getItem('selectedCharacter') || 'female'; // Valor por defecto

// Variables del personaje
let character = {
    x: 10,
    y: canvas.height - 150,  // Ajustar la posición Y para que el personaje esté visible
    width: 65,
    height: 130,
    speed: 2,  // Velocidad de movimiento
    frameIndex: 0,  // Índice del frame del sprite
    frameRate: 0,
    currentCharacter: selectedCharacter, // Almacena el personaje seleccionado
    imageWalkRight: {
        female: [
            '1imagen.png',
            '2imagen.png',
            '3imagen.png',
            '4imagen.png',
            '5imagen.png'
        ],
        male: [
            'posesmasculino1.png',
            'posesmasculino2.png',
            'posesmasculino3.png',
            'posesmasculino4.png',
            'posesmasculino5.png',
            'posesmasculino6.png',
            'posesmasculino7.png'
        ]
    },
    imageWalkLeft: {
        female: [
            'Imagen1izquierda.png',
            'Imagen2izquierda.png',
            'Imagen3izquierda.png',
            'Imagen4izquierda.png',
            'Imagen5izquierda.png'
        ],
        male: [
            'posesmasculino1izquierda.png',
            'posesmasculino2izquierda.png',
            'posesmasculino3izquierda.png',
            'posesmasculino4izquierda.png',
            'posesmasculino5izquierda.png'
        ]
    }
};

// Inicializar la imagen del personaje
let currentImage = new Image();
currentImage.src = character.imageWalkRight[character.currentCharacter][0];  // Comenzar con el primer frame del personaje seleccionado

// Variables de control de movimiento
let rightPressed = false;
let leftPressed = false;  // Variable para mover hacia la izquierda
let atLimitRight = false;  // Detecta si el personaje está en el límite derecho
let atLimitLeft = false;  // Detecta si el personaje está en el límite izquierdo

// Obtener los elementos del mensaje y botones
const messageElement = document.getElementById("message");
const buttonSi = document.getElementById("buttonSi");
const buttonNo = document.getElementById("buttonNo");

// Cargar todas las imágenes
const loadImages = (callback) => {
    let loadedImages = 0;
    const totalImages = character.imageWalkRight[character.currentCharacter].length + character.imageWalkLeft[character.currentCharacter].length;

    const checkLoaded = () => {
        loadedImages++;
        console.log(`Imágenes cargadas: ${loadedImages} de ${totalImages}`);
        if (loadedImages === totalImages) {
            callback();  // Llamar a la función callback una vez que todas las imágenes estén cargadas
        }
    };

    // Cargar imágenes de caminar a la derecha
    character.imageWalkRight[character.currentCharacter].forEach((src) => {
        const img = new Image();
        img.src = src;
        img.onload = checkLoaded;
    });

    // Cargar imágenes de caminar a la izquierda
    character.imageWalkLeft[character.currentCharacter].forEach((src) => {
        const img = new Image();
        img.src = src;
        img.onload = checkLoaded;
    });
};

// Dibujar el fondo
function drawBackground() {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height); // Dibuja el fondo en el canvas
}

// Dibujar el personaje
function drawCharacter() {
    ctx.drawImage(currentImage, character.x, character.y, character.width, character.height);
}

// Mostrar el mensaje y los botones
function showMessage() {
    messageElement.style.display = "block";
    buttonSi.style.display = "block";
    buttonNo.style.display = "block";
}

// Mover el personaje
function moveCharacter() {
    if (rightPressed && character.x < canvas.width - character.width) {
        character.x += character.speed;
        character.frameRate++;
        currentImage.src = character.imageWalkRight[character.currentCharacter][Math.floor(character.frameRate / 8) % character.imageWalkRight[character.currentCharacter].length];
        atLimitRight = false;
    } else if (leftPressed && character.x > 0) {
        character.x -= character.speed;
        character.frameRate++;
        currentImage.src = character.imageWalkLeft[character.currentCharacter][Math.floor(character.frameRate / 8) % character.imageWalkLeft[character.currentCharacter].length];
        atLimitLeft = false;
    }

    // Comprobar límites
    if (character.x >= canvas.width - character.width) {
        atLimitRight = true;
        rightPressed = false;
        showMessage(); // Llamar a la función para mostrar el mensaje y los botones
    } else if (character.x <= 0) {
        atLimitLeft = true;
        leftPressed = false;
    }
}

// Actualizar el juego
function update() {
    drawBackground(); // Dibuja el fondo
    drawCharacter(); // Dibuja el personaje
    moveCharacter(); // Mueve el personaje
    requestAnimationFrame(update); // Continuar la animación
}

// Escuchar eventos del teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'ArrowLeft') {
        leftPressed = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'ArrowLeft') {
        leftPressed = false;
    }
});

// Eventos para controles táctiles
canvas.addEventListener('touchstart', (event) => {
    const touchX = event.touches[0].clientX; // Obtener la posición del toque
    if (touchX > canvas.width / 2) { // Si el toque es en la mitad derecha
        rightPressed = true;
    } else { // Si el toque es en la mitad izquierda
        leftPressed = true;
    }
});

canvas.addEventListener('touchend', () => {
    rightPressed = false;
    leftPressed = false;
});

// Funciones para los botones visibles
function handleSi() {
    setTimeout(() => {
        window.location.href = "cargandomundo.html"; // Redirigir a otra página cuando se presiona "Sí"
    }, 100);

}

function handleNo() {
    messageElement.style.display = "none"; // Ocultar el mensaje
    buttonSi.style.display = "none"; // Ocultar el botón "Sí"
    buttonNo.style.display = "none"; // Ocultar el botón "No"
}

// Iniciar el juego una vez que todas las imágenes estén cargadas
background.onload = () => {
    loadImages(() => {
        update(); // Iniciar la animación cuando todas las imágenes estén cargadas
    });
};
