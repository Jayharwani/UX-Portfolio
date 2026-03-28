import { BrowserRouter as Router, Routes, Route } from "react-router";
import { HomePage } from "./components/HomePage";
import { SmartDrivePage } from "./components/SmartDrivePage";
import { BumperCasePage } from "./components/BumperCasePage";
import { ChronoWeavePage } from "./components/ChronoWeavePage";
import { AboutPage } from "./components/AboutPage";
import { ScrollToTop } from "./components/ScrollToTop";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen antialiased" style={{ backgroundColor: '#0A0A0A' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/smartdrive" element={<SmartDrivePage />} />
          <Route path="/bumper" element={<BumperCasePage />} />
          <Route path="/chronoweave" element={<ChronoWeavePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
    </Router>
  );
}
