import { useState, useEffect, useMemo } from "react";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import { FaEye, FaQrcode } from "react-icons/fa";
import Loader from "../utils/Loader";
import api from "../../Services/Interceptors";
import { useToken } from "../../tokenContext";

function InvoiceList() {
    const { token } = useToken() as { token: string };
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [loadingPdf, setLoadingPdf] = useState(null);
  const [loadingQr, setLoadingQr] = useState(null);

  const handleViewPdf = async (invoiceNumber:any) => {
    try {
        setLoadingPdf(invoiceNumber);
        const response = await api.get(`/v1/bills/download-pdf/${invoiceNumber}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            responseType: "json", 
        });

        if (response.status !== 200) {
            throw new Error("Error al descargar el PDF");
        }

        const pdfData = response.data.data.pdf_base_64_encoded;

        const byteCharacters = atob(pdfData);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });

        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un error al descargar el PDF");
    } finally {
        setLoadingPdf(null);
    }
};

const handleViewQr = async (invoiceNumber:any) => {
  try {
      setLoadingQr(invoiceNumber);
      const response = await api.get(`/v1/bills/show/${invoiceNumber}`, {
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
          },
      });

      if (response.status !== 200) {
          throw new Error("Error al obtener los detalles de la factura");
      }

      const qrUrl = response.data.data.bill.qr;
      window.open(qrUrl, "_blank");
  } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al obtener el QR");
  } finally {
      setLoadingQr(null);
  }
};
  const fetchInvoices = async (page = 1, filters = {}) => {
    const params = {
      page,
      ...filters,
    };  
    const response = await api.get(`/v1/bills`, {
       params,
       headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      });
    return response.data.data;
  };

  const columns = useMemo(
    () => [
      { Header: "Número", accessor: "number" },
      { Header: "Cliente", accessor: "names" },
      { Header: "Identificación", accessor: "identification" },
      { Header: "Total", accessor: "total" },
      { Header: "Fecha", accessor: "created_at" },
      {
        Header: "Acciones",
        accessor: "actions",
        Cell: ({ row }: { row: any }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => handleViewPdf(row.original.number)}
              className="text-blue-500 hover:text-blue-700"
              disabled={loadingPdf === row.original.number}
            >
              {loadingPdf === row.original.number ? (
                <Loader />
              ) : (
                <FaEye size={20} />
              )}
            </button>
            <button
              onClick={() => handleViewQr(row.original.number)}
              className="text-green-500 hover:text-green-700"
              disabled={loadingQr === row.original.number}
            >
              {loadingQr === row.original.number ? (
                <Loader />
              ) : (
                <FaQrcode size={20} />
              )}
            </button>
          </div>
        ),
      },
    ],
    [loadingPdf, loadingQr]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    page,
    setPageSize,
    canPreviousPage,
    state: { pageIndex, pageSize, globalFilter },
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
      manualPagination: true,
      pageCount,
    },
    useGlobalFilter,
    usePagination
  );

   useEffect(() => {
      if (!token) {
          window.location.href = '/refresh-token';
      }
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await fetchInvoices(pageIndex + 1, pageSize);
      setData(result.data);
      setPageCount(result.pagination.last_page);
      setLoading(false);
    };

    fetchData();
  }, [pageIndex, pageSize]);

  

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="text"
          value={globalFilter || ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar..."
          className="px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table
              {...getTableProps()}
              className="min-w-full bg-white border border-gray-200"
            >
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps()}
                        className="px-4 py-2 text-sm font-semibold text-left text-gray-700 bg-gray-100 border-b border-gray-200"
                        key={column.id}
                      >
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row:any) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} className="hover:bg-gray-50" key={row.id}>
                      {row.cells.map((cell:any) => (
                        <td
                          {...cell.getCellProps()}
                          className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200"
                          key={cell.column.id}
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div>
              <button
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
                className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => nextPage()}
                disabled={!canNextPage}
                className="px-4 py-2 ml-2 bg-gray-200 rounded-md disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
            <div>
              <span>
                Página{" "}
                <strong>
                  {pageIndex + 1} de {pageOptions.length}
                </strong>
              </span>
            </div>
            <div>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                }}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                {[10, 20, 30, 40, 50].map((size) => (
                  <option key={size} value={size}>
                    Mostrar {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default InvoiceList;