import"./rolldown-runtime-Bh1tDfsg.js";import{J as e,t,z as n}from"./Card-CeC5etUB.js";import{t as r}from"./SourceViewer-DeS1hOSu.js";import{t as i}from"./remoteData-D3mAZNIF.js";e();var a=`/*\r
  This page demonstrates a bounded, refreshable StockTwits symbol feed. Remote\r
  responses are validated before they reach the presentation components.\r
*/\r
import React, { useEffect, useRef, useState } from 'react';\r
import './StockTwits.css';\r
\r
import CardTemplate from '../Library/Card';\r
import Button from '@mui/material/Button';\r
import TextField from '@mui/material/TextField';\r
import InputAdornment from '@mui/material/InputAdornment';\r
import Chip from '@mui/material/Chip';\r
import Badge from '@mui/material/Badge';\r
import CircularProgress from '@mui/material/CircularProgress';\r
import {\r
  fetchStockSymbols,\r
  normalizeSymbols,\r
  StockSymbolFeed,\r
} from './stockTwitsApi';\r
import { RemoteRequestError } from '../../Services/remoteData';\r
\r
type ViewStatus =\r
  'idle' | 'loading' | 'refreshing' | 'success' | 'empty' | 'error';\r
\r
const StockTwits = (): React.ReactElement => {\r
  const [input, setInput] = useState('');\r
  const [feeds, setFeeds] = useState<ReadonlyArray<StockSymbolFeed>>([]);\r
  const [filters, setFilters] = useState<ReadonlyArray<string>>([]);\r
  const [submittedSymbols, setSubmittedSymbols] = useState<\r
    ReadonlyArray<string>\r
  >([]);\r
  const [status, setStatus] = useState<ViewStatus>('idle');\r
  const [error, setError] = useState('');\r
  const [warning, setWarning] = useState('');\r
  const [polling, setPolling] = useState(false);\r
  const [countdown, setCountdown] = useState(5);\r
  const controllerRef = useRef<AbortController | null>(null);\r
  const requestVersionRef = useRef(0);\r
  const requestInProgressRef = useRef(false);\r
  const elapsedMinutesRef = useRef(0);\r
  const refreshRequestRef = useRef<() => void>(() => undefined);\r
\r
  const isEmpty = (nextFeeds: ReadonlyArray<StockSymbolFeed>) =>\r
    nextFeeds.every((feed) => feed.messages.length === 0);\r
\r
  const warningFor = (symbols: ReadonlyArray<string>) =>\r
    symbols.length > 0\r
      ? \`Some symbols could not be loaded: \${symbols.join(', ')}.\`\r
      : '';\r
\r
  const runManualSearch = async (symbols: ReadonlyArray<string>) => {\r
    controllerRef.current?.abort();\r
    requestVersionRef.current += 1;\r
    const version = requestVersionRef.current;\r
    const nextController = new AbortController();\r
    controllerRef.current = nextController;\r
    requestInProgressRef.current = true;\r
    elapsedMinutesRef.current = 0;\r
    setPolling(false);\r
    setCountdown(5);\r
    setFeeds([]);\r
    setFilters([]);\r
    setSubmittedSymbols(symbols);\r
    setWarning('');\r
    setError('');\r
    setStatus('loading');\r
\r
    try {\r
      const result = await fetchStockSymbols(symbols, nextController.signal);\r
      if (version !== requestVersionRef.current) {\r
        return;\r
      }\r
      if (result.feeds.length === 0) {\r
        setStatus('error');\r
        setError(\`StockTwits could not load: \${symbols.join(', ')}.\`);\r
        return;\r
      }\r
      setFeeds(result.feeds);\r
      setWarning(warningFor(result.failedSymbols));\r
      setStatus(isEmpty(result.feeds) ? 'empty' : 'success');\r
      setPolling(true);\r
    } catch (requestError) {\r
      if (\r
        version === requestVersionRef.current &&\r
        !(\r
          requestError instanceof RemoteRequestError &&\r
          requestError.category === 'aborted'\r
        )\r
      ) {\r
        setStatus('error');\r
        setError('StockTwits could not complete the search.');\r
      }\r
    } finally {\r
      if (version === requestVersionRef.current) {\r
        requestInProgressRef.current = false;\r
      }\r
    }\r
  };\r
\r
  const refresh = async () => {\r
    if (requestInProgressRef.current || submittedSymbols.length === 0) {\r
      return;\r
    }\r
    requestInProgressRef.current = true;\r
    const version = requestVersionRef.current;\r
    const nextController = new AbortController();\r
    controllerRef.current = nextController;\r
    setStatus('refreshing');\r
    setWarning('');\r
\r
    try {\r
      const result = await fetchStockSymbols(\r
        submittedSymbols,\r
        nextController.signal\r
      );\r
      if (version !== requestVersionRef.current) {\r
        return;\r
      }\r
      const refreshed = result.feeds.reduce(\r
        (map, feed) => map.set(feed.symbol, feed),\r
        new Map<string, StockSymbolFeed>()\r
      );\r
      const merged = feeds.map((feed) => refreshed.get(feed.symbol) || feed);\r
      result.feeds.forEach((feed) => {\r
        if (!merged.some((existing) => existing.symbol === feed.symbol)) {\r
          merged.push(feed);\r
        }\r
      });\r
      setFeeds(merged);\r
      setFilters((selected) =>\r
        selected.filter((symbol) =>\r
          merged.some((feed) => feed.symbol === symbol)\r
        )\r
      );\r
      setStatus(isEmpty(merged) ? 'empty' : 'success');\r
      setWarning(warningFor(result.failedSymbols));\r
      if (result.failedSymbols.length > 0) {\r
        setPolling(false);\r
      } else {\r
        elapsedMinutesRef.current = 0;\r
        setCountdown(5);\r
      }\r
    } catch (requestError) {\r
      if (\r
        version === requestVersionRef.current &&\r
        !(\r
          requestError instanceof RemoteRequestError &&\r
          requestError.category === 'aborted'\r
        )\r
      ) {\r
        setStatus(isEmpty(feeds) ? 'empty' : 'success');\r
        setWarning(\r
          'Automatic refresh stopped because StockTwits was unavailable.'\r
        );\r
        setPolling(false);\r
      }\r
    } finally {\r
      if (version === requestVersionRef.current) {\r
        requestInProgressRef.current = false;\r
      }\r
    }\r
  };\r
  useEffect(() => {\r
    refreshRequestRef.current = () => {\r
      void refresh();\r
    };\r
  });\r
\r
  useEffect(() => {\r
    if (!polling) {\r
      return undefined;\r
    }\r
    const interval = window.setInterval(() => {\r
      elapsedMinutesRef.current += 1;\r
      const remaining = Math.max(0, 5 - elapsedMinutesRef.current);\r
      setCountdown(remaining);\r
      if (elapsedMinutesRef.current >= 5) {\r
        refreshRequestRef.current();\r
      }\r
    }, 60000);\r
    return () => window.clearInterval(interval);\r
  }, [polling]);\r
\r
  useEffect(\r
    () => () => {\r
      requestVersionRef.current += 1;\r
      controllerRef.current?.abort();\r
    },\r
    []\r
  );\r
\r
  const submit = (event: React.FormEvent<HTMLFormElement>) => {\r
    event.preventDefault();\r
    const normalized = normalizeSymbols(input);\r
    if (!normalized.valid) {\r
      controllerRef.current?.abort();\r
      controllerRef.current = null;\r
      requestVersionRef.current += 1;\r
      requestInProgressRef.current = false;\r
      setPolling(false);\r
      setError(normalized.message);\r
      setWarning('');\r
      setStatus('error');\r
      return;\r
    }\r
    void runManualSearch(normalized.symbols);\r
  };\r
\r
  const toggleFilter = (symbol: string) =>\r
    setFilters((selected) =>\r
      selected.includes(symbol)\r
        ? selected.filter((item) => item !== symbol)\r
        : [...selected, symbol]\r
    );\r
\r
  const visibleFeeds =\r
    filters.length === 0\r
      ? feeds\r
      : feeds.filter((feed) => filters.includes(feed.symbol));\r
  const noVisibleMessages =\r
    feeds.length > 0 &&\r
    visibleFeeds.every((feed) => feed.messages.length === 0);\r
  const refreshLabel =\r
    status === 'refreshing'\r
      ? 'Refreshing StockTwits results. Next refresh in 0 minutes.'\r
      : \`Next refresh in \${countdown} minute\${countdown === 1 ? '' : 's'}.\`;\r
\r
  return (\r
    <main className="app-stocktwits">\r
      <section className="search" aria-label="Stock symbol search">\r
        <form onSubmit={submit}>\r
          <TextField\r
            className="stock-input"\r
            id="stock-symbols"\r
            label="Input stock symbols (separate with a comma)"\r
            value={input}\r
            onChange={(event) => setInput(event.target.value)}\r
            error={status === 'error' && error !== ''}\r
            helperText={status === 'error' ? error : undefined}\r
            slotProps={{\r
              formHelperText: { role: 'alert' },\r
              input: {\r
                startAdornment: (\r
                  <InputAdornment position="start">$</InputAdornment>\r
                ),\r
              },\r
            }}\r
          />\r
          <br />\r
          <Button className="search-button" variant="contained" type="submit">\r
            Search\r
          </Button>\r
        </form>\r
      </section>\r
\r
      {status === 'loading' ? (\r
        <CircularProgress aria-label="Loading StockTwits results" />\r
      ) : null}\r
      {warning ? <p role="status">{warning}</p> : null}\r
      {polling ? (\r
        <p className="refresh-status" aria-live="polite">\r
          {refreshLabel}\r
        </p>\r
      ) : null}\r
\r
      {feeds.length > 0 ? (\r
        <section className="content">\r
          <section className="chips" aria-label="Filter by symbol">\r
            {feeds.map((feed) => {\r
              const selected = filters.includes(feed.symbol);\r
              return (\r
                <Badge\r
                  badgeContent={feed.messages.length}\r
                  className="badge"\r
                  key={feed.symbol}\r
                  overlap="rectangular"\r
                >\r
                  <Chip\r
                    label={feed.symbol}\r
                    className={selected ? 'chip active-chip' : 'chip'}\r
                    onClick={() => toggleFilter(feed.symbol)}\r
                    aria-pressed={selected}\r
                  />\r
                </Badge>\r
              );\r
            })}\r
          </section>\r
          {noVisibleMessages ? (\r
            <p role="status">\r
              {filters.length > 0\r
                ? 'No messages were found for the selected symbols.'\r
                : 'No messages were found for these symbols.'}\r
            </p>\r
          ) : null}\r
          <section className="tweets" aria-label="StockTwits messages">\r
            {visibleFeeds.reduce<React.ReactElement[]>((messages, feed) => {\r
              feed.messages.forEach((message) => {\r
                messages.push(\r
                  <CardTemplate\r
                    key={\`\${feed.symbol}-\${message.id}\`}\r
                    classGiven="card"\r
                    content={\r
                      <article>\r
                        <figure className="picture">\r
                          <img\r
                            src={message.user.avatarUrl}\r
                            alt={\`\${message.user.name}'s avatar\`}\r
                          />\r
                        </figure>\r
                        <p className="namearea">\r
                          <span className="name">{message.user.name}</span>{' '}\r
                          <span className="username">\r
                            @{message.user.username}\r
                          </span>\r
                        </p>\r
                        <p className="text">{message.body}</p>\r
                      </article>\r
                    }\r
                  />\r
                );\r
              });\r
              return messages;\r
            }, [])}\r
          </section>\r
        </section>\r
      ) : null}\r
    </main>\r
  );\r
};\r
\r
export default StockTwits;\r
`,o=`import {\r
  fetchAllOriginsJson,\r
  isHttpsUrl,\r
  RemoteRequestError,\r
} from '../../Services/remoteData';\r
\r
export interface StockTwitsUser {\r
  readonly name: string;\r
  readonly username: string;\r
  readonly avatarUrl: string;\r
}\r
\r
export interface StockTwitsMessage {\r
  readonly id: number;\r
  readonly body: string;\r
  readonly user: StockTwitsUser;\r
}\r
\r
export interface StockSymbolFeed {\r
  readonly symbol: string;\r
  readonly messages: ReadonlyArray<StockTwitsMessage>;\r
}\r
\r
export interface StockSearchResult {\r
  readonly feeds: ReadonlyArray<StockSymbolFeed>;\r
  readonly failedSymbols: ReadonlyArray<string>;\r
}\r
\r
export type SymbolInputResult =\r
  | { readonly valid: true; readonly symbols: ReadonlyArray<string> }\r
  | { readonly valid: false; readonly message: string };\r
\r
const isRecord = (value: unknown): value is Record<string, unknown> =>\r
  typeof value === 'object' && value !== null;\r
\r
export const normalizeSymbols = (input: string): SymbolInputResult => {\r
  const symbols = input\r
    .split(',')\r
    .map((symbol) => symbol.trim().toUpperCase())\r
    .filter(\r
      (symbol, index, all) => symbol !== '' && all.indexOf(symbol) === index\r
    );\r
\r
  if (symbols.length === 0) {\r
    return { valid: false, message: 'Enter at least one stock symbol.' };\r
  }\r
  if (symbols.length > 10) {\r
    return { valid: false, message: 'Enter no more than 10 stock symbols.' };\r
  }\r
  if (\r
    symbols.some(\r
      (symbol) => !/^[A-Z0-9.-]+$/.test(symbol) || !/[A-Z0-9]/.test(symbol)\r
    )\r
  ) {\r
    return {\r
      valid: false,\r
      message:\r
        'Symbols must include a letter or number and may also contain periods and hyphens.',\r
    };\r
  }\r
  return { valid: true, symbols };\r
};\r
\r
const parseMessage = (value: unknown): StockTwitsMessage => {\r
  if (\r
    !isRecord(value) ||\r
    typeof value.id !== 'number' ||\r
    !Number.isInteger(value.id) ||\r
    value.id < 1\r
  ) {\r
    throw new RemoteRequestError('schema', 'StockTwits returned invalid data.');\r
  }\r
  if (typeof value.body !== 'string' || !isRecord(value.user)) {\r
    throw new RemoteRequestError('schema', 'StockTwits returned invalid data.');\r
  }\r
  const user = value.user;\r
  if (\r
    typeof user.name !== 'string' ||\r
    typeof user.username !== 'string' ||\r
    !isHttpsUrl(user.avatar_url_ssl)\r
  ) {\r
    throw new RemoteRequestError('schema', 'StockTwits returned invalid data.');\r
  }\r
  return {\r
    id: value.id,\r
    body: value.body,\r
    user: {\r
      name: user.name,\r
      username: user.username,\r
      avatarUrl: user.avatar_url_ssl,\r
    },\r
  };\r
};\r
\r
export const fetchStockSymbol = async (\r
  symbol: string,\r
  signal?: AbortSignal\r
): Promise<StockSymbolFeed> => {\r
  const value = await fetchAllOriginsJson(\r
    \`https://api.stocktwits.com/api/2/streams/symbol/\${encodeURIComponent(\r
      symbol\r
    )}.json\`,\r
    { signal, requestName: 'stock-twits-live-feed' }\r
  );\r
  if (!isRecord(value)) {\r
    throw new RemoteRequestError('schema', 'StockTwits returned invalid data.');\r
  }\r
  if (value.error !== undefined || value.errors !== undefined) {\r
    throw new RemoteRequestError(\r
      'http',\r
      'StockTwits could not complete the symbol request.'\r
    );\r
  }\r
  if (\r
    !isRecord(value.response) ||\r
    typeof value.response.status !== 'number' ||\r
    !Number.isInteger(value.response.status)\r
  ) {\r
    throw new RemoteRequestError('schema', 'StockTwits returned invalid data.');\r
  }\r
  if (value.response.status < 200 || value.response.status >= 300) {\r
    throw new RemoteRequestError(\r
      'http',\r
      'StockTwits could not complete the symbol request.',\r
      value.response.status\r
    );\r
  }\r
  if (!Array.isArray(value.messages)) {\r
    throw new RemoteRequestError('schema', 'StockTwits returned invalid data.');\r
  }\r
  const messages = value.messages.map(parseMessage);\r
  if (new Set(messages.map((message) => message.id)).size !== messages.length) {\r
    throw new RemoteRequestError('schema', 'StockTwits returned invalid data.');\r
  }\r
  return { symbol, messages };\r
};\r
\r
export const fetchStockSymbols = async (\r
  symbols: ReadonlyArray<string>,\r
  signal?: AbortSignal\r
): Promise<StockSearchResult> => {\r
  const feeds: StockSymbolFeed[] = [];\r
  const failedSymbols: string[] = [];\r
  for (const symbol of symbols) {\r
    try {\r
      feeds.push(await fetchStockSymbol(symbol, signal));\r
    } catch (error) {\r
      if (error instanceof RemoteRequestError && error.category === 'aborted') {\r
        throw error;\r
      }\r
      failedSymbols.push(symbol);\r
    }\r
  }\r
  return { feeds, failedSymbols };\r
};\r
`,s=n(),c=[`// StockTwits component`,a,``,`// StockTwits adapter`,o,``,`// Shared remote transport`,i].join(`
`),l=()=>(0,s.jsx)(`main`,{className:`app-code-viewer`,children:(0,s.jsx)(t,{content:(0,s.jsx)(r,{value:c}),classGiven:`card`})});export{l as default};