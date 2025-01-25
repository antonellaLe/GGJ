/*class Burbuja{
    constructor(x, y, juego){
        //Por ahora todo esta en el mismo contenedor
        this.x = x;
        this.y = y;
        this.juego = juego;
        
        const bubbleTexture = PIXI.Texture.from('./assets/bubble_4.png'); 
        const colorMatrix = new PIXI.filters.ColorMatrixFilter();

        this.crearBurbujas()
    }




createBubble() {
    const bubble = new PIXI.Sprite(bubbleTexture);
    bubble.anchor.set(0.5);

    // Generar burbujas desde un punto fijo
    bubble.x = 300; // X fija
    bubble.y = 600; // Y fija fuera de la pantalla, en la parte inferior

    // Velocidades iniciales aleatorias
    const angle = Math.random() * Math.PI * 2; // Ángulo aleatorio
    bubble.vx = Math.cos(angle) * (Math.random() * 0.5 + 1); // Movimiento horizontal
    bubble.vy = -Math.abs(Math.sin(angle) * (Math.random() * 2 + 1)); // Movimiento hacia arriba

    // Oscilación independiente
    bubble.oscillation = Math.random() * 2; // Amplitud de oscilación
    bubble.phase = Math.random() * Math.PI * 2; // Fase inicial para la oscilación

    // 
    bubble.alpha = Math.random() * 0.5 + 0.5; // Transparencia aleatoria
    bubble.scale.set(Math.random() * 0.5 + 0.5); // Tamaño aleatorio

     // Filtro y color
     bubble.filters = [colorMatrix];
     colorMatrix.tint(0x0000FF); // Rojo

    // Agregar al contenedor
    particleContainer.addChild(bubble);
    bubbles.push(bubble);

    // Interaccion con el mouse
    bubble.interactive = true;
    bubble.buttonMode = true;

    // Mouse - Click para eliminar la burbuja al hacer clic
    bubble.on('pointerdown', () => {
        particleContainer.removeChild(bubble); // Eliminar del contenedor
        const index = bubbles.indexOf(bubble); // Eliminar del array
        if (index > -1) {
            bubbles.splice(index, 1);
        }
    });
}

updateBubbles(delta) {
    for (const bubble of bubbles) {
        // Movimiento de las burbujas
        bubble.x += bubble.vx * delta; // Movimiento horizontal
        bubble.y += bubble.vy * delta; // Movimiento vertical
        bubble.x += Math.sin(bubble.phase) * bubble.oscillation; // Oscilación lateral
        bubble.phase += 0.05; // Actualizar fase para oscilación

        //  bordes laterales
        if (bubble.x < 0 || bubble.x > 800) { // Es el ancho
            bubble.vx *= -1; // Invertir dirección horizontal
        }

       //  borde inferior 
       if (bubble.y > 600) { //Es el alto
        bubble.vy *= -0.8;
        bubble.y = 800; //Ancho 
        }

        // borde superior 
        if (bubble.y < 0) {
            bubble.vy *= -0.8; 
            bubble.y = 0; 
        }
    }
}

crearBurbujas(){
for (let i = 0; i < 100; i++) {
    createBubble();
}}

}*/
