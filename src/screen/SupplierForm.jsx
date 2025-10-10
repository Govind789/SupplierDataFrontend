import React, { useState, useEffect } from "react";

const initialFormData = {
  Supplier_ID: 1,
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

const SupplierForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState([]);

  // Fetch and set Supplier_ID with max+1 logic
  useEffect(() => {
    const fetchMaxId = async () => {
      try {
        const response = await fetch("http://localhost:5276/api/SupplierData");
        if (response.ok) {
          const { data = [] } = await response.json();
          const maxId = data.length
            ? Math.max(...data.map(d => Number(d.sup_id ?? d.Supplier_ID ?? 0)))
            : 0;
          setFormData(prev => ({
            ...prev,
            Supplier_ID: maxId ? maxId + 1 : 1
          }));
        }
      } catch (_err) {
        setFormData(prev => ({ ...prev, Supplier_ID: 1 }));
      }
    };
    fetchMaxId();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    try {
      const response = await fetch("http://localhost:5276/api/submitForm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorText = await response.text();
        const errorList = errorText.split(";")
          .map(e => e.trim())
          .filter(e => e);
        setErrors(errorList.length ? errorList : [errorText]);
        return;
      }
      await response.json();
      alert("Supplier saved successfully!");
      setFormData(initialFormData);

      // Refresh Supplier_ID for next
      const response2 = await fetch("http://localhost:5276/api/SupplierData");
      if (response2.ok) {
        const { data: data2 = [] } = await response2.json();
        const maxId = data2.length
          ? Math.max(...data2.map(d => Number(d.sup_id ?? d.Supplier_ID ?? 0)))
          : 0;
        setFormData(prev => ({
          ...prev,
          Supplier_ID: maxId ? maxId + 1 : 1
        }));
      }
    } catch (error) {
      setErrors([error.message || "Network or server error occurred"]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Supplier Form</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input type="hidden" name="Supplier_ID" value={formData.Supplier_ID} />

        {/* ... All your input fields ... */}
        {/* Supplier Name */}
        <div>
          <label htmlFor="Supplier_Name" className="block mb-1 font-semibold text-gray-700 text-base">
            Supplier Name <span className="text-red-600">*</span>
          </label>
          <input
            id="Supplier_Name"
            name="Supplier_Name"
            type="text"
            required
            value={formData.Supplier_Name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Enter Supplier Name"
          />
        </div>
        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* All contact info inputs as in your code */}
          <div>
            <label htmlFor="Contact_Name" className="block mb-1 font-semibold text-gray-700 text-sm">
              Contact Name
            </label>
            <input
              id="Contact_Name"
              name="Contact_Name"
              type="text"
              value={formData.Contact_Name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter Contact Name"
            />
          </div>
          <div>
            <label htmlFor="Contact_Phone" className="block mb-1 font-semibold text-gray-700 text-sm">
              Contact Phone
            </label>
            <input
              id="Contact_Phone"
              name="Contact_Phone"
              type="tel"
              value={formData.Contact_Phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter Phone Number"
            />
          </div>
          <div>
            <label htmlFor="Contact_Email" className="block mb-1 font-semibold text-gray-700 text-sm">
              Contact Email
            </label>
            <input
              id="Contact_Email"
              name="Contact_Email"
              type="email"
              value={formData.Contact_Email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter Email Address"
            />
          </div>
          <div>
            <label htmlFor="Tax_Identification" className="block mb-1 font-semibold text-gray-700 text-sm">
              Tax Identification
            </label>
            <input
              id="Tax_Identification"
              name="Tax_Identification"
              type="text"
              value={formData.Tax_Identification}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter Tax ID"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label htmlFor="Address" className="block mb-1 font-semibold text-gray-700 text-base">
            Address
          </label>
          <textarea
            id="Address"
            name="Address"
            rows={2}
            value={formData.Address}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 resize-y max-h-24 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Enter Supplier Address"
          />
        </div>

        {/* Location Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label htmlFor="City" className="block mb-1 font-semibold text-gray-700 text-sm">
              City
            </label>
            <input
              id="City"
              name="City"
              type="text"
              value={formData.City}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="City"
            />
          </div>
          <div>
            <label htmlFor="State" className="block mb-1 font-semibold text-gray-700 text-sm">
              State
            </label>
            <input
              id="State"
              name="State"
              type="text"
              value={formData.State}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="State"
            />
          </div>
          <div>
            <label htmlFor="Postal_Code" className="block mb-1 font-semibold text-gray-700 text-sm">
              Postal Code
            </label>
            <input
              id="Postal_Code"
              name="Postal_Code"
              type="text"
              value={formData.Postal_Code}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Postal Code"
            />
          </div>
          <div>
            <label htmlFor="Country" className="block mb-1 font-semibold text-gray-700 text-sm">
              Country
            </label>
            <input
              id="Country"
              name="Country"
              type="text"
              value={formData.Country}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Country"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
        >
          Save Supplier
        </button>
        {errors.length > 0 && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <h3 className="font-semibold mb-2">Errors</h3>
            <ul className="list-disc pl-5">
              {errors.map((e, idx) =>
                e ? <li key={idx}>{e}</li> : null
              )}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
};

export default SupplierForm;
