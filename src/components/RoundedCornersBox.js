import React from 'react';

export function RoundedCornersBox(props) {
  return (
    <div className="RoundedCornersBox" style={props.style}>
      <div className="RCBHeader">{props.name}</div>
      <div className="Content">{props.payload}</div>
    </div>
  );
}
