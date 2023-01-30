fetch('http://localhost:3000/api/products')
  .then(res => res.json())
  .then(data => {
    const items = document.querySelector('#items');
    if (!items) return;

    data.forEach(kanap => {
      const { _id, imageUrl, altTxt, name, description } = kanap;
      const article = document.createElement('article');
      article.appendChild(makeImage(imageUrl, altTxt));
      article.appendChild(makeH3(name));
      article.appendChild(makeParagraph(description));
      items.appendChild(makeAnchor(_id, article));
    });
  });

function makeAnchor(id, article) {
  const anchor = document.createElement('a');
  anchor.href = `./product.html?id=${id}`;
  anchor.appendChild(article);
  return anchor;
}

function makeImage(imageUrl, altTxt) {
  const image = document.createElement('img');
  image.src = imageUrl;
  image.alt = altTxt;
  return image;
}

function makeH3(name) {
  const h3 = document.createElement('h3');
  h3.textContent = name;
  h3.classList.add('productName');
  return h3;
}

function makeParagraph(description) {
  const p = document.createElement('p');
  p.textContent = description;
  p.classList.add('productDescription');
  return p;
}
