import mitt from "mitt"
import { useCallback, useMemo } from "react"

const randomId = () => Math.random().toString(36).substring(2, 15)

export const useWorker = <TArgs, TResult>(
  createWorker: () => Worker
): { run: (args: TArgs) => Promise<TResult> } => {
  const emitter = useMemo(() => mitt(), [])

  const [resolveWait, waitPromise] = useMemo(() => {
    let resolve: ((value: boolean) => unknown) | undefined
    const p = new Promise<boolean>((_resolve) => {
      resolve = _resolve
    })
    return [resolve, p]
  }, [])

  const worker = useMemo(() => {
    if (typeof Worker === "undefined") {
      return null
    }
    const worker = createWorker()
    worker.onmessage = (e) => {
      const { id, result } = e.data
      if (id === "init") {
        return resolveWait(true)
      }
      emitter.emit(id, result)
    }
    return worker
  }, [])

  const run = useCallback(
    async (args: TArgs): Promise<TResult> => {
      const id = randomId()
      await waitPromise

      const result = new Promise<TResult>((resolve) => {
        emitter.on(id, (data: any) => {
          emitter.off(id)
          resolve(data)
        })
        worker.postMessage({ id, args })
      })

      return result
    },
    [worker]
  )

  return { run }
}

type Listener = (args: any) => any

export const initializeWorkerListener = (listener: Listener) => {
  postMessage({ id: "init" })

  onmessage = async (e: any) => {
    const { id, args } = e.data

    const result = await listener(args)
    postMessage({ id, result })
  }
}
