import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useStateValue } from '../state/store';
import { Button } from 'semantic-ui-react';
import * as tf from '@tensorflow/tfjs';

const MINST_MODEL_URl =
  'https://raw.githubusercontent.com/agusnavce/happyorsad/master/model/model.json';
const INPUT_PIXEL_SIZE = 28;

export function DrawingBoard() {
  const canvasRef = useRef(null);
  const boardWrapperRef = useRef(null);
  const [isPainting, setIsPainting] = useState(false);
  const [mousePosition, setMousePosition] = useState(undefined);
  const [, dispatch] = useStateValue();
  const [model, setModel] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const getImageDataAndScale = (canvas, outputSize) => {
    let scaled = document.createElement('canvas');
    let scaledCtx = scaled.getContext('2d');
    scaled.width = outputSize.width;
    scaled.height = outputSize.height;
    scaledCtx.drawImage(canvas, 0, 0, outputSize.width, outputSize.height);
    return scaledCtx.getImageData(0, 0, outputSize.width, outputSize.height);
  };
  const loadModel = useCallback(async () => {
    const model = await tf.loadLayersModel(MINST_MODEL_URl);
    setModel(model);
    setIsLoading(false);
  }, [setIsLoading]);

  const setUpCanvas = () => {
    if (canvasRef.current && boardWrapperRef.current) {
      const canvas = canvasRef.current;
      const boardWrapper = boardWrapperRef.current;

      const boardWrapperRect = boardWrapper.getBoundingClientRect();

      if (boardWrapperRect.width >= boardWrapperRect.height) {
        canvas.width = boardWrapperRect.height;
        canvas.height = boardWrapperRect.height;
      } else {
        canvas.width = boardWrapperRect.width;
        canvas.height = boardWrapperRect.width;
      }
    }
  };

  useEffect(() => {
    setUpCanvas();
    loadModel();
  }, [loadModel]);

  const predict = useCallback(
    async imageData => {
      if (model) {
        await tf.tidy(() => {
          const pixSize = INPUT_PIXEL_SIZE;
          let img = tf.browser.fromPixels(imageData, 1);
          img = img.reshape([1, pixSize, pixSize, 1]);
          img = tf.cast(img, 'float32');
          img = img.div(tf.scalar(255));
          const output = model.predict(img);
          dispatch({
            type: 'predictions',
            payload: Array.from(output.dataSync())
          });
        });
      }
    },
    [model, dispatch]
  );

  const makePrediction = useCallback(async () => {
    const pixSize = INPUT_PIXEL_SIZE;
    const canvas = canvasRef.current;
    let image = getImageDataAndScale(canvas, {
      width: pixSize,
      height: pixSize
    });
    await predict(image);
  }, [predict]);

  useEffect(() => {
    if (!isPainting && !isLoading) {
      makePrediction();
    }
  }, [isPainting, isLoading, makePrediction]);

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
      context.lineWidth = 10;

      context.beginPath();
      context.moveTo(originalMousePosition.x, originalMousePosition.y);
      context.lineTo(newMousePosition.x, newMousePosition.y);
      context.closePath();

      context.stroke();
    }
  };

  return (
    <div className="DrawingBoard">
      <div className="BoardWrapper" ref={boardWrapperRef}>
        <canvas className="Board" ref={canvasRef} height={341} width={341} />
      </div>
      <Button primary onClick={clearCanvas}>
        Clear
      </Button>
    </div>
  );
}

DrawingBoard.defaultProps = {
  width: window.innerWidth,
  height: window.innerHeight
};
