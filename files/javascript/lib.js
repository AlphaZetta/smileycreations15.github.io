(function () {
	var _internalPrivate = {}
	_internalPrivate.instanceCount = 0
	self.smileycreations15_api = function smileycreations15() {
		_internalPrivate.instanceCount += 1
		// privateData
		var _private = {}

		// make native
		var makeNative = function (obj, template) {
			let obj1 = obj
			obj1.toString = () => {
				return template
			}
			obj1.toString.toString = () => "function toString(){ [native code] }"
			obj1.toString.toString.toString = obj1.toString.toString

			obj1.toLocaleString = () => {
				return template
			}
			obj1.toLocaleString.toLocaleString = () => "function toLocaleString(){ [native code] }"
			obj1.toLocaleString.toString = () => "function toString(){ [native code] }"
			obj1.toLocaleString.toLocaleString.toLocaleString = obj1.toLocaleString.toLocaleString
			obj1.toLocaleString.toString.toLocaleString = obj1.toString.toLocaleString
			obj1.toLocaleString.toLocaleString.toString = obj1.toLocaleString.toLocaleString
			obj1.toLocaleString.toString.toLocaleString = obj1.toString.toLocaleString

			return obj1
		}
		// prototype
		var smileycreations15_prototype = {}
		// sound element
		smileycreations15_prototype.createSoundElement = function createSoundElement(sources) {
			var a = document.createElement("audio");
			if (!Array.isArray(sources)) {
				throw new TypeError("Expected array.")
			}
			for (var i = 0; i !== sources.length; i++) {
				if (typeof sources[i] !== "object" || typeof sources[i].url !== "string" || typeof sources[i].type !== "string") {
					throw new Error("Filename or type is not valid or missing.");
				}
				var b = document.createElement("source");
				b.src = sources[i].url;
				b.type = sources[i].type;
				a.appendChild(b);
			}
			return a;
		}
		// dialog box
		smileycreations15_prototype.dialogBox = function dialogBox(location = "top-left", type = "plain", dialogContent, black = true) {
			let dialog = document.createElement("div")
			dialog.className = "notify " + location + " do-show font-notify"
			dialog.dataset.notificationStatus = type
			dialog.innerHTML = dialogContent // positions : bottom-right, top-left, top-right, bar-bottom, bar-top, bottom-right, bottom-left
			let blackText = ["success"


				, "notice"


				, "error"


				, "warning"
			] // notification types: success, notice, error, plain, warning, transparent

			if (blackText.includes(type) && black !== false) {
				dialog.style.color = "black"
			}

			document.body.appendChild(dialog)
		}

		// loader overlay
		smileycreations15_prototype.showLoaderOverlay = function showLoaderOverlay(id, text = null, overlayHtml = false) {
			if (null !== document.getElementById(id)) throw new Error("The element already exists.");
			let div = document.createElement("div")
			let option = "center"

			if (true === overlayHtml) {
				option = "overlay"
			}

			div.className = "overlay"
			div.id = id
			div.style.display = "none"

			if (null === text || undefined === text) {
				div.innerHTML = '<div class="text-' + option + '"></div><div class="progress-slider"><div class="line"></div><div class="progress-subline inc"></div><div class="progress-subline dec"></div></div>'
			} else {
				div.innerHTML = '<div class="text-overlay">' + text + '</div><div class="progress-slider"><div class="line"></div><div class="progress-subline inc"></div><div class="progress-subline dec"></div></div>'
			}

			document.body.appendChild(div)
			var proto = {

				"element": document.getElementById(id),
				"show": function () {
						if (null === document.getElementById(id)) throw new Error("The element could not be found, and may be removed from the DOM.");
						document.getElementById(id)
							.style.display = "block"
					}

					,
				"hide": function () {
						if (null === document.getElementById(id)) throw new Error("The element could not be found, and may be removed from the DOM.");
						document.getElementById(id)
							.style.display = "none"
					}

					,
				"remove": function () {
					if (null === document.getElementById(id)) throw new Error("The element could not be found, and may be removed from the DOM.");
					document.body.removeChild(document.getElementById(id))
				}
			}

			// proto.remove = makeNative(proto.remove, "function remove(){ [native code] }")
			// proto.show = makeNative(proto.show, "function show(){ [native code] }")
			// proto.hide = makeNative(proto.hide, "function hide(){ [native code] }")
			proto[Symbol.toStringTag] = "LoaderOverlay"
			return Object.create(proto)
		}
		// native code
		// smileycreations15_prototype.dialogBox = makeNative(smileycreations15_prototype.dialogBox, "function dialogBox(position,type,contents){ [native code] }")
		// smileycreations15_prototype.showLoaderOverlay = makeNative(smileycreations15_prototype.showLoaderOverlay, "function showLoaderOverlay(id,contents?,class_center?){ [native code] }")
		// create object
		smileycreations15_prototype[Symbol.toStringTag] = "smileycreations15";
		(function () {
			var store;
			var Store = class Store {
				constructor(dbName = 'smileycreations15-store', storeName = 'main') {
					this.storeName = storeName;
					this._dbp = new Promise((resolve, reject) => {
						const openreq = indexedDB.open(dbName, 1);
						openreq.onerror = () => reject(openreq.error);
						openreq.onsuccess = () => resolve(openreq.result);
						// First time setup: create an empty object store
						openreq.onupgradeneeded = () => {
							openreq.result.createObjectStore(storeName);
						};
					});
				}
				_withIDBStore(type, callback) {
					return this._dbp.then(db => new Promise((resolve, reject) => {
						const transaction = db.transaction(this.storeName, type);
						transaction.oncomplete = () => resolve();
						transaction.onabort = transaction.onerror = () => reject(transaction.error);
						callback(transaction.objectStore(this.storeName));
					}));
				}
			}
			let getDefaultStore = function getDefaultStore() {
				if (!store)
					store = new Store();
				return store;
			}

			let get = function get(key, store = getDefaultStore()) {
				let req;
				return store._withIDBStore('readonly', store => {
						req = store.get(key);
					})
					.then(() => req.result);
			}

			let set = function set(key, value, store = getDefaultStore()) {
				return store._withIDBStore('readwrite', store => {
					store.put(value, key);
				});
			}

			let del = function del(key, store = getDefaultStore()) {
				return store._withIDBStore('readwrite', store => {
					store.delete(key);
				});
			}

			let clear = function clear(store = getDefaultStore()) {
				return store._withIDBStore('readwrite', store => {
					store.clear();
				});
			}

			let keys = function keys(store = getDefaultStore()) {
				const keys = [];
				return store._withIDBStore('readonly', store => {
						// This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
						// And openKeyCursor isn't supported by Safari.
						(store.openKeyCursor || store.openCursor)
						.call(store)
							.onsuccess = function () {
								if (!this.result)
									return;
								keys.push(this.result.key);
								this.result.continue();
							};
					})
					.then(() => keys);
			}
			var obj123 = {
				"Store": Store,
				"get": get,
				"set": set,
				"del": del,
				"clear": clear,
				"keys": keys
			}
			smileycreations15_prototype.database = obj123
		})()
		smileycreations15_prototype.encoding = {}
		smileycreations15_prototype.encoding.encode = function encode(string, base = 36) {
			var number = "";
			var length = string.length;
			for (var i = 0; i < length; i++)
				number += string.charCodeAt(i)
				.toString(base);
			return number;
		}
		smileycreations15_prototype.encoding.decode = function decode(encoded, base = 36) {
			var string = "";
			var length = encoded.length;
			for (var i = 0; i < length;) {
				var code = encoded.slice(i, i += 2);
				string += String.fromCharCode(parseInt(code, base));
			}
			return string;
		}
		smileycreations15_prototype.tooltip = {}
		smileycreations15_prototype.tooltip.show = function () {
			document.getElementById("loading-side-tooltip")
				.style.display = ""
		}
		smileycreations15_prototype.tooltip.hide = function () {
			document.getElementById("loading-side-tooltip")
				.style.display = "none"
		}
		smileycreations15_prototype.tooltip.setHtml = function (html) {
			document.getElementById("loading-side-tooltip")
				.innerHTML = html
		}
		smileycreations15_prototype.randomId = function randomId(length, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
			var result = '';
			var characters = chars;
			var charactersLength = characters.length;
			for (var i = 0; i < length; i++) {
				result += characters.charAt(Math.floor(Math.random() * charactersLength));
			}
			return result;
		}
		smileycreations15_prototype.setDraggable = function setDraggable(dragHandler) {
			var dragItem = dragHandler
			var container = dragHandler
			var active = false;
			var currentX;
			var currentY;
			var initialX;
			var initialY;
			var xOffset = 0;
			var yOffset = 0;

			container.addEventListener("touchstart", dragStart, false);
			container.addEventListener("touchend", dragEnd, false);
			container.addEventListener("touchmove", drag, false);

			container.addEventListener("mousedown", dragStart, false);
			container.addEventListener("mouseup", dragEnd, false);
			container.addEventListener("mousemove", drag, false);

			function dragStart(e) {
				if (e.type === "touchstart") {
					initialX = e.touches[0].clientX - xOffset;
					initialY = e.touches[0].clientY - yOffset;
				} else {
					initialX = e.clientX - xOffset;
					initialY = e.clientY - yOffset;
				}

				if (e.target === dragItem) {
					active = true;
				}
			}

			function dragEnd(e) {
				initialX = currentX;
				initialY = currentY;

				active = false;
			}

			function drag(e) {
				if (active) {

					e.preventDefault();

					if (e.type === "touchmove") {
						currentX = e.touches[0].clientX - initialX;
						currentY = e.touches[0].clientY - initialY;
					} else {
						currentX = e.clientX - initialX;
						currentY = e.clientY - initialY;
					}

					xOffset = currentX;
					yOffset = currentY;

					setTranslate(currentX, currentY, dragItem);
				}
			}

			function setTranslate(xPos, yPos, el) {
				el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
			}
		}
		smileycreations15_prototype.objectId = function () {
			return _private.id
		}
		smileycreations15_prototype.scroll = {}
		smileycreations15_prototype.scroll.disable = function () {
			document.body.style.overflow = "hidden"
		}
		smileycreations15_prototype.scroll.enable = function () {
			document.body.style.overflow = ""
		}

		smileycreations15_prototype.trapFocus = function trapFocus(elem) {
			var focusIndex = 0;
			const focusable = "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex]:not(*[tabindex='-1']), *[contenteditable]";
			if (null !== document.querySelector(":focus")) document.querySelector(":focus").blur();
			if (0 === elem.querySelectorAll(focusable).length) {
				var element = document.createElement("focustrap")
				element.setAttribute("tabindex", "0")
				elem.appendChild(element)
			}
			elem.querySelectorAll(focusable)[0].focus();
			elem.addEventListener("keydown", function (evt) {
				if (evt.which === 9) {
					evt.preventDefault();
					if (evt.shiftKey) {
						if (focusIndex !== 0) {
							focusIndex -= 1
							elem.querySelectorAll(focusable)[focusIndex].focus();
						}
					} else {
						if (focusIndex !== elem.querySelector(focusable).length) {
							focusIndex += 1
							elem.querySelectorAll(focusable)[focusIndex].focus();
						}
					}
				}
			});
		}
    smileycreations15_prototype.modal = function (html) {
      var div = document.createElement("div")
      div.className = "grey-overlay"
      var id = smileycreations15_prototype.randomId(30)
      div.innerHTML = '<div class="modal" id="' + id + '-modal">' + html + '</div>'
      div.id = id
      document.body.appendChild(div)
      div = document.getElementById(id + "-modal")
      smileycreations15_prototype.trapFocus(div)
      return {
        "element": document.getElementById(id),
        "modal": document.getElementById(id + "-modal")
      }
    }
		smileycreations15_prototype.deprecated = {}

		smileycreations15_prototype.deprecated.modal = function (html) {
			const focusableQuery = 'input:not([disabled]):not([tabindex="-1"]), area:not([tabindex="-1"]), div:not([tabindex="-1"]), button:not([tabindex="-1"]),[tabindex]:not([tabindex="-1"]):not([tabindex=""]), textarea:not([tabindex="-1"])'
			var div = document.createElement("div")
			div.className = "grey-overlay"
			var id = smileycreations15_prototype.randomId(30)
			div.innerHTML = '<div class="modal" id="' + id + '-modal">' + html + '</div>'
			div.id = id
			document.body.appendChild(div)
			div = document.getElementById(id + "-modal")
			if (null !== document.getElementById(id + "-modal")
				.querySelector(focusableQuery)) {
				document.getElementById(id + "-modal")
					.querySelector(focusableQuery)
					.focus()
			}
			document.getElementById(id + "-modal")
				.addEventListener('transitionend', function (e) {
					if (null !== document.getElementById(id + "-modal")
						.querySelector(focusableQuery)) {
						document.getElementById(id + "-modal")
							.querySelector(focusableQuery)
							.focus()
					}
				})
			return {
				"element": document.getElementById(id),
				"modal": document.getElementById(id + "-modal")
			}
		}
		smileycreations15_prototype.deprecated.setDraggable = function setDraggable(elmnt, handle) {
			var pos1 = 0,
				pos2 = 0,
				pos3 = 0,
				pos4 = 0;
			if (handle) {
				// if present, the header is where you move the DIV from:
				handle.onmousedown = dragMouseDown;
			} else {
				// otherwise, move the DIV from anywhere inside the DIV:
				elmnt.onmousedown = dragMouseDown;
			}

			function dragMouseDown(e) {
				e = e || window.event;
				e.preventDefault();
				// get the mouse cursor position at startup:
				pos3 = e.clientX;
				pos4 = e.clientY;
				document.onmouseup = closeDragElement;
				// call a function whenever the cursor moves:
				document.onmousemove = elementDrag;
			}

			function elementDrag(e) {
				e = e || window.event;
				e.preventDefault();
				// calculate the new cursor position:
				pos1 = pos3 - e.clientX;
				pos2 = pos4 - e.clientY;
				pos3 = e.clientX;
				pos4 = e.clientY;
				// set the element's new position:
				elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
				elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
			}

			function closeDragElement() {
				// stop moving when mouse button is released:
				document.onmouseup = null;
				document.onmousemove = null;
			}
		}
		smileycreations15_prototype.showNotification = async function (title, options = {}) {
			if (self.registration) {
				if (self.registration.showNotification) {
					self.registration.showNotification(title, options)
					return await registration.getNotifications()[(await registration.getNotifications()).length]
				}
			} else {
				return new Notification(title, options)
			}
		}
		_private.id = smileycreations15_prototype.randomId(15)
		return Object.create(smileycreations15_prototype)
	}
	// smileycreations15_api = (function(obj, template) {
	//     let obj1 = obj
	//     obj1.toString = () => {
	//         return template
	//     }
	//     obj1.toString.toString = () => "function toString(){ [native code] }"
	//     obj1.toString.toString.toString = obj1.toString.toString
	//
	//     obj1.toLocaleString = () => {
	//         return template
	//     }
	//     obj1.toLocaleString.toLocaleString = () => "function toLocaleString(){ [native code] }"
	//     obj1.toLocaleString.toString = () => "function toString(){ [native code] }"
	//     obj1.toLocaleString.toLocaleString.toLocaleString = obj1.toLocaleString.toLocaleString
	//     obj1.toLocaleString.toString.toLocaleString = obj1.toString.toLocaleString
	//     obj1.toLocaleString.toLocaleString.toString = obj1.toLocaleString.toLocaleString
	//     obj1.toLocaleString.toString.toLocaleString = obj1.toString.toLocaleString
	//
	//     return obj1
	// })(smileycreations15_api, "function smileycreations15(){ [native code] }")
	self.smileycreations15 = smileycreations15_api()
})()
