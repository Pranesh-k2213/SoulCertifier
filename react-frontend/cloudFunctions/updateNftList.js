/* eslint-disable no-undef */
const logger = Moralis.Cloud.getLogger()

Moralis.Cloud.afterSave("BunchCreated", async (request) => {
  const confirmed = request.object.get("confirmed")
  if (confirmed) {
    const ActiveCertificates = Moralis.Object.extend("ActiveCertificates")
    const isNew = request.object.get("isNew")
    const toAddresses = request.object.get("to")
    const byAddress = request.object.get("by")
    const tokenId = request.object.get("uid")
    if (!isNew) {
      const query = new Moralis.Query(ActiveCertificates)
      query.equalTo("TokenId", tokenId)
      const results = await query.find()
      logger.info(results)
      for (let i = 0; i < results.length; i++) {
        const object = results[i]
        for (let j = 0; j < toAddresses.length; j++) {
          if (object.get("Owner") == toAddresses[j]) {
            logger.info(`destroying ${object.get("Owner")}`)
            await object.destroy()
          }
        }
      }
    }
    for (let i = 0; i < toAddresses.length; i++) {
      const certificate = new ActiveCertificates()
      certificate.set("Owner", toAddresses[i])
      certificate.set("Provider", byAddress)
      certificate.set("TokenId", tokenId)
      certificate.set("Owner_lower", toAddresses[i].toLowerCase())
      logger.info(
        `Adding ${toAddresses[i]} with tokenId ${tokenId} from provider ${byAddress}`
      )
      await certificate.save()
    }
  }
})

Moralis.Cloud.afterSave("TokenBurned", async (request) => {
  const confirmed = request.object.get("confirmed")
  logger.info(`conformation ${confirmed}`)
  if (confirmed) {
    const ActiveCertificates = Moralis.Object.extend("ActiveCertificates")
    const account = request.object.get("account")
    const tokenId = request.object.get("uid")
    logger.info(`Searching account:${account} with token id:${tokenId}`)
    const query = new Moralis.Query(ActiveCertificates)
    query.equalTo("TokenId", tokenId)
    //query.equalTo("Owner", account.toString())
    const results = await query.find()
    for (let i = 0; i < results.length; i++) {
      const activeItem = results[i]
      logger.info(activeItem.get("Owner"))
      if (activeItem.get("Owner").toLowerCase() == account) {
        await activeItem.destroy()
        logger.info("item found and destoryed")
        break
      }
    }
    logger.info("No items found")
  }
})
