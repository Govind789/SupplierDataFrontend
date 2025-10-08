


const SupplierTable = ({ suppliers }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full border border-gray-300">
      <thead className="bg-gray-200 sticky top-0">
        <tr>
          {suppliers.length > 0 && Object.keys(suppliers[0]).map((key) => (
            <th key={key} className="border border-gray-300 px-3 py-2">
              {key.replace(/_/g, " ")}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {suppliers.map((supplier) => (
          <tr key={supplier.Supplier_ID} className="odd:bg-white even:bg-gray-50 hover:bg-yellow-50">
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
);

export default SupplierTable;
