import React, { useState, useRef, useEffect } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import Modal from '../components/Modal.jsx';

const SupplierScreen = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [pendingImport, setPendingImport] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [showClearModal, setShowClearModal] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch(" https://hyperemic-kimi-overdeliciously.ngrok-free.dev/api/SupplierData");
      if (response.status === 200) {
        const res = await response.json();
        const transformed = res.data.map((item) => ({
          Supplier_ID: item.sup_id,
          Supplier_Name: item.sup_Name,
          Contact_Name: item.name,
          Contact_Phone: item.phone,
          Contact_Email: item.email,
          Address: item.address,
          City: item.city,
          State: item.state,
          Postal_Code: item.postal_code,
          Country: item.country,
          Tax_Identification: item.tax_id,
          Created_Date: new Date().toISOString().split("T")[0],
          Error_Msg: item.error_msg
        }));
        setSuppliers(transformed);
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const handleClearAll = async () => {
    try {
      const response = await fetch(" https://hyperemic-kimi-overdeliciously.ngrok-free.dev/api/deletesuppliers", {
        method: "DELETE"
      });
      if (response.ok) {
        setSuppliers([]);
        alert("All data cleared!");
      } else {
        alert("Failed to clear data.");
      }
    } catch (err) {
      alert("Error clearing data: " + err);
    }
    setShowClearModal(false);
    setClearConfirmOpen(false);
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Suppliers");

    if(suppliers.length === 0) return;

    worksheet.columns = Object.keys(suppliers[0]).map((key) => ({
      header: key,
      key,
      width: 20,
    }));

    suppliers.forEach((s) => worksheet.addRow(s));

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "suppliers.xlsx");
  };

  const exportToCSV = () => {
    const csv = Papa.unparse(suppliers);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "suppliers.csv");
  };

  const handleFileSelect = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const ext = file.name.split(".").pop()?.toLowerCase();

    let importedData = [];

    if (ext === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          importedData = results.data;
          setPendingImport(importedData);

          if (suppliers.length > 0) {
            setClearConfirmOpen(true);
          } else {
            setShowConfirm(true);
          }
        },
      });
    } else if (ext === "xlsx" || ext === "xls") {
      const buffer = await file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);

      const worksheet = workbook.worksheets[0];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const rowData = {
          Supplier_ID: Number(row.getCell(1).value),
          Supplier_Name: String(row.getCell(2).value || ""),
          Contact_Name: String(row.getCell(3).value || ""),
          Contact_Phone: String(row.getCell(4).value || ""),
          Contact_Email: String(row.getCell(5).value || ""),
          Address: String(row.getCell(6).value || ""),
          City: String(row.getCell(7).value || ""),
          State: String(row.getCell(8).value || ""),
          Postal_Code: String(row.getCell(9).value || ""),
          Country: String(row.getCell(10).value || ""),
          Tax_Identification: String(row.getCell(11).value || ""),
          Created_Date: String(row.getCell(12).value || ""),
          Error_Msg: String(row.getCell(13).value || "")
        };
        importedData.push(rowData);
      });

      setPendingImport(importedData);

      if (suppliers.length > 0) {
        setClearConfirmOpen(true);
      } else {
        setShowConfirm(true);
      }
    } else {
      alert("Unsupported file type. Please select CSV or Excel file.");
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const proceedImport = async (clearExisting) => {
    if (!pendingImport) return;

    try {
      if (clearExisting) {
        const clearResp = await fetch(" https://hyperemic-kimi-overdeliciously.ngrok-free.dev/api/deletesuppliers", {
          method: "DELETE"
        });
        if (!clearResp.ok) {
          alert("Failed to clear existing data.");
          return;
        }
        setSuppliers([]);
      }

      const csv = Papa.unparse(pendingImport);
      const blob = new Blob([csv], { type: "text/csv" });
      const formData = new FormData();
      formData.append("file", blob, "suppliers.csv");

      const response = await fetch(" https://hyperemic-kimi-overdeliciously.ngrok-free.dev/api/importcsv", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to upload CSV");
      }

      alert("File imported successfully!");

      await fetchSuppliers();

      setPendingImport(null);
      setShowConfirm(false);
      setClearConfirmOpen(false);
    } catch (error) {
      alert("Import failed: " + error.message);
    }
  };

  const cancelImport = () => {
    setPendingImport(null);
    setShowConfirm(false);
    setClearConfirmOpen(false);
  };

  const displayedData = pendingImport || suppliers;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Supplier Table</h1>

      <div className="mb-4 space-x-4">
        <button
          onClick={exportToExcel}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Export to Excel
        </button>
        <button
          onClick={exportToCSV}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Export to CSV
        </button>
        <button
          onClick={() => setShowClearModal(true)}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Clear All Data
        </button>

        <Modal
          open={showClearModal}
          onClose={() => setShowClearModal(false)}
          onConfirm={handleClearAll}
          title="Confirm Clear All Data"
        >
          <p>Do you want to clear all data from the table? This action cannot be undone.</p>
        </Modal>

        <Modal
          open={clearConfirmOpen}
          onClose={() => setClearConfirmOpen(false)}
          title="Import Options"
          onConfirm={() => proceedImport(true)}
        >
          <p>Do you want to clear existing data before import? Click 'Clear & Import' to clear, 'Append Import' to append or 'Cancel' to abort.</p>
          <div className="mt-4 flex space-x-4">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => proceedImport(true)}
            >
              Clear & Import
            </button>
            <button
              className="bg-yellow-600 text-white px-4 py-2 rounded"
              onClick={() => proceedImport(false)}
            >
              Append Import
            </button>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded"
              onClick={cancelImport}
            >
              Cancel
            </button>
          </div>
        </Modal>

        <label
          htmlFor="fileImport"
          className="cursor-pointer bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition"
        >
          Import File
        </label>
        <input
          type="file"
          id="fileImport"
          accept=".csv, .xlsx, .xls"
          onChange={handleFileSelect}
          ref={fileInputRef}
          className="hidden"
        />

        {showConfirm && (
          <>
            <button
              onClick={() => proceedImport(false)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              Confirm Import
            </button>
            <button
              onClick={cancelImport}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Cancel Import
            </button>
          </>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              {suppliers.length > 0 && Object.keys(suppliers[0]).map((key) => (
                <th key={key} className="border border-gray-300 px-3 py-2">
                  {key.replace(/_/g, " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedData.map((supplier) => (
              <tr key={supplier.Supplier_ID} className="odd:bg-white even:bg-gray-50">
                {Object.values(supplier).map((val, idx) => (
                  <td key={idx} className="border border-gray-300 px-3 py-2">
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierScreen;
