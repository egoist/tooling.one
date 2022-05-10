import { useEffect, useState } from "react"
import {
  camelCase,
  pascalCase,
  pathCase,
  kebabCase,
  snakeCase,
  constantCase,
} from "case-anything"
import titleCase from "title"
import { Layout } from "../components/Layout"
import { Textarea } from "../components/Textarea"
import { Column, TwoColumns } from "../components/TwoColumns"
import { CopyButton } from "../components/Button"

export default function TextCasePage() {
  const [input, setInput] = useState("")

  const [result, setResult] = useState<
    { name: string; value: string; convert: (value: string) => string }[]
  >([
    {
      name: "Camel Case",
      value: "",
      convert: (value) => camelCase(value),
    },
    {
      name: "Pascal Case",
      value: "",
      convert: (value) => pascalCase(value),
    },
    {
      name: "Snake Case",
      value: "",
      convert: (value) => snakeCase(value),
    },
    {
      name: "Kebab Case",
        value: "",
        convert: (value) => kebabCase(value),
    },
    {
      name: "Title Case",
      value: "",
      convert: (value) => titleCase(value),
    },
    {
      name: "Path Case",
      value: "",
      convert: (value) => pathCase(value),
    },
    {
      name: "Constant Case",
      value: "",
      convert: (value) => constantCase(value),
    },
  ])

  useEffect(() => {
    setResult((result) =>
      result.map((item) => {
        return {
          ...item,
          value: item.convert(input),
        }
      })
    )
  }, [input])

  return (
    <Layout>
      <TwoColumns>
        <Column title="Input">
          <Textarea value={input} fullWidth onChange={setInput} />
        </Column>
        <Column title="Result">
          {input && (
            <div className="space-y-5">
              {result.map((item) => {
                return (
                  <div key={item.name}>
                    <div className="mb-1 flex items-center justify-between">
                      <span>{item.name}</span>
                      <CopyButton getValue={() => item.value} />
                    </div>
                    <pre className="code">{item.value}</pre>
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
