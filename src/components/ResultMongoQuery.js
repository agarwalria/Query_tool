import React from "react";
import { Button } from "reactstrap";

const ResultMongoQuery = ({ result }) => {
  const handleDownloadJSON = () => {
    const json = JSON.stringify(result, null, 2);
    const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", "query_result.json");
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{marginTop:"0.8rem"}}>
        <h3>Query Result</h3>
      {result !== null ? (
        <div>
            <Button color="primary" className='mt-3 mb-3' onClick={handleDownloadJSON}>
            Download JSON
          </Button>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      ) : (
        <h5>No data to display</h5>
      )}
    </div>
  );
};

export default ResultMongoQuery;
