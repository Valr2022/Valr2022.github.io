const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Recuperar la puntuación del nivel anterior o inicializarla si no existe
let score = parseInt(localStorage.getItem('score')) || 0;
let level2Completed = localStorage.getItem('level2Completed') === 'true'; // Verifica si ya completó este nivel
document.getElementById('scoreDisplay').innerText = `Puntuación: ${score}`;

// Recuperar el personaje seleccionado del nivel anterior
const selectedCharacter = localStorage.getItem('selectedCharacter') || 'female';

// Definir los sprites del personaje
const sprites = {
    female: ['Imagen1izquierda.png', 'Imagen2izquierda.png', 'Imagen3izquierda.png', 'Imagen4izquierda.png', 'Imagen5izquierda.png'],
    male: ['posesmasculino1izquierda.png', 'posesmasculino2izquierda.png', 'posesmasculino3izquierda.png', 'posesmasculino4izquierda.png', 'posesmasculino5izquierda.png']
};

let currentCharacterImage = new Image();
currentCharacterImage.src = sprites[selectedCharacter][0];
let characterX = 400;
let characterY = 350;

// Cargar los frames de la lavadora caliente
let hotWasherImages = [];
for (let i = 1; i <= 8; i++) {
    let img = new Image();
    img.src = `lavadoracaliente${i}.png`;
    hotWasherImages.push(img);
}

// Cargar los frames de la lavadora fría
let coldWasherImages = [];
for (let i = 1; i <= 6; i++) {
    let img = new Image();
    img.src = `lavadorafria${i}.png`;
    coldWasherImages.push(img);
}

// Agregar la imagen final para la lavadora fría
let finalColdWasherImage = new Image();
finalColdWasherImage.src = 'lavadorafria5.png'; // La imagen final que se mostrará

// Agregar la imagen final para la lavadora caliente
let finalHotWasherImage = new Image();
finalHotWasherImage.src = 'lavadoracaliente8.png'; // La imagen final que se mostrará

let currentFrame = 0;
let frameCounter = 0;
let isAnimating = false;
let animationSpeed = 10;
let hasShownFeedback = false; // Controla si ya se ha mostrado el feedback
let hasAnsweredCorrectly = false; // Controla si ya se ha respondido correctamente

// Posición de la lavadora
let washerPosX = 190;
let washerPosY = 450;

// Variable para controlar qué tipo de animación mostrar
let isColdAnimation = false;

// Dibujar el fondo, el personaje y la lavadora
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar el personaje
    ctx.drawImage(currentCharacterImage, characterX, characterY, 100, 150);

    // Dibujar la lavadora
    if (isAnimating && !hasShownFeedback) { // Solo animar si no se ha mostrado el feedback
        const currentWasherImages = isColdAnimation ? coldWasherImages : hotWasherImages; // Selecciona el conjunto de imágenes según el tipo de animación
        if (currentFrame < currentWasherImages.length - 1) {
            ctx.drawImage(currentWasherImages[currentFrame], washerPosX, washerPosY, 150, 150);
            if (frameCounter % animationSpeed === 0) {
                currentFrame++;
            }
            frameCounter++;
        } else {
            const finalImage = isColdAnimation ? finalColdWasherImage : finalHotWasherImage;
            ctx.drawImage(finalImage, washerPosX, washerPosY, 150, 150); // Mostrar la imagen final correspondiente
            setTimeout(() => {
                showFeedback(isColdAnimation ? "¡Excelente! Usar agua fría ahorra energía." : "¡Casi! Los ciclos de agua caliente consumen más energía. Elige otra opción.");
            }, 1000);
            hasShownFeedback = true; // Evitar que el mensaje se muestre varias veces
            stopAnimation(); // Detener la animación después de mostrar el feedback
        }
    } else {
        ctx.drawImage(hotWasherImages[0], washerPosX, washerPosY, 150, 150); // Mostrar la lavadora en estado inicial
    }

    requestAnimationFrame(draw);
}

// Función para detener la animación
function stopAnimation() {
    isAnimating = false; // Detener la animación cuando el feedback ha sido mostrado
    currentFrame = isColdAnimation ? coldWasherImages.length - 1 : hotWasherImages.length - 1; // Mantener la última imagen del tipo correspondiente
}

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

// Función para mostrar el mensaje de felicitaciones y redirigir
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
        window.location.href = "nivel3.html"; 
    }, 3000); // El mensaje se muestra durante 3 segundos antes de redirigir
}

// Elegir opción
function chooseOption(option) {
    hasAnsweredCorrectly = false; // Reiniciar el estado de la respuesta correcta
    hasShownFeedback = false; // Reiniciar el feedback

    if (option === 1) {
        // Si se elige la opción incorrecta, mostrar el feedback de error
        isAnimating = true;
        isColdAnimation = false; // Asegúrate de que está configurado para la lavadora caliente
        document.getElementById('options').style.display = 'none'; // Ocultar las opciones
        currentFrame = 0; // Reiniciar el frame para la animación
    } else if (option === 2) {
        // Si es correcto, sumar puntos y mostrar feedback correcto
        if (!level2Completed) { // Asegúrate de que solo se sumen puntos una vez
            score += 100;
            localStorage.setItem('score', score); // Guardar la nueva puntuación
            localStorage.setItem('level2Completed', 'true'); // Marcar este nivel como completado
        }
        isColdAnimation = true; // Cambiar a la animación de la lavadora fría
        isAnimating = true; // Iniciar la animación de la lavadora fría
        document.getElementById('options').style.display = 'none'; // Ocultar las opciones
        currentFrame = 0; // Reiniciar el frame para la animación
        hasAnsweredCorrectly = true; // Marcar que se ha respondido correctamente
        setTimeout(showCongratulations, 3000); // Esperar antes de mostrar la felicitación
    }
}

// Iniciar el juego
draw();
