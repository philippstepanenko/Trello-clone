const Note = {
	idCounter: 8,
	dragged: null,

	process (noteElement) {
		noteElement.addEventListener('dblclick', (event) => {
			noteElement.setAttribute('contenteditable', 'true') 
			noteElement.removeAttribute('draggable')
			noteElement.closest('.column').removeAttribute('draggable')
			Label.setCarriage(noteElement)
			noteElement.focus() 
		})

		noteElement.addEventListener('blur', (event) => {
			noteElement.removeAttribute('contenteditable') 
			noteElement.setAttribute('draggable', 'true')
			noteElement.closest('.column').setAttribute('draggable', 'true')
			noteElement.textContent = noteElement.textContent.trim()
			if (!noteElement.textContent.length){
				noteElement.remove()
			}
	})

	noteElement.addEventListener('dragstart', Note.dragstart) 
	noteElement.addEventListener('dragend', Note.dragend) 
	noteElement.addEventListener('dragenter', Note.dragenter) 
	noteElement.addEventListener('dragover', Note.dragover) 
	noteElement.addEventListener('dragleave', Note.dragleave) 
	noteElement.addEventListener('drop', Note.drop)
	},

	dragstart(event){
		//console.log('dragstart', event, this)
		Note.dragged = this
		this.classList.add('dragged')

		event.stopPropagation()
	},
	dragend(event){
		//console.log('dragend', event, this)
		Note.dragged = null
		this.classList.remove('dragged')

		document
			.querySelectorAll('.note')
			.forEach(x => x.classList.remove('under'))
	},
	dragenter(event){
		if (this === Note.dragged){
			return
		}
		//console.log('dragenter', event, this)
		this.classList.add('under')
	},
	dragover(event){
		event.preventDefault()
		if (this === Note.dragged){
			return
		}
		//console.log('dragover', event, this)
	},
	dragleave(event){
		if (this === Note.dragged){
			return
		}
		//console.log('dragleave', event, this)
		this.classList.remove('under')
	},
	drop(event){
		event.stopPropagation()

		if (this === Note.dragged){
			return
		}

		if (this.parentElement === Note.dragged.parentElement){
			const note = Array.from(this.parentElement.querySelectorAll('.note'))
			const indexA = note.indexOf(this)
			const indexB = note.indexOf(Note.dragged)

			if (indexA < indexB){
				this.parentElement.insertBefore(Note.dragged,this)
			} else {
				this.parentElement.insertBefore(Note.dragged,this.nextElementSibling)
			}

		} else {
			this.parentElement.insertBefore(Note.dragged,this)
		}

	}

}