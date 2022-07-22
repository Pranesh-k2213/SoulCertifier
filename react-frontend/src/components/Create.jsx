import { Form, useNotification, Button } from "web3uikit"
import { useNewMoralisObject, useMoralis, useWeb3Contract } from "react-moralis"
import contactAbi from "../constants/soulCertifierAbi.json"
import contactAddress from "../constants/soulCertifierAddress.json"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

const Create = () => {
  const defaultFormData = [
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
  ]

  const { chainId, account } = useMoralis()
  const [addCount, setAddCount] = useState(1)
  const [formData, setFormData] = useState(defaultFormData)
  const navigate = useNavigate()
  const dispatch = useNotification()
  const { save } = useNewMoralisObject("TokenDetails")
  const { runContractFunction } = useWeb3Contract()
  const chainString = chainId ? parseInt(chainId).toString() : "31337"

  useEffect(() => {
    console.log(addCount)
    let newFormData = defaultFormData
    for (let i = 1; i < addCount; i++) {
      newFormData.push({
        name: "Receriver Address",
        type: "text",
        validation: {
          required: true,
          characterMaxLength: 42,
          characterMinLength: 42,
        },
        value: "",
      })
    }
    setFormData(newFormData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addCount])

  const createCertificate = async (values) => {
    const name = values.data[0].inputResult
    const description = values.data[1].inputResult
    const cid = values.data[2].inputResult
    const image = `https://ipfs.io/ipfs/${cid}`
    let accountArray = []
    for (let i = 0; i < addCount; i++) {
      accountArray.push(values.data[3 + i].inputResult.toLowerCase())
    }
    const createBunchOptions = {
      abi: contactAbi,
      contractAddress: contactAddress[chainString],
      functionName: "createBunch",
      params: {
        accounts: accountArray,
      },
    }
    runContractFunction({
      params: createBunchOptions,
      onSuccess: (res) => {
        res
          .wait(1)
          .then((rx) =>
            handleCreateSuccss(
              rx.events[0].args.id.toNumber(),
              name,
              description,
              image
            )
          )
      },
      onError: (error) => {
        console.log(error)
        navigate("/", { replace: true })
      },
    })
    console.log(createBunchOptions)
  }

  const handleCreateSuccss = (tokenId, name, description, image) => {
    const data = { tokenId, name, description, image, provider: account }
    console.log(data)
    save(data, {
      onSuccess: () => {
        dispatch({
          type: "success",
          message: "Certificates provided successfully",
          title: "Certified",
          position: "topR",
        })
      },
    })
    navigate("/", { replace: true })
  }
  return (
    <div className="create">
      <Form
        title="Create new Certificate"
        data={formData}
        buttonConfig={{
          theme: "primary",
        }}
        onSubmit={createCertificate}
      />
      <div className="button-order">
        <Button
          text="Add another address space"
          theme="primary"
          onClick={() => {
            setAddCount(addCount + 1)
            //console.log(addCount)
          }}
        />
        <Button
          text="Remove added address space"
          theme="secondary"
          onClick={() => {
            if (addCount > 1) {
              setAddCount(addCount - 1)
            }
          }}
        />
      </div>
    </div>
  )
}

export default Create
