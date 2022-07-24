import { useEffect, useState } from "react"
import { useMoralis, useMoralisQuery, useNewMoralisObject } from "react-moralis"
import { Button, Modal, Input, useNotification } from "web3uikit"

const Certificates = () => {
  const { account } = useMoralis()
  const [editModal, setEditModal] = useState([])
  const dispatch = useNotification()
  let updateData = {}
  const {
    data: certificates,
    isLoading,
    fetch,
  } = useMoralisQuery("TokenDetails", (query) =>
    query.equalTo("provider", account.toLowerCase())
  )
  const { save } = useNewMoralisObject("TokenDetails")
  const submitEdit = async (certificate) => {
    const tokenId = certificate.attributes.tokenId
    const image = updateData.CID
      ? `https://ipfs.io/ipfs/${updateData.CID}`
      : certificate.attributes.image
    const data = {
      tokenId: certificate.attributes.tokenId,
      name: updateData.name || certificate.attributes.name,
      description: updateData.description || certificate.attributes.description,
      image,
      provider: certificate.attributes.provider,
    }
    console.log(data)
    updateData = {}
    await certificate.destroy()
    save(data, {
      onSuccess: () => {
        dispatch({
          type: "success",
          message: "Certificate updated successfully",
          title: "Updated",
          position: "topR",
        })
        closeModal(tokenId)
        fetch()
      },
    })
  }
  useEffect(() => {
    console.log(editModal)
  }, [editModal])

  const closeModal = (tokenId) => {
    setEditModal(editModal.filter((id) => id !== tokenId))
  }

  return (
    <div>
      {!isLoading || certificates ? (
        certificates.map((certificate) => {
          return (
            <div key={certificate.attributes.tokenId}>
              tokenId: {certificate.attributes.tokenId}
              <br />
              name: {certificate.attributes.name}, <br />
              description: {certificate.attributes.description}
              <br />
              <div className="flex">
                <Button
                  text="Edit"
                  onClick={() => {
                    setEditModal(editModal.push(certificate.attributes.tokenId))
                  }}
                  theme="primary"
                />
                <Button
                  text="Revoke"
                  onClick={() => {
                    console.log("revoke certificate")
                  }}
                  theme="colored"
                />
              </div>
              <Modal
                cancelText="Cancel"
                id="regular"
                isVisible={editModal.includes(certificate.attributes.tokenId)}
                okText="Submit"
                onOk={() => submitEdit(certificate)}
                onCancel={closeModal(certificate.attributes.tokenId)}
                onCloseButtonPressed={closeModal(
                  certificate.attributes.tokenId
                )}
                title="Update Listing Details"
              >
                <Input
                  label="Name"
                  value={certificate.attributes.name}
                  onBlur={(event) => {
                    updateData.name = event.target.value
                  }}
                />
                <Input
                  label="Description"
                  value={certificate.attributes.description}
                  onBlur={(event) => {
                    updateData.description = event.target.value
                  }}
                />
                <Input
                  label="CID"
                  value={certificate.attributes.image.replace(
                    "https://ipfs.io/ipfs/",
                    ""
                  )}
                  onBlur={(event) => {
                    updateData.CID = event.target.value
                  }}
                />
              </Modal>
            </div>
          )
        })
      ) : (
        <div>Loading</div>
      )}
    </div>
  )
}

export default Certificates
