const express = require("express")
const fs = require("fs")
const app = express()
const { Moralis } = require("moralis/node")
require("dotenv").config()

const serverUrl = process.env.moralisServerUrl
const appId = process.env.moralisApplicationId
const masterKey = process.env.moralisMasterKey

let isMoralisStarted = false

app.listen(4000, () => {
    console.log("Lisening to port 4000")
    Moralis.start({
        serverUrl: serverUrl,
        appId: appId,
        masterKey: masterKey,
    })
        .then(() => {
            console.log("Moralis Started")
            isMoralisStarted = true
        })
        .catch((error) => {
            console.log(error)
        })
})

app.use(express.json())

app.use((req, res, next) => {
    console.log(`Request path:${req.path} with method ${req.method}`)
    next()
})

app.get("/api/:id", (req, res) => {
    const { id } = req.params
    const tokenDetails = Moralis.Object.extend("TokenDetails")
    const query = new Moralis.Query(tokenDetails)
    query.equalTo("tokenId", id)
    query
        .first()
        .then((results) => {
            const output = {
                name: results.get("name"),
                description: results.get("description"),
                image: results.get("image"),
            }
            console.log(output)
            res.status(200).json(output)
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ message: error.toString() })
        })
})

app.post("/api/:id", (req, res) => {
    const { id } = req.params
    const data = req.body
    if (
        !data.name ||
        !data.description ||
        !data.cid ||
        data.cid.length !== 46
    ) {
        res.status(400).json({ message: "invalid detalis" })
    }
    console.log(
        `name:${data.name} description:${data.description} cid:${data.cid}`
    )
    const tokenDetails = Moralis.Object.extend("TokenDetails")
    const token = new tokenDetails()
    token.set("name", data.name.toString())
    token.set("description", data.description.toString())
    token.set("image", `https://ipfs.io/ipfs/${data.cid}`)
    token.set("tokenId", id)
    token
        .save()
        .then(() => res.status(200).json({ message: "ok" }))
        .catch((error) => {
            console.log(error)
            res.status(500).json({ message: error.toString() })
        })
})
