const Article = require('../models/article');
const app = require('../app');
const supertest = require('supertest');
const request = supertest(app);
const mongoose = require('mongoose');

jest.setTimeout(10000);

const initialArticles = [
    {
        title: "The brain’s secret to life-long learning can now come as hardware for artificial intelligence",
        date: "February 3, 2022",
        source: "Purdue University",
        summary: "As companies use more and more data to improve how AI recognizes images, learns languages and carries out other complex tasks, a recent article shows a way that computer chips could dynamically rewire themselves to take in new data like the brain does, helping AI to keep learning over time.",
        link: "https://www.sciencedaily.com/releases/2022/02/220203160544.htm",
        id: "61fe9571ec27fda53b4143f5"
    },
    {
        title: "2D materials could be used to simulate brain synapses in computers",
        date: "January 28, 2022",
        source: "KTH, Royal Institute of Technology",
        summary: "Computers could mimic neural networks in the brain -- and be much more energy efficient -- with a new computer component that mimics how the brain works by acting like a synaptic cell. It's called an electrochemical random access memory (ECRAM), and researchers have developed materials that offer a commercially-viable way to build these components.",
        link: "https://www.sciencedaily.com/releases/2022/01/220128100738.htm",
        id: "61fe9571ec27fda53b4143f7"
    }
];

// this functionalty ensures that everytime we run the tests database will be in the same state as before
beforeEach(async () => {
    await Article.deleteMany({});
    let articleObject = new Article(initialArticles[0]);
    await articleObject.save();
    articleObject = new Article(initialArticles[1]);
    await articleObject.save();
});

describe('viewing articles', () => {
    test('all articles are returned', async () => {
        const response = await request.get('/api/articles');    
        expect(response.body).toHaveLength(initialArticles.length);
    });

    test('articles when given invalid endpoint are not returned', async () => {
        await request.get('/api/articless').expect(404);
    });

    test('single article is returned', async () => {
        const articles = await request.get('/api/articles');
        const response = await request
            .get(`/api/articles/${articles.body[0].id}`)
            .expect(200)
    });

    test(`the first article source is ${initialArticles[0].source}`, async () => {
        const response = await request.get('/api/articles');
        expect(response.body[0].source).toBe(initialArticles[0].source);
    });

    test('article with malformatted id is not returned', async () => {
        await request.get('/api/articles/61fd86f19d7eaa117599b2badsadsadsadasd').expect(500);
    });
});

describe('adding articles', () => {
    test('article can be added', async () => {
        const article = {
            title: "Article 3",
            date: "Article 3 date",
            source: "Article 3 source",
            summary: "Article 3 summary",
            link: "Article 3 link"
        };

        await request
            .post('/api/articles')
            .send(article)
            .expect(201)
    });

    test('article without title cannot be added', async () => {
        const article = {
            date: "January 28, 2022",
            source: "KTH, Royal Institute of Technology",
            summary: "Computers could mimic neural networks in the brain -- and be much more energy efficient -- with a new computer component that mimics how the brain works by acting like a synaptic cell. It's called an electrochemical random access memory (ECRAM), and researchers have developed materials that offer a commercially-viable way to build these components.",
            link: "https://www.sciencedaily.com/releases/2022/01/220128100738.htm"
        };

        await request
            .post('/api/articles')
            .send(article)
            .expect(500);
    });
});

describe('deleting articles', () => {
    test('article can be deleted', async () => {
        // get all articles
        const articles = await request.get('/api/articles');
        // find the article to delete
        const articleToDelete = articles.body[0];
        await request
            .delete(`/api/articles/${articleToDelete.id}`)
            .expect(204)
    });

    test('article with malformatted id cannot be deleted', async () => {
        await request
            .delete('/api/articles/61fea96d131adcb158d411f4dasdasdasd')
            .expect(500)
    });
});

describe('updating articles', () => {
    test('article can be updated', async () => {
        const updatedArticle = {
            title: 'Article title update',
            date: 'article date update',
            source: 'article source update',
            summary: 'article summary update',
            link: 'article link update'
        };
        // get all articles
        const articles = await request.get('/api/articles');
        // find the article to update
        const articleToUpdate = articles.body[0];
        // update article
        await request
            .put(`/api/articles/${articleToUpdate.id}`, updatedArticle)
            .expect(204)
    });

    test('article with malformatted id cannot be updated', async () => {
        const updatedArticle = {
            title: 'Article title update',
            date: 'article date update',
            source: 'article source update',
            summary: 'article summary update',
            link: 'article link update'
        };
        // get all articles
        const articles = await request.get('/api/articles');
        // find the article to update
        let articleToUpdate = articles.body[0];
        articleToUpdate.id = 'blablabla';
        // update article
        await request
            .put(`/api/articles/${articleToUpdate.id}`, updatedArticle)
            .expect(500)
    });
});

// after everything is done close the connection
afterAll(() => {
    mongoose.connection.close();
});