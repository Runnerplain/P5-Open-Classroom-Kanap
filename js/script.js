//------------ Command fetch & get data

fetch('http://localhost:3000/api/products')
  .then((res) => res.json())
  .then((data) => addProducts(data))


//---------Add products to HTML


function addProducts(data) {
  data.forEach((kanap) => {
    const { _id, imageUrl, altTxt, name, description } = kanap   /* Destructuring const */
    const image = makeImage(imageUrl, altTxt)
    const anchor = makeAnchor(_id)
    const article = document.createElement(
      'article',
    )
    const h3 = makeH3(name)
    const p = makeParagraph(description)
    appendElementToArticle(article, image, h3, p)
    appendArticleToAnchor(anchor, article)
  })
}

function appendElementToArticle(article, image, h3, p) {
  article.appendChild(image)
  article.appendChild(h3)
  article.appendChild(p)
}


//---------------- Create link with Id of product


function makeAnchor(id) {
  const anchor = document.createElement('a')
  anchor.href =
    './product.html?id=' +
    id
  return anchor
}


// ---------------------------Link Article to Anchor

function appendArticleToAnchor(anchor, article) {
  const items = document.querySelector('#items')
  if (items != null) {
    items.appendChild(anchor)
    anchor.appendChild(article)
  }
}

// ---------- Create Image, H3 & paragraphe

function makeImage(imageUrl, altTxt) {
  const image = document.createElement('img')
  image.src = imageUrl
  image.alt = altTxt
  return image
}

function makeH3(name) {
  const h3 = document.createElement('h3')
  h3.textContent = name
  h3.classList.add('productName')
  return h3
}

function makeParagraph(description) {
  const p = document.createElement('p')
  p.textContent = description
  p.classList.add('productDescription')
  return p
}
