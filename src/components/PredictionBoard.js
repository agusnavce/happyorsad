import React from 'react';

export function PredictionBoard({ prediction }) {
  return (
    <div className="PredictionBoard">
      <div className="PredictionBoard-image">
        <img
          src="https://s3-us-west-2.amazonaws.com/devcodepro/media/blog/como-funciona-reactjs.png"
          alt="Logo"
        />
      </div>
      <div className="PredictionBoard-text"> {prediction || 80}%</div>
    </div>
  );
}
