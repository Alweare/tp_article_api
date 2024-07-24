const express = require("express");
// const { request } = require("http");
// const { resolve } = require("path");


const app = express();
// Autoriser express à recevoir des données envoyées en JSON dans le body(payload)
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
app.use(express.json());


//---------------------------------BDD-----------------------------//
// Erreur si problème de connexion 

mongoose.connection.once('open', () => {
	console.log(`Connecter a la base de données`);
})

mongoose.connection.on('error', (err) => {
	console.log(`Erreur de bdd ${err}`);
})

//Connection a la base
mongoose.connect("mongodb://localhost:27017/db_article")

const Article = mongoose.model('Article', { uid: String, title: String, content: String, author: String }, 'articles');

app.get('/articles', async (request, response) => {

	const articles = await Article.find();

	return response.json(articles);


});
app.get('/article/:id', async (request, response) => {
	const idParam = request.params.id;

	const foundArticle = await Article.findOne({ uid: idParam });
	return response.json(foundArticle);


});
app.post('/save-article', async (request, response) => {

	const articleJson = request.body;
	let articleFound = null;

	if (articleJson.uid != undefined || articleJson.uid) {
		articleFound = Article.findOne({ uid: articleJson.uid });
	}

	if (articleFound) {
		// articleFound.title = articleJson.title;
		// articleFound.content = articleJson.content;
		// articleFound.author = articleJson.author;
		await articleFound.updateOne({ title: articleJson.title }, { content: articleJson.content }, { author: articleJson.author })


		return response.json({ message: `L'article a été modifié avec succès` })
	}


	articleJson.uid = uuidv4();
	const createArticle = await Article.create(articleJson);
	await createArticle.save();

	return response.json(createArticle);


});
app.delete('/article/:id', async (request, response) => {

	const uidParam = request.params.id;
	const articleFound = Article.findOne({ uid: uidParam });

	await Article.deleteOne(articleFound);


	return response.json({ message: "article supprimé" });


});



//---------------------------------BDD-----------------------------//

// MOCK
// Simulation de données en mémoire
// let DB_ARTICLES = [
// 	{
// 		id: 1,
// 		title: "Premier article",
// 		content: "Contenu du premier article",
// 		author: "Isaac",
// 	},
// 	{
// 		id: 2,
// 		title: "Deuxième article",
// 		content: "Contenu du deuxième article",
// 		author: "Sanchez",
// 	},
// 	{
// 		id: 3,
// 		title: "Troisième article",
// 		content: "Contenu du troisième article",
// 		author: "Toto",
// 	},
// ];

// app.get("/articles", (request, response) => {
// 	return response.json(DB_ARTICLES);
// });

// app.get("/articles/:id", (request, response) => {
// 	const articleID = parseInt(request.params.id);
// 	let listeArticles = DB_ARTICLES.find((a) => a.id === articleID);
// 	return response.json(listeArticles);
// });

// app.post("/save-article", (request, response) => {
// 	//Récupérer l'article en JSON
// 	const articleJSON = request.body;
// 	let foundArticle = null;
// 	// essayer de trouver un article existant
// 	if (articleJSON.id != undefined || articleJSON.id) {
// 		foundArticle = DB_ARTICLES.find(article => article.id === articleJSON.id);
// 	}
// 	// Si je trouve je modifie les nouvelles
// 	if (foundArticle) {
// 		foundArticle.title = articleJSON.title;
// 		foundArticle.content = articleJSON.content;
// 		foundArticle.author = articleJSON.author;

// 		return response.json(`L'article a été modifié avec succès`);
// 	}
// 	// Sinon par défaut je créer
// 	DB_ARTICLES.push(articleJSON);
// 	return response.json(`article crée avec succès`);
// });

//// app.delete("/articles/:id", (request, response) => {
// 	// Il faut l'id en entier
// 	const idADelete = parseInt(request.params.id);

// 	const foundArticleIndex = DB_ARTICLES.find(article => article.id === articleJSON.id);

// 	// si article  trouve erreur
// 	if (foundArticleIndex < 0) {
// 		return response.json(`Impossible de supprimer un article inexistant`);
// 	}


// 	DB_ARTICLES.splice(idADelete, 1);
// 	return response.json({ message: "deleted" });
// });

// Démarrer le serveur
app.listen(3000, () => {
	console.log("le serveur a démarrer");
});
