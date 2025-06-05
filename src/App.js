// App.js
import { Route, Routes, useLocation } from "react-router-dom";
import Base from './components/Homepage/Base';
import Project from "./components/Projects/Project";
import { AnimatePresence } from "framer-motion";
import Test from './components/Projects/Test'
import Fork from "./components/Projects/Fork/Fork";
import FaceScan from "./components/Trial/FaceScan";
function App() {
  const location = useLocation();
  return (
    <>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route index element={<Base />} />
            <Route path="/project" element={<Project />} />
            <Route index element={<Base />} />
            <Route path="/project" element={<Project />} />
            <Route path="/test" element={<Test />} />
            <Route path="/List" element={<Fork />} />
            <Route path="/Face" element={<FaceScan />} />
          </Routes>
        </AnimatePresence>
    </>
  );
}

export default App;
