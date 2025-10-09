import React, { useState } from "react";

const initialFormData = {
  Supplier_Name: "",
  Contact_Name: "",
  Contact_Phone: "",
  Contact_Email: "",
  Address: "",
  City: "",
  State: "",
  Postal_Code: "",
  Country: "",
  Tax_Identification: "",
};

const SupplierForm = ({ onSubmit, errors }) => {
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(initialFormData);
  };

  return (
  <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
    <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Supplier Form</h2>

    {errors && errors.length > 0 && (
      <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <h3 className="font-semibold mb-2">Errors found:</h3>
        <ul className="list-disc pl-5">
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
      </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Supplier Name */}
      <div>
        <label htmlFor="Supplier_Name" className="block mb-2 font-semibold text-gray-700">
          Supplier Name <span className="text-red-600">*</span>
        </label>
        <input
          id="Supplier_Name"
          name="Supplier_Name"
          type="text"
          required
          value={formData.Supplier_Name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="Enter Supplier Name"
        />
      </div>

      {/* Contact Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <label htmlFor="Contact_Name" className="block mb-2 font-semibold text-gray-700">
            Contact Name
          </label>
          <input
            id="Contact_Name"
            name="Contact_Name"
            type="text"
            value={formData.Contact_Name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Enter Contact Name"
          />
        </div>
        <div>
          <label htmlFor="Contact_Phone" className="block mb-2 font-semibold text-gray-700">
            Contact Phone
          </label>
          <input
            id="Contact_Phone"
            name="Contact_Phone"
            type="tel"
            value={formData.Contact_Phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Enter Phone Number"
          />
        </div>
        <div>
          <label htmlFor="Contact_Email" className="block mb-2 font-semibold text-gray-700">
            Contact Email
          </label>
          <input
            id="Contact_Email"
            name="Contact_Email"
            type="email"
            value={formData.Contact_Email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Enter Email Address"
          />
        </div>
        <div>
          <label htmlFor="Tax_Identification" className="block mb-2 font-semibold text-gray-700">
            Tax Identification
          </label>
          <input
            id="Tax_Identification"
            name="Tax_Identification"
            type="text"
            value={formData.Tax_Identification}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Enter Tax ID"
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <label htmlFor="Address" className="block mb-2 font-semibold text-gray-700">
          Address
        </label>
        <textarea
          id="Address"
          name="Address"
          rows={3}
          value={formData.Address}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="Enter Supplier Address"
        />
      </div>

      {/* Location Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
        <div>
          <label htmlFor="City" className="block mb-2 font-semibold text-gray-700">
            City
          </label>
          <input
            id="City"
            name="City"
            type="text"
            value={formData.City}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="City"
          />
        </div>
        <div>
          <label htmlFor="State" className="block mb-2 font-semibold text-gray-700">
            State
          </label>
          <input
            id="State"
            name="State"
            type="text"
            value={formData.State}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="State"
          />
        </div>
        <div>
          <label htmlFor="Postal_Code" className="block mb-2 font-semibold text-gray-700">
            Postal Code
          </label>
          <input
            id="Postal_Code"
            name="Postal_Code"
            type="text"
            value={formData.Postal_Code}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Postal Code"
          />
        </div>
        <div>
          <label htmlFor="Country" className="block mb-2 font-semibold text-gray-700">
            Country
          </label>
          <input
            id="Country"
            name="Country"
            type="text"
            value={formData.Country}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Country"
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold text-gray-700 invisible">Placeholder</label>
          <div />
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition"
      >
        Save Supplier
      </button>
    </form>
  </div>
);

};

const SupplierFormContainer = () => {
  const [errors, setErrors] = useState([]);

  const parseOracleError = (errorMessage) => {
    // Remove "Errors found:" prefix and any leading/trailing whitespace
    const cleanMessage = errorMessage.replace(/Errors found:/i, "").trim();

    // Split by semicolon and remove empty entries and leading colons/spaces
    const errorList = cleanMessage
      .split(";")
      .map((e) => e.trim().replace(/^:?\s*/, "")) // Remove any leading ':' and spaces
      .filter((e) => e.length > 0);

    return errorList.length > 0 ? errorList : [errorMessage];
  };

  const submitSupplierData = async (formData) => {
    setErrors([]);
    try {
      const response = await fetch("http://localhost:5276/api/submitForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData.error || errorData.message || "Unknown error occurred";
        const parsedErrors = parseOracleError(message);
        setErrors(parsedErrors);
        return;
      }

      const result = await response.json();
      alert("Supplier saved successfully");
      console.log("Response from server:", result);
    } catch (error) {
      setErrors([error.message || "Network or server error occurred"]);
      console.error("Error submitting form:", error);
    }
  };

  return <SupplierForm onSubmit={submitSupplierData} errors={errors} />;
};

export default SupplierFormContainer;
