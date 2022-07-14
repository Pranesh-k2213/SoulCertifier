const { network } = require("hardhat")
const { developmentChains, verificationBlockConformation } = require("../helper-hardhat-config.js")
require("dotenv").config()

const tokenURI = process.env.TOKEN_URI

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const waitBlockConformation = developmentChains.includes(network.name)
        ? 1
        : verificationBlockConformation
    //console.log(deployer, waitBlockConformation)
    log("----------------------------------------------")
    log("Deploying SoulCertifier")
    const args = [tokenURI]
    const soulCertifier = await deploy("SoulCertifier", {
        from: deployer,
        args: args,
        log: true,
        waitBlockConformation: waitBlockConformation,
    })
    log("----------------------------------------------")
    //console.log(soulCertifier)
}

module.exports.tags = ["all", "soulCertifier"]
