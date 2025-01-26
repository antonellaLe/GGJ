

class Juego {
    constructor() {
        this.app = new PIXI.Application({
            width: 800,
            height: 600,
            backgroundColor: 0x000000,
        });

        document.body.appendChild(this.app.view);
        this.agregarFondo();
        

        this.particleContainer = new PIXI.Container();
        this.app.stage.addChild(this.particleContainer);

        this.sonido = new Audio('./Assets/pulse_sound.mp3');

        this.agregarCursor();
        this.agregarUI();
        
        this.burbujas = [];
        this.burbujasR = [];

        this.cronometro = new Cronometro(this.app);
        this.cronometro.iniciar();

        this.contador = new Contador(this.app)


        // Burbujas
        //Cambiar a que se generen x
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * 800;
            const y = Math.random() * 600;
            const burbuja = new Burbuja(0x0000FF, x, y, this.particleContainer, this);
            this.burbujas.push(burbuja);
            const burbujaR = new Burbuja(0x8A2BE2, x, y, this.particleContainer, this);
            this.burbujas.push(burbujaR);
        }

        // Actualizar en cada frame
        this.app.ticker.add((delta) => this.actualizar(delta));


    }
   

    actualizar(delta) {
        this.burbujas.forEach(burbuja => burbuja.updateBubbles(delta));
        this.cronometro.actualizar(delta);

    }

    agregarFondo() {
        this.contenedorFondo = new PIXI.Container();
        this.textura = PIXI.Texture.from("Assets/fondo2.jpg");
        this.fondoSprite = new PIXI.TilingSprite(this.textura, this.app.view.width, this.app.view.height);
        this.contenedorFondo.addChild(this.fondoSprite);
        this.app.stage.addChild(this.contenedorFondo);
    }

    agregarCursor() {
        
        const textureM = PIXI.Texture.from('./Assets/componentes/puntero1.png');
        const mira = new PIXI.Sprite(textureM);
    
        mira.scale.set(0.7);
        mira.anchor.set(0.5);
        this.app.stage.addChild(mira);
    
        const initX = this.app.renderer.width / 2; 
        const initY = this.app.renderer.height; 
    
        this.app.view.addEventListener('mousemove', (event) => {
            const mouseX = event.clientX - this.app.view.offsetLeft;
            const mouseY = event.clientY - this.app.view.offsetTop;
    
            mira.x = mouseX;
            mira.y = mouseY;
    
        });
    }
    
  
    agregarUI(){
          
          const texture = PIXI.Texture.from('./Assets/componentes/f2.png');
          const sprite = new PIXI.Sprite(texture);
  
          sprite.x = 80;
          sprite.y = 60;
          sprite.scale.set(0.1);
          sprite.anchor.set(0.5);

          this.app.stage.addChild(sprite);
          //
          const textureT = PIXI.Texture.from('./Assets/componentes/f1.png');
          const timer = new PIXI.Sprite(textureT);
  
          timer.x = 400;
          timer.y = 60;
          timer.scale.set(0.15);
          timer.anchor.set(0.5);
  
          this.app.stage.addChild(timer);

          const textureS = PIXI.Texture.from('./Assets/componentes/f2.png');
          const sonido = new PIXI.Sprite(textureS);
  
          sonido.x = 725;
          sonido.y = 60;
          sonido.scale.set(0.1);
          sonido.anchor.set(0.5);
  
          this.app.stage.addChild(sonido);
    }

    condicionDeVictoria(){
        
    }
    condicionDeDerrota(){
        
    }

    


}


class Burbuja {
    constructor(color, x, y, container, juego, contador) {

       this.juego = juego; 
       this.container = container; 

        this.contador = contador;

        this.color = color;

        this.bubbleTexture = PIXI.Texture.from('./Assets/b1.png');

        this.bubbles = [];

        this.createBubble(x, y, color);
    }

    async animacion(bubble) {

        const atlasData = {
            frames: {
                b1: {
                    frame: { x: 0, y: 0, w: 128, h: 128 },
                    sourceSize: { w: 128, h: 128 },
                    spriteSourceSize: { x: 0, y: 0, w: 128, h: 128 }
                },
                b2: {
                    frame: { x: 128, y: 0, w: 128, h: 128 },
                    sourceSize: { w: 128, h: 128 },
                    spriteSourceSize: { x: 0, y: 0, w: 128, h: 128 }
                },
                b3: {
                    frame: { x: 256, y: 0, w: 128, h: 128 },
                    sourceSize: { w: 128, h: 128 },
                    spriteSourceSize: { x: 0, y: 0, w: 128, h: 128 }
                },
                b4: {
                    frame: { x: 384, y: 0, w: 128, h: 128 },
                    sourceSize: { w: 128, h: 128 },
                    spriteSourceSize: { x: 0, y: 0, w: 128, h: 128 }
                },
                b5: {
                    frame: { x: 512, y: 0, w: 128, h: 128 },
                    sourceSize: { w: 128, h: 128 },
                    spriteSourceSize: { x: 0, y: 0, w: 128, h: 128 }
                },
                b6: {
                    frame: { x: 640, y: 0, w: 128, h: 128 },
                    sourceSize: { w: 128, h: 128 },
                    spriteSourceSize: { x: 0, y: 0, w: 128, h: 128 }
                },
                b7: {
                    frame: { x: 768, y: 0, w: 128, h: 128 },
                    sourceSize: { w: 128, h: 128 },
                    spriteSourceSize: { x: 0, y: 0, w: 128, h: 128 }
                }
            },

            meta: {
                image: './Assets/explosion.png',
                format: 'RGBA8888',
                size: { w: 896, h: 198 },
                scale: 1
            },
            animations: {
                burbujaA: ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7']
            }
        };

        const spritesheet = new PIXI.Spritesheet(
            PIXI.Texture.from(atlasData.meta.image),
            atlasData
        );

        await new Promise((resolve) => spritesheet.parse(resolve));

        const anim = new PIXI.AnimatedSprite(spritesheet.animations.burbujaA);


        anim.animationSpeed = 0.6;
        anim.loop = false;


        const globalPosition = bubble.getGlobalPosition();


        anim.x = globalPosition.x - bubble.width / 2;
        anim.y = globalPosition.y - bubble.height / 2;

        anim.scale = bubble.scale;
        anim.alpha = bubble.alpha;

        anim.play();

        anim.onComplete = () => {
            this.container.removeChild(anim);
            anim.destroy();
        };

        this.container.addChild(anim);
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
        bubble.scale.set(Math.random() * 0.25 + 0.5);


        // Agregar al contenedor
        bubble.zIndex = 10;
        this.container.addChild(bubble);
        this.bubbles.push(bubble); // Agregar la burbuja al array de burbujas

        // Interacción con el mouse
        bubble.interactive = true;
        bubble.buttonMode = true;

        bubble.on('pointerdown', () => {
            this.juego.sonido.play(); 
            
            this.eliminarBurbuja(bubble);
            this.animacion(bubble);
        });

    }

    eliminarBurbuja(bubble) {
        this.explosionEnCurso = true;
        //this.animacionExplosion();

        //Puntaje no funciona
        juego.contador.actualizar();
        //console.log('suma uno')

        this.container.removeChild(bubble);
        const index = this.bubbles.indexOf(bubble); // Eliminar del array
        if (index > -1) {
            this.bubbles.splice(index, 1);
        }



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
            fontSize: 32,
            fill:  0x00CED1,
            align: 'center',
        });
        this.texto.anchor.set(0.5);
        this.texto.x = this.app.renderer.width / 2;
        this.texto.y = 60;
        this.app.stage.addChild(this.texto);
    }

    actualizar(delta) {
        if (this.tiempoRestante > 0) {
            this.tiempoRestante -= delta / 60;
            const minutos = Math.floor(this.tiempoRestante / 60);
            const segundos = Math.floor(this.tiempoRestante % 60);
            this.texto.text = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
        } else {
            this.texto.text = "¡ Tiempo!";
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
        this.crearTexto();
    }

    crearTexto() {
        this.texto = new PIXI.Text(this.puntaje.toString(), {
            fontFamily: 'Arial',
            fontSize: 32,
            fill: 0x00CED1, // blanco
            align: 'center',
        });
        this.texto.anchor.set(0.5);
        this.texto.x = 75;
        this.texto.y = 60;
        this.app.stage.addChild(this.texto);
    }

    actualizar() {
        this.puntaje += 1;
        this.texto.text = this.puntaje.toString();
    }
}


const juego = new Juego();

