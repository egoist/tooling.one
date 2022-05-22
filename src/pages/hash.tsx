import { useEffect, useState } from "react"
import md5 from "crypto-js/md5"
import sha256 from "crypto-js/sha256"
import sha512 from "crypto-js/sha512"
import sha1 from "crypto-js/sha1"
import { Layout } from "../components/Layout"
import { Column, TwoColumns } from "../components/TwoColumns"
import { CopyButton } from "../components/Button"
import { Input } from "~/components/Input"

type HASH_TYPE = "MD5" | "SHA256" | "SHA512" | "SHA1"

const hashString = (name: HASH_TYPE, str: string) => {
  switch (name) {
    case "MD5":
      return md5(str).toString()
    case "SHA256":
      return sha256(str).toString()
    case "SHA512":
      return sha512(str).toString()
    case "SHA1":
      return sha1(str).toString()
    default:
      throw new Error(`Unknown hash type: ${name}`)
  }
}

export default function HashPage() {
  const [input, setInput] = useState("")

  const [hashed, setHashed] = useState<{ name: HASH_TYPE; value: string }[]>([
    {
      name: "MD5",
      value: "",
    },
    {
      name: "SHA1",
      value: "",
    },
    {
      name: "SHA256",
      value: "",
    },
    {
      name: "SHA512",
      value: "",
    },
  ])

  useEffect(() => {
    if (!input) return

    setHashed((hashed) => {
      return hashed.map((hash) => {
        return {
          ...hash,
          value: hashString(hash.name, input),
        }
      })
    })
  }, [input])

  return (
    <Layout>
      <TwoColumns>
        <Column title="Input">
          <Input
            id="input"
            rows={10}
            value={input}
            onChange={(value) => setInput(value)}
          />
        </Column>
        <Column title="Result">
          {input && (
            <div className="space-y-5">
              {hashed.map((hash) => {
                return (
                  <div key={hash.name}>
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="block mb-1">{hash.name}</span>
                      <CopyButton getValue={() => hash.value} />
                    </div>
                    <pre className="code w-full">{hash.value}</pre>
                  </div>
                )
              })}
            </div>
          )}
        </Column>
      </TwoColumns>
    </Layout>
  )
}
