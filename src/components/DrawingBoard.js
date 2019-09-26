import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';

const MINST_MODEL_URl = '';
const INPUT_PIXEL_SIZE = 28;

export function DrawingBoard({ width, height }) {
  const canvasRef = useRef(null);
  const [isPainting, setIsPainting] = useState(false);
  const [mousePosition, setMousePosition] = useState(undefined);
  const [predictions, setPredictions] = useState([]);
  const [model, setModel] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const getImageDataAndScale = (canvas, outputSize) => {
    // let scaled = document.createElement('canvas');
    // let scaledCtx = scaled.getContext('2d');
    // scaled.width = outputSize.width;
    // scaled.height = outputSize.height;
    // scaledCtx.drawImage(canvas, 0, 0, outputSize.width, outputSize.height);
    // return scaledCtx.getImageData(0, 0, outputSize.width, outputSize.height);
  };
  const loadModel = useCallback(async () => {
    await tf.loadLayersModel(MINST_MODEL_URl);
  }, []);

  useEffect(() => {
    loadModel();
    setIsLoading(false);
  }, [loadModel]);

  const predict = useCallback(
    async imageData => {
      console.log('predict');
      // await tf.tidy(() => {
      //   const pixSize = INPUT_PIXEL_SIZE;
      //   let img = tf.browser.fromPixels(imageData, 1);
      //   img = img.reshape([1, pixSize, pixSize, 1]);
      //   img = tf.cast(img, 'float32');
      //   img = img.div(tf.scalar(255));

      //   const output = model.predict(img);
      //   setPredictions(Array.from(output.dataSync()));
      // });
    },
    [model]
  );

  const makePrediction = useCallback(async () => {
    const pixSize = INPUT_PIXEL_SIZE;
    let image = getImageDataAndScale(canvasRef, {
      width: pixSize,
      height: pixSize
    });
    await predict(image);
    setPredictions(predictions);
  }, [predict, predictions, setPredictions]);

  useEffect(() => {
    if (!isPainting) {
      makePrediction();
    }
  }, [isPainting, makePrediction]);

  const startPaint = useCallback(event => {
    const coordinates = getCoordinates(event);
    if (coordinates) {
      setMousePosition(coordinates);
      setIsPainting(true);
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    canvas.addEventListener('mousedown', startPaint);
    return () => {
      canvas.removeEventListener('mousedown', startPaint);
    };
  }, [startPaint]);

  const paint = useCallback(
    event => {
      if (isPainting) {
        const newMousePosition = getCoordinates(event);
        if (mousePosition && newMousePosition) {
          drawLine(mousePosition, newMousePosition);
          setMousePosition(newMousePosition);
        }
      }
    },
    [isPainting, mousePosition]
  );

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    canvas.addEventListener('mousemove', paint);
    return () => {
      canvas.removeEventListener('mousemove', paint);
    };
  }, [paint]);

  const exitPaint = useCallback(() => {
    setIsPainting(false);
    setMousePosition(undefined);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    canvas.addEventListener('mouseup', exitPaint);
    canvas.addEventListener('mouseleave', exitPaint);

    return () => {
      canvas.removeEventListener('mouseup', exitPaint);
      canvas.removeEventListener('mouseleave', exitPaint);
    };
  }, [exitPaint]);

  const getCoordinates = event => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    return {
      x: event.pageX - canvas.offsetLeft,
      y: event.pageY - canvas.offsetTop
    };
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const drawLine = (originalMousePosition, newMousePosition) => {
    if (!canvasRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (context) {
      context.strokeStyle = 'white';
      context.lineJoin = 'round';
      context.lineWidth = 5;

      context.beginPath();
      context.moveTo(originalMousePosition.x, originalMousePosition.y);
      context.lineTo(newMousePosition.x, newMousePosition.y);
      context.closePath();

      context.stroke();
    }
  };

  return (
    <div className="DrawingBoard">
      <div className="BoardWrapper">
        <canvas
          className="Board"
          ref={canvasRef}
          height={height}
          width={width}
        />
      </div>
      <button onClick={clearCanvas}>Clear</button>
    </div>
  );
}

DrawingBoard.defaultProps = {
  width: window.innerWidth,
  height: window.innerHeight
};
