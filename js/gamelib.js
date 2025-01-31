/**
 * Libreria JavaScript per lo sviluppo di videogiochi 2D.
 * @author Fabio Barosi
 * @version 1.0
 */

let ctx

/**
 * Inizializza il canvas di disegno e le variabili globali.
 * @param {string} id - ID dell'elemento html canvas.
 * @param {number} x - Posizione x del canvas.
 * @param {number} y - Posizione y del canvas.
 * @param {number} width - Larghezza del canvas.
 * @param {number} height - Altezza del canvas.
 */
function init(id, width, height) {
	let canvas = document.getElementById(id)
	ctx = canvas.getContext('2d')
	canvas.width = width
	canvas.height = height

	// Определяем размеры канваса
	const aspectRatio = 640 / 480
	const screenWidth = window.innerWidth
	const screenHeight = window.innerHeight
	if (screenWidth / screenHeight > aspectRatio) {
		canvas.style.height = `${screenHeight}px`
		canvas.style.width = `${screenHeight * aspectRatio}px`
	} else {
		canvas.style.width = `${screenWidth}px`
		canvas.style.height = `${screenWidth / aspectRatio}px`
	}
}

// -----------------------------------------------------------------------------

/**
 * Classe per la gestione di un vettore 2D.
 */
class Vector2 {
	/**
	 * Crea un nuovo oggetto Vector2.
	 */
	constructor(x = 0, y = 0) {
		this.x = x
		this.y = y
	}

	/**
	 * Imposta le componenti x e y del vettore.
	 * @param {number} x - Componente x del vettore.
	 * @param {number} y - Componente y del vettore.
	 */
	set(x, y) {
		this.x = x
		this.y = y
	}
}

// -----------------------------------------------------------------------------

/**
 * Classe per la gestione di uno sprite.
 */
class Sprite {
	/**
	 * Crea un nuovo oggetto Sprite.
	 * @param {string} path - Percorso della risorsa.
	 * @param {number} width - Larghezza dello sprite.
	 * @param {number} height - Altezza dello sprite.
	 */

	constructor(path, width, height) {
		this.image = new Image()
		this.image.src = path
		this.position = new Vector2()
		this.width = width
		this.height = height
		this.speed = new Vector2()
	}

	/**
	 * Verifica la collisione tra due sprite.
	 * @param {Sprite} sprite - Sprite con cui verificare la collisione.
	 * @return {boolean} true se i due sprite collidono, altrimenti false.
	 */
	collide(px, py) {
		return px < this.position.x + this.width - 22 && px > this.position.x - 4 && py < this.position.y + this.height - 28 && py > this.position.y - 12
	}

	/**
	 * Disegna lo sprite.
	 */
	draw(x = this.position.x, y = this.position.y) {
		ctx.drawImage(this.image, x, y)
	}
}

// -----------------------------------------------------------------------------

class Boundary {
	/**
	 * @param {object} position
	 * @param {number | undefined} action
	 * @param {number} width
	 * @param {number} height
	 */
	static width = 16
	static height = 16
	constructor({ position, action = undefined, width = 16, height = 16 }) {
		this.position = position
		this.action = action
		this.width = width
		this.height = height
	}

	collide(px, py, pw, ph) {
		player.action = undefined
		if (px < this.position.x + this.width - 12 && px + pw > this.position.x + 12 && py < this.position.y + this.height - 18 && py + ph > this.position.y + 9) {
			if (this.action == 1) return true
			background.image.src = CONFIG.MAPS[this.action - 2] ? CONFIG.MAPS[this.action - 2] : background.image.src
			console.log(this.action);
			
			switch (this.action) {
				case 2:
					console.log(2);
					player.position.set(CONFIG.PLAYER.START_X, CONFIG.PLAYER.START_Y)
					boundaries = col(collisions)
					break
				case 3:
					console.log(3);
					player.position.set(220, 200)
					boundaries = col(colissionsTree)
					break
				case 4:
					console.log(4);
					player.position.set(304, 242)
					boundaries = col(collisionsJewerly)
					break
				case 5:
					console.log(5);
					boundaries = col(collisionsStones)
					player.position.set(130, 150)
					break
				case 6:
					console.log(6);
					boundaries = col(collisionsJewerly)
					player.position.set(300, 280)
					// boundaries = col(collisionsGameOver)
					// boundaries = col(collisionsGameOver)
					break
				default:
					player.action = this.action
					return true
			}
		}
		return false
	}

	draw() {
		ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'
		ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
	}
}

// -----------------------------------------------------------------------------

/**
 * Classe per la gestione di un tasto.
 */
class Key {
	/**
	 * Crea un nuovo oggetto Key.
	 * @param {string} key - Codice o carattere associato al tasto.
	 * @param {boolean} pressed - Codice o carattere associato al tasto.
	 */
	constructor(key) {
		this.key = key
		this.pressed = false
							}

	keyDownHandler() {
		this.pressed = true
	}

	keyUpHandler() {
		this.pressed = false
	}

	keyPressChange() {
		this.pressed = !this.pressed
	}
}

// -----------------------------------------------------------------------------

/**
 * Classe per la gestione di un suono.
 */
class Sound {
	/**
	 * Crea un nuovo oggetto Sound.
	 * @param {string} path - Percorso della risorsa.
	 */
	constructor(path) {
		this.audio = new Audio(path)
	}

	/**
	 * Imposta il loop (true o false) del suono.
	 * @param {boolean} value - Loop (true o false) del suono.
	 */
	loop(value) {
		this.audio.loop = value
	}

	/**
	 * Imposta il volume [0.0; 1.0] del suono.
	 * @param {number} value - Volume [0.0; 1.0] del suono.
	 */
	volume(value) {
		this.audio.volume = value
	}

	/**
	 * Esegue il suono.
	 */
	play() {
		this.audio.play()
	}

	/**
	 * Esegue il suono senza attendere che il precedente sia terminato.
	 */
	playEffect() {
		this.audio.cloneNode().play()
	}

	/**
	 * Mette in pausa il suono.
	 */
	pause() {
		this.audio.pause()
	}

	/**
	 * Interrompe il suono.
	 */
	stop() {
		this.audio.pause()
		this.audio.currentTime = 0
	}
}

// -----------------------------------------------------------------------------

/**
 * Classe per la gestione di un testo.
 */
class Text {
	/**
	 * Crea un nuovo oggetto Text.
	 */
	constructor() {
		this.position = new Vector2()
		this.text = ''
		this.font = 'Arial'
		this.size = 20
		this.color = 'white'
	}

	/**
	 * Disegna il testo.
	 */
	draw() {
		ctx.font = `${this.size}px ${this.font}`
		ctx.fillStyle = this.color
		ctx.fillText(this.text, this.position.x, this.position.y)
	}
}

// -----------------------------------------------------------------------------

/**
 * Classe per la gestione di un timer.
 */
class Timer {
	/**
	 * Crea un nuovo oggetto Timer.
	 * @param {number} delay - Tempo di attesa del timer.
	 */
	constructor(delay) {
		this.delay = delay
		this.elapsed = 0
	}

	/**
	 * Resetta il timer.
	 */
	reset() {
		this.elapsed = 0
	}

	/**
	 * Attiva il tick del timer.
	 */
	doTick() {
		this.elapsed += 1
	}

	/**
	 * Verifica il tick del timer.
	 * @return {boolean} true se il timer ha eseguito un tick, altrimenti false.
	 */
	tick() {
		if (this.elapsed >= this.delay) {
			this.elapsed = 0
			return true
		}
		return false
	}

	/**
	 * Aggiorna il timer.
	 */
	update() {
		if (this.elapsed < this.delay) {
			this.elapsed += 17 // 1000 ms / 60 fps = 16.7
		}
	}
}

// -----------------------------------------------------------------------------

/**
 * Classe per la gestione di un'animazione.
 */
class Animation {
	static DEFAULT_SIZE = 32
	static COLLECT_SIZE = 48

	constructor(path, delay, pic_width, pic_height, p_width, p_height) {
		this.images = path.map(src => {
			const img = new Image()
			img.src = src
			return img
		})

		this.frame = 0
		this.move = 0
		this.timer = new Timer(delay)
		this.position = new Vector2()
		this.picWidth = pic_width
		this.picHeight = pic_height
		this.width = p_width
		this.height = p_height
		this.side = undefined
		this.action = undefined
		this.collecting = false
	}

	_setSize(size, frameReset = 0) {
		;[this.images[0], this.images[1]] = [this.images[1], this.images[0]]
		this.picWidth = size
		this.picHeight = size
		this.width = size
		this.height = size
		this.frame = frameReset
	}

	updateFrame() {
		this.timer.doTick()

		if (this.timer.tick()) {
			if (this.action && keys.E.pressed) {
				if (items.items[this.action - 7] !== 100) {
					items.items[this.action - 7] += 1
				}
				this.frame = this.frame === 0 ? this.picWidth : 0
			} else {
				this.frame = (this.frame + this.picWidth) % (this.picWidth * 6)
			}
			this.timer.reset()
		}
	}

	endState() {
		if (this.action) {
			this._setSize(Animation.DEFAULT_SIZE)
			this.move = (this.move / 3) * 2
			this.position.set(this.position.x + 8, this.position.y + 8)
			keys.E.keyUpHandler()
			this.collecting = false
		}
	}

	changeState(x, ismove = false) {
		if (!this.action || !keys.E.pressed) {
			this.side = x
			const moveValues = [96, 0, 64, 32]
			this.move = moveValues[x] + (ismove ? 128 : 0)
		}
	}

	collect() {
		if (this.action && keys.E.pressed && !this.collecting) {
			this._setSize(Animation.COLLECT_SIZE)
			this.move = (this.move / 2) * 3
			this.position.set(this.position.x - 8, this.position.y - 8)
			this.collecting = true
			const collectMoveValues = [144, 0, 96, 48]
			this.move = collectMoveValues[this.side]

			if (this.action === 7 && this.move < 192) {
				this.move += 192
			}
			if (this.action === 8 && this.move < 192) {
				this.move += 192
			}
			if (this.action === 9 && this.move < 192) {
				this.move += 192
			}
		}
	}

	draw() {
		ctx.drawImage(this.images[0], this.frame, this.move, this.picWidth, this.picHeight, this.position.x, this.position.y, this.width, this.height)
	}
}

// -----------------------------------------------------------------------------

/**
 * Classe per la gestione di una lista di elementi.
 */
class List {
	/**
	 * Crea un nuovo oggetto List.
	 */
	constructor() {
		this.items = []
	}

	/**
	 * Aggiunge un nuovo elemento alla lista.
	 * @param {Object} item - Elemento da aggiungere alla lista.
	 */
	add(item) {
		this.items.push(item)
	}

	/**
	 * Svuota la lista.
	 */
	clear() {
		this.items = []
	}

	/**
	 * Ritorna l'elemento in posizione index della lista.
	 * @param {number} index - Indice della lista.
	 * @return {Object} Elemento in posizione index della lista.
	 */
	get(index) {
		if (index >= 0 && index < this.items.length) {
			return this.items[index]
		}
	}

	/**
	 * Applica il metodo filter alla lista.
	 * @param {requestCallback} callback - Callback applicata al metodo filter.
	 */
	filter(callback) {
		this.items = this.items.filter(callback)
	}

	/**
	 * Esegue il metodo forEach alla lista.
	 * @param {requestCallback} callback - Callback applicata al metodo forEach.
	 */
	forEach(callback) {
		this.items.forEach(callback)
	}

	/**
	 * Ritorna il numero di elementi della lista.
	 * @return {number} Numero di elementi della lista.
	 */
	count() {
		return this.items.length
	}

	/**
	 * Rimuove l'elemento in posizione index della lista.
	 * @param {number} index - Indice della lista.
	 */
	remove(index) {
		if (index >= 0 && index < this.items.length) {
			this.items.splice(index, 1)
		}
	}
}

// -----------------------------------------------------------------------------

/**
 * Classe per la gestione di un menu.
 */
class Menu {
	/**
	 * Crea un nuovo oggetto Menu.
	 * @param {number} x - Posizione x del menu.
	 * @param {number} y - Posizione y del menu.
	 * @param {string[]} items - Voci di menu.
	 */
	constructor(x, y, items, icons = []) {
		this.items = items
		this.x = x
		this.y = y
		this.action = new Key('ArrowUp')
		this.font = 'Arial'
		this.size = 22
		this.standardColor = 'white'
		this.selectedColor = 'red'
		this.index = 0
		this.images = icons.map(src => {
			const img = new Image()
			img.src = src
			return img
		})
	}

	update() {
		if (keys.ArrowUp.pressed) {
			this.index = (this.index - 1 + this.items.length) % this.items.length
			keys.ArrowUp.keyUpHandler()
		}
		if (keys.ArrowDown.pressed) {
			this.index = (this.index + 1) % this.items.length
			keys.ArrowDown.keyUpHandler()
		}
		if (keys.Enter.pressed) {
			switch (this.index) {
				case 0:
					music.play()
					break
				case 1:
					music.pause()
					break
			}
			keys.Enter.keyUpHandler()
		}
		if (keys.ArrowLeft.pressed) {
			music.volume(Math.max(music.audio.volume - 0.08, 0))
			keys.ArrowLeft.keyUpHandler()
		}
		if (keys.ArrowRight.pressed) {
			music.volume(Math.min(music.audio.volume + 0.08, 1))
			keys.ArrowRight.keyUpHandler()
		}
	}

	draw() {
		let y = this.y
		ctx.font = `${this.size}px ${this.font}`
		ctx.fillStyle = 'rgba(77, 77, 77, 0.9)'
		ctx.textAlign = 'center'
		ctx.fillRect(0, 0, 640, 480)
		for (let i = 0; i < this.items.length; i++) {
			ctx.fillStyle = i === this.index ? this.selectedColor : this.standardColor
			ctx.fillText(this.items[i], this.x, y)
			y += this.size + 10
		}
	}

	drawResources() {
		let y = this.y
		ctx.font = `${this.size}px ${this.font}`
		ctx.fillStyle = 'rgba(77, 77, 77, 0.9)'
		ctx.fillRect(540, 0, 100, 90)
		for (let i = 0; i < this.items.length; i++) {
			ctx.fillStyle = this.standardColor
			ctx.drawImage(this.images[i], 545, y - 18, 24, 24)
			ctx.fillStyle = this.items[i] == 100 ? 'green' : 'red'
			ctx.fillText(Math.floor(this.items[i] / 10), this.x, y)
			ctx.fillText(['/', '/', '/'][i], this.x + (this.items[i] == 100 ? 30 : 15), y)
			ctx.fillText(10, this.x + (this.items[i] == 100 ? 40 : 25), y)
			y += this.size + 10
		}
	}
}

// -----------------------------------------------------------------------------

/**
 * Classe per il salvataggio e il caricamento di dati nello storage.
 */
class Storage {
	/**
	 * Crea un nuovo oggetto Storage.
	 */
	constructor() {}

	/**
	 * Memorizza un valore nello storage.
	 * @param {string} key - Chiave associata al valore da memorizzare nello storage.
	 * @param {Object} value - Valore da memorizzare nello storage.
	 */
	save(key, value) {
		localStorage.setItem(key, value)
	}

	/**
	 * Ritorna un valore memorizzato nello storage.
	 * @param {string} key - Chiave associata al valore memorizzato nello storage.
	 * @return {Object} Valore memorizzato nello storage.
	 */
	load(key) {
		let value = localStorage.getItem(key)
		return value
	}

	/**
	 * Cancella un valore memorizzato nello storage.
	 * @param {string} key - Chiave associata al valore memorizzato nello storage.
	 */
	remove(key) {
		localStorage.removeItem(key)
	}

	/**
	 * Cancella tutti i valori memorizzati nello storage.
	 */
	clear() {
		localStorage.clear()
	}
}
