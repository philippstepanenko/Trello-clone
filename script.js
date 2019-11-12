let noteIdCounter = 8
let columnIdCounter = 4
let draggedNote = null

document
	.querySelectorAll('.column')
	.forEach(columnProcess) 

document
	.querySelector('[data-action-addColumn]')
	.addEventListener('click', (event) => {
		const columnElement = document.createElement('div') 
		columnElement.classList.add('column') 
		columnElement.setAttribute('draggable', 'true') 
		columnElement.setAttribute('data-column-id', columnIdCounter) 
		
		columnElement.innerHTML = `<p class="column-header">В плане</p>
								  <div data-notes></div>
								  <p class="column-footer">
								  <span data-action-addNote class="action">+ Добавить карточку</span>
								  </p>`
		
		columnIdCounter ++
		document.querySelector('.columns').append(columnElement) 
		columnProcess(columnElement)
	}) 
	
document
	.querySelectorAll('.note')
	.forEach(noteProcess) 
	
function columnProcess (columnElement) {
	const spanAction_addNote = columnElement.querySelector('[data-action-addNote]') 
		
	spanAction_addNote.addEventListener('click', (event) => {
		const noteElement = document.createElement('div') 
		noteElement.classList.add('note') 
		noteElement.setAttribute('draggable', 'true') 
		noteElement.setAttribute('data-note-id', noteIdCounter) 
		noteIdCounter++ 

		columnElement.querySelector('[data-notes]').append(noteElement) 
		noteProcess(noteElement)

		noteElement.setAttribute('contenteditable', 'true')
		noteElement.focus()
	}) 
	const headerElement = columnElement.querySelector('.column-header') 
	headerElement.addEventListener('dblclick', (event) => {
		headerElement.setAttribute('contenteditable', 'true') 
		setCaret(headerElement)
		headerElement.focus() 
	}) 
	
	headerElement.addEventListener('blur', (event) => {
		headerElement.removeAttribute('contenteditable') 
	}) 		

	columnElement.addEventListener('dragover', (event) => {
		event.preventDefault()
	})

	columnElement.addEventListener('drop', (event) => {
		if (draggedNote){
			return columnElement.querySelector('[data-notes]').append(draggedNote)
		}
	})
}

function noteProcess(noteElement) {
	noteElement.addEventListener('dblclick', (event) => {
		noteElement.setAttribute('contenteditable', 'true') 
		noteElement.removeAttribute('draggable')
		noteElement.closest('.column').removeAttribute('draggable')
		setCaret(noteElement)
		noteElement.focus() 
	})

	noteElement.addEventListener('blur', (event) => {
		noteElement.removeAttribute('contenteditable') 
		noteElement.setAttribute('draggable', 'true')
		noteElement.closest('.column').setAttribute('draggable', 'true')
		if (!noteElement.textContent.trim().length){
			noteElement.remove()
		}
	})

	noteElement.addEventListener('dragstart', dragstart_noteHandler) 
	noteElement.addEventListener('dragend', dragend_noteHandler) 
	noteElement.addEventListener('dragenter', dragenter_noteHandler) 
	noteElement.addEventListener('dragover', dragover_noteHandler) 
	noteElement.addEventListener('dragleave', dragleave_noteHandler) 
	noteElement.addEventListener('drop', drop_noteHandler) 
}

function dragstart_noteHandler(event){
	//console.log('dragstart', event, this)
	draggedNote = this
	this.classList.add('dragged')

	event.stopPropagation()
}
function dragend_noteHandler(event){
	//console.log('dragend', event, this)
	draggedNote = null
	this.classList.remove('dragged')

	document
		.querySelectorAll('.note')
		.forEach(x => x.classList.remove('under'))
}
function dragenter_noteHandler(event){
	if (this === draggedNote){
		return
	}
	//console.log('dragenter', event, this)
	this.classList.add('under')
}
function dragover_noteHandler(event){
	event.preventDefault()
	if (this === draggedNote){
		return
	}
	//console.log('dragover', event, this)
}
function dragleave_noteHandler(event){
	if (this === draggedNote){
		return
	}
	//console.log('dragleave', event, this)
	this.classList.remove('under')
}
function drop_noteHandler(event){
	event.stopPropagation()

	if (this === draggedNote){
		return
	}

	if (this.parentElement === draggedNote.parentElement){
		const note = Array.from(this.parentElement.querySelectorAll('.note'))
		const indexA = note.indexOf(this)
		const indexB = note.indexOf(draggedNote)

		if (indexA < indexB){
			this.parentElement.insertBefore(draggedNote,this)
		} else {
			this.parentElement.insertBefore(draggedNote,this.nextElementSibling)
		}

	} else {
		this.parentElement.insertBefore(draggedNote,this)
	}

	//console.log(this)
	//console.log(draggedNote)
	//console.log('drop', event, this)
}

function setCaret(node){
	if (node.textContent.length > 0){
		const range = document.createRange();
		const sel = window.getSelection();
		range.setStart(node.childNodes[0], node.textContent.length);
		range.collapse(true);
		sel.removeAllRanges();
		sel.addRange(range);
	}
}