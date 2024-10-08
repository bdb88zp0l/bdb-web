import { userPrivateRequest } from "@/config/axios.config";
import { useState, useEffect, useRef } from "react";
import DOMPurify from "dompurify"; // Make sure you have this library installed

const highlightSVGContent = (svgContent: any, searchTerm: string) => {
  if (!searchTerm) return svgContent;

  // Sanitize the SVG content before parsing
  const cleanSVGContent = DOMPurify.sanitize(svgContent);

  // try {
    const parser = new DOMParser();
    const svgDocument = parser.parseFromString(
      cleanSVGContent,
      "image/svg+xml"
    );

    const textElements = svgDocument.querySelectorAll("text");

    // Convert the search term to lowercase
    const search = searchTerm.toLowerCase();

    textElements.forEach((textElement) => {
      // Convert the text content of the SVG to lowercase
      const text = textElement.textContent?.toLowerCase() || "";

      // Check if the text includes the search term
      if (text.includes(search)) {
        // Get the attributes required to draw the rectangle (highlight box)
        const highlightRect = svgDocument.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        const x = textElement.getAttribute("x");
        const y = textElement.getAttribute("y");
        const height = textElement.getAttribute("font-size");
        const width = textElement.getAttribute("textLength");

        // Set attributes for the rectangle to highlight the text
        highlightRect.setAttribute("x", x);
        highlightRect.setAttribute(
          "y",
          (Number(y) - Number(height)).toString()
        );
        highlightRect.setAttribute("width", width);
        highlightRect.setAttribute("height", height);
        highlightRect.setAttribute("fill", "yellow");
        highlightRect.setAttribute("opacity", "0.5");

        // Insert the highlight rectangle before the text element in the SVG
        textElement.parentNode.insertBefore(highlightRect, textElement);
      }
    });

    // Serialize the modified SVG back to a string
    return new XMLSerializer().serializeToString(svgDocument);
  // } catch (error) {
  //   console.error("Error parsing SVG:", error);
  //   return svgContent; // Return the original content if parsing fails
  // }
};


export const useProtectedSVG = (
  url: string | null,
  fallback_url: string | null,
  type: string | null,
  searchTerm: string | null
) => {
  const [svg, setSVG] = useState("");
  const [result, setResult] = useState({
    is_loading: true,
    error: null,
    data: null,
  });
  const ref = useRef<any>(null);

  useEffect(() => {
    if (!url) {
      return setResult({ is_loading: false, error: "URL is null", data: null });
    }

    let id = url.split("/")[3] ?? "";
    let imageType = url.split("/")[4] ?? "jpg";

    userPrivateRequest
      .get(`/api/file/getPage/${id}/${imageType}`, {
        responseType: imageType === "svg" ? "text" : "arraybuffer",
        ...(imageType === "svg" && { headers: { Accept: "image/svg+xml" } }),
      })
      .then((res) => {
        if (imageType === "svg") {
          // Apply highlight only for SVG content
          const highlightedSVG = highlightSVGContent(res.data, searchTerm);
          setSVG(highlightedSVG);
          setResult({
            is_loading: false,
            error: null,
            data: <div ref={ref}></div>, // Render SVG in the container
          });
        } else {
          // For non-SVG types, handle image as base64
          const encodedImage = imageEncode(res.data, "image/jpeg");
          setResult({
            is_loading: false,
            error: null,
            data: <img src={encodedImage} alt="" />,
          });
        }
      })
      .catch(() => {
        if (fallback_url) {
          fetchImage(fallback_url, type, "image/jpeg", setSVG, setResult);
        }
      });
  }, [url]);

  // Render the updated SVG inside the ref container
  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = svg;
    }
  }, [svg]);

  return result;
};

export const useProtectedJpg = (url: string, type: string) => {
  const [result, setResult] = useState({
    is_loading: true,
    error: null,
    data: null,
  });

  useEffect(() => {
    if (!url) {
      return setResult({ is_loading: false, error: "URL is null", data: null });
    }
    fetchImage(url, type, "image/jpeg", () => {}, setResult);
  }, [url]);

  return result;
};

function fetchImage(
  url: string,
  type: string,
  mimeType: any,
  setBase: any,
  setResult: any
) {
  if (type === "page") {
    let id = url.split("/")[3] ?? "";
    let imageType = url.split("/")[4] ?? "jpg";
    userPrivateRequest
      .get(`/api/file/getPage/${id}/${imageType}`, {
        responseType: imageType === "svg" ? "text" : "arraybuffer",
        ...(imageType === "svg" && { headers: { Accept: "image/svg+xml" } }),
      })
      .then((res) => {
        const encodedImage = imageEncode(res.data, mimeType);
        setBase(encodedImage);
        setResult({
          is_loading: false,
          error: null,
          data: <img className="w-full" src={encodedImage} alt="" />,
        });
      })
      .catch((error) => {
        setResult({
          is_loading: false,
          error: error.response
            ? `${error.response.status} ${error.response.statusText}`
            : error.message,
          data: null,
        });
      });
  } else {
    let id = url.split("/")[3] ?? "";
    userPrivateRequest
      .get(`/api/file/getThumbnail/${id}`, { responseType: "arraybuffer" })
      .then((res) => {
        const encodedImage = imageEncode(res.data, mimeType);
        setBase(encodedImage);
        setResult({
          is_loading: false,
          error: null,
          data: <img src={encodedImage} alt="" />,
        });
      })
      .catch((error) => {
        setResult({
          is_loading: false,
          error: error.response
            ? `${error.response.status} ${error.response.statusText}`
            : error.message,
          data: null,
        });
      });
  }
}

function imageEncode(arrayBuffer: any, mimeType: any) {
  return `data:${mimeType};base64,${window.btoa(
    String.fromCharCode(...new Uint8Array(arrayBuffer))
  )}`;
}
