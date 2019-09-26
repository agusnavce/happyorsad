import React, { useState } from 'react';
import { useStateValue } from '../state/store';

const HAPPY_IMAGE =
  'https://image.shutterstock.com/image-photo/happy-note-on-yellow-sticker-600w-142034761.jpg';
const SAD_IMAGE =
  'https://pbs.twimg.com/profile_images/811341743371194368/353_ttjx_400x400.jpg';

export function PredictionBoard() {
  const [{ predictions }] = useStateValue();
  const [previousPred, setPreviousPred] = useState({
    prediction: undefined,
    value: undefined
  });

  const selectMood = predictions => {
    const [sad, happy] = predictions;
    let prediction;
    if (happy > sad) {
      prediction = { prediction: 'happy', value: happy };
    } else {
      prediction = { prediction: 'sad', value: sad };
    }
    // setPreviousPred(prediction);
    return prediction;
  };
  return (
    <div className="PredictionBoard">
      <div className="PredictionBoard-image">
        <img
          src={
            selectMood(predictions).prediction === 'happy'
              ? HAPPY_IMAGE
              : SAD_IMAGE
          }
          alt="Logo"
        />
      </div>
      <div className="PredictionBoard-text">
        {console.log(predictions)}
        {Math.trunc(selectMood(predictions).value * 100) || 80}%
      </div>
    </div>
  );
}
