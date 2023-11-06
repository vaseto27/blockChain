import React, { useState, useEffect } from "react";

export const Blocks = () => {
  const [blocks, setBlocks] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3000/api/blocks")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setBlocks(data);
      });
  }, []);

  return <div>
    {blocks.map((block, index) => {
        return(
            <div key={index}>{block.hash}</div>
        )
    })}
  </div>;
};
