import React, { useState, useEffect } from "react";

export const Block = (props) => {
  console.log(props);
  return (
    <div className="block">
        <div>Hash: {props.block.hash.substring(0, 15)}...</div>
        <div>TimeStamp: {new Date(props.block.timestamp).toLocaleString()}</div>
        <div>Data: {JSON.stringify(props.block.data)}</div>
    </div>
  );
};
