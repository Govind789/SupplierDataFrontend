import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import SupplierScreen from "./screen/SupplierScreen";
import SupplierForm from "./screen/SupplierForm"; // Import your form component
import HomePage from "./screen/HomePage";

function App() {
  return (
    <Router>
      <Header />
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/suppliers" element={<SupplierScreen />} />
          <Route
            path="/supplier-form"
            element={<SupplierForm onSubmit={(data) => console.log(data)} />}
          />
          <Route path="*" element={<Navigate to="/suppliers" replace />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
