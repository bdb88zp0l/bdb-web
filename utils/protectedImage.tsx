import { userPrivateRequest } from "@/config/axios.config";
import { useState, useEffect, useRef } from "react";
import DOMPurify from "dompurify"; // Make sure you have this library installed

const highlightSVGContent = (svgContent: any, searchTerm: string) => {
  if (!searchTerm) return svgContent;
  // Sanitize the SVG content before parsing
  const cleanSVGContent = DOMPurify.sanitize(svgContent);

  // Sanitize the SVG content before parsing
  const parser = new DOMParser();
  const svgDocument = parser.parseFromString(cleanSVGContent, "image/svg+xml");

  const textElements = Array.from(svgDocument.querySelectorAll("text"));

  // Convert the search term to lowercase and split into words
  const search = searchTerm.toLowerCase().split(" ");

  // A helper function to get the position of the text element
  const getPositionAttributes = (textElement: Element) => {
    const x = textElement.getAttribute("x");
    const y = textElement.getAttribute("y");
    const height = textElement.getAttribute("font-size");
    const width = textElement.getAttribute("textLength");
    return { x, y, height, width };
  };

  // Iterate through the text elements and match the search term word by word
  let matchedNodes: Element[] = [];
  let currentWordIndex = 0;

  textElements.forEach((textElement, index) => {
    const text = textElement.textContent?.toLowerCase().trim() || "";
    console.log("text", text);

    if (text.includes(search[currentWordIndex])) {
      matchedNodes.push(textElement);
      currentWordIndex++;
    } else {
      // Reset matching if the sequence is broken
      matchedNodes = [];
      currentWordIndex = 0;
    }

    // If all words of the search term have been matched
    if (currentWordIndex === search.length) {
      console.log("Matched the sentence:", searchTerm);

      // Highlight each matched text element
      matchedNodes.forEach((matchedNode) => {
        const { x, y, height, width } = getPositionAttributes(matchedNode);
        const highlightRect = svgDocument.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );

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
        matchedNode.parentNode?.insertBefore(highlightRect, matchedNode);
      });

      // Reset after processing the match
      matchedNodes = [];
      currentWordIndex = 0;
    }
  });

  // Serialize the modified SVG back to a string
  return new XMLSerializer().serializeToString(svgDocument);
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
