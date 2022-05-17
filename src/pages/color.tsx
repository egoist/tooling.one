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

  const handleHexChange = (value: string) => {
    setError("");
    try {
      setHex(value);
      setPicker(value);
      setRgb(formatRgb(convert.hex.rgb(value)));
      setHsl(formatHsl(convert.hex.hsl(value)));
      setKeyword(convert.hex.keyword(value));
    } catch (e) {
      setError(e.message);
    }
  };
  const handleRgbChange = (value: string) => {
    setError("");
    try {
      const rgbAry = parseNumArray(value, 3);
      setHex(formatHex(convert.rgb.hex(rgbAry)));
      setPicker(formatHex(convert.rgb.hex(rgbAry)));
      setRgb(value);
      setHsl(formatHsl(convert.rgb.hsl(rgbAry)));
      setKeyword(convert.rgb.keyword(rgbAry));
    } catch (e) {
      setError(e.message);
    }
  };
  const handleHslChange = (value: string) => {
    setError("");
    try {
      const hslAry = parseNumArray(value, 3);
      setHsl(value);
      setRgb(formatRgb(convert.hsl.rgb(hslAry)));
      setHex(formatHex(convert.hsl.hex(hslAry)));
      setPicker(formatHex(convert.hsl.hex(hslAry)));
      setKeyword(convert.hsl.keyword(hslAry));
    } catch (e) {
      setError(e.message);
    }
  };
  const handleKeywordChange = (value: string) => {
    setError("");
    try {
      setKeyword(value);
      // color-convert only supports keyword -> rgb

      const k2rgb = convert.keyword.rgb(value);
      if (k2rgb === undefined) {
        // setError("Not in CSS Color Keywords : " + value)
        return;
      }
      setHex(formatHex(convert.rgb.hex(k2rgb)));
      setPicker(formatHex(convert.rgb.hex(k2rgb)));
      setRgb(formatRgb(k2rgb));
      setHsl(formatHsl(convert.rgb.hsl(k2rgb)));
    } catch (e) {
      setError(e.message);
    }
  };
  const handleColorPicker: ChangeEventHandler<HTMLInputElement> = (ev) => {
    setError("");
    setPicker(ev.currentTarget.value);
    setHex(ev.currentTarget.value);
    handleHexChange(ev.currentTarget.value);
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
