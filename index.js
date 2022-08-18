require('dotenv').config({})
const DEVELOPMENT_CHANNEL = process.env.DEVELOPMENT_CHANNEL === "TRUE";

const express = require('express')
const http = require('http')
const https = require('https')

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
        for (const vhostName of vhostList) {
            const vhost = require(`./projects/${vhostName}/vhost.js`).vhost({next_app, next_handle})
            const vServer = https.createServer(vhost)
            vServer.listen(require(`./projects/${vhostName}/vhost.js`).prodPort)
            console.log(`Added vhost: ${vhostName} on port ${require(`./projects/${vhostName}/vhost.js`).prodPort} (PROD)`)
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
