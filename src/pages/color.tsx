import React, { ChangeEventHandler, useEffect } from "react"
import convert from "color-convert"
import { Layout } from "../components/Layout"
import { ErrorMessage } from "../components/ErrorMessage"
import { CopyButton } from "../components/Button"
import { Column, TwoColumns } from "../components/TwoColumns"
import { Input } from "~/components/Input"

export default function ColorConvertPage() {
  const [error, setError] = React.useState("")
  const [hex, setHex] = React.useState("#000000")
  const [rgb, setRgb] = React.useState("")
  const [hsl, setHsl] = React.useState("")
  const [cmyk, setCmyk] = React.useState("")
  const [keyword, setKeyword] = React.useState("")
  const [picker, setPicker] = React.useState(hex)

  useEffect(() => {
    update(hex, "hex")
  }, [])

  const formatHsl = (hsl: number[]) => {
    const [h, s, l] = hsl
    return `hsl(${h}, ${s}%, ${l}%)`
  }
  const formatRgb = (rgb: number[]) => {
    const [r, g, b] = rgb
    return `rgb(${r}, ${g}, ${b})`
  }
  const formatCmyk = (cmyk: number[]) => {
    const [c, m, y, k] = cmyk
    return `cmyk(${c}%, ${m}%, ${y}%, ${k}%)`
  }
  const formatHex = (hex: string) => {
    return `#${hex.replace("#", "")}`
  }
  const parseNumArray = (input: string, length: number) => {
    const result = input.replace(/[^0-9,.]/g, "").split(",")
    return result.slice(0, length).map((x) => parseFloat(x))
  }

  type InputSourceType = "hex" | "rgb" | "hsl" | "cmyk" | "keyword" | "picker"

  const update = (hex: string, skip: InputSourceType) => {
    setError("")
    try {
      if (skip !== "hex") {
        setHex(formatHex(hex))
      }

      if (skip !== "picker") {
        setPicker(formatHex(hex))
      }

      if (skip !== "rgb") {
        setRgb(formatRgb(convert.hex.rgb(hex)))
      }

      if (skip !== "cmyk") {
        setCmyk(formatCmyk(convert.hex.cmyk(hex)))
      }

      if (skip !== "hsl") {
        setHsl(formatHsl(convert.hex.hsl(hex)))
      }

      if (skip !== "keyword") {
        setKeyword(convert.hex.keyword(hex))
      }
    } catch (e) {
      setError(e.message)
    }
  }

  const handleHexChange = (value: string) => {
    setHex(value)
    update(value, "hex")
  }
  const handleRgbChange = (value: string) => {
    setRgb(value)
    const hex = convert.rgb.hex(parseNumArray(value, 3))
    update(hex, "rgb")
  }
  const handleHslChange = (value: string) => {
    setHsl(value)
    const hex = convert.hsl.hex(parseNumArray(value, 3))
    update(hex, "hsl")
  }
  const handleCmykChange = (value: string) => {
    setCmyk(value)
    const hex = convert.cmyk.hex(parseNumArray(value, 4))
    update(hex, "cmyk")
  }
  const handleKeywordChange = (value: string) => {
    setKeyword(value)
    // color-convert only supports keyword -> rgb
    const k2rgb = convert.keyword.rgb(value)
    if (k2rgb === undefined) {
      // setError("Not in CSS Color Keywords : " + value)
      return
    }
    const k2hex = convert.rgb.hex(k2rgb)
    update(k2hex, "keyword")
  }

  const handleColorPicker: ChangeEventHandler<HTMLInputElement> = (ev) => {
    setPicker(ev.currentTarget.value)
    const hex = ev.target.value.replace("#", "")
    update(hex, "picker")
  }

  return (
    <Layout>
      <TwoColumns>
        <Column
          title="Hex"
          renderRight={() => <CopyButton getValue={() => hex} />}
        >
          <ErrorMessage className="mb-2" message={error} />
          <Input
            rows={5}
            id="input-el"
            className="w-full input"
            value={hex}
            onChange={handleHexChange}
            spellCheck={false}
          ></Input>

          <input type="color" value={picker} onChange={handleColorPicker} />
        </Column>
        <Column title="Result">
          {error && (
            <div className="px-5 py-3 text-white bg-red-500 rounded-lg mb-3">
              {error}
            </div>
          )}
          <div className="space-y-5">
            <Input
              rows={1}
              label="RGB:"
              value={rgb}
              onChange={handleRgbChange}
              spellCheck={false}
              canCopy
            ></Input>
            <Input
              rows={1}
              label="HSL:"
              value={hsl}
              onChange={handleHslChange}
              spellCheck={false}
              canCopy
            ></Input>

            <Input
              id="cmyk"
              label="CMYK:"
              value={cmyk}
              onChange={handleCmykChange}
              spellCheck={false}
              canCopy
            />

            <Input
              id="keyword"
              label="Keyword:"
              value={keyword}
              onChange={handleKeywordChange}
              spellCheck={false}
              canCopy
            />
          </div>
        </Column>
      </TwoColumns>
    </Layout>
  )
}
