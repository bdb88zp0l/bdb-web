import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic"; // For Next.js, otherwise use lazy import in plain React

// Dynamically import react-json-view to avoid SSR issues
const ReactJson = dynamic(() => import("react-json-view"), { ssr: false });

const JsonPreview = ({ data }) => {
  const [showJson, setShowJson] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Ensure this component only renders on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#f4f4f4",
        padding: "10px",
        borderRadius: "5px",
        margin: "20px auto",
      }}
    >
      <label
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          marginBottom: "10px",
        }}
      >
        <input
          type="checkbox"
          checked={showJson}
          onChange={() => setShowJson(!showJson)}
          style={{ marginRight: "8px" }}
        />
        {showJson ? "Hide legacy information" : "Show legacy information"}
      </label>
      {showJson && isClient && (
        <div style={{ marginTop: "10px" }}>
          <ReactJson
            src={data}
            theme="monokai"
            collapsed={false}
            enableClipboard={true}
          />
        </div>
      )}
    </div>
  );
};

export default JsonPreview;
