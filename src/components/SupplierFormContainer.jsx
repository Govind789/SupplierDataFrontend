// import SupplierForm from "../screen/SupplierForm"; // Assuming you import SupplierForm from separate file
import React, { useState, useEffect } from "react";

const SupplierFormContainer = () => {
  const [errors, setErrors] = useState([]);
  const [maxSupplierId, setMaxSupplierId] = useState(0);

  // Fetch max Supplier_ID from backend on mount
  useEffect(() => {
    const fetchMaxSupplierId = async () => {
      try {
        const response = await fetch("https://supplierdata.runasp.net/api/SupplierData");
        if (response.ok) {
          const data = await response.json();
          const maxId = data.data.length
            ? data.data.reduce((max, item) => (item.sup_id > max ? item.sup_id : max), 0)
            : 0;
          setMaxSupplierId(maxId);
        }
      } catch (err) {
        console.error("Failed to fetch max Supplier_ID", err);
      }
    };
    fetchMaxSupplierId();
  }, []);

  const parseOracleError = (errorMessage) => {
    const cleanMessage = errorMessage.replace(/Errors found:/i, "").trim();
    const errorList = cleanMessage
      .split(";")
      .map((e) => e.trim().replace(/^:?\s*/, ""))
      .filter((e) => e.length > 0);
    return errorList.length > 0 ? errorList : [errorMessage];
  };

  const submitSupplierData = async (formData) => {
    setErrors([]);

    // Assign Supplier_ID: 1 if no max, else max + 1
    const assignedSupplierId = maxSupplierId < 1 ? 1 : maxSupplierId + 1;

    // Inject Supplier_ID into formData
    const dataToSend = {
      Supplier_ID: assignedSupplierId,
      ...formData,
    };

    try {
      const response = await fetch("https://supplierdata.runasp.net/api/submitForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
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

      // Update maxSupplierId to latest used
      setMaxSupplierId(assignedSupplierId);

      console.log("Response from server:", result);
    } catch (error) {
      setErrors([error.message || "Network or server error occurred"]);
      console.error("Error submitting form:", error);
    }
  };

  return <SupplierForm onSubmit={submitSupplierData} errors={errors} />;
};

export default SupplierFormContainer;
