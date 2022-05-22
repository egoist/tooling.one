import { useState } from "react"
import qrcodeParser from "qrcode-parser";
import { CopyButton, Button } from "../components/Button"
import { CodeBlock } from "../components/CodeBlock"
import { Layout } from "../components/Layout"
import { ErrorMessage } from "../components/ErrorMessage"
import { Column, TwoColumns } from "../components/TwoColumns"

export default function QrcodeParserPage() {
  const [result, setResult] = useState("")
  const [error, setError] = useState("")
  const [imageSrc, setImageSrc] = useState("")

  const resetState = () => {
    setError("")
    setResult("")
    setImageSrc("")
  }

  const handleChange = async (e: any) => {
    resetState()
    const file = e.target.files[0]

    try {
      const qrcodeContent = await qrcodeParser(file)
      setResult(qrcodeContent)

      const reader = new FileReader()
      reader.onloadend = () => {
        setImageSrc(reader.result.toString())
      }
      reader.onerror = (err) => {
        alert(err)
      }
      reader.readAsDataURL(file)
    } catch (err) {
      setError(err.message)
      console.error(err)
    }
  }

  const getClipboardImageContent = async () => {
    resetState()

    try {
      const clipboardItems = await navigator.clipboard.read();
   
      for (const clipboardItem of clipboardItems) {
        if (!clipboardItem.types.includes("image/png")) {
          throw new Error("Clipboard contains non-image data.");
        }
        
        const blob = await clipboardItem.getType("image/png");
        const url = URL.createObjectURL(blob);
        const qrcodeContent = await qrcodeParser(url)

        setResult(qrcodeContent)
        setImageSrc(url)
      }
    } catch (err) {
      setError(err.message)
      console.error(err);
    }
  }

  return (
    <Layout>
      <TwoColumns>
        <Column title="QR Code Image" renderRight={() => <Button onClick={getClipboardImageContent}>Getting image from clipboard</Button>}>
          <ErrorMessage className="mb-2" message={error} />
          <input type="file" accept="image/png" onChange={handleChange} />
          {imageSrc && (
            <div className="mt-5">
              <img src={imageSrc} />
            </div>
          )}
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
