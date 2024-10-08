"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useProtectedJpg } from "@/utils/protectedImage";

const FileRow = ({ file }: any) => {
  const protected_image = useProtectedJpg(file.thumbnail_url, "thumbnail");
  return (
    <li className="list-group-item !border-t-0">
      <div className="flex items-center">
        <div className="me-2">
          <span className="avatar !rounded-full p-2 bg-light">
            {/* <img src="../../../assets/images/media/file-manager/1.png" alt="" /> */}
            {protected_image.data}
          </span>
        </div>
        <div className="flex-grow">
          <Link href="#!" scroll={false}>
            <span className="block font-semibold">{file?.title}</span>
          </Link>
          <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem] font-normal">
            {(Number(file?.size ?? 0) / 1000).toFixed(2)} MB
          </span>
        </div>
        <div className="inline-flex">
          {/* <button
            aria-label="button"
            type="button"
            className="ti-btn ti-btn-sm ti-btn-info me-[0.375rem]"
          >
            <i className="ri-edit-line"></i>
          </button>
          <button
            aria-label="button"
            type="button"
            className="ti-btn ti-btn-sm ti-btn-danger"
          >
            <i className="ri-delete-bin-line"></i>
          </button> */}
          <Link
            href={"/file-manager/?mode=viewer&id=" + file?.paperMergeNodeId}
            scroll={false}
            className="ti-btn ti-btn-sm ti-btn-info me-[0.375rem]"
            aria-expanded="false"
          >
            <i className="ri-eye-line"></i>
          </Link>
        </div>
      </div>
    </li>
  );
};

export default FileRow;
