import { useState } from "react"
import qrcodeParser from "qrcode-parser";
import { CopyButton } from "../components/Button"
import { CodeBlock } from "../components/CodeBlock"
import { Layout } from "../components/Layout"
import { ErrorMessage } from "../components/ErrorMessage"
import { Column, TwoColumns } from "../components/TwoColumns"

export default function QrcodeParserPage() {
  const [result, setResult] = useState("")
  const [error, setError] = useState("")

  const handleChange = async (e: any) => {
    const file = e.target.files[0]
    setError("")
    setResult("")
    try {
      const qrcodeContent = await qrcodeParser(file)
      setResult(qrcodeContent)
    } catch (err) {
      setError(err.message)
      console.error(err)
    }
  }

  return (
    <Layout>
      <TwoColumns>
        <Column title="QR Code Image">
          <ErrorMessage className="mb-2" message={error} />
          <input type="file" accept="image/png" onChange={handleChange} />
        </Column>
        <Column
          title="Result"
          renderRight={() => <CopyButton getValue={() => result} />}
        >
          {result && (
            <div>
              <CodeBlock
                code={result}
              />
            </div>
          )}
        </Column>
      </TwoColumns>
    </Layout>
  )
}
