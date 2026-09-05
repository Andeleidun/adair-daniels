import{n as e}from"./rolldown-runtime-Bh1tDfsg.js";import{F as t,N as n,O as r,P as i,S as a,X as o,h as s,i as c,l,m as u,p as d,r as f,t as p,v as ee,y as m,z as h}from"./ButtonBase-C6bbDwrF.js";import{i as g,n as _,r as v,s as y,t as b}from"./ownerWindow-CPrdHYJ0.js";import{c as te,l as x,t as S}from"./useSlot-CH0i_q6t.js";import{a as C,i as w,o as T,r as ne,s as E,t as D}from"./useSlotProps-Bk2dypGG.js";import{t as re}from"./SourceViewer-ctJJIHNP.js";var O=e(o(),1);function k(e){return i(`MuiTab`,e)}var A=n(`MuiTab`,[`root`,`labelIcon`,`textColorInherit`,`textColorPrimary`,`textColorSecondary`,`selected`,`disabled`,`fullWidth`,`wrapped`,`icon`]),j=h(),ie=e=>{let{classes:t,textColor:n,fullWidth:i,wrapped:a,icon:o,label:s,selected:c,disabled:l}=e;return r({root:[`root`,o&&s&&`labelIcon`,`textColor${u(n)}`,i&&`fullWidth`,a&&`wrapped`,c&&`selected`,l&&`disabled`],icon:[`icon`]},k,t)},M=m(p,{name:`MuiTab`,slot:`Root`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.root,n.label&&n.icon&&t.labelIcon,t[`textColor${u(n.textColor)}`],n.fullWidth&&t.fullWidth,n.wrapped&&t.wrapped,{[`& .${A.icon}`]:t.icon}]}})(s(({theme:e})=>({...e.typography.button,maxWidth:360,minWidth:90,position:`relative`,minHeight:48,flexShrink:0,padding:`12px 16px`,overflow:`hidden`,whiteSpace:`normal`,textAlign:`center`,lineHeight:1.25,variants:[{props:({ownerState:e})=>e.label&&(e.iconPosition===`top`||e.iconPosition===`bottom`),style:{flexDirection:`column`}},{props:({ownerState:e})=>e.label&&e.iconPosition!==`top`&&e.iconPosition!==`bottom`,style:{flexDirection:`row`}},{props:({ownerState:e})=>e.icon&&e.label,style:{minHeight:72,paddingTop:9,paddingBottom:9}},{props:({ownerState:e,iconPosition:t})=>e.icon&&e.label&&t===`top`,style:{[`& > .${A.icon}`]:{marginBottom:6}}},{props:({ownerState:e,iconPosition:t})=>e.icon&&e.label&&t===`bottom`,style:{[`& > .${A.icon}`]:{marginTop:6}}},{props:({ownerState:e,iconPosition:t})=>e.icon&&e.label&&t===`start`,style:{[`& > .${A.icon}`]:{marginRight:e.spacing(1)}}},{props:({ownerState:e,iconPosition:t})=>e.icon&&e.label&&t===`end`,style:{[`& > .${A.icon}`]:{marginLeft:e.spacing(1)}}},{props:{textColor:`inherit`},style:{color:`inherit`,opacity:.6,[`&.${A.selected}`]:{opacity:1},[`&.${A.disabled}`]:{opacity:(e.vars||e).palette.action.disabledOpacity}}},{props:{textColor:`primary`},style:{color:(e.vars||e).palette.text.secondary,[`&.${A.selected}`]:{color:(e.vars||e).palette.primary.main},[`&.${A.disabled}`]:{color:(e.vars||e).palette.text.disabled}}},{props:{textColor:`secondary`},style:{color:(e.vars||e).palette.text.secondary,[`&.${A.selected}`]:{color:(e.vars||e).palette.secondary.main},[`&.${A.disabled}`]:{color:(e.vars||e).palette.text.disabled}}},{props:({ownerState:e})=>e.fullWidth,style:{flexShrink:1,flexGrow:1,flexBasis:0,maxWidth:`none`}},{props:({ownerState:e})=>e.wrapped,style:{fontSize:e.typography.pxToRem(12)}}]}))),N=O.forwardRef(function(e,n){let r=ee({props:e,name:`MuiTab`}),{className:i,disabled:a=!1,disableFocusRipple:o=!1,fullWidth:s,icon:c,iconPosition:l=`top`,indicator:u,label:d,onChange:f,onClick:p,onFocus:m,selected:h,selectionFollowsFocus:g,textColor:_=`inherit`,value:v,wrapped:y=!1,...b}=r,te=T(),x=ne({id:v,ref:n,disabled:a,selected:h}),S=te.getItemMap().size===0&&h?0:x.tabIndex,C={...r,disabled:a,disableFocusRipple:o,selected:h,icon:!!c,iconPosition:l,label:!!d,fullWidth:s,textColor:_,wrapped:y},w=ie(C),E=c&&d&&O.isValidElement(c)?O.cloneElement(c,{className:t(w.icon,c.props.className)}):c;return(0,j.jsxs)(M,{internalNativeButton:!0,focusRipple:!o,className:t(w.root,i),ref:x.ref,role:`tab`,"aria-selected":h,disabled:a,onClick:e=>{!h&&f&&f(e,v),p&&p(e)},onFocus:e=>{g&&!h&&f&&f(e,v),m&&m(e)},tabIndex:S,ownerState:C,...b,children:[l===`top`||l===`start`?(0,j.jsxs)(O.Fragment,{children:[E,d]}):(0,j.jsxs)(O.Fragment,{children:[d,E]}),u]})});function P(e){return(1+Math.sin(Math.PI*e-Math.PI/2))/2}function ae(e,t,n,r={},i=()=>{}){let{ease:a=P,duration:o=300}=r,s=null,c=t[e],l=!1,u=()=>{l=!0},d=r=>{if(l){i(Error(`Animation cancelled`));return}s===null&&(s=r);let u=Math.min(1,(r-s)/o);if(t[e]=a(u)*(n-c)+c,u>=1){requestAnimationFrame(()=>{i(null)});return}requestAnimationFrame(d)};return c===n?(i(Error(`Element already at target position`)),u):(requestAnimationFrame(d),u)}var F={width:99,height:99,position:`absolute`,top:-9999,overflow:`scroll`,pointerEvents:`none`};function I(e){let{onChange:t,...n}=e,r=O.useRef(),i=O.useRef(null),a=()=>{r.current=i.current.offsetHeight-i.current.clientHeight};return g(()=>{let e=v(()=>{let e=r.current;a(),e!==r.current&&t(r.current)}),n=b(i.current);return n.addEventListener(`resize`,e),()=>{e.clear(),n.removeEventListener(`resize`,e)}},[t]),O.useEffect(()=>{a(),t(r.current)},[t]),(0,j.jsx)(`div`,{style:F,...n,ref:i})}var L=_((0,j.jsx)(`path`,{d:`M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z`}),`KeyboardArrowLeft`),oe=_((0,j.jsx)(`path`,{d:`M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z`}),`KeyboardArrowRight`);function R(e){return i(`MuiTabScrollButton`,e)}var z=n(`MuiTabScrollButton`,[`root`,`vertical`,`horizontal`,`disabled`]),B=e=>{let{classes:t,orientation:n,disabled:i}=e;return r({root:[`root`,n,i&&`disabled`]},R,t)},V=m(p,{name:`MuiTabScrollButton`,slot:`Root`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.root,n.orientation&&t[n.orientation]]}})({width:40,flexShrink:0,opacity:.8,[`&.${z.disabled}`]:{opacity:0},variants:[{props:{orientation:`vertical`},style:{width:`100%`,height:40,"& svg":{transform:`var(--TabScrollButton-svgRotate)`}}}]}),se=O.forwardRef(function(e,n){let r=ee({props:e,name:`MuiTabScrollButton`}),{className:i,slots:a={},slotProps:o={},direction:s,orientation:c,disabled:l,...u}=r,{nativeButton:d,...f}=u,p=y(),m={isRtl:p,...r},h=B(m),g=a.StartScrollButtonIcon??L,_=a.EndScrollButtonIcon??oe,v=D({elementType:g,externalSlotProps:o.startScrollButtonIcon,additionalProps:{fontSize:`small`},ownerState:m}),b=D({elementType:_,externalSlotProps:o.endScrollButtonIcon,additionalProps:{fontSize:`small`},ownerState:m});return(0,j.jsx)(V,{component:`div`,className:t(h.root,i),ref:n,role:null,ownerState:m,tabIndex:null,...f,style:{...f.style,...c===`vertical`&&{"--TabScrollButton-svgRotate":`rotate(${p?-90:90}deg)`}},children:s===`left`?(0,j.jsx)(g,{...v}):(0,j.jsx)(_,{...b})})});function H(e){return i(`MuiTabs`,e)}var U=n(`MuiTabs`,[`root`,`vertical`,`list`,`centered`,`scroller`,`fixed`,`scrollableX`,`scrollableY`,`hideScrollbar`,`scrollButtons`,`scrollButtonsHideMobile`,`indicator`]),ce=e=>{let{vertical:t,fixed:n,hideScrollbar:i,scrollableX:a,scrollableY:o,centered:s,scrollButtonsHideMobile:c,classes:l}=e;return r({root:[`root`,t&&`vertical`],scroller:[`scroller`,n&&`fixed`,i&&`hideScrollbar`,a&&`scrollableX`,o&&`scrollableY`],list:[`list`,t&&`vertical`,s&&`centered`],indicator:[`indicator`],scrollButtons:[`scrollButtons`,c&&`scrollButtonsHideMobile`],scrollableX:[a&&`scrollableX`],hideScrollbar:[i&&`hideScrollbar`]},H,l)},le=m(`div`,{name:`MuiTabs`,slot:`Root`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[{[`& .${U.scrollButtons}`]:t.scrollButtons},{[`& .${U.scrollButtons}`]:n.scrollButtonsHideMobile&&t.scrollButtonsHideMobile},t.root,n.vertical&&t.vertical]}})(s(({theme:e})=>({overflow:`hidden`,minHeight:48,WebkitOverflowScrolling:`touch`,display:`flex`,variants:[{props:({ownerState:e})=>e.vertical,style:{flexDirection:`column`}},{props:({ownerState:e})=>e.scrollButtonsHideMobile,style:{[`& .${U.scrollButtons}`]:{[e.breakpoints.down(`sm`)]:{display:`none`}}}}]}))),ue=m(`div`,{name:`MuiTabs`,slot:`Scroller`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.scroller,n.fixed&&t.fixed,n.hideScrollbar&&t.hideScrollbar,n.scrollableX&&t.scrollableX,n.scrollableY&&t.scrollableY]}})({position:`relative`,display:`inline-block`,flex:`1 1 auto`,whiteSpace:`nowrap`,variants:[{props:({ownerState:e})=>e.fixed,style:{overflowX:`hidden`,width:`100%`}},{props:({ownerState:e})=>e.hideScrollbar,style:{scrollbarWidth:`none`,"&::-webkit-scrollbar":{display:`none`}}},{props:({ownerState:e})=>e.scrollableX,style:{overflowX:`auto`,overflowY:`hidden`}},{props:({ownerState:e})=>e.scrollableY,style:{overflowY:`auto`,overflowX:`hidden`}}]}),de=m(`div`,{name:`MuiTabs`,slot:`List`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.list,n.centered&&t.centered]}})({display:`flex`,variants:[{props:({ownerState:e})=>e.vertical,style:{flexDirection:`column`}},{props:({ownerState:e})=>e.centered,style:{justifyContent:`center`}}]}),fe=m(`span`,{name:`MuiTabs`,slot:`Indicator`})(s(({theme:e})=>({position:`absolute`,height:2,bottom:0,width:`100%`,...l(e),variants:[{props:{indicatorColor:`primary`},style:{backgroundColor:(e.vars||e).palette.primary.main}},{props:{indicatorColor:`secondary`},style:{backgroundColor:(e.vars||e).palette.secondary.main}},{props:({ownerState:e})=>e.vertical,style:{height:`100%`,width:2,right:0}}]}))),pe=m(I)({overflowX:`auto`,overflowY:`hidden`,scrollbarWidth:`none`,"&::-webkit-scrollbar":{display:`none`}}),me={},W=O.forwardRef(function(e,n){let r=ee({props:e,name:`MuiTabs`}),i=a(),o=y(),s=c(i.motion.reducedMotion,!1),{"aria-label":l,"aria-labelledby":u,action:p,centered:m=!1,children:h,className:g,component:_=`div`,allowScrollButtonsMobile:T=!1,indicatorColor:ne=`primary`,onChange:re,orientation:k=`horizontal`,scrollButtons:A=`auto`,selectionFollowsFocus:ie,slots:M={},slotProps:N={},textColor:P=`primary`,value:F,variant:I=`standard`,visibleScrollbar:L=!1,...oe}=r,R=I===`scrollable`,z=k===`vertical`,B=z?`scrollTop`:`scrollLeft`,V=z?`top`:`left`,H=z?`bottom`:`right`,U=z?`clientHeight`:`clientWidth`,W=z?`height`:`width`,G={...r,component:_,allowScrollButtonsMobile:T,indicatorColor:ne,orientation:k,vertical:z,scrollButtons:A,textColor:P,variant:I,visibleScrollbar:L,fixed:!R,hideScrollbar:R&&!L,scrollableX:R&&!z,scrollableY:R&&z,centered:m&&!R,scrollButtonsHideMobile:!T},K=ce(G),he=D({elementType:M.startScrollButtonIcon,externalSlotProps:N.startScrollButtonIcon,ownerState:G}),ge=D({elementType:M.endScrollButtonIcon,externalSlotProps:N.endScrollButtonIcon,ownerState:G}),[_e,ve]=O.useState(!1),[q,ye]=O.useState(me),[be,xe]=O.useState(!1),[Se,Ce]=O.useState(!1),[we,Te]=O.useState(!1),Ee=F===!1?null:F,[De,Oe]=O.useState(!1),[ke,Ae]=O.useState({overflow:`hidden`,scrollbarWidth:0}),je=new Map,J=O.useRef(null),Y=O.useRef(null),X={slots:M,slotProps:N},Me=()=>{let e=J.current,t;if(e){let n=e.getBoundingClientRect();t={clientWidth:e.clientWidth,scrollLeft:e.scrollLeft,scrollTop:e.scrollTop,scrollWidth:e.scrollWidth,top:n.top,bottom:n.bottom,left:n.left,right:n.right}}let n;if(e&&F!==!1){let e=Y.current.children;if(e.length>0){let t=e[je.get(F)];n=t?t.getBoundingClientRect():null}}return{tabsMeta:t,tabMeta:n}},Z=f(()=>{let{tabsMeta:e,tabMeta:t}=Me(),n=0,r;z?(r=`top`,t&&e&&(n=t.top-e.top+e.scrollTop)):(r=o?`right`:`left`,t&&e&&(n=(o?-1:1)*(t[r]-e[r]+e.scrollLeft)));let i={[r]:n,[W]:t?t[W]:0};if(typeof q[r]!=`number`||typeof q[W]!=`number`)ye(i);else{let e=Math.abs(q[r]-i[r]),t=Math.abs(q[W]-i[W]);(e>=1||t>=1)&&ye(i)}}),Ne=(e,{animation:t=!0}={})=>{t&&!s.shouldReduceMotion?ae(B,J.current,e,{duration:i.transitions.duration.standard}):J.current[B]=e},Pe=e=>{let t=J.current[B];z?t+=e:t+=e*(o?-1:1),Ne(t)},Fe=()=>{let e=J.current[U],t=0,n=Array.from(Y.current.children);for(let r=0;r<n.length;r+=1){let i=n[r];if(t+i[U]>e){r===0&&(t=e);break}t+=i[U]}return t},Ie=()=>{Pe(-1*Fe())},Le=()=>{Pe(Fe())},[Re,{onChange:ze,...Be}]=S(`scrollbar`,{className:t(K.scrollableX,K.hideScrollbar),elementType:pe,shouldForwardComponentProp:!0,externalForwardedProps:X,ownerState:G}),Ve=O.useCallback(e=>{ze?.(e),Ae({overflow:null,scrollbarWidth:e})},[ze]),[He,Ue]=S(`scrollButtons`,{className:K.scrollButtons,elementType:se,externalForwardedProps:X,ownerState:G,additionalProps:{orientation:k,slots:{StartScrollButtonIcon:M.startScrollButtonIcon,EndScrollButtonIcon:M.endScrollButtonIcon},slotProps:{startScrollButtonIcon:he,endScrollButtonIcon:ge}}}),We=()=>{let e={};e.scrollbarSizeListener=R?(0,j.jsx)(Re,{...Be,onChange:Ve}):null;let t=R&&(A===`auto`&&(be||Se)||A===!0);return e.scrollButtonStart=t?(0,j.jsx)(He,{direction:o?`right`:`left`,onClick:Ie,disabled:!be,...Ue}):null,e.scrollButtonEnd=t?(0,j.jsx)(He,{direction:o?`left`:`right`,onClick:Le,disabled:!Se,...Ue}):null,e},Ge=f(e=>{let{tabsMeta:t,tabMeta:n}=Me();if(!(!n||!t)){if(n[V]<t[V]){let r=t[B]+(n[V]-t[V]);Ne(r,{animation:e})}else if(n[H]>t[H]){let r=t[B]+(n[H]-t[H]);Ne(r,{animation:e})}}}),Q=f(()=>{R&&A!==!1&&Te(!we)});O.useEffect(()=>{let e=v(()=>{J.current&&Z()}),t,n=n=>{n.forEach(e=>{e.removedNodes.forEach(e=>{t?.unobserve(e)}),e.addedNodes.forEach(e=>{t?.observe(e)})}),e(),Q()},r=b(J.current);r.addEventListener(`resize`,e);let i;return typeof ResizeObserver<`u`&&(t=new ResizeObserver(e),Array.from(Y.current.children).forEach(e=>{t.observe(e)})),typeof MutationObserver<`u`&&(i=new MutationObserver(n),i.observe(Y.current,{childList:!0})),()=>{e.clear(),r.removeEventListener(`resize`,e),i?.disconnect(),t?.disconnect()}},[Z,Q]),O.useEffect(()=>{let e=Array.from(Y.current.children),t=e.length;if(typeof IntersectionObserver<`u`&&t>0&&R&&A!==!1){let n=e[0],r=e[t-1],i={root:J.current,threshold:.99},a=new IntersectionObserver(e=>{xe(!e[0].isIntersecting)},i);a.observe(n);let o=new IntersectionObserver(e=>{Ce(!e[0].isIntersecting)},i);return o.observe(r),()=>{a.disconnect(),o.disconnect()}}},[R,A,we,h?.length]),O.useEffect(()=>{ve(!0)},[]),O.useEffect(()=>{Z()}),O.useEffect(()=>{Ge(me!==q)},[Ge,q]),O.useImperativeHandle(p,()=>({updateIndicator:Z,updateScrollButtons:Q}),[Z,Q]);let[Ke,qe]=S(`indicator`,{className:K.indicator,elementType:fe,externalForwardedProps:X,ownerState:G,additionalProps:{style:q}}),Je=(0,j.jsx)(Ke,{...qe}),Ye=w({activeItemId:De?void 0:Ee,orientation:k,isRtl:o}),Xe=Ye.getContainerProps(),Ze=O.Children.toArray(h).filter(O.isValidElement).map((e,t)=>{let n=e.props.value===void 0?t:e.props.value;return je.set(n,t),{child:e,index:t,childValue:n}}).map(({child:e,childValue:t})=>{let n=t===F;return O.cloneElement(e,{fullWidth:I===`fullWidth`,indicator:n&&!_e&&Je,selected:n,selectionFollowsFocus:ie,onChange:re,textColor:P,value:t})}),$=We(),[Qe,$e]=S(`root`,{ref:n,className:t(K.root,g),elementType:le,externalForwardedProps:{...X,...oe,component:_},ownerState:G}),[et,tt]=S(`scroller`,{ref:J,className:K.scroller,elementType:ue,externalForwardedProps:X,ownerState:G,additionalProps:{style:{overflow:ke.overflow,[z?`margin${o?`Left`:`Right`}`:`marginBottom`]:L?void 0:-ke.scrollbarWidth}}}),nt=d(Xe.ref,Y),rt=e=>{let t=Y.current;x(E(t))?.getAttribute(`role`)===`tab`&&Xe.onKeyDown(e)},[it,at]=S(`list`,{ref:nt,className:K.list,elementType:de,externalForwardedProps:X,ownerState:G,getSlotProps:e=>({...e,onBlur:t=>{te(t.currentTarget,t.relatedTarget)||Oe(!1),e.onBlur?.(t)},onKeyDown:t=>{rt(t),e.onKeyDown?.(t)},onFocus:t=>{Oe(!0),Xe.onFocus(t),e.onFocus?.(t)}})});return(0,j.jsxs)(Qe,{...$e,children:[$.scrollButtonStart,$.scrollbarSizeListener,(0,j.jsxs)(et,{...tt,children:[(0,j.jsx)(it,{"aria-label":l,"aria-labelledby":u,"aria-orientation":k===`vertical`?`vertical`:null,role:`tablist`,...at,children:(0,j.jsx)(C.Provider,{value:Ye,children:Ze})}),_e&&Je]}),$.scrollButtonEnd]})}),G=[{title:`App shell`,code:`import React, {
  lazy,
  ReactElement,
  Suspense,
  useEffect,
  useRef,
  useState,
} from 'react';
import './App.css';
import {
  BrowserRouter,
  Link,
  type Location,
  matchPath,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';

import Header from './Components/Library/Header';
import NavBar, { NavigationGroup } from './Components/Library/NavBar/NavBar';
import LoadScreen from './Components/Library/LoadScreen';
import Home from './Components/Home/Home';
import Portal from './Components/Library/Portal/Portal';
import { SiteIconName } from './Components/Library/SiteIcon';

const HomeViewer = lazy(() => import('./Components/Home/Home.codeview'));
const StockTwits = lazy(() => import('./Components/Stocktwits/Stocktwits'));
const StockViewer = lazy(
  () => import('./Components/Stocktwits/StockTwits.codeview')
);
const XKCD = lazy(() => import('./Components/XKCD/xkcd'));
const XKCDViewer = lazy(() => import('./Components/XKCD/xkcd.codeview'));
const Portfolio = lazy(() => import('./Components/Portfolio/Portfolio'));
const PortfolioViewer = lazy(
  () => import('./Components/Portfolio/Portfolio.codeview')
);
const Library = lazy(() => import('./Components/Library/Library'));
const LibraryViewer = lazy(
  () => import('./Components/Library/Library.codeview')
);
const PortalViewer = lazy(
  () => import('./Components/Library/Portal/Portal.codeview')
);

export type AppRoute =
  | '/'
  | '/poketable'
  | '/robotBattle'
  | '/stock'
  | '/xkcd'
  | '/portfolio'
  | '/library';

export interface PageDefinition {
  readonly text: string;
  readonly title: string;
  readonly description: string;
  readonly documentTitle: string;
  readonly route: AppRoute;
  readonly icon: SiteIconName;
  readonly navGroup: NavigationGroup;
  readonly component: (options: PageRenderOptions) => ReactElement;
  readonly codeView?: ReactElement;
  readonly exactRoute?: boolean;
}

interface PageRenderOptions {
  readonly demoExpanded: boolean;
  readonly onDemoExpandedChange: (expanded: boolean) => void;
}

export const pages: ReadonlyArray<PageDefinition> = [
  {
    text: 'Home',
    title: 'Adair Daniels',
    description:
      'Senior Frontend Engineer focused on accessible, dependable software.',
    documentTitle: 'Adair Daniels | Senior Frontend Engineer',
    route: '/',
    icon: 'home',
    navGroup: 'profile',
    component: () => <Home />,
    codeView: <HomeViewer />,
    exactRoute: true,
  },
  {
    text: 'Selected Work',
    title: 'Selected Work',
    description: 'Project screenshots and implementation highlights.',
    documentTitle: 'Selected Work | Adair Daniels',
    route: '/portfolio',
    icon: 'portfolio',
    navGroup: 'profile',
    component: () => <Portfolio />,
    codeView: <PortfolioViewer />,
  },
  {
    text: 'Component Library',
    title: 'Component Library',
    description: 'Reusable interface components and their source.',
    documentTitle: 'Component Library | Adair Daniels',
    route: '/library',
    icon: 'library',
    navGroup: 'profile',
    component: () => <Library />,
    codeView: <LibraryViewer />,
  },
  {
    text: 'PokeTable',
    title: 'PokeTable',
    description: 'A filterable and sortable React data-table demonstration.',
    documentTitle: 'PokeTable Demo | Adair Daniels',
    route: '/poketable',
    icon: 'table',
    navGroup: 'demos',
    component: ({ demoExpanded, onDemoExpandedChange }) => (
      <Portal
        url="https://andeleidun.github.io/pokeTable/"
        title="PokeTable"
        expanded={demoExpanded}
        onExpandedChange={onDemoExpandedChange}
      />
    ),
    codeView: <PortalViewer />,
  },
  {
    text: 'Robot Battle Arena',
    title: 'Robot Battle Arena',
    description: 'A separately hosted interactive React demonstration.',
    documentTitle: 'Robot Battle Arena | Adair Daniels',
    route: '/robotBattle',
    icon: 'robot',
    navGroup: 'demos',
    component: ({ demoExpanded, onDemoExpandedChange }) => (
      <Portal
        url="https://andeleidun.github.io/robot-arena/"
        title="Robot Battle Arena"
        expanded={demoExpanded}
        onExpandedChange={onDemoExpandedChange}
      />
    ),
    codeView: <PortalViewer />,
  },
  {
    text: 'StockTwits Feed',
    title: 'StockTwits Feed',
    description: 'Validated live data with cancellation and resilient states.',
    documentTitle: 'StockTwits Feed Demo | Adair Daniels',
    route: '/stock',
    icon: 'stock',
    navGroup: 'demos',
    component: ({ demoExpanded, onDemoExpandedChange }) => (
      <StockTwits
        expanded={demoExpanded}
        onExpandedChange={onDemoExpandedChange}
      />
    ),
    codeView: <StockViewer />,
  },
  {
    text: 'XKCD Slideshow',
    title: 'XKCD Slideshow',
    description: 'A responsive, failure-aware live comic browser.',
    documentTitle: 'XKCD Slideshow Demo | Adair Daniels',
    route: '/xkcd',
    icon: 'xkcd',
    navGroup: 'demos',
    component: ({ demoExpanded, onDemoExpandedChange }) => (
      <XKCD expanded={demoExpanded} onExpandedChange={onDemoExpandedChange} />
    ),
    codeView: <XKCDViewer />,
  },
];

const pageForPath = (pathname: string): PageDefinition | undefined =>
  pages.find((page) =>
    matchPath(
      {
        path: page.route,
        end: page.exactRoute !== false,
      },
      pathname
    )
  );

const NotFound = (): ReactElement => (
  <section className="not-found" aria-labelledby="not-found-title">
    <h2 id="not-found-title">This page could not be found</h2>
    <p>The address may have changed, or the page may no longer exist.</p>
    <Button component={Link} to="/" variant="contained">
      Return home
    </Button>
  </section>
);

const currentYear = new Date().getFullYear();

const AppFooter = (): ReactElement => (
  <footer className="site-footer">
    <p>&copy; {currentYear} Adair Daniels</p>
    <nav aria-label="Professional links">
      <a
        href="https://www.linkedin.com/in/adairdaniels/"
        target="_blank"
        rel="noopener noreferrer"
      >
        LinkedIn <span className="visually-hidden">(opens in a new tab)</span>
      </a>
      <a
        href="https://github.com/andeleidun"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub <span className="visually-hidden">(opens in a new tab)</span>
      </a>
      <a href="#page-title">Back to top</a>
    </nav>
  </footer>
);

export const ApplicationShell = (): ReactElement => {
  const location = useLocation();
  const desktop = useMediaQuery('(min-width:961px)');
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const previousPathnameRef = useRef(location.pathname);
  const [navShow, setNavShow] = useState(false);
  const [codeView, setCodeView] = useState(false);
  const [expandedDemoLocation, setExpandedDemoLocation] =
    useState<Location | null>(null);
  const currentPage = pageForPath(location.pathname);
  const sourceViewActive = codeView && Boolean(currentPage?.codeView);
  const demoExpanded = !sourceViewActive && expandedDemoLocation === location;
  const pageTitle = currentPage?.title ?? 'Page not found';
  const pageDescription =
    currentPage?.description ?? 'The requested portfolio page was not found.';
  const showPageHeading = currentPage?.route !== '/' && !demoExpanded;
  const pageKicker = currentPage
    ? currentPage.route === '/'
      ? undefined
      : currentPage.navGroup === 'demos'
        ? 'Engineering demonstration'
        : 'Portfolio'
    : undefined;

  useEffect(() => {
    const pageUrl = new URL(
      location.pathname,
      'https://adairdaniels.com/'
    ).toString();
    document.title =
      currentPage?.documentTitle ?? 'Page not found | Adair Daniels';
    const description = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]'
    );
    description?.setAttribute('content', pageDescription);
    document
      .querySelector<HTMLMetaElement>('meta[property="og:title"]')
      ?.setAttribute(
        'content',
        currentPage?.documentTitle ?? 'Page not found | Adair Daniels'
      );
    document
      .querySelector<HTMLMetaElement>('meta[property="og:description"]')
      ?.setAttribute('content', pageDescription);
    document
      .querySelector<HTMLMetaElement>('meta[property="og:url"]')
      ?.setAttribute('content', pageUrl);
    document
      .querySelector<HTMLMetaElement>('meta[name="twitter:title"]')
      ?.setAttribute(
        'content',
        currentPage?.documentTitle ?? 'Page not found | Adair Daniels'
      );
    document
      .querySelector<HTMLMetaElement>('meta[name="twitter:description"]')
      ?.setAttribute('content', pageDescription);
    document
      .querySelector<HTMLLinkElement>('link[rel="canonical"]')
      ?.setAttribute('href', pageUrl);
  }, [currentPage, location.pathname, pageDescription]);

  useEffect(() => {
    if (previousPathnameRef.current === location.pathname) {
      return undefined;
    }
    previousPathnameRef.current = location.pathname;
    const focusTimer = window.setTimeout(() => headingRef.current?.focus(), 0);
    return () => window.clearTimeout(focusTimer);
  }, [location.pathname]);

  useEffect(() => {
    if (!demoExpanded) {
      return undefined;
    }
    document.documentElement.classList.add('demo-expanded');
    document.body.classList.add('demo-expanded');
    return () => {
      document.documentElement.classList.remove('demo-expanded');
      document.body.classList.remove('demo-expanded');
    };
  }, [demoExpanded]);

  const toggleNav = () => setNavShow((shown) => !shown);
  const closeNav = () => {
    setNavShow(false);
    window.setTimeout(() => menuButtonRef.current?.focus(), 0);
  };
  const toggleCodeView = () => {
    setExpandedDemoLocation(null);
    setCodeView((shown) => !shown);
  };
  const handleDemoExpandedChange = (expanded: boolean) => {
    setNavShow(false);
    setExpandedDemoLocation(expanded ? location : null);
  };
  const contentClass = demoExpanded
    ? 'app-main app-main-demo-expanded'
    : desktop && navShow
      ? 'app-main app-main-with-menu'
      : 'app-main';
  const appContentClass = demoExpanded
    ? 'app-content app-content-demo-expanded'
    : 'app-content';

  return (
    <div className="app">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Header
        codeViewAvailable={
          desktop && !demoExpanded && Boolean(currentPage?.codeView)
        }
        onClick={toggleNav}
        codeView={codeView}
        menuOpen={navShow}
        ref={menuButtonRef}
        toggleCodeView={toggleCodeView}
      />
      <Drawer
        className="app-drawer"
        variant={desktop ? 'persistent' : 'temporary'}
        open={navShow}
        onClose={closeNav}
        transitionDuration={reduceMotion ? 0 : 160}
        ModalProps={{ disableRestoreFocus: true, keepMounted: true }}
      >
        <NavBar
          pages={pages}
          activeRoute={currentPage?.route ?? ''}
          navClick={closeNav}
          codeView={codeView}
          codeViewAvailable={
            !desktop && !demoExpanded && Boolean(currentPage?.codeView)
          }
          toggleCodeView={toggleCodeView}
        />
      </Drawer>
      <div className={contentClass}>
        <main id="main-content" className={appContentClass} tabIndex={-1}>
          <div
            className="app-screen"
            key={\`\${location.pathname}-\${sourceViewActive ? 'source' : 'live'}\`}
          >
            {showPageHeading ? (
              <header className="page-heading">
                {pageKicker ? (
                  <p className="page-kicker">{pageKicker}</p>
                ) : null}
                <h1 id="page-title" ref={headingRef} tabIndex={-1}>
                  {pageTitle}
                </h1>
                <p className="page-description">{pageDescription}</p>
              </header>
            ) : (
              <h1
                id="page-title"
                className="visually-hidden"
                ref={headingRef}
                tabIndex={-1}
              >
                {pageTitle}
              </h1>
            )}
            {currentPage?.codeView ? (
              <p className="visually-hidden" role="status">
                {sourceViewActive ? 'Source view' : 'Live demonstration view'}
              </p>
            ) : null}
            <Suspense fallback={<LoadScreen />}>
              <Routes>
                {pages.map((page) => (
                  <Route
                    path={page.route}
                    key={page.route}
                    element={
                      sourceViewActive && page.codeView
                        ? page.codeView
                        : page.component({
                            demoExpanded:
                              demoExpanded && page.route === currentPage?.route,
                            onDemoExpandedChange: handleDemoExpandedChange,
                          })
                    }
                  />
                ))}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
        </main>
        {demoExpanded ? null : <AppFooter />}
      </div>
    </div>
  );
};

const App = (): ReactElement => (
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <ApplicationShell />
  </BrowserRouter>
);

export default App;
`},{title:`Card`,code:`import React from 'react';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

export type CardAction =
  | { readonly kind: 'external'; readonly text: string; readonly url: string }
  | {
      readonly kind: 'button';
      readonly text: string;
      readonly onClick: () => void;
    };

interface CardTemplateProps {
  readonly media?: {
    readonly src: string;
    readonly alt: string;
    readonly width: number;
    readonly height: number;
    readonly loading?: 'eager' | 'lazy';
  };
  readonly title?: string;
  readonly text?: string;
  readonly content?: React.ReactNode;
  readonly classGiven?: string;
  readonly links?: ReadonlyArray<CardAction>;
}

const CardTemplate = (props: CardTemplateProps): React.ReactElement => {
  const { media, title, text, content, classGiven, links } = props;

  const generateLinks = () => {
    if (links && links.length > 0) {
      return (
        <CardActions className="card-buttons">
          {links.map((link) =>
            link.kind === 'external' ? (
              <Button
                className="card-button"
                component="a"
                fullWidth
                href={link.url}
                key={\`\${link.kind}-\${link.text}\`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.text}
                <span className="visually-hidden"> (opens in a new tab)</span>
              </Button>
            ) : (
              <Button
                className="card-button"
                fullWidth
                key={\`\${link.kind}-\${link.text}\`}
                onClick={link.onClick}
              >
                {link.text}
              </Button>
            )
          )}
        </CardActions>
      );
    }
    return null;
  };

  const generateMedia = () => {
    if (media) {
      return (
        <img
          className="media-area"
          src={media.src}
          alt={media.alt}
          width={media.width}
          height={media.height}
          loading={media.loading ?? 'lazy'}
          decoding="async"
        />
      );
    }
  };

  const generateContent = () => {
    return (
      <>
        {title ? <h2>{title}</h2> : null}
        {text ? <p>{text}</p> : null}
        {content}
      </>
    );
  };

  return (
    <Card className={classGiven}>
      {generateMedia()}
      <CardContent>{generateContent()}</CardContent>
      {generateLinks()}
    </Card>
  );
};

export default CardTemplate;
`},{title:`Demo expansion`,code:`import React, { useCallback, useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import SiteIcon from '../SiteIcon';
import './DemoExpansionButton.css';

export interface DemoExpansionOptions {
  readonly expanded?: boolean;
  readonly onExpandedChange?: (expanded: boolean) => void;
}

export const useDemoExpansionState = ({
  expanded,
  onExpandedChange,
}: DemoExpansionOptions) => {
  const [locallyExpanded, setLocallyExpanded] = useState(false);
  const isExpanded = expanded ?? locallyExpanded;
  const setExpanded = useCallback(
    (nextExpanded: boolean) => {
      if (expanded === undefined) {
        setLocallyExpanded(nextExpanded);
      }
      onExpandedChange?.(nextExpanded);
    },
    [expanded, onExpandedChange]
  );

  return { isExpanded, setExpanded } as const;
};

interface DemoExpansionButtonProps {
  readonly expanded: boolean;
  readonly onExpandedChange: (expanded: boolean) => void;
  readonly title: string;
}

const DemoExpansionButton = ({
  expanded,
  onExpandedChange,
  title,
}: DemoExpansionButtonProps): React.ReactElement => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wasExpandedRef = useRef(false);

  useEffect(() => {
    if (expanded || wasExpandedRef.current) {
      buttonRef.current?.focus({ preventScroll: true });
    }
    wasExpandedRef.current = expanded;
  }, [expanded]);

  useEffect(() => {
    if (!expanded) {
      return undefined;
    }
    const collapseOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onExpandedChange(false);
      }
    };
    window.addEventListener('keydown', collapseOnEscape);
    return () => window.removeEventListener('keydown', collapseOnEscape);
  }, [expanded, onExpandedChange]);

  const action = expanded ? 'Collapse' : 'Expand';

  return (
    <Button
      ref={buttonRef}
      className={\`demo-expansion-button\${
        expanded ? ' demo-expansion-button-expanded' : ''
      }\`}
      variant={expanded ? 'contained' : 'outlined'}
      startIcon={<SiteIcon name={expanded ? 'collapse' : 'expand'} />}
      onClick={() => onExpandedChange(!expanded)}
      aria-label={\`\${action} \${title} demonstration\`}
      aria-expanded={expanded}
    >
      {action} demo
    </Button>
  );
};

export default DemoExpansionButton;
`},{title:`Header`,code:`import React from 'react';
import { Link } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import SiteIcon from '../SiteIcon';

interface HeaderProps {
  readonly codeView: boolean;
  readonly codeViewAvailable: boolean;
  readonly menuOpen: boolean;
  readonly onClick: () => void;
  readonly ref?: React.Ref<HTMLButtonElement>;
  readonly toggleCodeView: () => void;
}

const Header = ({
  codeView,
  codeViewAvailable,
  menuOpen,
  onClick,
  ref,
  toggleCodeView,
}: HeaderProps): React.ReactElement => {
  const handleChange = () => {
    toggleCodeView();
  };

  const generateCodeView = () => {
    if (codeViewAvailable) {
      const codeViewBar = (
        <div className="code-view-bar">
          <FormControlLabel
            control={
              <Switch
                checked={codeView}
                onChange={handleChange}
                name="codeView"
              />
            }
            label="Code View"
          />
        </div>
      );
      return codeViewBar;
    }
  };

  return (
    <header className="app-header">
      <AppBar position="fixed" color="secondary" component="div">
        <Toolbar className="header-toolbar">
          <IconButton
            edge="start"
            ref={ref}
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            className="menu-button"
            onClick={onClick}
            aria-controls="app-navigation"
            aria-expanded={menuOpen}
          >
            <SiteIcon name={menuOpen ? 'close' : 'menu'} />
          </IconButton>
          <Link className="site-brand" to="/" aria-label="Adair Daniels home">
            <img
              className="site-brand-monogram"
              src={\`\${import.meta.env.BASE_URL}ad-monogram.svg\`}
              alt=""
              aria-hidden="true"
              width="40"
              height="40"
            />
            <span className="site-brand-name">Adair Daniels</span>
          </Link>
          {generateCodeView()}
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default Header;
`},{title:`Navigation`,code:`import React from 'react';
import { Link } from 'react-router-dom';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import ListSubheader from '@mui/material/ListSubheader';
import SiteIcon, { SiteIconName } from '../SiteIcon';

export type NavigationGroup = 'demos' | 'profile';

export interface NavigationPage {
  readonly text: string;
  readonly route: string;
  readonly icon: SiteIconName;
  readonly navGroup: NavigationGroup;
}

interface NavBarProps {
  readonly pages: ReadonlyArray<NavigationPage>;
  readonly activeRoute: string;
  readonly navClick: () => void;
  readonly codeView: boolean;
  readonly codeViewAvailable: boolean;
  readonly toggleCodeView: () => void;
}

const NavBar = (props: NavBarProps): React.ReactElement => {
  const handleChange = () => {
    props.toggleCodeView();
  };

  const populatePages = (group: NavigationGroup) =>
    props.pages
      .filter((page) => page.navGroup === group)
      .map((page) => (
        <li key={page.route}>
          <ListItemButton
            component={Link}
            to={page.route}
            onClick={props.navClick}
            aria-current={props.activeRoute === page.route ? 'page' : undefined}
          >
            <ListItemIcon aria-hidden="true">
              <SiteIcon name={page.icon} />
            </ListItemIcon>
            <ListItemText primary={page.text} />
          </ListItemButton>
        </li>
      ));

  const populateOptions = () => (
    <ListItem className="code-view-bar">
      <FormControlLabel
        control={
          <Switch
            checked={props.codeView}
            onChange={handleChange}
            name="codeView"
          />
        }
        label="Code View"
      />
    </ListItem>
  );

  return (
    <nav className="app-nav" id="app-navigation" aria-label="Main navigation">
      <List>
        <li className="nav-close">
          <Button
            onClick={props.navClick}
            startIcon={<SiteIcon name="close" />}
          >
            Close navigation
          </Button>
        </li>
        <ListSubheader component="li">Profile and work</ListSubheader>
        {populatePages('profile')}
        <ListSubheader component="li">Engineering demos</ListSubheader>
        {populatePages('demos')}
        {props.codeViewAvailable ? populateOptions() : null}
      </List>
    </nav>
  );
};

export default NavBar;
`},{title:`Site icon`,code:`import React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

export type SiteIconName =
  | 'code'
  | 'collapse'
  | 'close'
  | 'expand'
  | 'external'
  | 'home'
  | 'library'
  | 'menu'
  | 'portfolio'
  | 'robot'
  | 'stock'
  | 'table'
  | 'xkcd';

const paths: Readonly<Record<SiteIconName, string>> = {
  code: 'M8.7 16.6 4.1 12l4.6-4.6L7.3 6 1.3 12l6 6 1.4-1.4zm6.6 0 4.6-4.6-4.6-4.6L16.7 6l6 6-6 6-1.4-1.4z',
  collapse:
    'M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z',
  close:
    'M18.3 5.7 16.9 4.3 12 9.2 7.1 4.3 5.7 5.7l4.9 4.9-4.9 4.9 1.4 1.4 4.9-4.9 4.9 4.9 1.4-1.4-4.9-4.9 4.9-4.9z',
  expand:
    'M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z',
  external:
    'M19 19H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.6l-9.8 9.8 1.4 1.4L19 6.4V10h2V3h-7z',
  home: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z',
  library:
    'M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z',
  menu: 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z',
  portfolio:
    'M20 6h-4V4c0-1.1-.9-2-2-2h-4C8.9 2 8 2.9 8 4v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 0h-4V4h4v2zm6 13H4v-5h6v1h4v-1h6v5zm-8-5H4V8h16v6h-8z',
  robot:
    'M20 9V7h-2.2c-.4-1.2-1.3-2.1-2.4-2.7L16.5 2 14.7 1l-1.2 2.4c-.5-.1-1-.2-1.5-.2s-1 .1-1.5.2L9.3 1 7.5 2l1.1 2.3C7.5 4.9 6.6 5.8 6.2 7H4v2H2v10h20V9h-2zm-8-4c2.8 0 5 1.8 5.7 4H6.3C7 6.8 9.2 5 12 5zm8 12H4v-6h16v6zm-11-4H7v2h2v-2zm8 0h-2v2h2v-2z',
  stock:
    'M3 13h2v8H3v-8zm4-4h2v12H7V9zm4 3h2v9h-2v-9zm4-6h2v15h-2V6zm4-3h2v18h-2V3z',
  table:
    'M3 3h18v18H3V3zm2 4h14V5H5v2zm0 4h4V9H5v2zm6 0h8V9h-8v2zm-6 4h4v-2H5v2zm6 0h8v-2h-8v2zm-6 4h4v-2H5v2zm6 0h8v-2h-8v2z',
  xkcd: 'M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm8-2h8v8h-8v-8zm2 2v4h4v-4h-4z',
};

interface SiteIconProps {
  readonly name: SiteIconName;
  readonly fontSize?: 'small' | 'medium' | 'large';
}

const SiteIcon = ({
  name,
  fontSize = 'medium',
}: SiteIconProps): React.ReactElement => (
  <SvgIcon fontSize={fontSize} aria-hidden="true">
    <path d={paths[name]} />
  </SvgIcon>
);

export default SiteIcon;
`}],K=()=>{let[e,t]=(0,O.useState)(0);return(0,j.jsxs)(`div`,{className:`library-page`,children:[(0,j.jsxs)(`section`,{className:`library-navigation`,"aria-labelledby":`library-nav-title`,children:[(0,j.jsx)(`h2`,{id:`library-nav-title`,children:`Choose a shared component`}),(0,j.jsx)(W,{value:e,onChange:(e,n)=>t(n),variant:`scrollable`,scrollButtons:`auto`,"aria-label":`Component source`,children:G.map((e,t)=>(0,j.jsx)(N,{id:`component-tab-${t}`,"aria-controls":`component-panel-${t}`,label:e.title},e.title))})]}),G.map((t,n)=>{let r=e===n;return(0,j.jsx)(`section`,{className:`library-source`,id:`component-panel-${n}`,role:`tabpanel`,"aria-labelledby":`component-tab-${n}`,hidden:!r,children:r?(0,j.jsxs)(j.Fragment,{children:[(0,j.jsxs)(`h2`,{children:[t.title,` source`]}),(0,j.jsx)(re,{value:t.code,label:`${t.title} source code`})]}):null},t.title)})]})};export{K as default};