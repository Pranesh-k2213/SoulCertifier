const { getNamedAccounts, deployments, ethers, getUnnamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")
require("dotenv").config()

const tokenURI = process.env.TOKEN_URI

describe("SoulCertifier", async () => {
    let soulCertifier
    let deployer
    let users
    let accounts
    beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer
        users = await getUnnamedAccounts()
        accounts = [users[0], users[1]]
        //console.log(deployer)
        //console.log(users[0])
        //accounts = [ethers.utils.getAddress(users[1]), ethers.utils.getAddress(users[2])]
        //console.log(typeof accounts, accounts)
        //console.log(users)
        //console.log(typeof accounts[0], typeof deployer)
        await deployments.fixture(["all"])
        soulCertifier = await ethers.getContract("SoulCertifier")
    })

    describe("Constructor", () => {
        it("Sets the token URI correctly", async () => {
            const response = await soulCertifier.uri(3)
            assert.equal(response, tokenURI)
        })
    })

    describe("supportsInterface", () => {
        it("returns correct interface id", async () => {
            const response = await soulCertifier.supportsInterface("0xd9b67a26")
            //console.log("Response is:", response, typeof response)
            assert.equal(response, true)
        })
    })

    describe("balanceOf", () => {
        it("Reverts if address is null", async () => {
            await expect(soulCertifier.balanceOf("0x0000000000000000000000000000000000000000")).to
                .be.reverted
        })
    })

    describe("balanceOfBatch", () => {
        it("It must revert if the size of accounts and ids doesnt match", async () => {
            await expect(soulCertifier.balanceOfBatch([users[0], users[1]], [0])).to.be.reverted
        })
    })

    describe("createBunch - without tokenId", () => {
        it("Emits BunchCreated event on certificate creation", async () => {
            await expect(soulCertifier.createBunch(accounts, { from: deployer })).to.emit(
                soulCertifier,
                "BunchCreated"
            )
            //.withArgs(accounts, deployer, 0)
        })
        it("It should update _balance", async () => {
            const tokenid = (await soulCertifier.createBunch(accounts)).value.toNumber()
            const response = await soulCertifier.balanceOfBatch(accounts, [tokenid, tokenid])
            expect(response).to.eql([ethers.BigNumber.from("1"), ethers.BigNumber.from("1")])
        })

        it("It increments token Id on call", async () => {
            const tokenid = (await soulCertifier.createBunch(accounts)).value.toNumber()
            const respose = await soulCertifier.getNextTokenId()
            assert.equal(respose, tokenid + 1)
        })
    })

    describe("createBunchWithId", () => {
        it("It must revert when called by called by others", async () => {
            const tokenid = (
                await soulCertifier.createBunch(accounts, { from: deployer })
            ).value.toNumber()
            await expect(soulCertifier.createBunchWithId([users[2]], tokenid, { from: users[0] }))
                .to.be.reverted
        })

        it("It must emit BunchCreated event on completion", async () => {
            const tokenid = (
                await soulCertifier.createBunch(accounts, { from: deployer })
            ).value.toNumber()
            await expect(
                soulCertifier.createBunchWithId([users[2]], tokenid, { from: deployer })
            ).to.emit(soulCertifier, "BunchCreated")
        })

        it("It must update Balances", async () => {
            const tokenid = (
                await soulCertifier.createBunch(accounts, { from: deployer })
            ).value.toNumber()
            await soulCertifier.createBunchWithId([users[2]], tokenid, { from: deployer })
            const response = await soulCertifier.balanceOf(users[2], tokenid)
            expect(response).to.eql(ethers.BigNumber.from("1"))
        })

        it("It must update Balance of bunch", async () => {
            const tokenid = (
                await soulCertifier.createBunch(accounts, { from: deployer })
            ).value.toNumber()
            await soulCertifier.createBunchWithId([users[2], users[3]], tokenid, { from: deployer })
            const response = await soulCertifier.balanceOfBatch(
                [users[2], users[3]],
                [tokenid, tokenid]
            )
            expect(response).to.eql([ethers.BigNumber.from("1"), ethers.BigNumber.from("1")])
        })
    })

    describe("burnToken", () => {
        it("It must revert when called by called by others", async () => {
            const tokenid = (
                await soulCertifier.createBunch(accounts, { from: deployer })
            ).value.toNumber()
            await expect(soulCertifier.burnToken(users[0], tokenid, { from: users[0] })).to.be
                .reverted
        })

        it("It must revert if there is no such token", async () => {
            const tokenid = (
                await soulCertifier.createBunch(accounts, { from: deployer })
            ).value.toNumber()
            await expect(soulCertifier.burnToken(users[2], tokenid, { from: deployer })).to.be
                .reverted
        })

        it("It must emit TokenBurned event when successful", async () => {
            const tokenid = (
                await soulCertifier.createBunch(accounts, { from: deployer })
            ).value.toNumber()
            await expect(soulCertifier.burnToken(users[0], tokenid, { from: deployer })).to.emit(
                soulCertifier,
                "TokenBurned"
            )
        })

        it("It must update _balaces", async () => {
            const tokenid = (
                await soulCertifier.createBunch(accounts, { from: deployer })
            ).value.toNumber()
            await soulCertifier.burnToken(users[0], tokenid, { from: deployer })
            await soulCertifier.burnToken(users[1], tokenid, { from: deployer })
            const response = await soulCertifier.balanceOfBatch(
                [users[0], users[1]],
                [tokenid, tokenid]
            )
            //expect(response).to.eql([ethers.BigNumber.from("1"), ethers.BigNumber.from("1")])
            assert.deepEqual(response, [ethers.BigNumber.from("0"), ethers.BigNumber.from("0")])
        })
    })
})
