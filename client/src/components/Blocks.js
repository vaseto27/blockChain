import React, { useState, useEffect } from "react";
import Block from "./Block";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

const Blocks = () => {
  const [blocks, setBlocks] = useState([]);
  const [paginateId, setPaginateId] = useState(1);
  const [blocksLength, setBlocksLength] = useState(0);
  const fetchPaginatedBlocks = (paginateId) => {
    fetch(`${document.location.origin}/api/blocks/${paginateId}`)
      .then((res) => res.json())
      .then((data) => {
        setBlocks(data);
      });
  };

  const fetchBlocksLength = () => {
    fetch(`${document.location.origin}/api/blocks/length`)
      .then(response => response.json())
      .then(data => setBlocksLength(data))
  }

  useEffect(() => {
    fetchBlocksLength();
    fetchPaginatedBlocks(paginateId)
  }, []);

  return (
    <div>
      <div>
        <Link to="/">Home</Link>
      </div>
      <h3>BLOCKS</h3>
      {
        [...Array(Math.ceil(blocksLength / 5)).keys()].map((key) => {
          const paginateId = key + 1;
          return (
            <span key={key} onClick={() => fetchPaginatedBlocks(paginateId)}>
              <Button variant="danger" size="sm" >{paginateId}</Button>{' '}
            </span>
          )
        })
      }
      {blocks.map((block, index) => {
        return <Block key={index} block={block} />;
      })}
    </div>
  );
};

export default Blocks;
