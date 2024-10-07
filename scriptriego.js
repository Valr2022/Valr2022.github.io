const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0; // Variable para la puntuación
let hasAnsweredCorrectly = false; // Controla si ya se ha respondido correctamente
let hasShownFeedback = false; // Controla si ya se ha mostrado el feedback de la manguera

// Recuperar el personaje seleccionado del localStorage
const selectedCharacter = localStorage.getItem('selectedCharacter') || 'female';

// Definir los sprites de los personajes
const sprites = {
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
};

// Inicializar la imagen del personaje seleccionado
let currentCharacterImage = new Image();
currentCharacterImage.src = sprites[selectedCharacter][0];

let characterX = 400;
let characterY = 390;

// Cargar los frames de la manguera
let hoseImages = [];
for (let i = 1; i <= 8; i++) {
    let img = new Image();
    img.src = `grifo${i}.png`;
    hoseImages.push(img);
}

// Cargar los frames del sistema de riego por goteo
let goteoImages = [];
for (let i = 1; i <= 10; i++) {
    let img = new Image();
    img.src = `goteo${i}.png`;
    goteoImages.push(img);
}

// Cargar la imagen final para la manguera y el riego por goteo
let hoseFinalImage = new Image();
hoseFinalImage.src = 'ultimogrifo.png';

let currentFrame = 0;
let frameCounter = 0;
let isWaterOn = false;
let animationSpeed = 10;
let selectedAnimation = 'none';

// Posiciones para la manguera y riego por goteo
let hosePosXLeft = 100;
let hosePosXRight = 550;
let hosePosY = 450;
let goteoPosXLeft = 1;
let goteoPosXRight = 660;
let goteoPosY = 451;

// Dibujar el fondo, el personaje y la animación seleccionada
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Mostrar la puntuación
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Puntuación: " + score, 20, 30); // Mostrar la puntuación en la parte superior izquierda

    // Dibujar el personaje
    ctx.drawImage(currentCharacterImage, characterX, characterY, 100, 150);

    // Ejecutar la animación seleccionada
    if (selectedAnimation === 'hose') {
        drawHoseAnimation();
    } else if (selectedAnimation === 'goteo') {
        drawGoteoAnimation();
    }

    requestAnimationFrame(draw);
}

// Función para dibujar la animación de la manguera en ambos lados
function drawHoseAnimation() {
    if (isWaterOn) {
        if (currentFrame < hoseImages.length - 1) {
            ctx.drawImage(hoseImages[currentFrame], hosePosXLeft, hosePosY, 150, 150);
            drawMirroredImage(hoseImages[currentFrame], hosePosXRight, hosePosY, 150, 150);
            if (frameCounter % animationSpeed === 0) {
                currentFrame++;
            }
            frameCounter++;
        } else {
            ctx.drawImage(hoseFinalImage, hosePosXLeft, hosePosY, 150, 150);
            drawMirroredImage(hoseFinalImage, hosePosXRight, hosePosY, 150, 150);

            // Mostrar retroalimentación solo una vez
            if (!hasShownFeedback) {
                setTimeout(() => {
                    showFeedback("¡Ojo! Dejar la llave abierta desperdicia mucha agua. Prueba otra opción.");
                    hasShownFeedback = true; // Evitar mostrar el mensaje múltiples veces
                }, 1000);
            }
        }
    } else {
        ctx.drawImage(hoseImages[0], hosePosXLeft, hosePosY, 150, 150);
        drawMirroredImage(hoseImages[0], hosePosXRight, hosePosY, 150, 150);
    }
}

// Función para dibujar la animación del riego por goteo en ambos lados
function drawGoteoAnimation() {
    if (isWaterOn) {
        if (currentFrame < goteoImages.length - 1) {
            ctx.drawImage(goteoImages[currentFrame], goteoPosXLeft, goteoPosY, 150, 150);
            drawMirroredImage(goteoImages[currentFrame], goteoPosXRight, goteoPosY, 150, 150);
            if (frameCounter % animationSpeed === 0) {
                currentFrame++;
            }
            frameCounter++;
        } else {
            ctx.drawImage(goteoImages[goteoImages.length - 1], goteoPosXLeft, goteoPosY, 150, 150);
            drawMirroredImage(goteoImages[goteoImages.length - 1], goteoPosXRight, goteoPosY, 150, 150);
            if (!hasAnsweredCorrectly) {
                score += 100;  // Sumar 100 puntos solo una vez
                hasAnsweredCorrectly = true;
                showCongratulations(); // Mostrar el mensaje de felicitaciones
            }
            setTimeout(() => {
                showFeedback("¡Perfecto! Usar un sistema de riego por goteo ahorra agua.");
            }, 1000);
        }
    } else {
        ctx.drawImage(goteoImages[0], goteoPosXLeft, goteoPosY, 150, 150);
        drawMirroredImage(goteoImages[0], goteoPosXRight, goteoPosY, 150, 150);
    }
}

// Función para dibujar imágenes espejadas (invertidas horizontalmente) en el lado derecho
function drawMirroredImage(image, x, y, width, height) {
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(image, -x - width, y, width, height);
    ctx.restore();
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
        // Redirigir al Nivel 2
        window.location.href = "nivel2.html"; 
    }, 3000); // El mensaje se muestra durante 3 segundos antes de redirigir
}

// Elegir opción de riego
function chooseOption(option) {
    hasAnsweredCorrectly = false; // Reiniciar el estado de la respuesta correcta
    hasShownFeedback = false; // Reiniciar para permitir mostrar feedback nuevamente en futuras respuestas incorrectas

    if (option === 1) {
        selectedAnimation = 'hose';
        isWaterOn = true;
        document.getElementById('options').style.display = 'none';
    } else if (option === 2) {
        selectedAnimation = 'goteo';
        isWaterOn = true;
        document.getElementById('options').style.display = 'none';
    }
}

// Iniciar el juego
draw();
