import { useEffect } from "react"
import { useMoralisQuery } from "react-moralis"
import { useMoralis } from "react-moralis"
import Card from "./Card"
const Home = () => {
  const { account } = useMoralis()
  const {
    data: certificates,
    isLoading,
    fetch,
  } = useMoralisQuery("ActiveCertificates", (query) =>
    query.equalTo("Owner_lower", account)
  )

  //   useEffect(() => {
  //     console.log("Account:" + account, typeof account)
  //     console.log("isFetching:" + isFetching)
  //     console.log("isLoading:" + isLoading)
  //     console.log("Certificates:" + certificates)
  //     console.log("error:" + error)
  //   }, [isFetching, isLoading, certificates, account, error])

  return (
    <div className="home">
      {!certificates || isLoading ? (
        <div>
          <h1>Loading data</h1>
          <button
            onClick={() => {
              fetch()
            }}
          >
            Fetch Manually
          </button>
        </div>
      ) : (
        <div>
          <h1>You have got {certificates.length} certificates</h1>
          {certificates.map((certificate) => {
            const tokenId = parseInt(certificate.attributes.TokenId)
            const provider = certificate.attributes.Provider
            return (
              <Card
                className="card"
                provider={provider}
                tokenId={tokenId}
                key={tokenId}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Home
