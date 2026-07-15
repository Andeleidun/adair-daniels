import"./rolldown-runtime-Bh1tDfsg.js";import{J as e,t,z as n}from"./Card-CeC5etUB.js";import{t as r}from"./SourceViewer-DeS1hOSu.js";e();var i=`import React, { useState } from 'react';\r
import './Library.css';\r
\r
import '../Library/CodeView.css';\r
import CardTemplate, { CardAction } from './Card';\r
import SourceViewer from './SourceViewer';\r
\r
import AppCode from './App.codeview';\r
import CardCode from './Card/Card.codeview';\r
import HeaderCode from './Header/Header.codeview';\r
import NavBarCode from './NavBar/NavBar.codeview';\r
\r
interface LibraryComponent {\r
  readonly title: string;\r
  readonly code: string;\r
}\r
\r
const components: ReadonlyArray<LibraryComponent> = [\r
  { title: 'App', code: AppCode },\r
  { title: 'Card', code: CardCode },\r
  { title: 'Header', code: HeaderCode },\r
  { title: 'Nav Bar', code: NavBarCode },\r
];\r
\r
const Library = (): React.ReactElement => {\r
  const [codeState, setCodeState] = useState(components[0].code);\r
\r
  const navigate = (index: number) => {\r
    setCodeState(components[index].code);\r
  };\r
\r
  const links: ReadonlyArray<CardAction> = components.map(\r
    (component, index) => ({\r
      kind: 'button',\r
      onClick: () => navigate(index),\r
      text: component.title,\r
    })\r
  );\r
\r
  const viewer = <SourceViewer value={codeState} />;\r
\r
  return (\r
    <main className="library-page">\r
      <CardTemplate\r
        title="Library Navigation"\r
        links={links}\r
        classGiven="card library-card"\r
      />\r
      <CardTemplate content={viewer} classGiven="card" />\r
    </main>\r
  );\r
};\r
\r
export default Library;\r
`,a=n(),o=()=>(0,a.jsx)(`main`,{className:`app-code-viewer`,children:(0,a.jsx)(t,{content:(0,a.jsx)(r,{value:i}),classGiven:`card`})});export{o as default};