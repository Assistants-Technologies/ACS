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

    const questionSchema = require(`${__models}/questionList`);

    const { id } = req.params;
    const { query, answer } = req.body;
    if (!query || !answer || !id) return res.send({ error: true, message: 'No query or answer' });

    questionSchema.updateOne({ search: 'search' }, {
        $set: {
            [`list.${id}.query`]: query,
            [`list.${id}.answer`]: answer
        }
    }, async (err, result) => {
        if (err)
            return res.send({ error: true, message: 'Question not found' })

        res.redirect('/admin/support');
    })
});

router.post('/edit/:id/delete', async function (req, res) {
    if (req.session?.user?.admin !== true)
        return res.status(403).send()

    const questionSchema = require(`${__models}/questionList`);

    const { id } = req.params;

    await questionSchema.findOneAndUpdate(
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

    const { query, answer } = req.body;
    if (!query || !answer)
        return res.send({ error: true, message: 'Query or answer is empty' })

    const questionSchema = require(`${__models}/questionList`);

    const questions = await questionSchema.findOne({ search: 'search' })

    await questionSchema.updateOne({ search: 'search' }, {
        $push: {
            list: {
                query: req.body.query,
                answer: req.body.answer,
                id: (parseInt(questions.list.reverse()[0].id) + 1).toString(),
            },
        }
    }, { new: true })

    res.send({ error: false, message: 'Question created' });
});


module.exports = router