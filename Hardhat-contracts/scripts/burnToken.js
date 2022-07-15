const { ethers, getNamedAccounts, getUnnamedAccounts, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

const USER_NUM = 0
const TOKEN_ID = 0
const MOVE_BLOCKS = 4
const SLEEP_AMOUNT = 500

const burnToken = async () => {
    const { deployer } = await getNamedAccounts()
    const users = await getUnnamedAccounts()
    const soulCertifier = await ethers.getContract("SoulCertifier")
    const response = await soulCertifier.burnToken(users[USER_NUM], TOKEN_ID, { from: deployer })
    await response.wait(1)
    console.log(`tokenId: ${TOKEN_ID} of user id: ${USER_NUM} is burned`)

    if (network.name == "localhost") {
        await moveBlocks(MOVE_BLOCKS, SLEEP_AMOUNT)
    }
}

burnToken()
    .then(() => {
        process.exit(0)
    })
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
