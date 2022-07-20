const { Moralis } = require("moralis/node")
require("dotenv").config()

const SERVER_URL = process.env.REACT_APP_SERVER_URL
const APP_ID = process.env.REACT_APP_APPLICATION_ID
const querydb = async () => {
  await Moralis.start({
    serverUrl: SERVER_URL,
    appId: APP_ID,
  })
  const ActiveCertificates = Moralis.Object.extend("ActiveCertificates")
  const query = new Moralis.Query(ActiveCertificates)
  query.descending("createdAt")
  const results = await query.find()
  console.log(results)
}

querydb()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
