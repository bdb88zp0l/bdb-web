/**
 * A reusable React component that renders a modal dialog.
 *
 * @param {object} props - The component props.
 * @param {boolean} props.isOpen - Indicates whether the modal should be open or closed.
 * @param {function} props.close - A callback function to close the modal.
 * @param {React.ReactNode} props.children - The content to be displayed inside the modal.
 * @returns {React.ReactElement} The rendered modal component.
 */
import React, { useState, useEffect } from "react";

const Modal = ({ isOpen, close, children }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    }
  }, [isOpen]);

  const handleTransitionEnd = () => {
    if (!isOpen) {
      setShouldRender(false);
    }
  };

  return (
    shouldRender && (
      <div
        className={`fixed inset-0 ti-modal ${
          isOpen ? "opacity-100 open opened" : "opacity-0 pointer-events-none"
        }`}
        style={{
          transition: "opacity 300ms",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        onTransitionEnd={handleTransitionEnd}
        // onClick={close}
        // onClick={(e) => e.stopPropagation()}
      >
        {/* <div
          className="w-full max-w-md p-5 bg-white rounded shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
        </div> */}

        {children}
      </div>
    )
  );
};

export default Modal;
