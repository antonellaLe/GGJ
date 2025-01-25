class Juego {
    constructor() {
        this.app = new PIXI.Application({
            width: 800,
            height: 600,
            backgroundColor: 0x000000,  
        });

        document.body.appendChild(this.app.view);

        this.particleContainer = new PIXI.Container();
        this.app.stage.addChild(this.particleContainer);
   
        this.burbujas = [];
        this.burbujasR = [];

        this.cronometro = new Cronometro(this.app);
        this.cronometro.iniciar();

        this.contador = new Contador(this.app);
        this.contador.crearTexto();


        // Burbujas
        //Cambiar a que se generen x
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * 800; 
            const y = Math.random() * 600; 
            const burbuja = new Burbuja(0x0000FF, x, y, this.particleContainer);
            this.burbujas.push(burbuja);
            const burbujaR = new Burbuja( 0x8A2BE2, x, y, this.particleContainer); 
            this.burbujas.push(burbujaR);
        }

        // Actualizar en cada frame
        this.app.ticker.add((delta) => this.actualizar(delta));
    }

    actualizar(delta) {
        this.burbujas.forEach(burbuja => burbuja.updateBubbles(delta));
        this.cronometro.actualizar(delta);
    }

    
}


class Burbuja {
    constructor(color, x, y, container, juego, contador) {
        
        this.container = container;
        
        this.juego = juego;

        this.contador = contador;

        this.color = color;

        this.bubbleTexture = PIXI.Texture.from('./assets/b1.png');

        this.colorMatrix = new PIXI.filters.ColorMatrixFilter();

        this.bubbles = [];

        this.createBubble(x, y, color); 
    }

    createBubble(x, y, color) {
        const bubble = new PIXI.Sprite(this.bubbleTexture);
        bubble.anchor.set(0.5);

        bubble.x = x || 300; 
        bubble.y = y || 600; 

        // Velocidades iniciales aleatorias
        const angle = Math.random() * Math.PI * 2; // Ángulo aleatorio
        bubble.vx = Math.cos(angle) * (Math.random() * 0.5 + 1); // Movimiento horizontal
        bubble.vy = -Math.abs(Math.sin(angle) * (Math.random() * 2 + 1)); // Movimiento hacia arriba

        // Oscilación independiente
        bubble.oscillation = Math.random() * 2; // Amplitud de oscilación
        bubble.phase = Math.random() * Math.PI * 2; // Fase inicial para la oscilación

        // Transparencia y escala aleatorias
        bubble.alpha = Math.random() * 0.5 + 0.5;
        bubble.scale.set(Math.random() * 0.5 + 0.5);

        // Aplicar filtro de color
        bubble.filters = [this.colorMatrix];
        this.colorMatrix.tint(color); // Color azul0x0000FF

        // Agregar al contenedor
        this.container.addChild(bubble);
        this.bubbles.push(bubble); // Agregar la burbuja al array de burbujas

        // Interacción con el mouse
        bubble.interactive = true;
        bubble.buttonMode = true;

        bubble.on('pointerdown', () => {
            this.eliminarBurbuja(bubble); 
        });
        
    }

    eliminarBurbuja(bubble) {
        this.container.removeChild(bubble); 
        const index = this.bubbles.indexOf(bubble); // Eliminar del array
        if (index > -1) {
            this.bubbles.splice(index, 1);
        }

        //Puntaje no funciona
        this.contador.actualizar();
        console.log('suma uno')
    }

    updateBubbles(delta) {
        for (const bubble of this.bubbles) {
            bubble.x += bubble.vx * delta; // Movimiento horizontal
            bubble.y += bubble.vy * delta; // Movimiento vertical
            bubble.x += Math.sin(bubble.phase) * bubble.oscillation; // Oscilación lateral
            bubble.phase += 0.05 * delta; // Actualizar fase para oscilación

            // Bordes laterales
            if (bubble.x < 0 || bubble.x > 800) { 
                bubble.vx *= -1; 
            }

            // Bordes superior e inferior
            if (bubble.y < 0) {
                bubble.vy *= -0.8; 
                bubble.y = 0;
            }
            if (bubble.y > 600) { 
                bubble.vy *= -0.8; 
                bubble.y = 600;
            }
        }
    }
}

class Cronometro {
    constructor(app) {
        this.app = app;
        this.tiempoTotal = 60; 
        this.texto = null;
        this.tiempoRestante = this.tiempoTotal;

        this.crearTexto();
    }

    crearTexto() {
        this.texto = new PIXI.Text(`01:00`, {
            fontFamily: 'Arial',
            fontSize: 36,
            fill: 0xffffff,
            align: 'center',
        });
        this.texto.anchor.set(0.5);
        this.texto.x = this.app.renderer.width / 2;
        this.texto.y = 50;
        this.app.stage.addChild(this.texto);
    }

    actualizar(delta) {
        if (this.tiempoRestante > 0) {
            this.tiempoRestante -= delta / 60; 
            const minutos = Math.floor(this.tiempoRestante / 60);
            const segundos = Math.floor(this.tiempoRestante % 60);
            this.texto.text = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
        } else {
            this.texto.text = "¡Termino el tiempo!";
        }
    }

    iniciar() {
        this.tiempoRestante = this.tiempoTotal; 
    }
}

class Contador {
    constructor(app) {
        this.app = app; 
        this.texto = null; 
        this.puntaje = 0; 
    }

    crearTexto() {
        this.texto = new PIXI.Text(this.puntaje.toString(), {
            fontFamily: 'Arial',
            fontSize: 32,
            fill: 0xffffff, // blanco
            align: 'center',
        });
        this.texto.anchor.set(0.5);
        this.texto.x = 100; 
        this.texto.y = 50;  
        this.app.stage.addChild(this.texto);
    }

    actualizar() {
        this.puntaje += 1; 
        this.texto.text = this.puntaje.toString(); 
    }
}

class Player{ //Puntos- mouse- etc

}

// Crear una instancia del juego
const juego = new Juego();
