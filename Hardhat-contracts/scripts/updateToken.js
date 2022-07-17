const { ethers, getNamedAccounts, getUnnamedAccounts, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

const MOVE_BLOCKS = 4
const SLEEP_AMOUNT = 500
const TOKEN_ID = 0

const updateNewToken = async () => {
    const { deployer } = await getNamedAccounts()
    const users = await getUnnamedAccounts()
    const accounts = [users[0], users[2]]
    const soulCertifier = await ethers.getContract("SoulCertifier")
    const response = await soulCertifier.createBunchWithId(accounts, TOKEN_ID, { from: deployer })
    await response.wait(1)
    console.log(`Certified ${accounts}, with token of id ${TOKEN_ID}`)
    //console.log("topics", receipt.logs[0].topics)
    //console.log("event args", await receipt.events[0].decode())
    if (network.name == "localhost") {
        await moveBlocks(MOVE_BLOCKS, SLEEP_AMOUNT)
    }
}

updateNewToken()
    .then(() => {
        process.exit(0)
    })
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
