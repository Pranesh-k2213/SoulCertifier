require("dotenv").config()
const fs = require("fs")
const { ethers, getChainId } = require("hardhat")

const frontend_contractFile = "../react-frontend/src/constants"

module.exports = async () => {
    if (process.env.UPDATE_FRONTEND) {
        //update contract address
        const soulCertifier = await ethers.getContract("SoulCertifier")
        const contractAddress = soulCertifier.address
        const chainId = (await getChainId()).toString()

        console.log("Updating frontend")
        const addressjson = JSON.parse(
            fs.readFileSync(`${frontend_contractFile}/soulCertifierAddress.json`, "utf-8")
        )
        addressjson[chainId] = contractAddress
        //console.log(contractAddress, addressjson)
        fs.writeFileSync(
            `${frontend_contractFile}/soulCertifierAddress.json`,
            JSON.stringify(addressjson)
        )

        //update contract abi
        fs.writeFileSync(
            `${frontend_contractFile}/soulCertifierAbi.json`,
            soulCertifier.interface.format(ethers.utils.FormatTypes.json)
        )
        console.log("Updated")
    }
}

module.exports.tags = ["all", "updateFrontend"]
