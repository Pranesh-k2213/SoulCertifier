import { Form } from "web3uikit"
import { useNewMoralisObject, useMoralis, useWeb3Contract } from "react-moralis"
import contactAbi from "../constants/soulCertifierAbi.json"
import contactAddress from "../constants/soulCertifierAddress.json"
import { useNavigate } from "react-router-dom"

const Create = () => {
  const { chainId, account } = useMoralis()
  const navigate = useNavigate()
  const chainString = chainId ? parseInt(chainId).toString() : "31337"
  const { save } = useNewMoralisObject("TokenDetails")
  const { runContractFunction } = useWeb3Contract()

  const createCertificate = async (values) => {
    const name = values.data[0].inputResult
    const description = values.data[1].inputResult
    const cid = values.data[2].inputResult
    const image = `https://ipfs.io/ipfs/${cid}`
    const recAdd = values.data[3].inputResult.toLowerCase()
    if (
      !name ||
      !description ||
      !cid ||
      cid.length !== 46 ||
      !recAdd ||
      recAdd.length !== 42 ||
      recAdd.slice(0, 2) != "0x"
    ) {
      navigate("/create", { replace: true })
    }
    const createBunchOptions = {
      abi: contactAbi,
      contractAddress: contactAddress[chainString],
      functionName: "createBunch",
      params: {
        accounts: [recAdd],
      },
    }
    runContractFunction({
      params: createBunchOptions,
      onSuccess: (res) => {
        handleCreateSuccss(res, name, description, image)
      },
      onError: (error) => console.log(error),
    })
    console.log(createBunchOptions)
  }

  const handleCreateSuccss = (res, name, description, image) => {
    console.log({ res, name, description, image })
    navigate("/", { replace: true })
  }
  return (
    <div className="create">
      <Form
        title="Create new Certificate"
        data={[
          {
            name: "Certificate Title",
            type: "text",
            validation: {
              required: true,
            },
            value: "",
          },
          {
            name: "Certificate Description",
            type: "text",
            validation: {
              required: true,
            },
            value: "",
          },
          {
            name: "Certificate Image CID",
            type: "text",
            validation: {
              required: true,
              characterMaxLength: 46,
              characterMinLength: 46,
            },
            value: "",
          },
          {
            name: "Receriver Address",
            type: "text",
            validation: {
              required: true,
              characterMaxLength: 42,
              characterMinLength: 42,
            },
            value: "",
          },
        ]}
        buttonConfig={{
          theme: "primary",
        }}
        onSubmit={createCertificate}
      />
    </div>
  )
}

export default Create
