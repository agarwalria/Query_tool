import React from "react";
import { Table, Button } from "reactstrap";
import Papa from "papaparse";

const ResultSqlQuery = ({ result }) => {
  const handleDownloadCSV = () => {
    if (Array.isArray(result) && result.length > 0) {
      const csv = Papa.unparse(result);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute("download", "query_result.csv");
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div style={{marginTop : "0.8rem"}}>
        <h3>Query Result</h3>
      {result !== null ? (
        Array.isArray(result) && result.length > 0 ? (
          <>
          <Button color="primary" className="mb-3 mt-3" onClick={handleDownloadCSV}>
              Download CSV
            </Button>
            <Table striped bordered>
              <thead>
                <tr>
                  {Object.keys(result[0]).map((columnName) => (
                    <th key={columnName}>{columnName}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, colIndex) => (
                      <td key={colIndex}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
            
          </>
        ) : (
          <div>
            <h5> No data to display</h5>
            {/* {Object.entries(result).map(([key, value]) => (
              <p key={key}>
                <strong>{key}:</strong> {value}
              </p>
            ))} */}
          </div>
        )
      ) : (
        <h5> No data to display</h5>
      )}
    </div>
  );
};

export default ResultSqlQuery;
