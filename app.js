const express = require("express");
const { request } = require("http");
const { resolve } = require("path");


const app = express();
// Autoriser express à recevoir des données envoyées en JSON dans le body(payload)
app.use(express.json());
// MOCK
// Simulation de données en mémoire
let DB_ARTICLES = [
	{
		id: 1,
		title: "Premier article",
		content: "Contenu du premier article",
		author: "Isaac",
	},
	{
		id: 2,
		title: "Deuxième article",
		content: "Contenu du deuxième article",
		author: "Sanchez",
	},
	{
		id: 3,
		title: "Troisième article",
		content: "Contenu du troisième article",
		author: "Toto",
	},
];

app.get("/articles", (request, response) => {
	return response.json(DB_ARTICLES);
});

app.get("/articles/:id", (request, response) => {
	const articleID = parseInt(request.params.id);
	let listeArticles = DB_ARTICLES.find((a) => a.id === articleID);
	return response.json(listeArticles);
});

app.post("/save-article", (request, response) => {
	//Récupérer l'article en JSON
	const articleJSON = request.body;
	let foundArticle = null;
	// essayer de trouver un article existant
	if (articleJSON.id != undefined || articleJSON.id ) {
		foundArticle = DB_ARTICLES.find(article => article.id === articleJSON.id);
	}
	// Si je trouve je modifie les nouvelles
	if (foundArticle) {
		foundArticle.title = articleJSON.title;
		foundArticle.content = articleJSON.content;
		foundArticle.author = articleJSON.author;

		return response.json(`L'article a été modifié avec succès`);
	}
	// Sinon par défaut je créer
	DB_ARTICLES.push(articleJSON);
	return response.json(`article crée avec succès`);
});

app.delete("/articles/:id", (request, response) => {
	// Il faut l'id en entier
	const idADelete = parseInt(request.params.id);

	const foundArticleIndex = DB_ARTICLES.find(article => article.id === articleJSON.id);

	// si article  trouve erreur
	if(foundArticleIndex <0){
		return response.json(`Impossible de supprimer un article inexistant`);
	}


	DB_ARTICLES.splice(idADelete, 1);
	return response.json({ message: "deleted" });
});

// Démarrer le serveur
app.listen(3000, () => {
	console.log("le serveur a démarrer");
});
