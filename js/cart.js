// ------------------------ Variable globale--------------

const cart = []

retrieveItemFromCache()
cart.forEach((item) => displayItem(item))

const orderButton = document.querySelector('#order')
orderButton.addEventListener('click', (e) => submitForm(e))


// -------------------------Go check & take from cache----------------- 

function retrieveItemFromCache() {
  const numberOfItems = localStorage.length
  for (let i = 0; i < numberOfItems; i++) {
    const item =
      localStorage.getItem(localStorage.key(i)) ||
      ''
    const itemObjet = JSON.parse(item)
    cart.push(itemObjet)
  }
}

function displayItem(item) {
  const article = makeArticle(item)
  const imageDiv = makeImageDiv(item)
  article.appendChild(imageDiv)
  const card__Item__Content = makeCartContent(item)
  article.appendChild(card__Item__Content)
  displayArticle(article)
  displayTotalQuantity()
  displayTotalPrice()
}


let getKey = (item) => {
  return `${item.id}-${item.color}`
}

// ------------- Using 'reduce' instead of 'for each'--------------


function displayTotalQuantity() {
  const totalQuantity = document.querySelector('#totalQuantity')
  const total = cart.reduce((total, item) => total + item.quantity, 0)
  totalQuantity.textContent = total
}

function displayTotalPrice() {
  const totalPrice = document.querySelector('#totalPrice')
  const total = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  totalPrice.textContent = total
}


function displayArticle(article) {
  document.querySelector('#cart__items').appendChild(article)
}


// --------------------- Making function------------------------ 

function makeArticle(item) {
  const article = document.createElement('article')
  article.classList.add('card__item')
  article.dataset.id = item.id
  article.dataset.color = item.color
  return article
}

function makeImageDiv(item) {
  const div = document.createElement('div')
  div.classList.add('cart__item__img')
  const image = document.createElement('img')
  image.src = item.imageUrl
  image.alt = item.altTxt
  div.appendChild(image)
  return div
}


function makeRequestBody() {
  const form = document.querySelector('.cart__order__form')
  const firstName = form.elements.firstName.value
  const lastName = form.elements.lastName.value
  const address = form.elements.address.value
  const city = form.elements.city.value
  const email = form.elements.email.value
  const body = {
    contact: {
      firstName: firstName,
      lastName: lastName,
      address: address,
      city: city,
      email: email,
    },
    products: getIdsFromCache(),
  }
  return body
}


function makeCartContent(item) {
  const cardItemContent = document.createElement('div')
  cardItemContent.classList.add('cart__item__content')
  const description = makeDescription(item)
  const settings = makeSettings(item)
  cardItemContent.appendChild(description)
  cardItemContent.appendChild(settings)
  return cardItemContent
}

function makeSettings(item) {
  const settings = document.createElement('div')
  settings.classList.add('cart__item__content__settings')
  addQuantityToSettings(settings, item)
  addDeleteToSettings(settings, item)
  return settings
}

function makeDescription(item) {
  const description = document.createElement('div')
  description.classList.add('cart__item__content__description')
  const h2 = document.createElement('h2')
  h2.textContent = item.name
  const p = document.createElement('p')
  p.textContent = item.color
  const p2 = document.createElement('p')
  p2.textContent = item.price + ' €'
  description.appendChild(h2)
  description.appendChild(p)
  description.appendChild(p2)
  return description
}


function getIdsFromCache() {
  const numberOfProducts = localStorage.length
  const ids = []
  for (let i = 0; i < numberOfProducts; i++) {
    const key = localStorage.key(i)
    const id = key.split('-')[0]
    ids.push(id)
  }
  return ids
}



function addDeleteToSettings(settings, item) {
  const div = document.createElement('div')
  div.classList.add('cart__item__content__settings__delete')
  div.addEventListener('click', () => deleteItem(item))
  const p = document.createElement('p')
  p.textContent = 'Supprimer'
  div.appendChild(p)
  settings.appendChild(div)
}


function addQuantityToSettings(settings, item) {
  const quantity = document.createElement('div')
  quantity.classList.add('cart__item__content__settings__quantity')
  const p = document.createElement('p')
  p.textContent = 'Qté : '
  quantity.appendChild(p)
  const input = document.createElement('input')
  input.type = 'number'
  input.classList.add('itemQuantity')
  input.name = 'itemQuantity'
  input.min = '1'
  input.max = '100'
  input.value = item.quantity
  input.addEventListener('input', () =>
    updatePriceAndQuantity(item.id, input.value, item),
  )
  quantity.appendChild(input)
  settings.appendChild(quantity)
}

function updatePriceAndQuantity(id, newValue, item) {
  const itemToUpdate = cart.find((item) => item.id === id)
  itemToUpdate.quantity = Number(newValue)
  item.quantity = itemToUpdate.quantity
  displayTotalPrice()
  displayTotalQuantity()
  saveNewDataToCache(item)
}

// ----------DELETE function-------------------

function deleteItem(item) {
  const itemToDelete = cart.findIndex(
    (product) => product.id === item.id && product.color === item.color,
  )
  delete cart.splice(itemToDelete, 1)
  displayTotalPrice()
  displayTotalQuantity()
  deleteDataFromCache(item)
  deleteArticleFromPage(item)
}

function deleteArticleFromPage(item) {
  const articleToDelete = document.querySelector(
    `article[data-id="${item.id}"][data-color="${item.color}"]`,
  )
  articleToDelete.remove()
}
function deleteDataFromCache(item) {
  const key = `${item.id}-${item.color}`
  localStorage.removeItem(key)
  localStorage.removeItem(key)
}

//------------ Saving new data(informations) to cache-------------

function saveNewDataToCache(item) {
  const dataToSave = JSON.stringify(item)
  const key = getKey(item)
  localStorage.setItem(key, dataToSave)
}

// ------------- Prevent for no refreshing page & alert --------------- /

function submitForm(e) {
  e.preventDefault()
  if (cart.length === 0) {
    alert('S\il vous plait, choisissez au moins un article !')
    return false
  }
  if (isFormInvalid()) return
  if (isEmailInvalid()) return

  // ------------ API create data --------- 

  const body = makeRequestBody()
  fetch('http://localhost:3000/api/products/order', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const orderId = data.orderId
      window.location.href = '/html/confirmation.html' + '?orderId=' + orderId
    })
    .catch((err) => console.error(err))
}

// ----------- Final check for 'form' & 'email' before confirmation with REGEX check validator ---------------
function isFinalOrderIsInvalid(itemQuantity) {
  if (itemQuantity <= 0 || itemQuantity >= 100) {
    handleError()
    return;
  } else (makeRequestBody())
}


function isFormInvalid() {
  const form = document.querySelector('.cart__order__form')
  const inputs = form.querySelectorAll('input')
  inputs.forEach((input) => {
    if (input.value === '') {
      alert("S'il vous plait, remplissez tous les champs du formulaire")

    }
  })
  return false
}


function isEmailInvalid() {
  const email = document.querySelector('#email').value
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  if (regex.test(email) === false) {
    alert("S'il vous plait, entrez un email correct")
    return true
  }
  return false
}

function handleError(e) {
  e.preventDefault()
  alert('S\il vous plait, choisissez au moins un article !')
}

