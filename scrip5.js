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
let characterX = 100;
let characterY = 370;

// Cargar los residuos
const items = [
    { src: 'cajadepizza.png', x: 250, y: 300, type: 'orgánico', width: 100, height: 80, recycled: false },
    { src: 'plastico1.png', x: 325, y: 320, type: 'plástico', width: 40, height: 70, recycled: false },
    { src: 'restodecarne1.png', x: 290, y: 360, type: 'orgánico', width: 40, height: 60, recycled: false },
    { src: 'vidrio1.png', x: 425, y: 340, type: 'vidrio', width: 40, height: 90, recycled: false },
    { src: 'vidrio2.png', x: 380, y: 290, type: 'vidrio', width: 50, height: 90, recycled: false },
    { src: 'latas.png', x: 470, y: 291, type: 'plástico', width: 70, height: 90, recycled: false },
    { src: 'periodico.png', x: 470, y: 370, type: 'papel', width: 80, height: 70, recycled: false },
    { src: 'restodecarne.png', x: 370, y: 380, type: 'orgánico', width: 40, height: 60, recycled: false }
];

// Cargar imágenes de los residuos
items.forEach(item => {
    item.image = new Image();
    item.image.src = item.src;
});

// Cargar imágenes de los botes
const bins = {
    blue: { closed: 'boteazul.png', open: 'boteazul1.png', type: 'papel', x: 20, y: 500 },
    green: { closed: 'boteverde.png', open: 'boteverde1.png', type: 'vidrio', x: 120, y: 500 },
    orange: { closed: 'botenaranja.png', open: 'botenaranja1.png', type: 'plástico', x: 600, y: 500 },
    red: { closed: 'boterojo.png', open: 'boterojo1.png', type: 'orgánico', x: 700, y: 500 }
};

// Variables de control
let selectedItem = null;
let offsetX, offsetY;
let itemsRecycled = 0; // Contador de objetos reciclados

// Mensaje inicial
const initialMessage = "¡Es momento de aprender a reciclar!";
showFeedback(initialMessage, true); // Mostrar mensaje inicial

// Dibujar el fondo, los residuos, y el personaje
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar el fondo
    const backgroundImage = new Image();
    backgroundImage.src = 'background4.png'; // Imagen de fondo
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // Dibujar el personaje
    ctx.drawImage(currentCharacterImage, characterX, characterY, 90, 150);

    // Dibujar residuos que no han sido reciclados
    items.forEach(item => {
        if (!item.recycled) {
            ctx.drawImage(item.image, item.x, item.y, item.width, item.height);
        }
    });

    // Dibujar botes
    for (let key in bins) {
        const bin = bins[key];
        const img = new Image();
        img.src = (selectedItem && selectedItem.type === bin.type) ? bin.open : bin.closed;
        ctx.drawImage(img, bin.x, bin.y, 100, 100);
    }

    requestAnimationFrame(draw);
}

// Seleccionar objeto (ratón y toque)
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('touchstart', handleTouchStart, { passive: true });

// Mover objeto seleccionado (ratón y toque)
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('touchmove', handleTouchMove, { passive: true });

// Soltar objeto (ratón y toque)
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('touchend', handleTouchEnd);

// Funciones para manejar el ratón
function handleMouseDown(e) {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;
    selectItem(mouseX, mouseY);
}

function handleMouseMove(e) {
    if (selectedItem) {
        selectedItem.x = e.offsetX - offsetX;
        selectedItem.y = e.offsetY - offsetY;
    }
}

function handleMouseUp() {
    if (selectedItem) {
        checkBin(selectedItem);
        selectedItem = null;
    }
}

// Funciones para manejar el toque en pantalla táctil
function handleTouchStart(e) {
    const touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
    const touchY = e.touches[0].clientY - canvas.getBoundingClientRect().top;
    selectItem(touchX, touchY);
}

function handleTouchMove(e) {
    if (selectedItem) {
        const touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
        const touchY = e.touches[0].clientY - canvas.getBoundingClientRect().top;
        selectedItem.x = touchX - offsetX;
        selectedItem.y = touchY - offsetY;
    }
}

function handleTouchEnd() {
    if (selectedItem) {
        checkBin(selectedItem);
        selectedItem = null;
    }
}

// Función para seleccionar el objeto (ratón y toque)
function selectItem(x, y) {
    items.forEach(item => {
        if (x > item.x && x < item.x + item.width && y > item.y && y < item.y + item.height) {
            selectedItem = item;
            offsetX = x - item.x;
            offsetY = y - item.y;
        }
    });
}

// Comprobar si el objeto está sobre un bote
function checkBin(item) {
    for (let key in bins) {
        const bin = bins[key];
        if (item.x < bin.x + 100 && item.x + item.width > bin.x && item.y < bin.y + 100 && item.y + item.height > bin.y) {
            // Si el tipo de residuo es correcto
            if (item.type === bin.type) {
                itemsRecycled++; // Incrementar contador de reciclados
                showFeedback("¡Muy bien! Separar los residuos facilita el reciclaje y reduce el impacto ambiental.");
                item.recycled = true; // Marcar el objeto como reciclado
                item.x = -100; // Mover el objeto fuera de la pantalla (simular desaparición)
                item.y = -100;

                // Comprobar si se han reciclado todos los objetos
                if (itemsRecycled === items.length) {
                    showCongratulations();
                }
            } else {
                showFeedback("¡Ojo! Mezclar todos los residuos dificulta el reciclaje. Elige otra opción.");
            }
        }
    }
}

// Mostrar retroalimentación
function showFeedback(message, isInitial = false) {
    const feedback = document.getElementById('feedback');
    feedback.innerText = message;
    feedback.style.display = 'block';

    if (!isInitial) {
        setTimeout(() => {
            feedback.style.display = 'none';
        }, 3000);
    } else {
        setTimeout(() => {
            feedback.style.display = 'none';
        }, 2000); // Mostrar solo por 2 segundos para el mensaje inicial
    }
}

// Mostrar mensaje de felicitaciones
function showCongratulations() {
    const congratulations = document.createElement('div');
    congratulations.innerText = "¡Nivel completo! ¡Felicitaciones!";
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
        window.location.href = "nivel5.html"; 
    }, 3000); // El mensaje se muestra durante 3 segundos antes de redirigir
}

// Iniciar el juego
draw();
