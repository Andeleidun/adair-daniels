var e=`export type RemoteErrorCategory =\r
  'network' | 'http' | 'proxy' | 'parse' | 'schema' | 'aborted';\r
\r
export type RemoteFeatureName = 'stock-twits-live-feed' | 'xkcd-slideshow';\r
\r
export interface AllOriginsOptions {\r
  readonly signal?: AbortSignal;\r
  readonly requestName: RemoteFeatureName;\r
}\r
\r
export class RemoteRequestError extends Error {\r
  readonly category: RemoteErrorCategory;\r
  readonly status?: number;\r
\r
  constructor(category: RemoteErrorCategory, message: string, status?: number) {\r
    super(message);\r
    this.name = 'RemoteRequestError';\r
    this.category = category;\r
    this.status = status;\r
    Object.setPrototypeOf(this, RemoteRequestError.prototype);\r
  }\r
}\r
\r
const isRecord = (value: unknown): value is Record<string, unknown> =>\r
  typeof value === 'object' && value !== null;\r
\r
export const isHttpsUrl = (value: unknown): value is string => {\r
  if (typeof value !== 'string') {\r
    return false;\r
  }\r
  try {\r
    const url = new URL(value);\r
    return (\r
      url.protocol === 'https:' && url.username === '' && url.password === ''\r
    );\r
  } catch {\r
    return false;\r
  }\r
};\r
\r
const isAbortError = (error: unknown, signal?: AbortSignal): boolean =>\r
  signal?.aborted === true || (isRecord(error) && error.name === 'AbortError');\r
\r
const abortedRequest = (): RemoteRequestError =>\r
  new RemoteRequestError('aborted', 'The request was cancelled.');\r
\r
const isHttpStatus = (value: unknown): value is number =>\r
  typeof value === 'number' &&\r
  Number.isInteger(value) &&\r
  value >= 100 &&\r
  value <= 599;\r
\r
const upstreamStatus = (\r
  envelope: Record<string, unknown>\r
): number | undefined => {\r
  const status = envelope.status;\r
  if (status !== undefined) {\r
    if (isRecord(status) && isHttpStatus(status.http_code)) {\r
      return status.http_code;\r
    }\r
    throw new RemoteRequestError(\r
      'proxy',\r
      'The remote-data proxy returned invalid status metadata.'\r
    );\r
  }\r
  if (envelope.statusCode !== undefined) {\r
    if (isHttpStatus(envelope.statusCode)) {\r
      return envelope.statusCode;\r
    }\r
    throw new RemoteRequestError(\r
      'proxy',\r
      'The remote-data proxy returned invalid status metadata.'\r
    );\r
  }\r
  return undefined;\r
};\r
\r
export const fetchAllOriginsJson = async (\r
  targetUrl: string,\r
  options: AllOriginsOptions\r
): Promise<unknown> => {\r
  if (!isHttpsUrl(targetUrl)) {\r
    throw new RemoteRequestError(\r
      'schema',\r
      'The remote service URL must use HTTPS.'\r
    );\r
  }\r
  if (options.signal?.aborted) {\r
    throw abortedRequest();\r
  }\r
\r
  try {\r
    const response = await fetch(\r
      \`https://api.allorigins.win/get?url=\${encodeURIComponent(targetUrl)}\`,\r
      {\r
        signal: options.signal,\r
        headers: { 'X-Requested-With': options.requestName },\r
      }\r
    );\r
    if (options.signal?.aborted) {\r
      throw abortedRequest();\r
    }\r
\r
    if (!response.ok) {\r
      throw new RemoteRequestError(\r
        'proxy',\r
        'The remote-data proxy could not complete the request.',\r
        response.status\r
      );\r
    }\r
\r
    let envelope: unknown;\r
    try {\r
      envelope = await response.json();\r
    } catch (error) {\r
      if (isAbortError(error, options.signal)) {\r
        throw abortedRequest();\r
      }\r
      throw new RemoteRequestError(\r
        'parse',\r
        'The remote-data proxy returned an unreadable response.'\r
      );\r
    }\r
    if (options.signal?.aborted) {\r
      throw abortedRequest();\r
    }\r
\r
    if (!isRecord(envelope)) {\r
      throw new RemoteRequestError(\r
        'proxy',\r
        'The remote-data proxy returned an invalid response.'\r
      );\r
    }\r
\r
    const status = upstreamStatus(envelope);\r
    if (status !== undefined && (status < 200 || status >= 300)) {\r
      throw new RemoteRequestError(\r
        'http',\r
        status === 404\r
          ? 'The requested remote resource was not found.'\r
          : 'The remote service could not complete the request.',\r
        status\r
      );\r
    }\r
\r
    if (typeof envelope.contents !== 'string') {\r
      throw new RemoteRequestError(\r
        'proxy',\r
        'The remote-data proxy response was incomplete.'\r
      );\r
    }\r
    if (options.signal?.aborted) {\r
      throw abortedRequest();\r
    }\r
\r
    try {\r
      return JSON.parse(envelope.contents);\r
    } catch {\r
      throw new RemoteRequestError(\r
        'parse',\r
        'The remote service returned unreadable data.'\r
      );\r
    }\r
  } catch (error) {\r
    if (error instanceof RemoteRequestError) {\r
      throw error;\r
    }\r
    if (isAbortError(error, options.signal)) {\r
      throw abortedRequest();\r
    }\r
    throw new RemoteRequestError(\r
      'network',\r
      'The remote service could not be reached.'\r
    );\r
  }\r
};\r
`;export{e as t};