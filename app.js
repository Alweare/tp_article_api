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
//---------------------------------BDD-----------------------------//

//------------------------------Routes-----------------------------//
/**
 * Fonction utilitaire pour retourner une structure de réponse métier
 * @param {*} response
 * @param {*} code
 * @param {*} message
 * @param {*} data
 * @returns
 */


// Middleware
function authMiddleware(request, response, next) {
	// Si token null alors erreur
	if (request.headers.authorization == undefined || !request.headers.authorization) {
		return response.json({ message: "Token null" });
	}

	// Extraire le token (qui est bearer)
	const token = request.headers.authorization.substring(7);

	// par defaut le result est null
	let result = null;

	// Si reussi à générer le token sans crash
	try {
		result = jwt.verify(token, JWT_SECRET);
	} catch {
	}

	// Si result null donc token incorrect
	if (!result) {
		return response.json({ message: "token pas bon" });
	}

	// On passe le middleware
	next();
}


function performResponseService(response, code, message, data) {
	return response.json({ code: code, message: message, data: data });
}

app.get('/articles', async (request, response) => {

	const articles = await Article.find();

	return performResponseService(response, '200', `La liste des articles a été récupérés avec succès`, articles);

});
app.get('/article/:id', async (request, response) => {
	const idParam = request.params.id;


	const foundArticle = await Article.findOne({ uid: idParam });

	if (!foundArticle) {
		return performResponseService(response, '702', ` Impossible de récupérer un article avec l'UID ${idParam} | Null`, null);

	}

	return performResponseService(response, '200', `Article récupéré avec succès`, foundArticle);

});
app.post('/save-article', async (request, response) => {

	const articleJson = request.body;
	let articleFound = null;



	if (articleJson.uid != undefined || articleJson.uid) {
		articleFound = Article.findOne({ uid: articleJson.uid });

		if (!articleFound) {

			return performResponseService(response, '701', `Impossible de modifier un article inexistant`, articleJson);
		}
		if (Article.findOne({ title: articleJson.title, uid: { $ne: articleJson.uid } })) {

			return performResponseService(response, '701', `Impossible de modifier un article si un autre article possède un titre similaire`, null);
		}
		await articleFound.updateOne({ title: articleJson.title }, { content: articleJson.content }, { author: articleJson.author });

		return performResponseService(response, '200', `Article modifié avec succès`, articleJson);
	}

	if (Article.findOne(articleJson.title)) {

		return response.json({ code: response.statusCode = 702, message: `Impossible d'ajouter un article avec un titre déjà existant`, data: `Null` });
	}
	articleJson.uid = uuidv4();
	const createArticle = await Article.create(articleJson);
	await createArticle.save();

	return response.json({ code: response.statusCode = 200, message: `Article ajouté avec succès`, data: createArticle });


});
app.delete('/article/:id', async (request, response) => {

	const uidParam = request.params.id;
	const articleFound = Article.findOne({ uid: uidParam });
	if (!articleFound) {
		return performResponseService(response, '702', `Impossible de supprimer un article dont l'UID n'existe pas`, null);

	}


	await Article.deleteOne(articleFound);

	return performResponseService(response, '200', `delete avec succès`, articleJson);


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
