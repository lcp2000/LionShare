(function () {
	'use strict';

	const config = window.LionShareConfig || {};
	const MAX_SIZE = 1500 * 1024 * 1024;
	const CHUNK_SIZE = 256 * 1024;
	const DB_NAME = 'LionShareDB';
	const DB_VERSION = 1;
	const STORE_NAME = 'files';
	const WRITE_PAUSE = 8 * 1024 * 1024;
	const WRITE_RESUME = 2 * 1024 * 1024;

	const copy = {
		en: {
			themeDark: 'Dark Mode', themeLight: 'Light Mode', language: 'Español',
			hook: 'Need to share a file without parking it on someone else\'s cloud?',
			description: '{app} sends files directly between browsers. The file remains on the sender\'s device until a recipient requests it.',
			usesTitle: 'What can you share with {app}?',
			use1: '<strong>Sensitive material:</strong> Contracts, financial documents, credentials, and personal files.',
			use2: '<strong>Any format:</strong> Images, PDFs, archives, audio, video, and multiple files packaged as a ZIP.',
			use3: '<strong>Direct transfer:</strong> File bytes travel peer-to-peer and are not stored by the {app} app.',
			prepare: 'Prepare your files to send', dropLabel: 'Drag files here or choose them below (1.5 GB maximum):',
			dropPrompt: 'Drag files here or click to browse', selected: 'Selected:', filesQueued: 'files queued', space: 'Space',
			expiryLabel: 'Expiration time:', expiry2: '2 minutes', expiry5: '5 minutes', expiry10: '10 minutes',
			generate: 'Generate secure link', preparing: 'Preparing files', success: 'Secure link created.',
			copy: 'Copy link', copied: 'Copied!', qr: 'Scan to receive the file',
			errNoFile: 'Choose at least one file first.', errTooLarge: 'The selected files exceed the 1.5 GB limit.',
			errStorage: 'The browser could not store the file locally.', errZip: 'The files could not be packaged.',
			previewTitle: 'Secure file viewer', timeRemaining: 'Viewing time remaining:', file: 'File:',
			connecting: 'Connecting to the sender', calculating: 'calculating…', estimated: 'Estimated time remaining:',
			notFound: 'The file is unavailable. The link may have expired, or the sender may have closed the sharing tab.',
			expired: 'This link has expired and the file is no longer available.', destroyed: 'Time is up. The browser copy has been removed.',
			choose: 'How would you like to receive this file?', saveDisk: 'Save directly to disk', viewBrowser: 'View in browser',
			saveNote: 'Writes to disk while receiving and avoids holding the whole file in browser memory. The saved copy will not self-destruct.',
			viewNote: 'Keeps the file temporarily in browser memory for preview and download. Best for smaller files.',
			saving: 'Saving to disk', saveCancelled: 'Saving was cancelled. Choose a receiving method.', saveFailed: 'The file could not be written to disk.',
			saved: 'File saved to your device', savedNote: 'This local copy no longer depends on {app}; delete it when you are finished.',
			download: 'Download file', noPreview: 'This format cannot be previewed here. Download it to open it safely.',
			textTruncated: '[Preview shortened to protect browser performance.]',
			disclaimerLink: 'Legal disclaimer', disclaimerTitle: 'Legal disclaimer',
			disclaimerBody: '<p><strong>{app}</strong> is a browser-to-browser transport tool. File contents are not uploaded to or stored by the {app} app.</p><p><strong>Malware notice:</strong> Direct transfers are not scanned by the site. Only accept files from people you trust, and scan downloaded files with appropriate security software.</p><p class="lionshare-attribution">Based on the original <a href="https://github.com/coffeetron832/Giraffile" target="_blank" rel="noopener noreferrer">Giraffile</a> project created by jahp / coffeetron832 and used under the MIT License.</p>',
			close: 'Close', footer: '{app} v{version} · Private files, directly shared.'
		},
		es: {
			themeDark: 'Modo oscuro', themeLight: 'Modo claro', language: 'English',
			hook: '¿Necesitas compartir un archivo sin dejarlo en la nube de otra empresa?',
			description: '{app} envía archivos directamente entre navegadores. El archivo permanece en el dispositivo del remitente hasta que el destinatario lo solicita.',
			usesTitle: '¿Qué puedes compartir con {app}?',
			use1: '<strong>Material confidencial:</strong> Contratos, documentos financieros, credenciales y archivos personales.',
			use2: '<strong>Cualquier formato:</strong> Imágenes, PDF, archivos comprimidos, audio, video y varios archivos en un ZIP.',
			use3: '<strong>Transferencia directa:</strong> Los bytes viajan P2P y {app} no los almacena.',
			prepare: 'Prepara tus archivos para enviar', dropLabel: 'Arrastra archivos aquí o selecciónalos (máximo 1.5 GB):',
			dropPrompt: 'Arrastra archivos aquí o haz clic para buscar', selected: 'Seleccionado:', filesQueued: 'archivos en cola', space: 'Espacio',
			expiryLabel: 'Tiempo de caducidad:', expiry2: '2 minutos', expiry5: '5 minutos', expiry10: '10 minutos',
			generate: 'Generar enlace seguro', preparing: 'Preparando archivos', success: 'Enlace seguro creado.',
			copy: 'Copiar enlace', copied: '¡Copiado!', qr: 'Escanea para recibir el archivo',
			errNoFile: 'Selecciona al menos un archivo.', errTooLarge: 'Los archivos superan el límite de 1.5 GB.',
			errStorage: 'El navegador no pudo almacenar el archivo localmente.', errZip: 'No se pudieron empaquetar los archivos.',
			previewTitle: 'Visualizador de archivo seguro', timeRemaining: 'Tiempo restante de visualización:', file: 'Archivo:',
			connecting: 'Conectando con el remitente', calculating: 'calculando…', estimated: 'Tiempo restante estimado:',
			notFound: 'El archivo no está disponible. El enlace puede haber caducado o el remitente cerró la pestaña.',
			expired: 'Este enlace ha caducado y el archivo ya no está disponible.', destroyed: 'El tiempo terminó. Se eliminó la copia del navegador.',
			choose: '¿Cómo quieres recibir este archivo?', saveDisk: 'Guardar directamente en disco', viewBrowser: 'Ver en el navegador',
			saveNote: 'Escribe en el disco durante la recepción y evita guardar todo el archivo en la memoria. La copia guardada no se autodestruye.',
			viewNote: 'Mantiene temporalmente el archivo en la memoria para previsualizarlo y descargarlo. Ideal para archivos pequeños.',
			saving: 'Guardando en disco', saveCancelled: 'Se canceló el guardado. Elige un método de recepción.', saveFailed: 'No se pudo escribir el archivo en el disco.',
			saved: 'Archivo guardado en tu dispositivo', savedNote: 'Esta copia local ya no depende de {app}; elimínala cuando termines.',
			download: 'Descargar archivo', noPreview: 'Este formato no se puede previsualizar aquí. Descárgalo para abrirlo de forma segura.',
			textTruncated: '[Vista previa acortada para proteger el rendimiento del navegador.]',
			disclaimerLink: 'Aviso legal', disclaimerTitle: 'Aviso legal',
			disclaimerBody: '<p><strong>{app}</strong> es una herramienta de transporte directo entre navegadores. Este {app} app no carga ni almacena el contenido de los archivos.</p><p><strong>Aviso sobre malware:</strong> El sitio no analiza las transferencias directas. Acepta archivos solo de personas de confianza y usa un programa de seguridad apropiado.</p><p class="lionshare-attribution">Basado en el proyecto original <a href="https://github.com/coffeetron832/Giraffile" target="_blank" rel="noopener noreferrer">Giraffile</a>, creado por jahp / coffeetron832 y utilizado bajo la Licencia MIT.</p>',
			close: 'Cerrar', footer: '{app} v{version} · Archivos privados, compartidos directamente.'
		}
	};

	function openDatabase() {
		return new Promise(function (resolve, reject) {
			const request = indexedDB.open(DB_NAME, DB_VERSION);
			request.onupgradeneeded = function (event) {
				const db = event.target.result;
				if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: 'id' });
			};
			request.onsuccess = function (event) { resolve(event.target.result); };
			request.onerror = function () { reject(request.error); };
		});
	}

	async function databaseGet(id) {
		const db = await openDatabase();
		return new Promise(function (resolve, reject) {
			const request = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(id);
			request.onsuccess = function () { resolve(request.result); };
			request.onerror = function () { reject(request.error); };
		});
	}

	async function databasePut(value) {
		const db = await openDatabase();
		return new Promise(function (resolve, reject) {
			const transaction = db.transaction(STORE_NAME, 'readwrite');
			transaction.objectStore(STORE_NAME).put(value);
			transaction.oncomplete = resolve;
			transaction.onerror = function () { reject(transaction.error); };
		});
	}

	async function databaseDelete(id) {
		const db = await openDatabase();
		return new Promise(function (resolve) {
			const transaction = db.transaction(STORE_NAME, 'readwrite');
			transaction.objectStore(STORE_NAME).delete(id);
			transaction.oncomplete = resolve;
			transaction.onerror = resolve;
		});
	}

	async function cleanExpired() {
		try {
			const db = await openDatabase();
			const now = Math.floor(Date.now() / 1000);
			const transaction = db.transaction(STORE_NAME, 'readwrite');
			const request = transaction.objectStore(STORE_NAME).openCursor();
			request.onsuccess = function (event) {
				const cursor = event.target.result;
				if (!cursor) return;
				if (now >= cursor.value.created + cursor.value.duration) cursor.delete();
				cursor.continue();
			};
		} catch (error) {
			// Storage cleanup is best-effort and should not stop the interface.
		}
	}

	class LionShareApp {
		constructor(root) {
			this.root = root;
			this.files = [];
			this.peer = null;
			this.senderPeers = new Map();
			this.objectUrl = null;
			this.timer = null;
			this.lang = localStorage.getItem('lionshare-language') || 'en';
			this.theme = localStorage.getItem('lionshare-theme') || 'light';
			this.q = (selector) => this.root.querySelector(selector);
			this.qa = (selector) => Array.from(this.root.querySelectorAll(selector));
		}

		text(key) {
			const value = (copy[this.lang] && copy[this.lang][key]) || copy.en[key] || key;
			return String(value)
				.replaceAll('{app}', config.title || 'LionShare')
				.replaceAll('{version}', config.version || '1.0.0');
		}

		init() {
			this.root.dataset.theme = this.theme;
			this.bindEvents();
			this.translate();
			cleanExpired();
			const fileId = window.location.hash.slice(1);
			if (/^file_[a-z0-9_-]+$/i.test(fileId)) this.openSharedLink(fileId);
		}

		bindEvents() {
			this.root.addEventListener('click', (event) => {
				const actionElement = event.target.closest('[data-ls-action]');
				if (!actionElement || !this.root.contains(actionElement)) return;
				const action = actionElement.dataset.lsAction;
				if (action === 'language') this.toggleLanguage();
				if (action === 'theme') this.toggleTheme();
				if (action === 'generate') this.generateLink();
				if (action === 'disclaimer') this.q('[data-ls-modal]').hidden = false;
				if (action === 'close-modal') this.q('[data-ls-modal]').hidden = true;
				if (action === 'copy') this.copyLink(actionElement);
			});

			const dropZone = this.q('[data-ls-drop-zone]');
			const fileInput = this.q('[data-ls-file-input]');
			dropZone.addEventListener('click', (event) => {
				if (!event.target.closest('.lionshare-file-remove')) fileInput.click();
			});
			dropZone.addEventListener('keydown', (event) => {
				if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); fileInput.click(); }
			});
			['dragenter', 'dragover'].forEach((name) => dropZone.addEventListener(name, (event) => {
				event.preventDefault(); dropZone.classList.add('is-over');
			}));
			['dragleave', 'drop'].forEach((name) => dropZone.addEventListener(name, (event) => {
				event.preventDefault(); dropZone.classList.remove('is-over');
			}));
			dropZone.addEventListener('drop', (event) => this.addFiles(event.dataTransfer.files));
			fileInput.addEventListener('change', () => { this.addFiles(fileInput.files); fileInput.value = ''; });
			this.q('[data-ls-modal]').addEventListener('click', (event) => {
				if (event.target === this.q('[data-ls-modal]')) this.q('[data-ls-modal]').hidden = true;
			});
		}

		translate() {
			this.root.lang = this.lang;
			this.qa('[data-ls-text]').forEach((node) => { node.textContent = this.text(node.dataset.lsText); });
			this.qa('[data-ls-html]').forEach((node) => { node.innerHTML = this.text(node.dataset.lsHtml); });
			this.q('[data-ls-action="language"]').textContent = this.text('language');
			this.q('[data-ls-action="theme"]').textContent = this.theme === 'dark' ? this.text('themeLight') : this.text('themeDark');
			this.q('[data-ls-footer]').textContent = this.text('footer');
			this.q('[data-ls-action="close-modal"]').setAttribute('aria-label', this.text('close'));
			this.renderFileQueue();
		}

		toggleLanguage() {
			this.lang = this.lang === 'en' ? 'es' : 'en';
			localStorage.setItem('lionshare-language', this.lang);
			this.translate();
		}

		toggleTheme() {
			this.theme = this.theme === 'dark' ? 'light' : 'dark';
			this.root.dataset.theme = this.theme;
			localStorage.setItem('lionshare-theme', this.theme);
			this.translate();
		}

		addFiles(fileList) {
			this.files = this.files.concat(Array.from(fileList || []));
			const total = this.files.reduce((sum, file) => sum + file.size, 0);
			if (total > MAX_SIZE) this.q('[data-ls-error]').textContent = this.text('errTooLarge');
			else this.q('[data-ls-error]').textContent = '';
			this.renderFileQueue();
		}

		renderFileQueue() {
			const total = this.files.reduce((sum, file) => sum + file.size, 0);
			const limit = this.q('[data-ls-limit]');
			const prompt = this.q('[data-ls-drop-prompt]');
			const list = this.q('[data-ls-file-list]');
			limit.hidden = this.files.length === 0;
			list.textContent = '';
			if (!this.files.length) {
				prompt.textContent = this.text('dropPrompt');
				return;
			}
			prompt.textContent = this.files.length === 1
				? `${this.text('selected')} ${this.files[0].name}`
				: `${this.text('selected')} ${this.files.length} ${this.text('filesQueued')}`;
			this.q('[data-ls-limit-label]').textContent = `${this.text('space')}: ${this.formatBytes(total)} / 1.5 GB`;
			this.q('[data-ls-limit-bar]').value = Math.min(100, total / MAX_SIZE * 100);
			this.files.forEach((file, index) => {
				const item = document.createElement('li');
				item.className = 'lionshare-file-row';
				const name = document.createElement('span');
				name.textContent = `${file.name} (${this.formatBytes(file.size)})`;
				const remove = document.createElement('button');
				remove.type = 'button'; remove.className = 'lionshare-file-remove'; remove.textContent = '×';
				remove.setAttribute('aria-label', `Remove ${file.name}`);
				remove.addEventListener('click', (event) => {
					event.stopPropagation(); this.files.splice(index, 1); this.renderFileQueue();
				});
				item.append(name, remove); list.appendChild(item);
			});
		}

		formatBytes(bytes) {
			if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
			const units = ['B', 'KB', 'MB', 'GB'];
			const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
			return `${(bytes / Math.pow(1024, index)).toFixed(index ? 2 : 0)} ${units[index]}`;
		}

		uniqueId() {
			if (window.crypto && crypto.getRandomValues) {
				const bytes = new Uint8Array(12); crypto.getRandomValues(bytes);
				return 'file_' + Array.from(bytes, (byte) => byte.toString(36).padStart(2, '0')).join('');
			}
			return 'file_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
		}

		async generateLink() {
			const total = this.files.reduce((sum, file) => sum + file.size, 0);
			if (!this.files.length) { this.q('[data-ls-error]').textContent = this.text('errNoFile'); return; }
			if (total > MAX_SIZE) { this.q('[data-ls-error]').textContent = this.text('errTooLarge'); return; }
			this.q('[data-ls-error]').textContent = '';
			const output = this.q('[data-ls-output]');
			output.innerHTML = `<div class="lionshare-output-card"><strong data-ls-progress-label></strong><progress data-ls-progress value="0" max="100"></progress></div>`;
			const progress = output.querySelector('[data-ls-progress]');
			const progressLabel = output.querySelector('[data-ls-progress-label]');
			const setProgress = (value) => { progress.value = value; progressLabel.textContent = `${this.text('preparing')} (${Math.floor(value)}%)`; };
			setProgress(0);

			try {
				let blob;
				let name;
				let type;
				if (this.files.length > 1) {
					const zip = new JSZip();
					const usedNames = new Map();
					this.files.forEach((file) => {
						const seen = usedNames.get(file.name) || 0;
						usedNames.set(file.name, seen + 1);
						let zipName = file.name;
						if (seen) {
							const dot = file.name.lastIndexOf('.');
							zipName = dot > 0 ? `${file.name.slice(0, dot)} (${seen})${file.name.slice(dot)}` : `${file.name} (${seen})`;
						}
						zip.file(zipName, file);
					});
					blob = await zip.generateAsync({ type: 'blob' }, (meta) => setProgress(meta.percent));
					name = `${(config.title || 'LionShare').replace(/[^a-z0-9_-]+/gi, '_')}_Package_${Date.now()}.zip`;
					type = 'application/zip';
				} else {
					blob = this.files[0]; name = blob.name; type = blob.type || 'application/octet-stream'; setProgress(100);
				}

				const payload = {
					id: this.uniqueId(), created: Math.floor(Date.now() / 1000),
					duration: Number(this.q('[data-ls-expiry]').value), name, type, size: blob.size, blob
				};
				await databasePut(payload);
				this.startSender(payload);
				this.renderShareLink(payload.id);
			} catch (error) {
				console.error(error);
				output.innerHTML = `<p class="lionshare-error">${this.text(error && error.name === 'QuotaExceededError' ? 'errStorage' : 'errZip')}</p>`;
			}
		}

		renderShareLink(id) {
			const output = this.q('[data-ls-output]');
			const base = config.pageUrl || window.location.href.split('#')[0];
			const url = new URL(base, window.location.href); url.hash = id;
			output.textContent = '';
			const card = document.createElement('div'); card.className = 'lionshare-output-card';
			const status = document.createElement('p'); status.className = 'lionshare-success'; status.textContent = this.text('success');
			const textarea = document.createElement('textarea'); textarea.readOnly = true; textarea.value = url.href;
			const button = document.createElement('button'); button.type = 'button'; button.className = 'lionshare-button'; button.dataset.lsAction = 'copy'; button.textContent = this.text('copy');
			card.append(status, textarea, button);
			const qr = document.createElement('div'); qr.className = 'lionshare-qr';
			card.appendChild(qr); output.appendChild(card);
			if (window.QRCode) {
				new QRCode(qr, { text: url.href, width: 180, height: 180, colorDark: '#0b2447', colorLight: '#ffffff' });
				const caption = document.createElement('p'); caption.textContent = this.text('qr'); qr.appendChild(caption);
			}
		}

		async copyLink(button) {
			const textarea = this.q('[data-ls-output] textarea');
			if (!textarea) return;
			try { await navigator.clipboard.writeText(textarea.value); }
			catch (error) { textarea.select(); document.execCommand('copy'); }
			button.textContent = this.text('copied');
			setTimeout(() => { button.textContent = this.text('copy'); }, 1600);
		}

		startSender(payload) {
			const senderPeer = new Peer(payload.id, config.peerConfig || {});
			this.senderPeers.set(payload.id, senderPeer);
			senderPeer.on('connection', (connection) => {
				let paused = false;
				connection.on('data', async (message) => {
					if (!message || !message.request) return;
					if (message.request === 'FLOW_PAUSE') { paused = true; return; }
					if (message.request === 'FLOW_RESUME') { paused = false; return; }
					const now = Math.floor(Date.now() / 1000);
					if (now >= payload.created + payload.duration) { connection.close(); await databaseDelete(payload.id); return; }
					if (message.request === 'REQUEST_METADATA') {
						connection.send({ meta: true, id: payload.id, created: payload.created, duration: payload.duration, name: payload.name, type: payload.type, size: payload.size });
					}
					if (message.request === 'DOWNLOAD_FILE_STREAM') this.sendChunks(connection, payload, () => paused);
				});
			});
			const expiresIn = Math.max(0, (payload.created + payload.duration) * 1000 - Date.now());
			setTimeout(async () => {
				await databaseDelete(payload.id);
				const activePeer = this.senderPeers.get(payload.id);
				if (activePeer) activePeer.destroy();
				this.senderPeers.delete(payload.id);
			}, expiresIn + 250);
		}

		async sendChunks(connection, payload, isPaused) {
			let offset = 0;
			while (offset < payload.blob.size && connection.open) {
				if (Math.floor(Date.now() / 1000) >= payload.created + payload.duration) {
					connection.close();
					await databaseDelete(payload.id);
					return;
				}
				if (isPaused() || (connection.bufferSize || 0) > 1024 * 1024) {
					await new Promise((resolve) => setTimeout(resolve, 12)); continue;
				}
				const end = Math.min(offset + CHUNK_SIZE, payload.blob.size);
				const chunk = await payload.blob.slice(offset, end).arrayBuffer();
				offset = end;
				connection.send({ chunk, progress: offset / payload.blob.size * 100 });
			}
			if (connection.open) connection.send({ eof: true, created: payload.created, duration: payload.duration, name: payload.name, type: payload.type, size: payload.size });
		}

		async openSharedLink(fileId) {
			this.q('.lionshare-columns').hidden = true;
			const preview = this.q('[data-ls-preview]'); preview.hidden = false;
			try {
				const local = await databaseGet(fileId);
				if (local) {
					if (Math.floor(Date.now() / 1000) >= local.created + local.duration) {
						await databaseDelete(fileId); this.showError('expired');
					} else this.renderPreview(local);
					return;
				}
			} catch (error) { /* A receiver can continue without IndexedDB. */ }
			this.connectReceiver(fileId);
		}

		showError(key) {
			this.q('[data-ls-file-content]').innerHTML = `<p class="lionshare-error">${this.text(key)}</p>`;
		}

		showProgress(label, percent, eta) {
			const content = this.q('[data-ls-file-content]');
			content.textContent = '';
			const card = document.createElement('div'); card.className = 'lionshare-output-card';
			const strong = document.createElement('strong'); strong.textContent = `${label} (${Math.floor(percent || 0)}%)`;
			const progress = document.createElement('progress'); progress.max = 100; progress.value = percent || 0;
			const estimate = document.createElement('p'); estimate.className = 'lionshare-choice-note'; estimate.textContent = `${this.text('estimated')} ${eta || this.text('calculating')}`;
			card.append(strong, progress, estimate); content.appendChild(card);
			return { strong, progress, estimate };
		}

		connectReceiver(fileId) {
			const state = {
				connection: null, meta: null, mode: null, chunks: [], bytes: 0, started: 0,
				writable: null, writes: Promise.resolve(), queued: 0, paused: false, complete: false, eof: false
			};
			let progressUi = this.showProgress(this.text('connecting'), 0);
			if (this.peer) this.peer.destroy();
			this.peer = new Peer(undefined, config.peerConfig || {});

			const begin = (mode) => {
				if (state.mode || !state.connection || !state.connection.open) return;
				state.mode = mode; state.started = Date.now(); state.connection.send({ request: 'DOWNLOAD_FILE_STREAM' });
				progressUi = this.showProgress(mode === 'disk' ? this.text('saving') : this.text('connecting'), 0);
			};

			const beginDisk = async () => {
				try {
					const handle = await window.showSaveFilePicker({ suggestedName: state.meta.name });
					state.writable = await handle.createWritable();
					begin('disk');
				} catch (error) { this.showReceiveChoice(state, beginDisk, () => begin('memory'), 'saveCancelled'); }
			};

			this.peer.on('open', () => {
				state.connection = this.peer.connect(fileId, { reliable: true, ordered: true });
				state.connection.on('open', () => state.connection.send({ request: 'REQUEST_METADATA' }));
				state.connection.on('data', (message) => {
					if (message.meta) {
						state.meta = message;
						if (Math.floor(Date.now() / 1000) >= message.created + message.duration) { this.showError('expired'); state.connection.close(); return; }
						if (this.supportsDiskSave()) this.showReceiveChoice(state, beginDisk, () => begin('memory'));
						else begin('memory');
						return;
					}
					if (message.chunk) this.receiveChunk(message, state, progressUi);
					if (message.eof) {
						state.eof = true;
						if (state.mode === 'disk') this.finishDisk(message, state);
						else this.finishMemory(fileId, message, state);
					}
				});
				state.connection.on('close', () => {
					if (!state.complete && !state.eof) this.showError(state.mode === 'disk' ? 'saveFailed' : 'notFound');
				});
			});
			this.peer.on('error', () => { if (!state.complete && !state.eof) this.showError('notFound'); });
		}

		supportsDiskSave() {
			return window.isSecureContext && typeof window.showSaveFilePicker === 'function';
		}

		showReceiveChoice(state, diskHandler, memoryHandler, errorKey) {
			const content = this.q('[data-ls-file-content]'); content.textContent = '';
			if (errorKey) { const error = document.createElement('p'); error.className = 'lionshare-error'; error.textContent = this.text(errorKey); content.appendChild(error); }
			const info = document.createElement('div'); info.className = 'lionshare-choice';
			const prompt = document.createElement('p'); prompt.textContent = this.text('choose');
			const name = document.createElement('strong'); name.textContent = state.meta.name;
			const size = document.createElement('span'); size.textContent = this.formatBytes(state.meta.size);
			info.append(prompt, name, size); content.appendChild(info);
			const disk = document.createElement('button'); disk.type = 'button'; disk.className = 'lionshare-button lionshare-button-primary'; disk.textContent = this.text('saveDisk'); disk.addEventListener('click', diskHandler, { once: true });
			const diskNote = document.createElement('p'); diskNote.className = 'lionshare-choice-note'; diskNote.textContent = this.text('saveNote');
			const memory = document.createElement('button'); memory.type = 'button'; memory.className = 'lionshare-button'; memory.style.width = '100%'; memory.textContent = this.text('viewBrowser'); memory.addEventListener('click', memoryHandler, { once: true });
			const memoryNote = document.createElement('p'); memoryNote.className = 'lionshare-choice-note'; memoryNote.textContent = this.text('viewNote');
			content.append(disk, diskNote, memory, memoryNote);
		}

		receiveChunk(message, state, ui) {
			const chunk = message.chunk instanceof ArrayBuffer ? new Uint8Array(message.chunk) : message.chunk;
			state.bytes += chunk.byteLength;
			if (state.mode === 'disk') {
				state.queued += chunk.byteLength;
				state.writes = state.writes.then(() => state.writable.write(chunk)).then(() => {
					state.queued -= chunk.byteLength;
					if (state.paused && state.queued <= WRITE_RESUME) { state.paused = false; state.connection.send({ request: 'FLOW_RESUME' }); }
				}).catch(() => this.showError('saveFailed'));
				if (!state.paused && state.queued >= WRITE_PAUSE) { state.paused = true; state.connection.send({ request: 'FLOW_PAUSE' }); }
			} else state.chunks.push(chunk);
			const percent = message.progress || (state.meta ? state.bytes / state.meta.size * 100 : 0);
			const elapsed = Date.now() - state.started;
			let eta = this.text('calculating');
			if (elapsed > 300 && state.bytes && state.meta) {
				const seconds = Math.max(0, Math.ceil((state.meta.size - state.bytes) / (state.bytes / elapsed) / 1000));
				eta = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
			}
			ui.strong.textContent = `${state.mode === 'disk' ? this.text('saving') : this.text('connecting')} (${Math.floor(percent)}%)`;
			ui.progress.value = percent; ui.estimate.textContent = `${this.text('estimated')} ${eta}`;
		}

		async finishDisk(message, state) {
			try { await state.writes; await state.writable.close(); }
			catch (error) { this.showError('saveFailed'); return; }
			state.complete = true;
			const content = this.q('[data-ls-file-content]'); content.textContent = '';
			const card = document.createElement('div'); card.className = 'lionshare-choice';
			const title = document.createElement('strong'); title.textContent = this.text('saved');
			const name = document.createElement('p'); name.textContent = message.name || state.meta.name;
			const note = document.createElement('p'); note.className = 'lionshare-choice-note'; note.textContent = this.text('savedNote');
			card.append(title, name, note); content.appendChild(card);
			if (this.peer) { this.peer.destroy(); this.peer = null; }
		}

		async finishMemory(fileId, message, state) {
			const meta = state.meta || message;
			const blob = new Blob(state.chunks, { type: message.type || meta.type || 'application/octet-stream' });
			state.chunks = []; state.complete = true;
			const payload = { id: fileId, created: message.created || meta.created, duration: message.duration || meta.duration, name: message.name || meta.name, type: message.type || meta.type, size: blob.size, blob };
			try { await databasePut(payload); } catch (error) { /* Preview still works without persistence. */ }
			this.renderPreview(payload);
			if (this.peer) { this.peer.destroy(); this.peer = null; }
		}

		renderPreview(file) {
			const preview = this.q('[data-ls-preview]'); preview.hidden = false;
			const meta = this.q('[data-ls-file-meta]'); meta.textContent = `${this.text('file')} ${file.name} (${this.formatBytes(file.size)})`;
			const timer = this.q('[data-ls-timer]'); timer.hidden = false;
			if (this.timer) clearInterval(this.timer);
			const tick = async () => {
				const remaining = file.created + file.duration - Math.floor(Date.now() / 1000);
				if (remaining <= 0) {
					clearInterval(this.timer); timer.hidden = true; meta.hidden = true;
					if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
					await databaseDelete(file.id); this.showError('destroyed'); return;
				}
				this.q('[data-ls-time]').textContent = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`;
				this.q('[data-ls-life-bar]').value = remaining / file.duration * 100;
			};
			tick(); this.timer = setInterval(tick, 1000);
			if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
			this.objectUrl = URL.createObjectURL(file.blob);
			this.renderFileContent(file, this.objectUrl);
		}

		async renderFileContent(file, objectUrl) {
			const content = this.q('[data-ls-file-content]'); content.textContent = '';
			const previewLimit = 40 * 1024 * 1024;
			if ((file.type || '').startsWith('image/') && file.size <= previewLimit) {
				const image = document.createElement('img'); image.src = objectUrl; image.alt = file.name; content.appendChild(image); return;
			}
			if (file.type === 'application/pdf' && file.size <= previewLimit) {
				const embed = document.createElement('embed'); embed.src = objectUrl; embed.type = 'application/pdf'; embed.style.width = '100%'; embed.style.height = '480px'; content.appendChild(embed);
				content.appendChild(this.downloadButton(file, objectUrl)); return;
			}
			const isText = (file.type || '').startsWith('text/') || /\.(json|js|css|md|xml|csv)$/i.test(file.name);
			if (isText && file.size <= previewLimit) {
				const pre = document.createElement('pre');
				const limit = 50 * 1024; pre.textContent = await file.blob.slice(0, limit).text();
				if (file.size > limit) pre.textContent += `\n\n${this.text('textTruncated')}`;
				content.append(pre, this.downloadButton(file, objectUrl)); return;
			}
			const card = document.createElement('div'); card.className = 'lionshare-choice';
			const note = document.createElement('p'); note.textContent = this.text('noPreview');
			const name = document.createElement('strong'); name.textContent = file.name; card.append(note, name);
			content.append(card, this.downloadButton(file, objectUrl));
		}

		downloadButton(file, url) {
			const link = document.createElement('a'); link.className = 'lionshare-button lionshare-button-primary';
			link.style.display = 'block'; link.style.marginTop = '12px'; link.style.textAlign = 'center'; link.style.textDecoration = 'none';
			link.href = url; link.download = file.name; link.textContent = this.text('download'); return link;
		}
	}

	document.addEventListener('DOMContentLoaded', function () {
		document.querySelectorAll('[data-lionshare-app]').forEach((root) => new LionShareApp(root).init());
	});
})();
