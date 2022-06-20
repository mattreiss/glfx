import {useRef} from 'react';
import logo from './logo.svg';
import './App.css';
import { Canvas } from '@mattreiss/glfx';

function App() {
  const imgRef = useRef();
  const canvasRef = useRef();
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
        <Canvas 
          width={300} 
          height={300} 
          image={imgRef.current} 
          innerRef={canvasRef}/>
      </header>
    </div>
  );
}

export default App;
