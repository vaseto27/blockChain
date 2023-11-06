import React, { useState, useEffect } from "react";
import { Block } from "./Block";

export const Blocks = () => {
  const [blocks, setBlocks] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3000/api/blocks")
      .then((res) => res.json())
      .then((data) => {
        setBlocks(data);
      });
  }, []);

  return (
    <div>
      {blocks.map((block, index) => {
        return <Block key={index} block={block} />;
      })}
    </div>
  );
};
