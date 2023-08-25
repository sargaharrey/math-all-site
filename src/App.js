import './App.css';
import Graph from './pages/graph-page';
import Math from './pages/math-page';
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Switch } from 'react-router-dom';


function App() {
 
  const [theme, setTheme] = useState('light')
  return (

    <BrowserRouter>
    <div className={`App ${theme}`}>
      <Routes>
        
        <Route exact path="/" element={<Math setTheme={setTheme} theme={theme} />}/>
          <Route path="/graph" element={<Graph setTheme={setTheme} theme={theme} />}/>
          
    </Routes>
    </div>
</BrowserRouter>
  );
}

export default App;
