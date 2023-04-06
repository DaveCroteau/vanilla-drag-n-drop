document.querySelectorAll('.list-element').forEach(i => {
	i.addEventListener('dragstart', onDragStart)
	i.addEventListener('dragover', onDragOver)
	i.addEventListener('dragenter', onDragEnter)
	i.addEventListener('dragleave', onDragLeave)
	i.addEventListener('drop', onDrop)
	i.addEventListener('dragend', onDragEnd)
})

let ref = null
let target = null
let pos = null

function onDragStart(e) {
	e.target.classList.add('dragging')
	ref = e.target
}

function onDragEnter(e) {
	e.target.classList.add('dragged')
}

function onDragOver(e) {
	// console.log('onDragOver', e)
	e.preventDefault()
	manageDropZones(e)
}

function onDragLeave(e) {
	clearDropZones()
	e.target.classList.remove('dragged')
}

function onDrop(e) {
	e.target.classList.remove('dragged')
	target = e.target
}

function onDragEnd(e) {
	e.target.classList.remove('dragging')
	move()
	clearDropZones()
	clearRefs()
}

function move() {
	if (!ref || !target || !pos) return
	target.insertAdjacentElement(pos, ref)
}

function clearRefs() {
	ref = null
	target = null
}

function manageDropZones(e) {
	const rect = e.target.getBoundingClientRect()
	const top = rect.y
	const center = top + rect.height / 2
	const bottom = rect.bottom
	const isUp = e.clientY >= top && e.clientY < center
	const isDown = e.clientY >= center && e.clientY < bottom

	if (isUp) {
		e.target.classList.remove('bottom')
		e.target.classList.add('top')
		pos = 'beforebegin'
	}

	if (isDown) {
		e.target.classList.remove('top')
		e.target.classList.add('bottom')
		pos = 'afterend'
	}
}

function clearDropZones() {
	document.querySelectorAll('.top').forEach(e => e.classList.remove('top'))
	document.querySelectorAll('.bottom').forEach(e => e.classList.remove('bottom'))
	pos = null
}
