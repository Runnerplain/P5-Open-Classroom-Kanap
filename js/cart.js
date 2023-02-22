// ------------------------ Variable globale--------------

const cart = []

retrieveItemFromCache()
setTimeout(() => {
  cart.forEach((item) => displayItem(item))
}, 1000);


const form = document.querySelector('form')
form.addEventListener("submit", handleForm)

// -------------------------Go check & take from cache----------------- 

function retrieveItemFromCache() {
  const numberOfItems = localStorage.length
  for (let i = 0; i < numberOfItems; i++) {
    const item =
      localStorage.getItem(localStorage.key(i)) ||
      ''
    const itemObjet = JSON.parse(item)
    console.log(itemObjet);
    fetch(`http://localhost:3000/api/products/${itemObjet.id}`)         /*modification*/
      .then((response) => response.json())
      .then((res) => cart.push({
        ...itemObjet,
        price: res.price
      }))

  }
}

// --------------------------Show item-------------------------------------
function displayItem(item) {
  const article = makeArticle(item)
  const imageDiv = makeImageDiv(item)
  article.appendChild(imageDiv)
  const cart__Item__Content = makeCartContent(item)
  article.appendChild(cart__Item__Content)
  article.setAttribute("prix", item.price)
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
  const total = cart.reduce(function (total, item) {
    const prix = +document.querySelector(`[data-id="${item.id}"]`).getAttribute('prix')   /*modification */
    return total + prix * item.quantity
  }, 0)
  totalPrice.textContent = total
}


function displayArticle(article) {
  document.querySelector('#cart__items').appendChild(article)
}



// --------------------- Making function------------------------ 

function makeArticle(item) {
  const article = document.createElement('article')
  article.classList.add('cart__item')
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


// ------- take ids (items) from cache & push-------------

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



// ------------ Adding Delete & Quantity to settings --------------

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

//------------ Saving new data(informations) to cache -------------

function saveNewDataToCache(item) {
  delete item.price                                 /*modification*/
  const dataToSave = JSON.stringify(item)
  const key = getKey(item)
  localStorage.setItem(key, dataToSave)
}



// --------------- Validation form ------------------------------

// Selection of module id for error MSG 
const firstNameMsg = document.querySelector('#firstNameErrorMsg')
const lastNameMsg = document.querySelector('#lastNameErrorMsg')
const addressMsg = document.querySelector('#addressErrorMsg')
const cityMsg = document.querySelector('#cityErrorMsg')
const emailMsg = document.querySelector('#emailErrorMsg')

// dictionary for error messages 

const errorMsgs = {
  firstNameMsg: "Veuillez rentrer un prénom valide entre 3 et 25 caractères et sans chiffre.",
  lastNameMsg: "Veuillez rentrer un prénom valide entre 3 et 25 caractères et sans chiffre.",
  addressMsg: "Format de l'addresse incorrect",
  cityMsg: "Format de la ville incorrect",
  emailMsg: "Veuillez rentrer un email valide"
}

// Regex generator for input
const regexName = /[A-Za-z -.]{3,25}/
const regexAddress = /[A-Za-z -.0-9.]{3,25}/
const regexCity = /[A-Za-z -.]{3,30}/
const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

// FirstName input selection, validation & style transform
const firstNameInput = document.querySelector('.cart__order__form__question:nth-child(1) input')
firstNameInput.addEventListener('blur', firstNameValidation)
firstNameInput.addEventListener('input', firstNameValidation)

function firstNameValidation() {
  if (regexName.test(firstNameInput.value)) {
    firstNameInput.style.border = "2px solid green"
    firstNameMsg.style.color = "transparent"
    inputsValidity.firstName = true
  }
  else {
    firstNameInput.style.border = "2px solid red"
    firstNameMsg.textContent = errorMsgs.firstNameMsg
    firstNameMsg.style.color = "#F24646"
    firstNameMsg.style.fontWeight = "500"
    inputsValidity.firstName = false
  }
}

// LastName input selection, validation & style transform
const lastNameInput = document.querySelector('.cart__order__form__question:nth-child(2) input')

lastNameInput.addEventListener('blur', lastNameValidation)
lastNameInput.addEventListener('input', lastNameValidation)


function lastNameValidation() {
  if (regexName.test(lastNameInput.value)) {
    lastNameInput.style.border = "2px solid green"
    lastNameMsg.style.color = "transparent"
    inputsValidity.lastName = true
  }
  else {
    lastNameInput.style.border = "2px solid red"
    lastNameMsg.textContent = errorMsgs.lastNameMsg
    lastNameMsg.style.color = "#F24646"
    lastNameMsg.style.fontWeight = "500"
    inputsValidity.lastName = false
  }
}

// Address input selection, validation & style transform
const addressInput = document.querySelector('.cart__order__form__question:nth-child(3) input')

addressInput.addEventListener('blur', addressValidation)
addressInput.addEventListener('input', addressValidation)

function addressValidation() {
  if (regexAddress.test(addressInput.value)) {
    addressInput.style.border = "2px solid green"
    addressMsg.style.color = "transparent"
    inputsValidity.address = true
  }
  else {
    addressInput.style.border = "2px solid red"
    addressMsg.textContent = errorMsgs.addressMsg
    addressMsg.style.color = "#F24646"
    addressMsg.style.fontWeight = "500"
    inputsValidity.address = false
  }
}

// City input selection, validation & style transform
const cityInput = document.querySelector('.cart__order__form__question:nth-child(4) input')

cityInput.addEventListener('blur', cityValidation)
cityInput.addEventListener('input', cityValidation)

function cityValidation() {
  if (regexCity.test(cityInput.value)) {
    cityInput.style.border = "2px solid green"
    cityMsg.style.color = "transparent"
    inputsValidity.city = true
  }
  else {
    cityInput.style.border = "2px solid red"
    cityMsg.textContent = errorMsgs.cityMsg
    cityMsg.style.color = "#F24646"
    cityMsg.style.fontWeight = "500"
    inputsValidity.city = false
  }
}

// Email input selection, validation & style transform
const emailInput = document.querySelector('.cart__order__form__question:nth-child(5) input')

emailInput.addEventListener('blur', emailValidation)
emailInput.addEventListener('input', emailValidation)

function emailValidation() {
  if (regexEmail.test(emailInput.value)) {
    emailInput.style.border = "2px solid green"
    emailMsg.style.color = "transparent"
    inputsValidity.email = true
  }
  else {
    emailInput.style.border = "2px solid red"
    emailMsg.textContent = errorMsgs.emailMsg
    emailMsg.style.color = "#F24646"
    emailMsg.style.fontWeight = "500"
    inputsValidity.email = false
  }
}


// Dictionary for inputs validity

const inputsValidity = {
  firstName: false,
  lastName: false,
  address: false,
  city: false,
  email: false
}


// Making object for form & cart elements in one variable = body

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


// Final function for control & send to confirmation page

function handleForm(e) {
  e.preventDefault()

  const failedInputs = Object.values(inputsValidity).filter(x => !x)

  if (cart.filter(item => item.quantity > 0).length === 0) {
    alert('S\il vous plait, choisissez au moins un article !')
    return false
  }

  if (failedInputs.length > 0) {
    alert('Veuillez revoir les informations du formulaire, certains informations semblent incorrectes...')
    return false
  }

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


