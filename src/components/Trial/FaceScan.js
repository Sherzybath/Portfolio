import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { useNavigate } from 'react-router-dom';

export default function FaceScan() {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [landmarks, setLandmarks] = useState([]);
  const lastPeaceTimeRef = useRef(0);
  const lastRockTimeRef = useRef(0);
  const scrollIntervalRef = useRef(null);

  useEffect(() => {
    const hands = new Hands({ locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5,
    });
    hands.onResults(onResults);

    if (webcamRef.current) {
      const camera = new Camera(webcamRef.current.video, {
        onFrame: async () => await hands.send({ image: webcamRef.current.video }),
        width: 640,
        height: 480,
      });
      camera.start();
    }

    return () => {
      if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
    };
  }, []);

  function onResults(results) {
    const handsLandmarks = results.multiHandLandmarks || [];
    setLandmarks(handsLandmarks);
    const now = Date.now();
    let direction = null;

    if (handsLandmarks.length > 0) {
      const lm = handsLandmarks[0];
      const indexUp = lm[8].y < lm[6].y;
      const middleUp = lm[12].y < lm[10].y;
      const ringUp = lm[16].y < lm[14].y;
      const pinkyUp = lm[20].y < lm[18].y;

      // Peace: index + middle up, ring + pinky down
      if (indexUp && middleUp && !ringUp && !pinkyUp) {
        if (now - lastPeaceTimeRef.current > 3000) {
          navigate('/project');
          // console.log('Peace');
          lastPeaceTimeRef.current = now; 
        }
      }

      // Rock: index + pinky up, middle + ring down
      if (indexUp && pinkyUp && !middleUp && !ringUp) {
        if (now - lastRockTimeRef.current > 3000) {
          console.log('Rock');
          lastRockTimeRef.current = now;
        }
      }

      if (indexUp && pinkyUp && !middleUp && !ringUp) {
        if (now - lastRockTimeRef.current > 3000) {
          console.log('Rock');
          lastRockTimeRef.current = now;
        }
      }

      // Scroll-up: only index finger up
      if (indexUp && !middleUp && !ringUp && !pinkyUp) {
        direction = -1;
      }
      // Scroll-down: all fingers down (fist)
      else {
        const indexDown = !indexUp;
        const middleDown = !middleUp;
        const ringDown = !ringUp;
        const pinkyDown = !pinkyUp;
        if (indexDown && middleDown && ringDown && pinkyDown) {
          direction = 1;
        }
      }
    }
    if (direction !== null) {
      if (!scrollIntervalRef.current) {
        scrollIntervalRef.current = setInterval(() => {
          window.scrollBy(0, direction * 30);
        }, 20);
      }
    } else {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    }

    // Clear canvas (invisible landmarks)
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // Colored sections to visualize scrolling
  const sections = Array.from({ length: 20 }, (_, i) => (
    <div
      key={i}
      style={{
        height: 200,
        backgroundColor: i % 2 === 0 ? '#add8e6' : '#90ee90',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 24,
      }}
    >
      Section {i + 1}
    </div>
  ));

  return (
    <>
      <div style={{ position: 'relative', width: 640, height: 480, margin: '0 auto' }}>
        <Webcam
          ref={webcamRef}
          audio={false}
          videoConstraints={{ width: 640, height: 480, facingMode: 'user' }}
          style={{ display: 'none', visibility: 'hidden' }}
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          style={{ position: 'absolute', left: 0, top: 0, width: 640, height: 480, backgroundColor: 'transparent' }}
        />
      </div>
      <div>{sections}</div>
    </>
  );
}
