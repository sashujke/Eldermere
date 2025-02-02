// (Configurazione)
const CONFIG = {
	STAGE: {
		ID: 'stage', // ID per l'elemento del palcoscenico
		WIDTH: 640, // Larghezza dello schermo
		HEIGHT: 480, // Altezza dello schermo
	},
	PLAYER: {
		PICWIDTH: 32, // Larghezza dell'immagine del giocatore
		PICHEIGHT: 32, // Altezza dell'immagine del giocatore
		ACTUALWIDTH: 32, // Larghezza effettiva del giocatore
		ACTUALHEIGHT: 32, // Altezza effettiva del giocatore
		START_X: 640 / 2 - 16, // Posizione iniziale del giocatore sull'asse X
		START_Y: 480 / 2 - 38, // Posizione iniziale del giocatore sull'asse Y
		IMAGES: ['assets/players/Player.png', 'assets/players/Player_Actions.png'], // Immagini del giocatore
	},
	MAPS: ['assets/maps/village_style_game.jpg', 'assets/maps/ForestMap.png', 'assets/maps/JewerlyMap.png', 'assets/maps/StoneMap.png','assets/maps/GameOver.png' ], // Mappe disponibili
	ICONS: ['assets/items/wood.png', 'assets/items/rock.png', 'assets/items/diamond.png'], // Icone degli oggetti
	BG_SONG: 'assets/funny-bgm.mp3', // Musica di sottofondo
}
let num = 1 // Variabile per memorizzare lo stato del giocatore

// (Oggetti)
const player = new Animation(CONFIG.PLAYER.IMAGES, 10, CONFIG.PLAYER.PICWIDTH, CONFIG.PLAYER.PICHEIGHT, CONFIG.PLAYER.ACTUALWIDTH, CONFIG.PLAYER.ACTUALHEIGHT) // Crea l'oggetto giocatore con le immagini e dimensioni
const music = new Sound(CONFIG.BG_SONG) // Crea l'oggetto musica
const menu = new Menu(CONFIG.STAGE.WIDTH / 2, CONFIG.STAGE.HEIGHT / 2, ['Play Music (Enter)', 'Pause Music (Enter)', 'Volume Change (<-- -->)']) // Crea il menu con opzioni
const items = new Menu(575, 20, [0, 0, 0], CONFIG.ICONS) // Crea il menu per gli oggetti
const background = new Sprite(CONFIG.MAPS[0], CONFIG.STAGE.WIDTH, CONFIG.STAGE.HEIGHT) // Crea lo sfondo con la prima mappa
const keys = { // Mappa dei tasti
	W: new Key('KeyW'), // Tasto W per il movimento
	S: new Key('KeyS'), // Tasto S per il movimento
	A: new Key('KeyA'), // Tasto A per il movimento
	D: new Key('KeyD'), // Tasto D per il movimento
	E: new Key('KeyE'), // Tasto E per raccogliere oggetti
	Esc: new Key('Escape'), // Tasto Escape per aprire il menu
	ArrowUp: new Key('ArrowUp'), // Freccia su per il movimento
	ArrowDown: new Key('ArrowDown'), // Freccia giù per il movimento
	ArrowLeft: new Key('ArrowLeft'), // Freccia sinistra per il movimento
	ArrowRight: new Key('ArrowRight'), // Freccia destra per il movimento
	Enter: new Key('Enter'), // Tasto Enter per azioni
}
player.position.set(CONFIG.PLAYER.START_X, CONFIG.PLAYER.START_Y) // Imposta la posizione iniziale del giocatore

// (Funzione per creare le collisioni)
const col = collisions =>
	collisions.reduce((boundaries, symbol, index) => {
		if (symbol !== 0) {
			const row = Math.floor(index / 40) // Calcola la riga della collisione
			const col = index % 40 // Calcola la colonna della collisione
			boundaries.push( // Aggiungi la collisione agli oggetti
				new Boundary({
					position: { x: col * Boundary.width, y: row * Boundary.height }, // Posizione della collisione
					action: typeof symbol == 'object' ? symbol[0] : symbol, // Azione della collisione
					width: typeof symbol == 'object' ? symbol[1] * 16 : 16, // Larghezza della collisione
					height: typeof symbol == 'object' ? symbol[2] * 16 : 16, // Altezza della collisione
				})
			)
			boundaries.push( // Aggiungi altre collisioni per i bordi
				new Boundary({ position: { x: 0, y: 14 }, action: 1, width: 40 * 16, height: 0 }), 
				new Boundary({ position: { x: 4, y: 0 }, action: 1, width: 0, height: 30 * 16 }), 
				new Boundary({ position: { x: 0, y: 30 * 16 }, action: 1, width: 40 * 16, height: 0 }),
				new Boundary({ position: { x: 40 * 16 - 4, y: 0 }, action: 1, width: 0, height: 30 * 16 })
			)
		}
		return boundaries
	}, []) // Restituisce l'array delle collisioni

// (Impostazione delle collisioni)
let boundaries = col(collisions) // Crea le collisioni per la mappa

// (Funzione per l'animazione)
const animate = () => {
	ctx?.clearRect(0, 0, CONFIG.STAGE.WIDTH, CONFIG.STAGE.HEIGHT) // Pulisce lo schermo
	background.draw() // Disegna lo sfondo
	// (Disegnare le collisioni non è necessario)
	boundaries.forEach(b => b.draw()) // Disegna le collisioni
	player.draw() // Disegna il giocatore
	player.updateFrame() // Aggiorna l'animazione del giocatore
	items.drawResources() // Disegna gli oggetti sullo schermo
	if (keys.Esc.pressed) { // Se il tasto Escape è premuto, mostra il menu
		menu.draw()
		menu.update()
	}
	keyDown() // Gestisce i movimenti dei tasti
	window.requestAnimationFrame(animate) // Richiama la funzione di animazione per il prossimo frame
}

//  (Funzione per il movimento del giocatore)
const movePlayer = (dx = 0, dy = 0) => {
	if (!boundaries.some(b => b.collide(player.position.x + dx, player.position.y + dy, player.width, player.height))) { // Controlla se ci sono collisioni con il movimento
		player.position.set(player.position.x + dx, player.position.y + dy) // Muove il giocatore
	}
}

// (Gestore degli eventi per i tasti)
const keyDown = () => {
	const dir = { dx: 0, dy: 0 } // Imposta la direzione iniziale
	const directions = [ // Elenco delle direzioni associate ai tasti
		{ key: keys.W, axis: 'dy', value: -1, stateNum: 0 },
		{ key: keys.S, axis: 'dy', value: 1, stateNum: 1 },
		{ key: keys.D, axis: 'dx', value: 1, stateNum: 3 },
		{ key: keys.A, axis: 'dx', value: -1, stateNum: 2 },
	]

	directions.forEach(({ key, axis, value, stateNum }) => {
		if (key.pressed && dir[axis] !== value) { // Controlla se un tasto è premuto e cambia la direzione
			dir[axis] += value
			num = stateNum // Cambia lo stato del giocatore in base alla direzione
		}
	})
	if (dir.dx && dir.dy) { // Se il giocatore si muove diagonalmente, riduci la velocità
		dir.dx *= 7 / 10
		dir.dy *= 7 / 10
	}
	if (dir.dx) movePlayer(dir.dx, 0) // Muove il giocatore sull'asse X
	if (dir.dy) movePlayer(0, dir.dy) // Muove il giocatore sull'asse Y

	player.changeState(num, Boolean(dir.dx || dir.dy)) // Cambia lo stato del giocatore in base al movimento
}

const keyActions = { // Azioni per ogni tasto
	KeyW: { keyDown: () => keys.W.keyDownHandler(), keyUp: () => keys.W.keyUpHandler() },
	KeyS: { keyDown: () => keys.S.keyDownHandler(), keyUp: () => keys.S.keyUpHandler() },
	KeyA: { keyDown: () => keys.A.keyDownHandler(), keyUp: () => keys.A.keyUpHandler() },
	KeyD: { keyDown: () => keys.D.keyDownHandler(), keyUp: () => keys.D.keyUpHandler() },
	KeyE: { // Gestisce l'azione per raccogliere oggetti
		keyDown: () => {
			keys.E.keyDownHandler()
			player.collect() // Il giocatore raccoglie l'oggetto
		},
		keyUp: () => {
			keys.E.keyUpHandler()
			player.endState() // Il giocatore termina l'azione di raccolta
		},
	},
	ArrowUp: { keyDown: () => keys.ArrowUp.keyDownHandler(), keyUp: () => keys.ArrowUp.keyUpHandler() },
	ArrowDown: { keyDown: () => keys.ArrowDown.keyDownHandler(), keyUp: () => keys.ArrowDown.keyUpHandler() },
	ArrowLeft: { keyDown: () => keys.ArrowLeft.keyDownHandler(), keyUp: () => keys.ArrowLeft.keyUpHandler() },
	ArrowRight: { keyDown: () => keys.ArrowRight.keyDownHandler(), keyUp: () => keys.ArrowRight.keyUpHandler() },
	Enter: { keyDown: () => keys.Enter.keyDownHandler(), keyUp: () => keys.Enter.keyUpHandler() },
	Escape: { keyDown: () => keys.Esc.keyPressChange() }, // Gestisce il tasto Escape per aprire/chiudere il menu
}

//  (Eventi)
window.addEventListener('keydown', e => {
	if (!e.repeat) { // Evita che l'evento si ripeta
		keyActions[e.code]?.keyDown?.(e) // Gestisce l'azione quando un tasto viene premuto
	}
})

window.addEventListener('keyup', e => {
	if (!e.repeat) { // Evita che l'evento si ripeta
		keyActions[e.code]?.keyUp?.(e) // Gestisce l'azione quando un tasto viene rilasciato
	}
})

// (Inizializzazione)
init(CONFIG.STAGE.ID, CONFIG.STAGE.WIDTH, CONFIG.STAGE.HEIGHT) // Inizializza il gioco con la configurazione
animate() // Avvia l'animazione del gioco
