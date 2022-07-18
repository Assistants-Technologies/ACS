require('dotenv').config({})
const DEVELOPMENT_CHANNEL = process.env.DEVELOPMENT_CHANNEL === "TRUE";

const express = require('express')
const http = require('http')

const vhost = require('vhost')
const next = require('next')
const path = require('path')
const fs = require('fs')
const mongo = require('mongoose')
const config = require('./configs/config')

const next_app = next({dev: DEVELOPMENT_CHANNEL, dir: DEVELOPMENT_CHANNEL ? 'src' : './'})
const next_handle = next_app.getRequestHandler()

const server = express()

const createApp = () => {
    const vhostList = fs.readdirSync(path.join(__dirname, '/projects'))

    const domain = process.env.DOMAIN || 'localhost'

    if(DEVELOPMENT_CHANNEL) {
        for (const vhostName of vhostList) {
            console.log(`Adding vhost: ${vhostName}`)
            const vhostHost = vhostName == 'main' ? null : vhostName
            const vhostApp = require(`./projects/${vhostName}/vhost.js`).vhost({next_app, next_handle})
            server.use(vhost(vhostHost ? `${vhostHost}.${domain}` : domain, vhostApp))
        }

        server.listen(3000)
    }else{
        /*
            PROD PORTS:
            - BETA.ASSISTANTSCENTER.COM - 3000
            - CDN.BETA.ASSISTANTSCENTER.COM - 3001 (wont work for BETA, cloudflare is stuped)
         */

        for (const vhostName of vhostList) {
            const vhost = require(`./projects/${vhostName}/vhost.js`).vhost({next_app, next_handle})
            const vServer = http.createServer(vhost)
            vServer.listen(require(`./projects/${vhostName}/vhost.js`).prodPort)
        }
    }
}

const connectWithMongo = () => {
    mongo.connect(process.env.MONGO_URL)
}

next_app.prepare().then(()=>{
    connectWithMongo()
    createApp()
}).catch(console.log)
