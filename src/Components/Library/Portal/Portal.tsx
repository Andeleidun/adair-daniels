/*
  This component uses lazy loading iframes to setup a portal
  for separately hosted micro-frontends. This is implemented 
  with the PokeTable.
  PokeTable is a filterable and sortable React data table.
  PokeTable code can be found on github -
  https://github.com/Andeleidun/pokeTable
*/
import React from 'react';
import './Portal.css';

interface Props {
  url: string;
  title: string;
}

const Portal = ({ url, title }: Props) => {
  return <iframe src={url} loading="lazy" className="portal" title={title} />;
};

export default Portal;
