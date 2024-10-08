import { useProtectedJpg, useProtectedSVG } from "@/utils/protectedImage";
import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify"; // Import DOMPurify to sanitize the SVG

const PageView = ({ page, id, scale, search }) => {
  const { is_loading, data, error } = useProtectedSVG(
    page.svg_url,
    page.jpg_url,
    "page",
    search
  );

  const [sanitizedData, setSanitizedData] = useState("");

  // useEffect(() => {
  //   if (data) {
  //     // Sanitize the SVG content to avoid any parsing errors
  //     const cleanData = DOMPurify.sanitize(data);
  //     setSanitizedData(cleanData);
  //   }
  // }, [data]);
  return (
    <div
      id={`page-${id}`}
      key={id}
      className="pb-4"
      style={{
        width: `${scale}%`,
        transformOrigin: "center",
      }}
    >
      {/* Render the sanitized SVG content */}
      {data}
    </div>
  );
};

export default PageView;
