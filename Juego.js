

class Juego {
    constructor() {
        this.juegoIniciado = false;
        this.app = new PIXI.Application({
            width: 800,
            height: 600,
            backgroundColor: 0x000000,
        });

        document.body.appendChild(this.app.view);
       
        this.particleContainer = new PIXI.Container();

        this.musica = new Audio('./Assets/thunderbird-game-over-9232.mp3');

        this.sonido = new Audio('./Assets/pulse_sound.mp3');

        this.inicio = new Inicio(this.app);

        this.inicio.mostrar();

    }

    cargar(){
        this.agregarFondo();
       
        this.app.stage.addChild(this.particleContainer);
        
        this.agregarUI();
        this.agregarMusica();

        this.burbujas = [];
        this.burbujasR = [];

        this.cronometro = new Cronometro(this.app);

        this.cronometro.iniciar();

        this.contador = new Contador(this.app)
        
        this.agregarCursor();

        this.agregarBurbujasCada(100,500);

        this.agregarBurbujasCada(50,25000);

        this.agregarBurbujasCada(50,35000);
 
        this.iniciarEventos();

        this.app.ticker.add((delta) => this.actualizar(delta));
    }

    agregarBurbujasCada(cant, tiempo) {
        setTimeout(() => {
            for (let i = 0; i < cant; i++) {
                const x = Math.random() * 800; 
                const y = Math.random() * 600; 
                const burbuja = new Burbuja(0x0000FF, x, y, this.particleContainer, this); 
                this.burbujas.push(burbuja); 
            }
        }, tiempo);
    }
    

    actualizar(delta) {
        this.burbujas.forEach(burbuja => burbuja.updateBubbles(delta));
        this.cronometro.actualizar(delta);
        this.condicionDeVictoria(delta);
        this.condicionDeDerrota(delta);
    }

    agregarFondo() {
        this.contenedorFondo = new PIXI.Container();
        this.textura = PIXI.Texture.from("Assets/fondo2.jpg");
        this.fondoSprite = new PIXI.Sprite(this.textura, this.app.view.width, this.app.view.height);
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


    agregarUI() {
        this.agregarImagen('./Assets/componentes/f2.png', 75, 60, 0.1)
  
        this.agregarImagen('./Assets/componentes/f1.png', 400, 60, 0.15)
  
        this.agregarImagen('./Assets/componentes/f2.png', 725, 60, 0.1)

        //this.agregarImagen('./Assets/componentes/f4.png', 90, 550, 0.1)

        //this.agregarImagen('./Assets/componentes/f5.png', 710, 550, 0.1)

    }

    agregarImagen(ruta, x, y, scaleN) {
        const texture = PIXI.Texture.from(ruta);
        const sprite = new PIXI.Sprite(texture); 
    
        sprite.x = x;
        sprite.y = y;
        sprite.scale.set(scaleN);
        sprite.anchor.set(0.5);
    
        this.app.stage.addChild(sprite);
    }
    

   agregarMusica(){
        //icono (cambiar icono)
        const textureI = PIXI.Texture.from('./Assets/componentes/audio.png');
        const icono = new PIXI.Sprite(textureI);

        icono.x = 725;
        icono.y = 60;
        icono.scale.set(0.05);
        icono.anchor.set(0.5);

        icono.interactive = true; 
        icono.buttonMode = true;

        this.app.stage.addChild(icono);
        this.musica.play();
        this.musica.volume = 0.2;

        this.sonando = true;

        icono.on('pointerdown', () => {
            if(this.sonando){
                this.musica.pause();
                this.sonando = false;
            }else if (!this.sonando){
                this.musica.play();
                this.sonando = true;
            }
        });        
     
    }

    condicionDeVictoria() {
        if (!this.cronometro.tiempoAgotado
            && this.contador.puntaje === 200 ) {
            this.win.mostrar();
            this.app.ticker.stop();
            //this.reiniciar();
        }

    }

    condicionDeDerrota() {
        if (this.cronometro.tiempoAgotado
            && this.contador.puntaje !== 100) {
            this.gameOver.mostrar();
            this.app.ticker.stop();
            //this.reiniciar();
        }
    }

    iniciarEventos() {
        this.evento = new Evento(this.app,this.juego);
        this.win = new Win(this.app, this.juego);
        this.gameOver = new GameOver(this.app, this.juego);
    }

    reiniciar(){
        //this.burbujas.quitarBurbujas();
        this.cronometro.reiniciarTiempo();
        this.cargar();
        this.evento.quitar();
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

        anim.x = globalPosition.x;
        anim.y = globalPosition.y;


        anim.anchor.set(0.5);

        anim.rotation = Math.PI / Math.random();        

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
        bubble.vy = -Math.abs(Math.sin(angle) * (Math.random() * 1 + 1)); // Movimiento hacia arriba

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
        juego.contador.actualizar();

        this.container.removeChild(bubble);
        const index = this.bubbles.indexOf(bubble); // Eliminar del array
        if (index > -1) {
            this.bubbles.splice(index, 1);
        }

    }

    updateBubbles(delta) {
        let margen = 30;
        let limiteDerecho = 800 - margen;
        let limiteIzquierdo = margen;
        let limiteArriba = margen;
        let limiteAbajo = 600 - margen;


        for (const bubble of this.bubbles) {
            bubble.x += bubble.vx * delta; // Movimiento horizontal
            bubble.y += bubble.vy * delta; // Movimiento vertical
            bubble.x += Math.sin(bubble.phase) * bubble.oscillation; // Oscilación lateral
            bubble.phase += 0.05 * delta; // Actualizar fase para oscilación

            // Bordes laterales
            if (bubble.x < limiteIzquierdo) {
                bubble.vx *= -1;
                bubble.x = limiteIzquierdo;
            }
            if (bubble.x > limiteDerecho) {
                bubble.vx *= -1;
                bubble.x = limiteDerecho;
            }

            // Bordes superior e inferior
            if (bubble.y < limiteArriba) {
                bubble.vy *= -0.8;
                bubble.y = limiteArriba;
            }
            if (bubble.y > limiteAbajo) {
                bubble.vy *= -0.8;
                bubble.y = limiteAbajo;
            }
        }
    }

    quitarBurbujas(){
        this.burbujas.forEach((burbuja) => {
            burbuja.sprite.destroy(); 
        });
        this.burbujas = []; 

    }

}

class Cronometro {
    constructor(app) {
        this.app = app;
        this.tiempoTotal = 60;
        this.texto = null;
        this.tiempoRestante = this.tiempoTotal;
        this.crearTexto();
        this.tiempoAgotado = false
    }
    reiniciarTiempo(){
        this.tiempoTotal = 60;
    }

    crearTexto() {
        this.texto = new PIXI.Text(`01:00`, {
            fontFamily: 'Arial',
            fontSize: 32,
            fill: 0x00CED1,
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
            this.tiempoAgotado = true
        }
    }

    iniciar() {
        if (this.juegoIniciado === true) {
            this.tiempoRestante = this.tiempoTotal;
        }
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
        this.texto.x = 70;
        this.texto.y = 60;
        this.app.stage.addChild(this.texto);
    }

    actualizar() {
        this.puntaje += 1;
        this.texto.text = this.puntaje.toString();
    }

}

class Evento {
    constructor(app, juego) {
        this.app = app;
        this.juego = juego

        this.mensajeMostrado = false;
        this.eventoTexto = null;

        this.textoPixi = null;
       

    }

    crearTexto(texto, color) {
        const estiloTexto = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 80,
            fill: color,
            align: 'center'
        });
        const textoPixi = new PIXI.Text(texto, estiloTexto);

        this.textoPixi = textoPixi;
        return textoPixi;
    }

    mostrar() {
        if (!this.mensajeMostrado) {
            

            this.app.stage.addChild(this.textoPixi);

            this.textoPixi.visible = true;

            this.mensajeMostrado = true;

            this.app.ticker.add(() => {
                this.actualizarPosicion();
                this.crearPlaca();
            })
        }
    }

    quitar() {
        this.app.stage.removeChild(this.textoPixi);
        this.app.stage.removeChild(this.placa);
        this.mensajeMostrado = false;
    }

    actualizarPosicion() {
        this.textoPixi.anchor.set(0.5, 0.5);

        this.textoPixi.x = this.app.view.width / 2;
        this.textoPixi.y = this.app.view.height / 2;
    }

    crearPlaca() {
        const textureP = PIXI.Texture.from('./Assets/componentes/f4.png');
        this.placa = new PIXI.Sprite(textureP);

        this.placa.x = 350;
        this.placa.y = 250;
        this.placa.scale.set(2);
        this.placa.anchor.set(0.5, 0.5);

        //this.placa.alpha = 0.0001;
        //this.placa.zIndex

        this.app.stage.addChild(this.placa);
    }

    /*actualizarPlaca() {
        this.placa.alpha = this.mensajeMostrado ? 1 : 0;

    }*/
}

class Win extends Evento {
    constructor(app, juego) {
        super(app, juego);
        
        this.crearTexto('WIN', 'aqua');
        
    }
}

class GameOver extends Evento {
    constructor(app, juego) {
        super(app, juego);

        this.crearTexto('GAME OVER', 'red');
    }
}

class Inicio extends Evento {
    constructor(app, juego) {
        super(app, juego);

        this.ini = PIXI.Texture.from("Assets/incio.png");
        this.intro = new PIXI.Sprite(this.ini, this.app.view.width, this.app.view.height);
        this.app.stage.addChild(this.intro);
        this.boton = this.botonStart();

    }
    botonStart() {
        const graphics = new PIXI.Graphics();

        graphics.beginFill(0xFF0000); 
        graphics.drawRect(192, 368, 377, 168);
        graphics.endFill();
        graphics.alpha = 0;  // Opacidad 0 (completamente invisible)

        graphics.interactive = true;
        graphics.buttonMode = true; // Esto cambia el cursor cuando pasa sobre el objeto

        graphics.on('pointerdown', () => {
            juego.juegoIniciado = true;
            this.quitar();
            juego.cargar();
            graphics.off('pointerdown'); 

        });


        this.app.stage.addChild(graphics);

    }

    mostrar() {
        if (!this.mensajeMostrado) {
            this.mensajeMostrado = true;
        }
    }

    quitar() {
        this.app.stage.removeChild(this.intro);
        //this.app.stage.removeChild(this.botonStart.graphics);
        this.mensajeMostrado = false;
    }


}

const juego = new Juego();

