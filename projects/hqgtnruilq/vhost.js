const express = require('express')

const vhost = ({next_app, next_handle}) => {
    const app = express()

    app.get('/categories/v2', (req,res)=>{
        res.send({
            success: true,
            categories: [
                [
                    "Valorant", "Fortnite","League of Legends","League of Legends Mobile", "Among Us","Apex Legends","Battlefield","Brawl Stars","Call of Duty","Cosplay","Counter Strike","Cyberpunk 2077","Cyberpunk 2077","Diablo 4","Diabotical","Discord","Escape from Tarkov","Fall Guys","Fame MMA","Fanart","FIFA",
                ],
                [
                    "Seriale i filmy", "GTA","Harry Potter: Wizards Unite","Hyper Scape","Hytale","Legends of Runeterra","Minecraft","Minecraft Earth","mmorpg","News","nsfw","Overwatch","Pokemon Go","Pokemon Unite","Project L","PUBG","Rainbow Six Siege","Ratowanie Świata","Rocket League",
                ],
                [
                    "Rouge Company","Rozrywka","Sklep","Star Wars Squadrons","Technologia","Tellstones","Wild Rift","World of Tanks","WoW","Gaming","Genshin Impact",
                ]
            ]
        })
    })

    return app
}

module.exports = {
    vhost,
    prodPort: process.env.PROD_BUT_BETA === "TRUE" ? 2004 : 3004
}
