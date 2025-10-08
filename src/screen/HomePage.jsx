import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-6">Welcome to Supplier Management</h1>
      <p className="mb-8 text-lg">Use the links below to view suppliers or add a new supplier.</p>
      <div className="flex justify-center space-x-6">
        <Link
          to="/suppliers"
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          View Suppliers
        </Link>
        <Link
          to="/supplier-form"
          className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Add Supplier
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
