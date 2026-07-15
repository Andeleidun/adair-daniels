import"./rolldown-runtime-Bh1tDfsg.js";import{J as e,t,z as n}from"./Card-CeC5etUB.js";import{t as r}from"./SourceViewer-DeS1hOSu.js";e();var i=`/*\r
  This component uses lazy loading iframes to setup a portal\r
  for separately hosted micro-frontends. This is implemented \r
  with the PokeTable.\r
  PokeTable is a filterable and sortable React data table.\r
  PokeTable code can be found on github -\r
  https://github.com/Andeleidun/pokeTable\r
*/\r
import React from 'react';\r
import './Portal.css';\r
\r
interface Props {\r
  readonly url: string;\r
  readonly title: string;\r
}\r
\r
const Portal = ({ url, title }: Props): React.ReactElement => {\r
  return <iframe src={url} loading="lazy" className="portal" title={title} />;\r
};\r
\r
export default Portal;\r
`,a=n(),o=()=>(0,a.jsx)(`main`,{className:`app-code-viewer`,children:(0,a.jsx)(t,{content:(0,a.jsx)(r,{value:i}),classGiven:`card`})});export{o as default};