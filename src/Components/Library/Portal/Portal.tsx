/*
  This component uses lazy loading iframes to setup a portal
  for separately hosted micro-frontends. This is implemented 
  with the PokeTable.
  PokeTable code can be found on github -
  https://github.com/Andeleidun/pokeTable
*/
import React from 'react';
import './Portal.css';

interface Props {
  url: string;
}

const Portal = ({ url }: Props) => {
  return <iframe src={url} loading="lazy" className="portal" />;
};

export default Portal;
