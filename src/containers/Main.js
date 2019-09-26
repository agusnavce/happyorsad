import * as React from 'react';
import { DrawingBoard } from '../components/DrawingBoard';
import { RoundedCornersBox } from '../components/RoundedCornersBox';
import { PredictionBoard } from '../components/PredictionBoard';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Grid } from 'semantic-ui-react';
export const Main = () => {
  return (
    <div className="Main">
      <Header />
      <div className="MainWrapper">
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>
              <RoundedCornersBox
                key={'Draw'}
                name={'Draw'}
                payload={<DrawingBoard />}
              />
            </Grid.Column>
            <Grid.Column width={10}>
              <RoundedCornersBox
                key={'Prediction'}
                name={'Prediction'}
                payload={<PredictionBoard />}
              />{' '}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
      <Footer />
    </div>
  );
};
