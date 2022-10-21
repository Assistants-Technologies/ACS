const express = require('express')
const router = express.Router()

const questionsList = require(`${__models}/questionList`)

router.use(async (req, res, next) => {
    const questions = await questionsList.findOne({
        search: 'search'
    });

    if (!questions) {
        db = new questionsList();
        await db.save();
    }

    next();
});

router.get('/', async (req, res) => {
    if (req.session?.user?.admin !== true)
        return res.status(403).send()

    const questions = await questionsList.findOne({
        search: 'search'
    });

    return res.send({ error: false, questions })
})

router.post('/edit/:id/set', async function (req, res) {
    if (req.session?.user?.admin !== true)
        return res.status(403).send()

    const { query, answer, match } = req.body

    if (!query || !answer)
        return res.send({ error: true, message: 'No query or answer' })

    const questions = await questionsList.findOne({
        search: 'search'
    });

    const question = questions.list.find((x) => x.id == req.params.id)
    if (!question) return res.send({ error: true, message: 'Question not found' })

    const array = questions.list

    const index = array.findIndex(a => a.id === question.id);

    array[index] = {
        id: question.id,
        query,
        answer,
        match: match ? parseInt(match) : 50
    }

    questions.list = array

    await questions.save()

    return res.send({ error: false, message: 'Question updated' })
});

router.post('/edit/:id/delete', async function (req, res) {
    if (req.session?.user?.admin !== true)
        return res.status(403).send()

    const { id } = req.params;

    await questionsList.findOneAndUpdate(
        {
            search: 'search'
        },
        {
            $pull: {
                list: {
                    id: id
                }
            },
        },
        { safe: true, multi: false }
    );
});

router.post('/create', async function (req, res) {
    if (req.session?.user?.admin !== true)
        return res.status(403).send()

    const { query, answer, match } = req.body;
    if (!query || !answer)
        return res.send({ error: true, message: 'Query or answer is empty' })

    const questions = await questionsList.findOne({ search: 'search' })

    await questionsList.updateOne({ search: 'search' }, {
        $push: {
            list: {
                query,
                answer,
                id: (parseInt(questions.list.reverse()[0].id) + 1).toString(),
                match: parseInt(match) || 50
            },
        }
    }, { new: true })

    res.send({ error: false, message: 'Question created' });
});


module.exports = router