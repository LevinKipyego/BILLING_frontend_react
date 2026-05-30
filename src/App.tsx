import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppVendor from "./vendor/AppVendor";

export default function App() {
  return (

    
    <Router>
      
      <Routes>


        {/* Vendor Routes  */}
        <Route path="/vendor/*" element={<AppVendor />} />
      
          {/* PPPoE Portal */}
        

        

      </Routes>
      
    </Router>
  );
}