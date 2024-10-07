// Obtener el canvas y el contexto de renderizado 2D
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Recuperar la puntuación del nivel anterior o inicializarla si no existe
let score = parseInt(localStorage.getItem('score')) || 0;
let level3Completed = localStorage.getItem('level3Completed') === 'true'; // Verifica si ya completó este nivel
document.getElementById('scoreDisplay').innerText = `Puntuación: ${score}`;

// Recuperar el personaje seleccionado del nivel anterior
const selectedCharacter = localStorage.getItem('selectedCharacter') || 'female';

// Definir los sprites del personaje
const sprites = {
    female: ['1imagen.png', '2imagen.png', '3imagen.png', '4imagen.png', '5imagen.png'],
    male: ['posesmasculino1.png', 'posesmasculino2.png', 'posesmasculino3.png', 'posesmasculino4.png', 'posesmasculino5.png']
};

let currentCharacterImage = new Image();
currentCharacterImage.src = sprites[selectedCharacter][0];
let characterX = 300;
let characterY = 450;

// Cargar las imágenes de las bolsas
const plasticBagImage = new Image();
plasticBagImage.src = 'bolsaplasticodesechable.png'; // Asegúrate de usar el nombre correcto de la imagen
const reusableBagImage = new Image();
reusableBagImage.src = 'portabolsareutilizable.png'; // Asegúrate de usar el nombre correcto de la imagen

let isAnimating = false;
let hasShownFeedback = false;
let hasAnsweredCorrectly = false;

// Variables de control de movimiento
let currentFrame = 0;
let frameCounter = 0;
const animationSpeed = 10; // Controla la velocidad de la animación
let direction = 'right'; // Controlar la dirección
let moveSpeed = 8; // Velocidad de movimiento más lenta
let isMoving = false; // Estado de movimiento

// Posiciones de las bolsas
const plasticBagPosition = { x: 120, y: 480 }; // Posición de la bolsa desechable
const reusableBagPosition = { x: 620, y: 470 }; // Posición de la bolsa reutilizable
const interactionRange = 50; // Rango para interactuar

// Dibujar el fondo, el personaje y el feedback
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar el personaje
    ctx.save(); // Guardar el estado actual del contexto

    // Girar el sprite según la dirección
    if (direction === 'left') {
        ctx.scale(-1, 1); // Invertir horizontalmente
        ctx.drawImage(currentCharacterImage, -characterX - 90, characterY, 90, 150); // Ajustar la posición
    } else {
        ctx.drawImage(currentCharacterImage, characterX, characterY, 90, 150); // Dibujar normalmente
    }

    ctx.restore(); // Restaurar el estado del contexto

    // Dibujar las bolsas
    ctx.drawImage(plasticBagImage, plasticBagPosition.x, plasticBagPosition.y, 90, 150); // Bolsa de plástico
    ctx.drawImage(reusableBagImage, reusableBagPosition.x, reusableBagPosition.y, 90, 150); // Bolsa reutilizable

    // Verificar cercanía a las bolsas
    checkProximity();

    requestAnimationFrame(draw);
}

// Mover el personaje
function moveCharacter(dir) {
    if (dir === 'left' && characterX > 0) {
        characterX -= moveSpeed; // Mueve a la izquierda
        direction = 'left'; // Cambiar dirección
    } else if (dir === 'right' && characterX < canvas.width - 90) {
        characterX += moveSpeed; // Mueve a la derecha
        direction = 'right'; // Cambiar dirección
    }

    // Actualizar la animación
    if (isMoving) {
        currentFrame++; // Aumentar el frame para la animación
        currentCharacterImage.src = sprites[selectedCharacter][currentFrame % sprites[selectedCharacter].length];
    }
}

// Función para verificar la proximidad a las bolsas
function checkProximity() {
    const plasticBagInRange = (characterX < plasticBagPosition.x + interactionRange && characterX + 90 > plasticBagPosition.x - interactionRange);
    const reusableBagInRange = (characterX < reusableBagPosition.x + interactionRange && characterX + 90 > reusableBagPosition.x - interactionRange);

    if (plasticBagInRange) {
        document.getElementById('options').style.display = 'block'; // Mostrar opción de plástico
        document.getElementById('options').children[0].style.display = 'block'; // Mostrar botón de plástico
        document.getElementById('options').children[1].style.display = 'none'; // Ocultar botón de reutilizable
    } else if (reusableBagInRange) {
        document.getElementById('options').style.display = 'block'; // Mostrar opción reutilizable
        document.getElementById('options').children[0].style.display = 'none'; // Ocultar botón de plástico
        document.getElementById('options').children[1].style.display = 'block'; // Mostrar botón de reutilizable
    } else {
        document.getElementById('options').style.display = 'none'; // Ocultar opciones si no está cerca
    }
}

// Función para manejar el teclado
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        isMoving = true; // Activar el movimiento
        moveCharacter('left');
    } else if (event.key === 'ArrowRight') {
        isMoving = true; // Activar el movimiento
        moveCharacter('right');
    }
});

// Detener el movimiento al soltar la tecla
document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        isMoving = false; // Desactivar el movimiento
    }
});

// Agregar eventos táctiles para dispositivos móviles
canvas.addEventListener('touchstart', (event) => {
    const touchX = event.touches[0].clientX; // Obtener la posición del toque
    if (touchX > canvas.width / 2) { // Si el toque es en la mitad derecha
        isMoving = true; // Activar el movimiento
        moveCharacter('right');
    } else { // Si el toque es en la mitad izquierda
        isMoving = true; // Activar el movimiento
        moveCharacter('left');
    }
});

canvas.addEventListener('touchend', () => {
    isMoving = false; // Detener el movimiento al soltar el toque
});

// Función para mostrar retroalimentación
function showFeedback(message) {
    const feedback = document.getElementById('feedback');
    feedback.innerText = message;
    feedback.style.display = 'block';

    setTimeout(() => {
        feedback.style.display = 'none';
        if (!hasAnsweredCorrectly) {
            document.getElementById('options').style.display = 'block'; // Mostrar opciones de nuevo si fue incorrecto
        }
    }, 3000);
}

// Función para mostrar el mensaje de felicitaciones
function showCongratulations() {
    const congratulations = document.createElement('div');
    congratulations.innerText = "¡Felicitaciones! Has ganado 100 puntos.";
    congratulations.style.position = "absolute";
    congratulations.style.top = "30%";
    congratulations.style.left = "50%";
    congratulations.style.transform = "translate(-50%, -50%)";
    congratulations.style.fontSize = "40px";
    congratulations.style.fontWeight = "bold";
    congratulations.style.color = "green";
    congratulations.style.backgroundColor = "white";
    congratulations.style.padding = "20px";
    congratulations.style.border = "2px solid black";
    congratulations.style.borderRadius = "10px";
    congratulations.style.zIndex = "100";
    document.body.appendChild(congratulations);

    setTimeout(() => {
        congratulations.remove();
        // Redirigir al siguiente nivel
        window.location.href = "nivel4.html"; 
    }, 3000); // El mensaje se muestra durante 3 segundos antes de redirigir
}

// Elegir opción
function chooseOption(option) {
    hasAnsweredCorrectly = false; // Reiniciar el estado de la respuesta correcta
    hasShownFeedback = false; // Reiniciar el feedback

    if (option === 1) {
        // Mostrar el feedback incorrecto
        isAnimating = true;
        document.getElementById('options').style.display = 'none';
        setTimeout(() => {
            showFeedback("¡Recuerda! Las bolsas de plástico desechables no son ecológicas. Prueba la otra opción.");
        }, 1000);
    } else if (option === 2) {
        // Mostrar el feedback correcto y sumar puntos
        if (!level3Completed) { // Asegúrate de que solo se sumen puntos una vez
            score += 100;
            localStorage.setItem('score', score); // Guardar la nueva puntuación
            localStorage.setItem('level3Completed', 'true'); // Marcar este nivel como completado
        }
        hasAnsweredCorrectly = true;
        document.getElementById('options').style.display = 'none'; // Ocultar las opciones
        setTimeout(() => {
            showFeedback("¡Perfecto! Usar bolsas reutilizables ayuda a reducir el desperdicio de plástico y protege el medio ambiente.");
            setTimeout(() => {
                showCongratulations(); // Mostrar mensaje de felicitaciones y redirigir al siguiente nivel
            }, 3000);
        }, 1000);
    }
}

// Iniciar el juego
draw();
