const express = require("express")
const fs = require("fs")
const app = express()

app.listen(4000, () => {
    console.log("Lisening to port 4000")
})

app.use(express.json())

app.use((req, res, next) => {
    console.log(`Request path:${req.path} with method ${req.method}`)
    next()
})

app.get("/:id", (req, res) => {
    const { id } = req.params
    const uri_json = JSON.parse(fs.readFileSync("./uri_meta_data.json"))
    console.log(uri_json[id])

    res.status(200).json(uri_json[id])
})
