import clsx from "clsx"
import React from "react"
import { Layout } from "../components/Layout"
import { ErrorMessage } from "../components/ErrorMessage"
import { Button, CopyButton } from "../components/Button"
import { Column, TwoColumns } from "../components/TwoColumns"

export default function Base64Page() {
  const [encoded, setEncoded] = React.useState("")
  const [decoded, setDecoded] = React.useState("")
  const [encodingError, setEncodingError] = React.useState("")
  const [decodingError, setDecodingError] = React.useState("")

  const clearErrors = () => {
    setEncodingError("")
    setDecodingError("")
  }

  const handleDecodedChange = (e: any) => {
    const value = e.target.value
    setDecoded(value)
    clearErrors()
    try {
      const result = btoa(unescape(encodeURIComponent(value)))
      setEncoded(result)
    } catch (err) {
      console.error(err)
      setEncodingError(err.message)
    }
  }

  const handleEncodedChange = (e: any) => {
    const value = e.target.value
    setEncoded(value)
    clearErrors()
    try {
      const result = decodeURIComponent(escape(atob(value)))
      setDecoded(result)
    } catch (err) {
      console.error(err)
      setDecodingError(err.message)
    }
  }

  return (
    <Layout>
      <TwoColumns>
        <Column
          title="Text"
          renderRight={() => <CopyButton getValue={() => decoded} />}
        >
          <ErrorMessage className="mb-2" message={encodingError} />
          <textarea
            rows={10}
            id="input-el"
            className="w-full input"
            value={decoded}
            onChange={handleDecodedChange}
          ></textarea>
        </Column>
        <Column
          title="Encoded"
          renderRight={() => <CopyButton getValue={() => encoded} />}
        >
          <ErrorMessage className="mb-2" message={decodingError} />
          <textarea
            id="output-el"
            rows={10}
            value={encoded}
            onChange={handleEncodedChange}
            className={clsx(
              `w-full resize-none border rounded-md p-2 focus:outline-none focus:ring-2 focus:border-blue-500`
            )}
          ></textarea>
        </Column>
      </TwoColumns>
    </Layout>
  )
}
