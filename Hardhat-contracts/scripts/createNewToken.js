const { ethers, getNamedAccounts, getUnnamedAccounts, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

const MOVE_BLOCKS = 4
const SLEEP_AMOUNT = 500

const createNewToken = async () => {
    const { deployer } = await getNamedAccounts()
    const users = await getUnnamedAccounts()
    const accounts = [users[0], users[1]]
    const soulCertifier = await ethers.getContract("SoulCertifier")
    const response = await soulCertifier.createBunch(accounts, { from: deployer })
    await response.wait(1)
    const tokenId = response.value.toNumber()
    console.log(`Certified ${accounts}, with token of id ${tokenId}`)
    //console.log("topics", receipt.logs[0].topics)
    //console.log("event args", await receipt.events[0].decode())
    if (network.name == "localhost") {
        await moveBlocks(MOVE_BLOCKS, SLEEP_AMOUNT)
    }
}

createNewToken()
    .then(() => {
        process.exit(0)
    })
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
