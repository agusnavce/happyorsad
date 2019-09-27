import React from 'react';
import { useStateValue } from '../state/store';
import { Icon } from 'semantic-ui-react';

const HAPPY_ICON = 'smile outline';
const SAD_ICON = 'frown outline';

export function PredictionBoard() {
  const [{ predictions }] = useStateValue();

  const selectMood = predictions => {
    const [sad, happy] = predictions;
    let prediction;
    if (happy > sad) {
      prediction = { prediction: 'happy', value: happy };
    } else {
      prediction = { prediction: 'sad', value: sad };
    }
    return prediction;
  };
  return (
    <div className="PredictionBoard">
      <div className="PredictionBoard-image">
        <Icon
          size="massive"
          name={
            selectMood(predictions).prediction === 'happy'
              ? HAPPY_ICON
              : SAD_ICON
          }
        />
      </div>
      <div className="Text">
        {Math.trunc(selectMood(predictions).value * 100) || 80}%
      </div>
    </div>
  );
}
