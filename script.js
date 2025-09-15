document.addEventListener('DOMContentLoaded', () => {
    const printer = document.querySelector('.printer');
    const ticket = document.querySelector('.ticket');
    
    // Oculta el boleto al inicio
    ticket.style.display = 'none';

    // Función para activar la impresión
    const printTicket = () => {
        // Reproduce un sonido (opcional, necesitarías un archivo de audio)
        // const audio = new Audio('sonido_impresora.mp3');
        // audio.play();

        // Muestra el boleto con la animación
        ticket.style.display = 'flex';
        
        // Evita que la animación se dispare múltiples veces seguidas
        document.body.removeEventListener('click', printTicket);
        document.body.removeEventListener('touchstart', printTicket);
    };

    // Escucha el evento de clic o toque en el cuerpo de la página
    document.body.addEventListener('click', printTicket);
    document.body.addEventListener('touchstart', printTicket);
});
