const express = require('express')
const router = express.Router()

const questionsList = require(`${__models}/questionList`)

router.get('/', async (req, res) => {
    if (req.session?.user?.admin !== true)
        return res.status(403).send()

    const questions = await questionsList.find();

    const clean = questions.map(x => {
        return {
            id: x.id,
            query: x.query,
            answer: x.answer,
            match: x.match
        }
    })

    return res.send({ error: false, questions: clean })
})

router.post('/edit/:id/edit', async function (req, res) {
    if (req.session?.user?.admin !== true)
        return res.status(403).send()

    const { query, answer, match } = req.body

    if (!query || !answer)
        return res.send({ error: true, message: 'No query or answer' })

    const question = await questionsList.findOne({ id: req.params.id });
    if (!question) return res.send({ error: true, message: 'Question not found' })

    question.query = query
    question.answer = answer
    question.match = match ? parseInt(match) : 50

    await question.save()

    return res.send({ error: false, message: 'Question updated' })
});

router.post('/edit/:id/delete', async function (req, res) {
    if (req.session?.user?.admin !== true)
        return res.status(403).send()

    const { id } = req.params;

    const question = await questionsList.findOne({
        id: id
    });

    if (!question) return res.send({ error: true, message: 'Question not found' })

    await questionsList.deleteOne({ 
        id: id
    }).catch(err => {
        return res.send({ error: true, message: err })
    })

    return res.send({ error: false, message: 'Question deleted' })
});

router.post('/create', async function (req, res) {
    if (req.session?.user?.admin !== true)
        return res.status(403).send()

    const { query, answer, match } = req.body;
    if (!query || !answer)
        return res.send({ error: true, message: 'Query or answer is empty' })

    let questions = await questionsList.find({})

    questions.sort((a, b) => a.id - b.id)

    const largestId = questions[questions.length - 1].id

    questionsList.create({
        query,
        answer,
        id: (parseInt(largestId) + 1).toString(),
        match: parseInt(match) || 50
    })

    res.send({ error: false, message: 'Question created' });
});


module.exports = router