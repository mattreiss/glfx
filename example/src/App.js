import {useEffect, useRef, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import { Canvas } from '@mattreiss/glfx';

function App() {
  const imgRef = useRef();
  const canvasRef = useRef();

  const [img, setImg] = useState(null);

  useEffect(() => {
    let i = document.createElement('img');
    i.onload = () => {
      const canvas = document.createElement("canvas");
      const { width, height } = i;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(i, 0, 0);
      setImg(canvas);
    };
    i.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII';
  }, []);

  const width = 300;
  const height = 300;

  return (
    <div className="App">
      <header className="App-header">
        <img ref={imgRef} src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        {img && (
          <Canvas 
            width={width} 
            height={height} 
            image={img} 
            innerRef={canvasRef}
            onChange={() => console.log('change')}
            effects={[
              {
                  // denoise: {
                  //     exponent: 1,
                  // }
              }, {
                  // noise: {
                  //     amount: 0.5,
                  // }
              }, {
                  // hueSaturation: {
                  //     hue: 0,
                  //     saturation: 0.9,
                  // }
              }, {
              //     vibrance: {
              //       amount: 0.9,
              //     }
              }, {
              //     sepia: {
              //         amount: 0.1
              //     }
              }, {
                  swirl: {
                      center: [ width / 2, height / 2 ],
                      radius: width / 2,
                      angle: -Math.PI * 2,
                  }
              }, {
                  // curves: {
                  //     red: [[0,1], [1, 1]],
                  //     green: [[0,0.2], [1,1]],
                  //     blue: [[0,1], [0.5,0.7], [1,1]],
                  // }
              }, {
                  // brightnessContrast: {
                  //     brightness:  -0.4,
                  //     contrast:  0.8,
                  // }
              }
          ]}
          />
        )}
      </header>
    </div>
  );
}

export default App;
