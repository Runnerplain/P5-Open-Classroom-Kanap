const orderId = getOrderId()
displayOrderID(orderId)
cleanFullCache()

function getOrderId() {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    return urlParams.get('orderId')
}



function displayOrderID(orderId) {
    const orderIdElement = document.getElementById('orderId')
    orderIdElement.textContent = orderId
}

function cleanFullCache() {
    const cache = window.localStorage
    cache.clear()
}

