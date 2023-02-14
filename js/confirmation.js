const orderId = getOrderId()
displayOrderID(orderId)
cleanFullCache()

// Take orderID

function getOrderId() {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    return urlParams.get('orderId')
}


// Display in page orderID

function displayOrderID(orderId) {
    const orderIdElement = document.getElementById('orderId')
    orderIdElement.textContent = orderId
}

// Secure & clean cache 

function cleanFullCache() {
    const cache = window.localStorage
    cache.clear()
}

