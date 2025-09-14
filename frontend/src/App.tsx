import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Shell } from './components/Shell';
import { ConsentDialog } from './components/ConsentDialog';
import { Home } from './pages/Home';
import { Confirm } from './pages/Confirm';
import { About } from './pages/About';

function App() {
  const [consentAccepted, setConsentAccepted] = useState(false);

  const handleConsentAccept = () => {
    setConsentAccepted(true);
  };

  return (
    <Router>
      <div className="App">
        <ConsentDialog 
          open={!consentAccepted} 
          onAccept={handleConsentAccept} 
        />
        
        {consentAccepted && (
          <Shell>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/confirm" element={<Confirm />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </Shell>
        )}
      </div>
    </Router>
  );
}

export default App;

