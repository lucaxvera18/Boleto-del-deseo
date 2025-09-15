document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.querySelector('.main-container');
    const printerBody = document.querySelector('.printer-body-pp');
    const lever = document.querySelector('.lever');
    const greenLight = document.querySelector('.green-light');
    const redLight = document.querySelector('.red-light');
    const buttonSet = document.querySelector('.button-set');
    const printerRollers = document.querySelector('.printer-rollers');
    const ticket = document.querySelector('.ticket-pp');
    const ticketDate = document.getElementById('ticket-date');

    const printerStartSound = document.getElementById('printerStartSound');
    const printerPrintSound = document.getElementById('printerPrintSound');
    const printerCutSound = document.getElementById('printerCutSound');

    let isPrinting = false;

    // Función para obtener la fecha actual en formato "OCT 2023"
    const getFormattedDate = () => {
        const date = new Date();
        const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
        const year = date.getFullYear();
        return `${month} ${year}`;
    };

    // Inicializar la fecha
    ticketDate.textContent = getFormattedDate();

    // Estado inicial de las luces
    greenLight.classList.add('on');
    redLight.classList.remove('on');


    const activatePrinter = async () => {
        if (isPrinting) return; // Evita múltiples impresiones
        isPrinting = true;

        // 1. Efectos iniciales (luces, palanca, sonido de inicio)
        redLight.classList.add('on');
        greenLight.classList.remove('on');
        lever.classList.add('active');
        buttonSet.querySelectorAll('.button-pp').forEach(btn => btn.classList.add('active'));
        
        if (printerStartSound) {
            printerStartSound.currentTime = 0;
            printerStartSound.play().catch(e => console.log("Error playing printer start sound:", e));
        }

        // Simula la pulsación de botones
        await new Promise(resolve => setTimeout(() => {
            buttonSet.querySelectorAll('.button-pp').forEach(btn => btn.classList.remove('active'));
            resolve();
        }, 300));

        // 2. Sonido y animación de impresión
        await new Promise(resolve => setTimeout(async () => {
            if (printerPrintSound) {
                printerPrintSound.currentTime = 0;
                printerPrintSound.loop = true; // El sonido de impresión se repite
                printerPrintSound.play().catch(e => console.log("Error playing printer print sound:", e));
            }
            printerRollers.classList.add('active'); // Activa la animación de los rodillos
            ticket.style.transition = 'none'; // Deshabilita la transición inicial
            ticket.style.clipPath = 'inset(100% 0 0 0)'; // Asegura que esté oculto
            ticket.classList.remove('printed'); // Reinicia la clase
            
            // Pequeña vibración de la impresora
            printerBody.style.animation = 'printer-vibrate 0.1s infinite';

            await new Promise(resolve => setTimeout(resolve, 50)); // Pequeño retraso antes de empezar a mostrar
            
            ticket.style.transition = 'clip-path 1.5s ease-out'; // Reactiva la transición para la impresión
            ticket.classList.add('printed'); // Inicia la animación de salida
            resolve();
        }, 500)); // Retraso para el sonido de inicio y palanca

        // 3. Esperar a que el boleto salga completamente + sonido de corte
        await new Promise(resolve => setTimeout(async () => {
            if (printerPrintSound) printerPrintSound.pause(); // Detiene el sonido de impresión
            printerRollers.classList.remove('active'); // Desactiva los rodillos
            printerBody.style.animation = 'none'; // Detiene la vibración
            
            if (printerCutSound) {
                printerCutSound.currentTime = 0;
                printerCutSound.play().catch(e => console.log("Error playing printer cut sound:", e));
            }

            await new Promise(resolve => setTimeout(resolve, 300)); // Sonido de corte
            
            // Animación final del boleto
            ticket.style.animation = 'ticket-slide-down 0.5s ease-out forwards';
            resolve();
        }, 1500)); // Duración de la animación de clip-path (1.5s)

        // 4. Resetear la impresora (luces, palanca)
        await new Promise(resolve => setTimeout(() => {
            lever.classList.remove('active');
            redLight.classList.remove('on');
            greenLight.classList.add('on');
            isPrinting = false; // Permite una nueva impresión
            resolve();
        }, 500)); // Retraso final
    };

    // Event Listeners para activar la impresión
    mainContainer.addEventListener('click', activatePrinter);
    mainContainer.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Previene el zoom en móviles
        activatePrinter();
    });

    // Añadir animación de vibración de la impresora
    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(`
        @keyframes printer-vibrate {
            0% { transform: translate(1px, 1px); }
            25% { transform: translate(-1px, -1px); }
            50% { transform: translate(1px, -1px); }
            75% { transform: translate(-1px, 1px); }
            100% { transform: translate(1px, 1px); }
        }
    `, styleSheet.cssRules.length);
});
