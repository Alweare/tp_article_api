


app.get('/articles', async (request, response) => {

	const articles = await Article.find();

	return response.json({
		code: response.statusCode, message: "La liste des articles a été récupérés avec succès", data: articles

	});


});
app.get('/article/:id', async (request, response) => {
	const idParam = request.params.id;


	const foundArticle = await Article.findOne({ uid: idParam });

	if (!foundArticle) {
		response.json({
			code: response.statusCode = 702, message: ` Impossible de récupérer un article avec l'UID ${idParam} | Null`, data: `null`

		})

	}


	return response.json({
		code: response.statusCode, message: "Article récupéré avec succès", data: foundArticle

	});

});
app.post('/save-article', async (request, response) => {

	const articleJson = request.body;
	let articleFound = null;



	if (articleJson.uid != undefined || articleJson.uid) {
		articleFound = Article.findOne({ uid: articleJson.uid });

		if (!articleFound) {
			return response.json({ code: response.statusCode = 701, message: `Impossible de modifier un article inexistant`, data: articleJson });
		}
		if (Article.findOne(articleJson.title)) {
			return response.json({ code: response.statusCode = 701, message: `Impossible de modifier un article si un autre article possède un titre similaire`, data: `Null` });
		}
		await articleFound.updateOne({ title: articleJson.title }, { content: articleJson.content }, { author: articleJson.author });
		return response.json({ code: response.statusCode = 200, message: `Article modifié avec succès`, data: articleJson });
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
		return response.json({ code: '702', message: `Impossible de supprimer un article dont l'UID n'existe pas`, data: 'Null' })

	}


	await Article.deleteOne(articleFound);


	return response.json({ code: '200', message: `${uidParam}`, data: articleFound });


});

