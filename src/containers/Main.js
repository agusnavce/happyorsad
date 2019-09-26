import * as React from 'react';
import { DrawingBoard } from '../components/DrawingBoard';
import { RoundedCornersBox } from '../components/RoundedCornersBox';
import { PredictionBoard } from '../components/PredictionBoard';
export const Main = props => {
  return (
    <div className="Main">
      <RoundedCornersBox
        key={'Draw'}
        name={'Draw'}
        payload={<DrawingBoard />}
      />
       <RoundedCornersBox
        key={'Prediction'}
        name={'Prediction'}
        payload={<PredictionBoard />}
      />
    </div>
  );
};
