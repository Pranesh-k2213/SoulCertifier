# SoulCertifier

This is a web3 application that helps users generate and distribute certificates as non fungable tokens.
It employes a ERC1155 compatible smart contract that is modified to make the token non tranferable.

Any user A can log in to the site and create a bunch of nft for a group of addresses and these nft will be the proof of some activity(certificate)

The users (B) who receives these nft's will not be able to transfer these nft's to others as certifactes cannot be transfered

Anyone who wants to verifiy that B has has a certificate provided by A can verify it through the website

## DEV

### Hardhat (smart contract)

The project uses smart contract that is developed with hardhat under './Hardhat-contracts' section

After running "yarn" to install required dependencies, try running

'''
yarn hardhat deploy
yarn hardhat coverage
yarn hardhat node
'''

### Node express uri server

This project also employes a Express js server to provide URI and make URI in 'URI-server'

```
nodemon server.js
```
