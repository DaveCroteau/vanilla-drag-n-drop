const state = {
	ref: null,
	target: null,
	isValid() {
		return this.ref !== null && this.target !== null
	},
	reset() {
		this.ref = null
		this.target = null
	},
}

document.addEventListener('DOMContentLoaded', onDomLoad)

async function onDomLoad() {
	setTitle('Rick and Morty draggable list')
	await getCharacters()
	setEventListeners()
}

function setTitle(title) {
	document.querySelector('#project-title').textContent = title
}

async function getCharacters() {
	try {
		const res = await fetch('https://rickandmortyapi.com/api/character?page=1')
		if (!res.ok) throw new Error('Could not get characters')
		const data = await res.json()
		if (!data.results.length) throw new Error('Nothing to show...')
		setCharacters(data.results)
	} catch (error) {
		emptyList(error.message)
	}
}

function setCharacters(characters) {
	const list = document.querySelector('#list')
	const html = characters.reduce((acc, character) => {
		return (acc += `
			<div draggable="true">
				<div class="card">
					<span class="material-symbols-outlined">drag_handle</span>
					<h3>${character.id} - ${character.name} - ${character.gender} - ${character.status}</h3>
				</div>
				<div class="dropzone">Drop</div>
			</div>
    `)
	}, '<div class="dropzone">Drop</div>')

	list.innerHTML = html
}

function emptyList(message) {
	const list = document.querySelector('#list')
	const error = `<h1>${message}...</h1>`
	list.innerHTML = error
}

function onDragStart(e) {
	e.target.classList.add('dragged')
	state.ref = e.target
}

function onDragEnter(e) {
	const isNotAbove = state.ref.previousElementSibling.querySelector('.dropzone') !== e.target
	const isNotBelow = state.ref.querySelector('.dropzone') !== e.target
	if (isNotAbove && isNotBelow) e.target.classList.add('dragover')
}

function onDragOver(e) {
	e.preventDefault()
	e.dataTransfer.dropEffect = e.target.classList.contains('dropzone') ? 'move' : 'none'
}

function onDragLeave(e) {
	e.target.classList.remove('dragover')
}

function onDrop(e) {
	e.target.classList.remove('dragover')
	state.target = e.target.closest('[draggable="true"]') || e.target
}

function onDragEnd(e) {
	e.target.classList.remove('dragged')
	if (state.isValid()) state.target.insertAdjacentElement('afterend', state.ref)
	state.reset()
}

function setEventListeners() {
	document.querySelectorAll('[draggable="true"]').forEach(i => {
		i.addEventListener('dragstart', onDragStart)
		i.addEventListener('dragover', onDragOver)
		i.addEventListener('dragend', onDragEnd)
	})

	document.querySelectorAll('.dropzone').forEach((i, index) => {
		i.addEventListener('dragenter', onDragEnter)
		i.addEventListener('dragleave', onDragLeave)
		i.addEventListener('drop', onDrop)

		if (index === 0) i.addEventListener('dragover', onDragOver)
	})
}
