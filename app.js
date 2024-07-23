const express = require("express");
const { request } = require("http");

const app = express();
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
app.use(express.json());
app.get("/articles", (request, response) => {
	return response.json(DB_ARTICLES);
});

app.get("/articles/:id", (request, response) => {
	const articleID = parseInt(request.params.id);
	let listeArticles = DB_ARTICLES.find(a => a.id === articleID);
	return response.json(listeArticles);
});

app.post("/save-article", (request, response) => {

	let article = request.body;
	let articleFound = false;

	for(let i = 0 ; i< DB_ARTICLES.length;i++){
		if(article){
			if(article.id === DB_ARTICLES[i].id){
				DB_ARTICLES[i] = article;
				articleFound = true;
			}
		}
	}
		if(!articleFound){
			DB_ARTICLES.push(article);
			return response.json({message : "ajouté"})
		}else {
			return response.json({ message: "modifié" });
		}

	});
app.delete("/articles/:id", (request, response) => {
	const idADelete = parseInt(request.params.id);
	DB_ARTICLES.splice(idADelete, 1);
	return response.json({message : "deleted"})
});

// Démarrer le serveur
app.listen(3000, () => {
	console.log("le serveur a démarrer");
});
