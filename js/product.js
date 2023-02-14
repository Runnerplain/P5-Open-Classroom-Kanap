//--------------Take products _id-------------

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const id = urlParams.get('id')
if (id != null) {
  let itemPrice = 0
  let imgUrl, altText, articleName
}

// ------- Fetch command to take data -------------

fetch(`http://localhost:3000/api/products/${id}`)
  .then((response) => response.json())
  .then((res) => handleData(res))

// ------- Create global product with childs éléments -----------------------

function handleData(kanap) {
  const { altTxt, colors, description, imageUrl, name, price } = kanap
  itemPrice = price
  makeImage(imageUrl, altTxt)
  imgUrl = imageUrl
  altText = altTxt
  articleName = name
  makeTitle(name)
  makePrice(price)
  makeDescription(description)
  makeColors(colors)
}

// ----------- Make elements on page --------------

function makeImage(imageUrl, altTxt) {
  const image = document.createElement('img')
  image.src = imageUrl
  image.alt = altTxt
  const parent = document.querySelector('.item__img')
  if (parent != null) parent.appendChild(image)
}

function makeTitle(name) {
  const h1 = document.querySelector('#title')
  if (h1 != null) h1.textContent = name
}

function makePrice(price) {
  const span = document.querySelector('#price')
  if (span != null) span.textContent = price
}

function makeDescription(description) {
  const p = document.querySelector('#description')
  if (p != null) p.textContent = description
}

function makeColors(colors) {
  const select = document.querySelector('#colors')
  if (select != null) {
    colors.forEach((color) => {
      const option = document.createElement('option')
      option.value = color
      option.textContent = color
      select.appendChild(option)
    })
  }
}

const button = document.querySelector('#addToCart')
button.addEventListener('click', handleClick)


//---------- click function assignment for color & quantity ----------------

function handleClick() {
  const color = document.querySelector('#colors').value
  const quantity = document.querySelector('#quantity').value
  if (isOrderInvalid(color, quantity)) return
  saveOrder(color, quantity)
  redirectToCart()
}

//---------Save item & get ids from localStorage to check same color & same id & ajust quantity---------

function saveOrder(color, quantity) {
  const key = `${id}-${color}`
  const localSameItem = JSON.parse(localStorage.getItem(key))
  let quantityProduct = quantity
  if (localSameItem != null) {
    quantityProduct = Number(quantityProduct) + (localSameItem.quantity)
  }
  const data = {
    id: id,
    color: color,
    quantity: Number(quantityProduct),
    price: itemPrice,
    imageUrl: imgUrl,
    altTxt: altText,
    name: articleName,
  }
  localStorage.setItem(key, JSON.stringify(data))
}

// ----------- Check vality of order & return error if null -------------

function isOrderInvalid(color, quantity) {
  if (color == null || color === '' || quantity == null || quantity <= 0) {
    alert(
      "S'il vous plait, choisissez une couleur et une quantité",
    )
    return true
  }
}

//------- Redirection to cart-----------------


function redirectToCart() {
  window.location.href = 'cart.html'
}
