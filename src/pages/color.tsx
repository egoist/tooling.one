import React, { ChangeEventHandler } from "react";
import convert from "color-convert";
import { Layout } from "../components/Layout";
import { ErrorMessage } from "../components/ErrorMessage";
import { CopyButton } from "../components/Button";
import { Column, TwoColumns } from "../components/TwoColumns";
import { Textarea } from "~/components/Textarea";

export default function ColorConvertPage() {
  const [error, setError] = React.useState("");
  const [hex, setHex] = React.useState("#000000");
  const [rgb, setRgb] = React.useState("rgb(0, 0, 0)");
  const [hsl, setHsl] = React.useState("hsl(0, 0%, 0%)");
  const [keyword, setKeyword] = React.useState("black");
  const [picker, setPicker] = React.useState("#000000");

  const formatHsl = (hsl: number[]) => {
    const [h, s, l] = hsl;
    return `hsl(${h}, ${s}%, ${l}%)`;
  };
  const formatRgb = (rgb: number[]) => {
    const [r, g, b] = rgb;
    return `rgb(${r}, ${g}, ${b})`;
  };
  const formatHex = (hex: string) => {
    return `#${hex}`;
  };
  const parseNumArray = (input: string, length: number) => {
    const result = input.replace(/[^0-9,.]/g, "").split(",");
    return result.slice(0, length).map((x) => parseFloat(x));
  };

  type InputSourceType = "hex" | "rgb" | "hsl" | "keyword" | "picker";

  const update = (hex: string, skip: InputSourceType) => {
    setError("");
    try {
      if (skip !== "hex") {
        setHex(formatHex(hex));
      }

      if (skip !== "picker") {
        setPicker(formatHex(hex));
      }

      if (skip !== "rgb") {
        setRgb(formatRgb(convert.hex.rgb(hex)));
      }

      if (skip !== "hsl") {
        setHsl(formatHsl(convert.hex.hsl(hex)));
      }

      if (skip !== "keyword") {
        setKeyword(convert.hex.keyword(hex));
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const handleHexChange = (value: string) => {
    setHex(value);
    update(value, "hex");
  };
  const handleRgbChange = (value: string) => {
    setRgb(value);
    const hex = convert.rgb.hex(parseNumArray(value, 3));
    update(hex, "rgb");
  };
  const handleHslChange = (value: string) => {
    setHsl(value);
    const hex = convert.hsl.hex(parseNumArray(value, 3));
    update(hex, "hsl");
  };
  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    // color-convert only supports keyword -> rgb
    const k2rgb = convert.keyword.rgb(value);
    if (k2rgb === undefined) {
      // setError("Not in CSS Color Keywords : " + value)
      return;
    }
    const k2hex = convert.rgb.hex(k2rgb);
    update(k2hex, "keyword");
  };

  const handleColorPicker: ChangeEventHandler<HTMLInputElement> = (ev) => {
    setPicker(ev.currentTarget.value);
    const hex = ev.target.value.replace("#", "");
    update(hex, "picker");
  };

  return (
    <Layout>
      <TwoColumns>
        <Column
          title="Hex"
          renderRight={() => <CopyButton getValue={() => hex} />}
        >
          <ErrorMessage className="mb-2" message={error} />
          <Textarea
            rows={5}
            id="input-el"
            className="w-full input"
            value={hex}
            onChange={handleHexChange}
            spellCheck={false}
          >
          </Textarea>

          <input type="color" value={picker} onChange={handleColorPicker} />
        </Column>
        <Column title="Result">
          {error && (
            <div className="px-5 py-3 text-white bg-red-500 rounded-lg mb-3">
              {error}
            </div>
          )}
          <div className="space-y-5">
            <div>
              <div className="mb-2">RGB:</div>
              <Textarea
                fullWidth
                rows={1}
                value={rgb}
                onChange={handleRgbChange}
                spellCheck={false}
              >
              </Textarea>
            </div>
            <div>
              <div className="mb-2">HSL:</div>
              <Textarea
                fullWidth
                rows={1}
                value={hsl}
                onChange={handleHslChange}
                spellCheck={false}
              >
              </Textarea>
            </div>
            <div>
              <div className="mb-2">Keyword:</div>
              <Textarea
                fullWidth
                rows={1}
                value={keyword}
                onChange={handleKeywordChange}
                spellCheck={false}
              >
              </Textarea>
            </div>
          </div>
        </Column>
      </TwoColumns>
    </Layout>
  );
}
