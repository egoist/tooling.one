import React, { ChangeEvent } from "react"
import clsx from "clsx"
import { CopyButton } from "./Button"

export const Input: React.FC<{
  id?: string
  rows?: number
  label?: string
  className?: string
  value: string
  onChange: (value: string) => void
  canCopy?: boolean
  spellCheck?: boolean
  readonly?: boolean
}> = ({
  id,
  label,
  canCopy,
  value,
  onChange,
  rows = 1,
  className,
  spellCheck,
  readonly,
}) => {
  const Component = rows > 1 ? "textarea" : "input"
  return (
    <div>
      {label && (
        <div className="flex justify-between items-center text-sm mb-1">
          <label className="block" htmlFor={id}>
            {label}
          </label>
          {canCopy && <CopyButton getValue={() => value} />}
        </div>
      )}
      <Component
        spellCheck={spellCheck}
        rows={rows}
        readOnly={readonly}
        className={clsx(className, "input", "w-full")}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
          onChange(e.target.value)
        }
      ></Component>
    </div>
  )
}
