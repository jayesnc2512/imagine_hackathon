// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import "./App.css";
// import Home from "./Pages/Home";
// import Legal from "./Pages/Legal";
// import NotFound from "./Pages/NotFound";
// import Appointment from "./Pages/Appointment";
// import SignIn from "./Pages/SignIn";

// function App() {
//   return (
//     <div className="App">
//       <Router basename="/Health-Plus">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/signin" element={<SignIn/>}/>
//           <Route path="/legal" element={<Legal />} />
//           <Route path="/appointment" element={<Appointment />} />
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </Router>
//     </div>
//   );
// }

// export default App;
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import Legal from "./Pages/Legal";
import NotFound from "./Pages/NotFound";
import Appointment from "./Pages/Appointment";
import SignIn from "./Pages/SignIn";
import Profile from "./Pages/Profile";

function App() {
  const [isSignInVisible, setIsSignInVisible] = useState(true);

  return (
    <div className={`App ${isSignInVisible ? "blur" : ""}`}>
      <Router >
        <Routes>
          
      
          <Route path="/" element={<Home setIsSignInVisible={setIsSignInVisible} />} />
              <Route path="/signin" element={<SignIn  setIsSignInVisible={setIsSignInVisible}/>} />
              {/* <Route path="/legal" element={<Legal />} /> */}
              {/* <Route path="/appointment" element={<Appointment />} /> */}
              <Route path="*" element={<NotFound />} />
              <Route path="/profile" element={<Profile />} />
          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
