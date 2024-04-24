const defaultConfig = {
    open: true,
    debug: true,
    animatable: true,
}
export default function draggable($element, config = defaultConfig) {
    if (!($element instanceof HTMLElement)) {
        return console.warn(`Elemento invalido se esperaba un HTMLElment y se recibio ${$element}`)
    }

    let isOpen = config.open
    let isDragging = false
    const elementRect = $element.getBoundingClientRect()
    const ELEMENT_BLOCK_SIZE = elementRect.height
    const $marker = $element.querySelector('[data-marker]')
    const MARKER_BLOCK_SIZE = $marker.getBoundingClientRect().height

    const VISIBLE_Y_POSITION = 0
    const HIDDEN_Y_POSITION = ELEMENT_BLOCK_SIZE - MARKER_BLOCK_SIZE
    let widgetPosition = VISIBLE_Y_POSITION

    isOpen ? open() : close()
    let startY = 0
    $marker.addEventListener('click', handleClick)
    $marker.addEventListener('pointerdown', handlePointerDown)
    $marker.addEventListener('pointerup', handlePointerUp)
    $marker.addEventListener('pointerout', handlePointerOut)
    $marker.addEventListener('pointercancel', handlePointerCancel)
    $marker.addEventListener('pointermove', handlePointerMove)

    if (config.animatable) {
        setAnimation()
    }

    function handlePointerOut() {
        looger('Pointer OUT')
        dragEnd()
    }

    function handlePointerCancel() {
        looger('Pointer CANCEL')
        dragEnd()
    }

    function handlePointerDown(event) {
        looger('Pointer DOWN')
        startDrag(event)
    }

    function handlePointerUp() {
        looger('Pointer UP')
        dragEnd()
    }

    function handlePointerMove(event) {
        looger('Pointer Move')
        drag(event)
    }

    function handleClick(event) {
        looger('CLICK')
        toggle()
    }

    function pageY(event) {
        return event.pageY || event.tocuhes[0].pageY
    }

    function startDrag(event) {
        isDragging = true
        startY = pageY(event)
        looger({startY})
    }

    function setAnimation(){
        $element.style.transition = 'margin-bottom .3s'
    }

    function bounce() {
        if (widgetPosition < ELEMENT_BLOCK_SIZE / 2){
            return open()
        }
        return close()
    }

    function dragEnd() {
        looger('Drag End')
        isDragging = false
        bounce()
    }

    function toggle() {
        if (!isDragging){            
            if(!isOpen){
                return open()
            }
                return close()
        }
        
    }


    function looger(message) {
        if (defaultConfig.debug) {
            console.info(message)
        }
    }

    function open() {
        looger('Abrir Widget')
        isOpen = true
        widgetPosition = VISIBLE_Y_POSITION
        setWidgetPosition(widgetPosition)
    }

    function close() {
        looger('Cerrar Widget')
        isOpen = false
        widgetPosition = HIDDEN_Y_POSITION
        setWidgetPosition(widgetPosition)
    }

    function setWidgetPosition(value) {
        $element.style.marginBottom = `-${value}px`
    }


    function drag(event) {
        const cursorY = pageY(event)
        const movementY = cursorY - startY
        widgetPosition = widgetPosition + movementY
        startY = cursorY
        if (widgetPosition > HIDDEN_Y_POSITION){
            return false
        }
        setWidgetPosition(widgetPosition)
    }
}