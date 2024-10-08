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
import { convertToUUID } from "@/utils/utils";
const Select = dynamic(() => import("react-select"), { ssr: false });

const BreadCrumb = ({
  breadcrumbs,
  setParentId,
  setScreen,
  setServiceType,
}: any) => {
  return (
    <>
      <ol className="flex items-center whitespace-nowrap min-w-0 pb-2">
        {breadcrumbs?.map((breadcrumb: any, index: number) => {
          let name = breadcrumb[1];
          let id = breadcrumb[0];

          let isLast = breadcrumbs?.length - 1 <= index;
          return (
            <li className="text-sm">
              <Link
                className={
                  isLast
                    ? "flex items-center text-gray-500 dark:text-[#8c9097] dark:text-white/50 hover:text-primary"
                    : "flex items-center text-primary hover:text-primary dark:text-primary"
                }
                href="#!"
                scroll={false}
                onClick={(e) => {
                  e.preventDefault();
                  setParentId(convertToUUID(id));
                  setScreen("explorer");
                  setServiceType(null);
                }}
              >
                {name === ".home" ? "Home" : name}

                {!isLast && (
                  <svg
                    className="flex-shrink-0 mx-3 overflow-visible h-2.5 w-2.5 text-gray-300 dark:text-white/10 rtl:rotate-180"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 1L10.6869 7.16086C10.8637 7.35239 10.8637 7.64761 10.6869 7.83914L5 14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </Link>
            </li>
          );
        })}
      </ol>
    </>
  );
};

export default BreadCrumb;
