const Moralis = require("moralis/node")
require("dotenv").config()
let chainId = process.env.chainId || 31337
// eslint-disable-next-line eqeqeq
let moralisChainId = chainId == "31337" ? "1337" : chainId
const contractAddresses = require("./constants/soulCertifierAddress.json")
const contractAddress = contractAddresses[chainId].toString()

const serverUrl = process.env.REACT_APP_SERVER_URL
const appId = process.env.REACT_APP_APPLICATION_ID
const masterKey = process.env.moralisMasterKey

const addEvents = async () => {
  Moralis.start({ serverUrl, appId, masterKey })
  const bunchCreatedEventOptions = {
    chainId: moralisChainId,
    sync_historical: true,
    address: contractAddress,
    topic: "BunchCreated(address,uint256,bool,address[])",
    description: "Fired on createBunch",
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "by",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "bool",
          name: "isNew",
          type: "bool",
        },
        {
          indexed: false,
          internalType: "address[]",
          name: "to",
          type: "address[]",
        },
      ],
      name: "BunchCreated",
      type: "event",
    },
    tableName: "BunchCreated",
  }

  const tokenBurnedEventOptions = {
    chainId: moralisChainId,
    address: contractAddress,
    sync_historical: true,
    topic: "TokenBurned(address,address,uint256)",
    description: "Fired on burning a token",
    tableName: "TokenBurned",
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "by",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
      ],
      name: "TokenBurned",
      type: "event",
    },
  }

  const bunchCreatedResponse = await Moralis.Cloud.run(
    "watchContractEvent",
    bunchCreatedEventOptions,
    {
      useMasterKey: true,
    }
  )

  const tokenBurnedResponse = await Moralis.Cloud.run(
    "watchContractEvent",
    tokenBurnedEventOptions,
    { useMasterKey: true }
  )
  console.log(bunchCreatedResponse)
  console.log(tokenBurnedResponse)
}

addEvents()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
