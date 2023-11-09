import React, { useState, useEffect } from "react";
import Block from "./Block";
import { Link } from 'react-router-dom';

const Blocks = () => {
  const [blocks, setBlocks] = useState([]);
  useEffect(() => {
    fetch(`${document.location.origin}/api/blocks`)
      .then((res) => res.json())
      .then((data) => {
        setBlocks(data);
      });
  }, []);

  return (
    <div>
      <div><Link to='/'>Home</Link></div>
      {blocks.map((block, index) => {
        return <Block key={index} block={block} />;
      })}
    </div>
  );
};

export default Blocks