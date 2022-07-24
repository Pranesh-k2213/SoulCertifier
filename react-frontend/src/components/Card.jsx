import { useState } from "react"
import { useEffect } from "react"
import { NFT } from "web3uikit"
import { useMoralis } from "react-moralis"
const Card = ({ tokenId, provider }) => {
  const [tokenJson, setTokenJson] = useState(null)
  const { chainId } = useMoralis()
  useEffect(() => {
    const fetchTokenJson = async () => {
      const response = await fetch(`/api/${tokenId}/`)
      const json = await response.json()
      if (response.ok) {
        setTokenJson(json)
        //console.log(tokenJson)
      }
    }
    fetchTokenJson().catch((error) => {
      console.log(error)
    })
  }, [tokenId])

  return tokenJson ? (
    <div>
      TokenId: {tokenId}
      <br />
      Provider:{provider}
      <br />
      name:{tokenJson.name}
      <br />
      description:{tokenJson.description}
      <br />
      <img className="card-image" src={tokenJson.image} alt="nft" />
    </div>
  ) : (
    <div>Loading...</div>
  )
}

export default Card
