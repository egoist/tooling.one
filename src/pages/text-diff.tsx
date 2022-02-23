import type { editor as MonacoEditor } from "monaco-editor"
import { useEffect, useRef, useState } from "react"
import { Layout } from "../components/Layout"
import { MONACO_LANGUAGES, MONACO_PATH } from "../generated/monaco-editor"

const loadMonaco = async (): Promise<typeof import("monaco-editor")> => {
  // @ts-expect-error
  if (window.monaco) return window.monaco

  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = `${MONACO_PATH}/min/vs/loader.js`
    script.id = "monaco-loader"
    script.onload = () => {
      // @ts-expect-error
      window.require.config({ paths: { vs: `${MONACO_PATH}/min/vs` } })
      // @ts-expect-error
      window.require(["vs/editor/editor.main"], () => {
        // @ts-expect-error
        resolve(window.monaco)
      })
    }
    document.body.appendChild(script)
  })
}

const getMonaco = (): typeof import("monaco-editor") | undefined => {
  // @ts-expect-error
  return window.monaco
}

const getMonacoFileUrl = (language: string, filename: string) => {
  const monaco = getMonaco()
  const isTS = language === "typescript"
  const isJS = language === "javascript"
  if (isTS || isJS) {
    return monaco.Uri.file(filename + (isTS ? ".tsx" : ".jsx"))
  }
  return undefined
}

export default function TextDiffPage() {
  const editorContainer = useRef<HTMLDivElement | null>(null)
  const [language, setLanguage] = useState("text")
  const [inlineView, setInlineView] = useState(false)

  const [diffEditor, setDiffEditor] =
    useState<MonacoEditor.IStandaloneDiffEditor | null>(null)

  const createModel = (
    value: string,
    language: string,
    type: "original" | "modified"
  ) => {
    const monaco = getMonaco()
    return monaco.editor.createModel(
      value,
      language,
      getMonacoFileUrl(language, type)
    )
  }

  const initEditor = async () => {
    const monaco = await loadMonaco()
    // Disable type errors
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: false,
    })

    // Tell typescript to use 'react' for jsx files.
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.React,
    })

    const originalModel = createModel(`Hello World`, language, "original")
    const modifiedModel = createModel(`Goodbye World`, language, "modified")
    const editor = monaco.editor.createDiffEditor(editorContainer.current, {
      enableSplitViewResizing: false,
      renderSideBySide: !inlineView,
      originalEditable: true,
    })
    editor.setModel({
      original: originalModel,
      modified: modifiedModel,
    })

    setDiffEditor(editor)
  }

  useEffect(() => {
    initEditor()

    return () => {
      if (diffEditor) diffEditor.dispose()
    }
  }, [])

  useEffect(() => {
    if (diffEditor) {
      const monaco = getMonaco()
      if (monaco) {
        const models = diffEditor.getModel()

        if (language === "typescript" || language === "javascript") {
          // Currently no way to change model uri, so we have to recreate the model
          const orignal = models.original.getValue()
          const modified = models.modified.getValue()
          models.original.dispose()
          models.modified.dispose()
          const originalModel = createModel(orignal, language, "original")
          const modifiedModel = createModel(modified, language, "modified")
          diffEditor.setModel({
            original: originalModel,
            modified: modifiedModel,
          })
        } else {
          monaco.editor.setModelLanguage(models.modified, language)
          monaco.editor.setModelLanguage(models.original, language)
        }
      }
    }
  }, [language])

  useEffect(() => {
    if (diffEditor) {
      diffEditor.updateOptions({
        renderSideBySide: !inlineView,
      })
    }
  }, [inlineView])

  return (
    <Layout>
      <div className="h-screen flex flex-col">
        <header className="h-12 border-b flex-shrink-0 flex items-center px-3 space-x-5">
          <select
            value={language}
            className="bg-white p-1 border rounded-lg"
            onChange={(e) => setLanguage(e.target.value)}
          >
            {MONACO_LANGUAGES.map((lang) => {
              return (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              )
            })}
          </select>
          <label className="space-x-1 flex items-center">
            <input
              type="checkbox"
              checked={inlineView}
              onChange={(e) => setInlineView(e.target.checked)}
            />
            <span>Inline View</span>
          </label>
        </header>
        <div ref={editorContainer} className="h-full"></div>
      </div>
    </Layout>
  )
}
