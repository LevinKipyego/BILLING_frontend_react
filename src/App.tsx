import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppVendor from "./vendor/AppVendor";
import AppPortal from "./portal/AppPortal";
export default function App() {
  return (

    
    <Router>
      
      <Routes>


        {/* Vendor Routes  */}
        <Route path="/vendor/*" element={<AppVendor />} />
      
          {/* PPPoE Portal */}
        <Route path="/portal/*" element={<AppPortal />} />

        

      </Routes>
      
    </Router>
  );
}