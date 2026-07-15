import"./rolldown-runtime-Bh1tDfsg.js";import{J as e,t,z as n}from"./Card-CeC5etUB.js";import{t as r}from"./SourceViewer-DeS1hOSu.js";e();var i=`/*\r
  This page demonstrates React's capacity for generating content from provided\r
  data. All public resume content remains owned by Home.json.\r
*/\r
import React, { ReactElement, useState } from 'react';\r
import './Home.css';\r
\r
import CardTemplate, { CardAction } from '../Library/Card';\r
import {\r
  headshot,\r
  ketomate,\r
  hp,\r
  nike,\r
  aws,\r
} from '../../Resources/images/index';\r
import HomeData from './Home.json';\r
\r
import List from '@mui/material/List';\r
import ListItem from '@mui/material/ListItem';\r
import ListItemIcon from '@mui/material/ListItemIcon';\r
import ListItemText from '@mui/material/ListItemText';\r
import Chip from '@mui/material/Chip';\r
import Button from '@mui/material/Button';\r
\r
interface ExternalLink {\r
  readonly url: string;\r
  readonly text: string;\r
}\r
\r
interface LinkSet {\r
  readonly url: string;\r
  readonly title: string;\r
  readonly img: string;\r
  readonly text: string;\r
}\r
\r
interface TechnicalSkillGroup {\r
  readonly title: string;\r
  readonly skills: ReadonlyArray<string>;\r
}\r
\r
type GroupItem =\r
  | { readonly classes: string }\r
  | { readonly title: string }\r
  | { readonly dates: string }\r
  | { readonly description: string }\r
  | { readonly jobTitle: string }\r
  | { readonly text: string }\r
  | { readonly skills: ReadonlyArray<string> };\r
\r
interface GroupSet {\r
  readonly group: ReadonlyArray<GroupItem>;\r
}\r
\r
type ContentItem =\r
  | { readonly text: string }\r
  | { readonly linkset: LinkSet }\r
  | { readonly skillGroup: TechnicalSkillGroup }\r
  | { readonly groupSet: ReadonlyArray<GroupSet> };\r
\r
interface CardContent {\r
  readonly title: string;\r
  readonly media: string;\r
  readonly content: ReadonlyArray<ContentItem>;\r
  readonly links?: ReadonlyArray<ExternalLink>;\r
  readonly classes: string;\r
}\r
\r
interface HomeDataSet {\r
  readonly career: CardContent;\r
  readonly highlights: CardContent;\r
  readonly skills: CardContent;\r
  readonly experience: CardContent;\r
  readonly education: CardContent;\r
}\r
\r
const homeData: HomeDataSet = HomeData.homeData;\r
const homeCardKeys: ReadonlyArray<keyof HomeDataSet> = [\r
  'career',\r
  'highlights',\r
  'skills',\r
  'experience',\r
  'education',\r
];\r
const contentImages = { ketomate, hp, nike, aws };\r
type ImageKey = keyof typeof contentImages;\r
\r
const isImageKey = (key: string): key is ImageKey => key in contentImages;\r
const imageForKey = (key: string): string | undefined =>\r
  isImageKey(key) ? contentImages[key] : undefined;\r
\r
const groupItemKey = (item: GroupItem): string => {\r
  if ('classes' in item) return \`classes-\${item.classes}\`;\r
  if ('title' in item) return \`title-\${item.title}\`;\r
  if ('dates' in item) return \`dates-\${item.dates}\`;\r
  if ('description' in item) return \`description-\${item.description}\`;\r
  if ('jobTitle' in item) return \`job-\${item.jobTitle}\`;\r
  if ('text' in item) return \`text-\${item.text}\`;\r
  return \`skills-\${item.skills.join('-')}\`;\r
};\r
\r
const groupKey = (group: GroupSet): string =>\r
  group.group.map(groupItemKey).join('|');\r
\r
const contentItemKey = (content: ContentItem): string => {\r
  if ('linkset' in content) return \`link-\${content.linkset.url}\`;\r
  if ('skillGroup' in content) return \`skills-\${content.skillGroup.title}\`;\r
  if ('groupSet' in content)\r
    return \`groups-\${content.groupSet.map(groupKey).join('|')}\`;\r
  return \`text-\${content.text}\`;\r
};\r
\r
const Home = (): ReactElement => {\r
  const [experienceIndex, setExperienceIndex] = useState(0);\r
  const [educationIndex, setEducationIndex] = useState(0);\r
\r
  const generateGroupSet = (groupSet: ReadonlyArray<GroupSet>) =>\r
    groupSet.map((group) => {\r
      let groupClass = '';\r
      const groupContent: ReactElement[] = [];\r
\r
      group.group.forEach((item) => {\r
        const itemKey = groupItemKey(item);\r
        if ('classes' in item) {\r
          groupClass = item.classes;\r
        }\r
        if ('title' in item) {\r
          groupContent.push(\r
            <div className="title" key={\`\${itemKey}-title\`}>\r
              <h3>{item.title}</h3>\r
            </div>\r
          );\r
        }\r
        if ('dates' in item) {\r
          groupContent.push(\r
            <ListItem\r
              component="div"\r
              key={\`\${itemKey}-dates\`}\r
              className="dates"\r
            >\r
              <ListItemText primary={item.dates} />\r
            </ListItem>\r
          );\r
        }\r
        if ('description' in item) {\r
          groupContent.push(\r
            <ListItem\r
              component="div"\r
              key={\`\${itemKey}-description\`}\r
              className="description"\r
            >\r
              <ListItemText primary={item.description} />\r
            </ListItem>\r
          );\r
        }\r
        if ('jobTitle' in item) {\r
          groupContent.push(\r
            <ListItem\r
              component="div"\r
              key={\`\${itemKey}-job\`}\r
              className="job-title"\r
            >\r
              <ListItemText primary={item.jobTitle} />\r
            </ListItem>\r
          );\r
        }\r
        if ('text' in item) {\r
          groupContent.push(\r
            <ListItem\r
              component="div"\r
              key={\`\${itemKey}-text\`}\r
              className="group-text"\r
            >\r
              <ListItemIcon>\r
                <span className="material-icons" aria-hidden="true">\r
                  layers\r
                </span>\r
              </ListItemIcon>\r
              <ListItemText primary={item.text} />\r
            </ListItem>\r
          );\r
        }\r
        if ('skills' in item) {\r
          groupContent.push(\r
            <div className="skills" key={\`\${itemKey}-skills\`}>\r
              {item.skills.map((skill) => (\r
                <Chip\r
                  size="small"\r
                  label={skill}\r
                  className="skill"\r
                  key={skill}\r
                />\r
              ))}\r
            </div>\r
          );\r
        }\r
      });\r
\r
      return (\r
        <div className={groupClass} key={groupKey(group)}>\r
          {groupContent}\r
        </div>\r
      );\r
    });\r
\r
  const formatContent = (contentSet: CardContent): ReactElement => {\r
    const formattedContent: ReactElement[] = [];\r
    const title = contentSet.title;\r
\r
    contentSet.content.forEach((content) => {\r
      const contentKey = \`\${title}-\${contentItemKey(content)}\`;\r
      if ('linkset' in content) {\r
        formattedContent.push(\r
          <ListItem\r
            component="div"\r
            key={\`\${contentKey}-link\`}\r
            className="linkset"\r
          >\r
            <a\r
              href={content.linkset.url}\r
              target="_blank"\r
              rel="noopener noreferrer"\r
            >\r
              <div>\r
                <img\r
                  src={imageForKey(content.linkset.img)}\r
                  alt={content.linkset.title}\r
                />\r
                <h3>{content.linkset.title}</h3>\r
              </div>\r
            </a>\r
            <p>{content.linkset.text}</p>\r
          </ListItem>\r
        );\r
      }\r
      if ('skillGroup' in content) {\r
        const headingId = \`technical-skill-\${content.skillGroup.title\r
          .toLowerCase()\r
          .replace(/[^a-z0-9]+/g, '-')}\`;\r
        formattedContent.push(\r
          <ListItem\r
            component="section"\r
            className="technical-skill-group"\r
            key={\`\${contentKey}-skill\`}\r
            aria-labelledby={headingId}\r
          >\r
            <h3 id={headingId}>{content.skillGroup.title}</h3>\r
            <ul\r
              className="technical-skill-list"\r
              aria-label={\`\${content.skillGroup.title} skills\`}\r
            >\r
              {content.skillGroup.skills.map((skill) => (\r
                <li key={skill}>\r
                  <Chip\r
                    size="small"\r
                    label={skill}\r
                    className="technical-skill"\r
                  />\r
                </li>\r
              ))}\r
            </ul>\r
          </ListItem>\r
        );\r
      }\r
      if ('groupSet' in content) {\r
        const generatedGroups = generateGroupSet(content.groupSet);\r
        const isExperience = title === 'Experience';\r
        const activeIndex = isExperience ? experienceIndex : educationIndex;\r
        const setIndex = isExperience ? setExperienceIndex : setEducationIndex;\r
        const lastIndex = generatedGroups.length - 1;\r
        const previous = () =>\r
          setIndex(activeIndex === 0 ? lastIndex : activeIndex - 1);\r
        const next = () =>\r
          setIndex(activeIndex === lastIndex ? 0 : activeIndex + 1);\r
\r
        formattedContent.push(\r
          <div className="group-set" key={\`\${contentKey}-groups\`}>\r
            <div className="group-set-content">\r
              {generatedGroups[activeIndex]}\r
            </div>\r
            <div className="group-set-nav">\r
              <div>\r
                <Button\r
                  variant="contained"\r
                  startIcon={\r
                    <span className="material-icons" aria-hidden="true">\r
                      navigate_before\r
                    </span>\r
                  }\r
                  onClick={previous}\r
                  aria-label={\`Previous \${title}\`}\r
                >\r
                  Previous\r
                </Button>\r
              </div>\r
              <div>\r
                <Button\r
                  variant="contained"\r
                  endIcon={\r
                    <span className="material-icons" aria-hidden="true">\r
                      navigate_next\r
                    </span>\r
                  }\r
                  onClick={next}\r
                  aria-label={\`Next \${title}\`}\r
                >\r
                  Next\r
                </Button>\r
              </div>\r
            </div>\r
          </div>\r
        );\r
      }\r
      if ('text' in content) {\r
        formattedContent.push(\r
          <ListItem component="div" key={\`\${contentKey}-text\`}>\r
            <ListItemText primary={content.text} />\r
          </ListItem>\r
        );\r
      }\r
    });\r
\r
    return <List component="div">{formattedContent}</List>;\r
  };\r
\r
  const cards = homeCardKeys.map((key) => {\r
    const content = homeData[key];\r
    const links: ReadonlyArray<CardAction> | undefined = content.links\r
      ? content.links.map((link) => ({ kind: 'external', ...link }))\r
      : undefined;\r
\r
    return (\r
      <CardTemplate\r
        title={content.title}\r
        img={content.media === 'headshot' ? headshot : null}\r
        content={formatContent(content)}\r
        classGiven={content.classes}\r
        links={links}\r
        key={key}\r
      />\r
    );\r
  });\r
\r
  return <main className="app-home">{cards}</main>;\r
};\r
\r
export default Home;\r
`,a=n(),o=()=>(0,a.jsx)(`main`,{className:`app-code-viewer`,children:(0,a.jsx)(t,{content:(0,a.jsx)(r,{value:i}),classGiven:`card`})});export{o as default};