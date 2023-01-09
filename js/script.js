fetch ("http://localhost:3000/api/products") 
.then(res => res.json())
.then((data) => addProducts(data))


function addProducts(donnees) {
    console.log(donnees)
    const imageUrl = donnees [0].imageUrl
    console.log("url de l'image", imageUrl)

const anchor = document.createElement("a")
anchor.href = imageUrl
anchor .text = "un canapé bleu"

const items = document.querySelector("#items")
if (items != null) {
    items.appendChild(anchor)
    console.log("nous avons bien ajouter le lien")
}
}