import"./rolldown-runtime-Bh1tDfsg.js";import{J as e,t,z as n}from"./Card-CeC5etUB.js";import{t as r}from"./SourceViewer-DeS1hOSu.js";import{t as i}from"./remoteData-D3mAZNIF.js";e();var a=`/*\r
  This page demonstrates live API content with bounded parallel requests,\r
  cancellation, validation, and recoverable navigation failures.\r
*/\r
import React, { useEffect, useRef, useState } from 'react';\r
import './xkcd.css';\r
import { reactLogo } from '../../Resources/images/index';\r
import CardTemplate from '../Library/Card';\r
import { fetchComicBatch, fetchCurrentComic, XkcdSlot } from './xkcdApi';\r
import { RemoteRequestError } from '../../Services/remoteData';\r
\r
interface PanelProps {\r
  readonly slot: XkcdSlot;\r
}\r
\r
export const Panel = ({ slot }: PanelProps): React.ReactElement => {\r
  if (slot.kind === 'unavailable') {\r
    return (\r
      <div className="unavailable-comic" role="status">\r
        Comic #{slot.num} unavailable\r
      </div>\r
    );\r
  }\r
  return (\r
    <CardTemplate\r
      title={slot.title}\r
      content={\r
        <figure>\r
          <img src={slot.img} alt={slot.alt} />\r
        </figure>\r
      }\r
      classGiven="card panel-card"\r
    />\r
  );\r
};\r
\r
type LoadStatus = 'loading' | 'success' | 'error';\r
\r
const XKCD = (): React.ReactElement => {\r
  const [slots, setSlots] = useState<ReadonlyArray<XkcdSlot>>([]);\r
  const [index, setIndex] = useState(1);\r
  const [latest, setLatest] = useState(0);\r
  const [status, setStatus] = useState<LoadStatus>('loading');\r
  const [error, setError] = useState('');\r
  const [retryIndex, setRetryIndex] = useState(1);\r
  const controllerRef = useRef<AbortController | null>(null);\r
  const requestVersionRef = useRef(0);\r
  const initialRequestRef = useRef<() => void>(() => undefined);\r
  const finalIndex = Math.max(1, latest - 2);\r
\r
  const beginRequest = () => {\r
    controllerRef.current?.abort();\r
    requestVersionRef.current += 1;\r
    const nextController = new AbortController();\r
    controllerRef.current = nextController;\r
    return { version: requestVersionRef.current, controller: nextController };\r
  };\r
\r
  const isAborted = (requestError: unknown) =>\r
    requestError instanceof RemoteRequestError &&\r
    requestError.category === 'aborted';\r
\r
  const loadInitial = async () => {\r
    const request = beginRequest();\r
    setStatus('loading');\r
    setError('');\r
    setRetryIndex(1);\r
    try {\r
      const current = await fetchCurrentComic(request.controller.signal);\r
      const nextSlots = await fetchComicBatch(\r
        1,\r
        current.num,\r
        request.controller.signal\r
      );\r
      if (request.version !== requestVersionRef.current) {\r
        return;\r
      }\r
      setLatest(current.num);\r
      setIndex(1);\r
      setRetryIndex(1);\r
      setSlots(nextSlots);\r
      setStatus('success');\r
    } catch (requestError) {\r
      if (\r
        request.version === requestVersionRef.current &&\r
        !isAborted(requestError)\r
      ) {\r
        setStatus('error');\r
        setError('XKCD comics could not be loaded.');\r
      }\r
    }\r
  };\r
\r
  const loadBatch = async (target: number) => {\r
    const clamped = Math.max(1, Math.min(target, finalIndex));\r
    const request = beginRequest();\r
    setStatus('loading');\r
    setError('');\r
    setRetryIndex(clamped);\r
    try {\r
      const nextSlots = await fetchComicBatch(\r
        clamped,\r
        latest,\r
        request.controller.signal\r
      );\r
      if (request.version !== requestVersionRef.current) {\r
        return;\r
      }\r
      setSlots(nextSlots);\r
      setIndex(clamped);\r
      setStatus('success');\r
    } catch (requestError) {\r
      if (\r
        request.version === requestVersionRef.current &&\r
        !isAborted(requestError)\r
      ) {\r
        setStatus('error');\r
        setError('That XKCD batch could not be loaded.');\r
      }\r
    }\r
  };\r
\r
  useEffect(() => {\r
    initialRequestRef.current = () => {\r
      void loadInitial();\r
    };\r
  });\r
\r
  useEffect(() => {\r
    const loadingTimer = window.setTimeout(\r
      () => initialRequestRef.current(),\r
      0\r
    );\r
    return () => {\r
      window.clearTimeout(loadingTimer);\r
      requestVersionRef.current += 1;\r
      controllerRef.current?.abort();\r
    };\r
  }, []);\r
\r
  const loading = status === 'loading';\r
  const retry = () => {\r
    if (latest === 0) {\r
      void loadInitial();\r
    } else {\r
      void loadBatch(retryIndex);\r
    }\r
  };\r
\r
  return (\r
    <div className="xkcd" aria-busy={loading}>\r
      {slots.length === 0 && loading ? (\r
        <img src={reactLogo} className="loading-logo" alt="Loading comics" />\r
      ) : null}\r
      {slots.length > 0 ? (\r
        <main className="slideshow" aria-live="polite">\r
          {slots.map((slot) => (\r
            <Panel slot={slot} key={slot.num} />\r
          ))}\r
        </main>\r
      ) : null}\r
      {error ? (\r
        <section className="xkcd-error" role="alert">\r
          <p>{error}</p>\r
          <button onClick={retry}>Retry</button>\r
        </section>\r
      ) : null}\r
      <footer className="xkcd-footer">\r
        <nav aria-label="Comic navigation">\r
          <button\r
            onClick={() => void loadBatch(1)}\r
            disabled={loading || latest === 0 || index === 1}\r
          >\r
            First\r
          </button>\r
          <button\r
            onClick={() => void loadBatch(index - 3)}\r
            disabled={loading || latest === 0 || index === 1}\r
          >\r
            Previous\r
          </button>\r
          <button\r
            onClick={() => void loadBatch(index + 3)}\r
            disabled={loading || latest === 0 || index === finalIndex}\r
          >\r
            Next\r
          </button>\r
          <button\r
            onClick={() => void loadBatch(finalIndex)}\r
            disabled={loading || latest === 0 || index === finalIndex}\r
          >\r
            Last\r
          </button>\r
        </nav>\r
        <section className="credit">\r
          <p>\r
            Sincere thanks to{' '}\r
            <a href="https://xkcd.com">Randall Munroe over at XKCD</a> for\r
            making such an awesome webcomic.\r
          </p>\r
        </section>\r
      </footer>\r
    </div>\r
  );\r
};\r
\r
export default XKCD;\r
`,o=`import {\r
  fetchAllOriginsJson,\r
  isHttpsUrl,\r
  RemoteRequestError,\r
} from '../../Services/remoteData';\r
\r
export interface XkcdComic {\r
  readonly kind: 'comic';\r
  readonly num: number;\r
  readonly title: string;\r
  readonly img: string;\r
  readonly alt: string;\r
}\r
\r
export interface XkcdUnavailableSlot {\r
  readonly kind: 'unavailable';\r
  readonly num: number;\r
}\r
\r
export type XkcdSlot = XkcdComic | XkcdUnavailableSlot;\r
\r
const isRecord = (value: unknown): value is Record<string, unknown> =>\r
  typeof value === 'object' && value !== null;\r
\r
const parseComic = (value: unknown): XkcdComic => {\r
  if (\r
    !isRecord(value) ||\r
    typeof value.num !== 'number' ||\r
    !Number.isInteger(value.num) ||\r
    value.num < 1 ||\r
    typeof value.title !== 'string' ||\r
    !isHttpsUrl(value.img) ||\r
    typeof value.alt !== 'string'\r
  ) {\r
    throw new RemoteRequestError('schema', 'XKCD returned invalid comic data.');\r
  }\r
  return {\r
    kind: 'comic',\r
    num: value.num,\r
    title: value.title,\r
    img: value.img,\r
    alt: value.alt,\r
  };\r
};\r
\r
export const fetchCurrentComic = async (\r
  signal?: AbortSignal\r
): Promise<XkcdComic> =>\r
  parseComic(\r
    await fetchAllOriginsJson('https://xkcd.com/info.0.json', {\r
      signal,\r
      requestName: 'xkcd-slideshow',\r
    })\r
  );\r
\r
export const fetchComic = async (\r
  number: number,\r
  signal?: AbortSignal\r
): Promise<XkcdSlot> => {\r
  try {\r
    const comic = parseComic(\r
      await fetchAllOriginsJson(\`https://xkcd.com/\${number}/info.0.json\`, {\r
        signal,\r
        requestName: 'xkcd-slideshow',\r
      })\r
    );\r
    if (comic.num !== number) {\r
      throw new RemoteRequestError(\r
        'schema',\r
        'XKCD returned a comic for the wrong position.'\r
      );\r
    }\r
    return comic;\r
  } catch (error) {\r
    if (\r
      error instanceof RemoteRequestError &&\r
      error.category === 'http' &&\r
      error.status === 404\r
    ) {\r
      return { kind: 'unavailable', num: number };\r
    }\r
    throw error;\r
  }\r
};\r
\r
export const fetchComicBatch = (\r
  start: number,\r
  latest: number,\r
  signal?: AbortSignal\r
): Promise<ReadonlyArray<XkcdSlot>> => {\r
  const count = Math.min(3, latest - start + 1);\r
  const numbers = Array.from(\r
    { length: count },\r
    (_value, index) => start + index\r
  );\r
  return Promise.all(numbers.map((number) => fetchComic(number, signal)));\r
};\r
`,s=n(),c=[`// XKCD component`,a,``,`// XKCD adapter`,o,``,`// Shared remote transport`,i].join(`
`),l=()=>(0,s.jsx)(`main`,{className:`app-code-viewer`,children:(0,s.jsx)(t,{content:(0,s.jsx)(r,{value:c}),classGiven:`card`})});export{l as default};