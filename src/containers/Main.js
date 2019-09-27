import * as React from 'react';
import { DrawingBoard } from '../components/DrawingBoard';
import { PredictionBoard } from '../components/PredictionBoard';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
export const Main = () => {
  return (
    <div className="Main">
      <Header />
      <div className="Body">
        <div className="Left">
          <span>Draw</span>
          <DrawingBoard />
        </div>
        <div className="Right">
          <span>Prediction</span>
          <PredictionBoard />
        </div>
      </div>
      <Footer />
    </div>
  );
};
