import React, { useEffect, useState } from "react";
import PageView from "./PageView";
const PagePanel = ({ toggleThumbnail, selectedThumbnail, data, search }) => {
  const MIN_SCALE = 20;
  const MAX_SCALE = 100;
  const [scale, setScale] = useState(50);
  const [isOpen, setIsOpen] = useState(false);
  const toggleThumbnails = () => {
    setIsOpen(!isOpen);
  };

  const zoomIn = () => {
    setScale((prevScale) => Math.min(prevScale * 1.2, MAX_SCALE));
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale / 1.2, MIN_SCALE));
  };

  const handleScrollToPage = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const resetZoom = () => {
    setScale(50);
  };

  useEffect(() => {
    if (selectedThumbnail != null) {
      handleScrollToPage(`page-${selectedThumbnail}`);
    }
  }, [selectedThumbnail]);

  return (
    <div className="bg-[#535353] w-full h-[80vh] box-border flex flex-col relative overflow-hidden">
      <div
        className="h-10 w-10 text-white cursor-pointer absolute top-4 left-4 z-10"
        onClick={toggleThumbnail}
      >
        <div onClick={toggleThumbnails}>
          <i
            className={`text-2xl ${
              isOpen ? "ri-arrow-right-line" : "ri-arrow-left-line"
            }`}
          ></i>
        </div>
      </div>

      <div className="flex-1 overflow-auto flex flex-col items-center justify-start gap-4 relative ml-12">
        {/* mt-12 */}
        <div className="mt-12 flex flex-col items-center justify-start gap-4 pb-8 w-full py-6">
          {data?.pages?.map((page, i) => (
            <PageView page={page} id={i} scale={scale} search={search} />
          ))}
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 gap-3 flex items-center">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={zoomIn}
        >
          <i className="ri-add-circle-line"></i>
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={zoomOut}
        >
          <i className="ri-indeterminate-circle-line"></i>
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={resetZoom}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default PagePanel;
