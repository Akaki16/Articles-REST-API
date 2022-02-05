const router = require('express').Router();
const Article = require('../models/article');

// desc: get all articles
router.get('/', async (req, res) => {
    const articles = await Article.find();
    if (articles) {
        res.status(200).json(articles);
    } else {
        res.status(404).json({ error: 'articles cannot be returned' });
    }
});

// desc: get single article
router.get('/:id', async (req, res) => {
    const article = await Article.findById(req.params.id);
    if (article) {
        res.status(200).json(article);
    } else {
        res.status(404).json({ error: 'article cannot be retrieved' });
    }
});

// desc: create new article
router.post('/', async (req, res) => {
    const body = req.body;

    // create article object
    const article = new Article({
        title: body.title,
        date: body.date,
        source: body.source,
        summary: body.summary,
        link: body.link
    });

    // save article
    const savedArticle = await article.save();
    if (savedArticle) {
        res.status(201).json(savedArticle);
    } else {
        res.status(400).json({ error: 'Article cannot be created' });
    }
});

// desc: delete single article
router.delete('/:id', async (req, res) => {
    const articleToDelete = await Article.findByIdAndDelete(req.params.id);
    if (articleToDelete) {
        res.status(204).end();
    } else {
        res.status(400).json({ error: 'Article cannot be deleted' });
    }
});

// desc: update single article
router.put('/:id', async (req, res) => {
    const body = req.body;

    const article = {
        title: body.title,
        date: body.date,
        source: body.source,
        summary: body.summary,
        link: body.link
    };

    const updatedArticle = await Article.findByIdAndUpdate(req.params.id, article, { new: true });

    if (updatedArticle) {
        res.status(204).end();
    } else {
        res.status(400).json({ error: 'article cannot be updated' });
    }
});

module.exports = router;