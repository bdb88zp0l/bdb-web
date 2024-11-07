/**
 * A reusable React component that renders a modal dialog.
 *
 * @param {object} props - The component props.
 * @param {boolean} props.isOpen - Indicates whether the modal should be open or closed.
 * @param {function} props.close - A callback function to close the modal.
 * @param {React.ReactNode} props.children - The content to be displayed inside the modal.
 * @returns {React.ReactElement} The rendered modal component.
 */
import { userPrivateRequest } from "@/config/axios.config";
import ButtonSpinner from "@/shared/layout-components/loader/ButtonSpinner";
import Modal from "@/shared/modals/Modal";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import Link from "next/link";
const Select = dynamic(() => import("react-select"), { ssr: false });

const NoFileFolder = () => {
  return (
    <>
      <div className="col-span-12" key={Math.random()}>
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex space-x-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4V7C12 7.553 12.447 8 13 8H16L20 12V20C20 20.553 19.553 21 19 21H5C4.447 21 4 20.553 4 20V4C4 3.447 4.447 3 5 3H11C11.553 3 12 3.447 12 4Z"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 7H21V21H3V7Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 3H19V8H5V3Z"
              />
            </svg>
          </div>
          <p className="text-lg text-gray-700 mt-4">
            No files or folder available!
          </p>
        </div>
      </div>
    </>
  );
};

export default NoFileFolder;
