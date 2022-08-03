const express = require('express')

const LicensesList = require('../../models/licensesList')
const LicensesAccessTokensList = require('../../models/licensesAccessTokensList');
const uuid = require("uuid");
const fs = require("fs");
const path = require("path");

const vhost = ({next_app, next_handle}) => {
    const app = express()
    app.set('trust proxy', 1)

    app.use(express.json())
    app.use(express.urlencoded({
        extended: true
    }))

    app.get('/', (req,res)=>{
        res.redirect('https://assistantscenter.com/discord-dashboard/v2')
    })

    app.post('/validate', async (req,res)=>{
        const { licenseId } = req?.body
        if(!licenseId) {
            return res.status(400).json({
                error: true,
                message: 'Missing required fields',
            })
        }

        let LicenseData;
        try {
            LicenseData = await LicensesList.findOne({license_id: licenseId});
        }catch(err){
            return res.send({error:true,message:'License is not valid or expired.'});
        }
        if(!LicenseData) {
            return res.send({error:true,message:'License is not valid or expired.'});
        }

        const access_token = uuid.v4();
        await LicensesAccessTokensList.create({
            access_token,
            used: false,
        });
        return res.send({error:false,type:LicenseData.license_type,user:LicenseData.user,access_token,licenseId});
    })

    app.post('/api/index/:version',async (req,res)=>{
        if(!req.body)return res.send({error:'ah no body'});
        if(req.body.token != require('./config').indexToken)return res.send({error:'wrong token!'});
        await fs.writeFileSync(path.join(__dirname,'./resources-licenses/'+req.params.version+'.txt'), req.body.data);
        return res.send({});
    });

    app.get('/api/index/:version/:licenseId',async (req,res)=>{
        if(
            !req.params.version.startsWith('2.0')
            &&
            !req.params.version.startsWith('2.1')
            &&
            !req.params.version.startsWith('2.2')
        )return res.send('Version not supported for this endpoint.');
        let l;
        try {
            l = await LicensesList.findOne({license_id: req.params?.licenseId});
        }catch(err){
            l=false;
        }
        if(l) {
            const text = await fs.readFileSync(path.join(__dirname, './resources-licenses/' + req.params?.version + '.txt'));
            return res.send(text);
        }else{
            return res.send('');
        }
    });

    app.get('/api/index/:version/:licenseId/:access_key',async (req,res)=>{
        if(
            req.params.version.startsWith('2.0')
            ||
            req.params.version.startsWith('2.1')
            ||
            req.params.version.startsWith('2.2')
        )return res.send('Version not supported for this endpoint.');
        let l;
        try {
            l = await LicensesList.findOne({license_id: req.params?.licenseId});
        }catch(err){
            l=false;
        }
        const access_token_valid = await LicensesAccessTokensList.findOne({access_token: req.params.access_key});
        if(access_token_valid){
            if(l) {
                const text = await fs.readFileSync(path.join(__dirname, './resources-licenses/' + req.params?.version + '.txt'));
                res.send(text);
                await access_token_valid.delete();
            }else{
                return res.send('Sorry, your license ID is not valid.');
            }
        }else{
            return res.send('Sorry, you need to use validated license token when accessing this resource.');
        }
    });

    return app
}

module.exports = {
    vhost,
    prodPort: process.env.PROD_BUT_BETA === "TRUE" ? 2001 : 3001
};