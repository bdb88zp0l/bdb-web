"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { userPrivateRequest } from "@/config/axios.config";
import Modal from "@/shared/modals/Modal";
import ButtonSpinner from "@/shared/layout-components/loader/ButtonSpinner";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useConfig } from "@/shared/providers/ConfigProvider";
import {
  formatAmount,
  formatDate,
  getImageUrl,
  toWordUpperCase,
} from "@/utils/utils";
import CreateModal from "../billing/CreateModal";
import ViewBilling from "../billing/ViewBilling";
import EditModal from "../billing/EditModal";
import BillingPdfDownload from "../billing/BillingPdfDownload";

// Dynamically import react-select to avoid SSR issues
const Select = dynamic(() => import("react-select"), { ssr: false });

const BillingOverview = ({ caseInfo }: any) => {
  const config = useConfig();

  const [isModalOpen, setModalOpen] = useState(false);
  const [showModalOpen, setShowModalOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [pageData, setPageData] = useState<any>({});

  const fetchPageData = async () => {
    const res = await userPrivateRequest.get("/api/billing/data/get");
    setPageData(res.data.data ?? {});
  };
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [search, setSearch] = useState("");
  const [temporaryKeyword, setTemporaryKeyword] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<any>({});
  const [selectedBilling, setSelectedBilling] = useState<any>(null);

  useEffect(() => {
    fetchPageData();
  }, []);

  const fetchBillings = async () => {
    if (!caseInfo?._id) return;
    setIsFetching(true);
    const res = await userPrivateRequest
      .get("/api/billing", {
        params: {
          page,
          limit,
          sortBy,
          sortOrder,
          search,
          case: caseInfo?._id,
        },
      })
      .then((res) => {
        setData(res.data.data ?? {});
      })
      .catch((error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to fetch billings"
        );
      })
      .finally(() => {
        setIsFetching(false);
      });
  };
  useEffect(() => {
    fetchBillings();
  }, [caseInfo, page, limit, sortBy, sortOrder, search]);

  const handleDelete = async (id: string) => {
    await userPrivateRequest.delete(`/api/billing/${id}`).then((res) => {
      toast.success("Billing deleted successfully");
      fetchBillings();
    });
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="xl:col-span-12 col-span-12">
          <div className="">
            <div className="box-header flex items-center justify-between flex-wrap gap-4">
              <div className="flex" role="search">
                <input
                  className="form-control me-2 h-[36.47px]"
                  type="text"
                  placeholder="Search"
                  aria-label="Search"
                />
                <button
                  className="ti-btn ti-btn-light !mb-0 h-[36.47px]"
                  type="submit"
                >
                  Search
                </button>
                <button className="text-info !py-1 !px-4 !text-[0.75rem] !m-0 h-[36.47px] content-center text-nowrap">
                  Clear Search Results
                </button>
              </div>

              <div className="flexflex-wrap gap-2">
                <button
                  onClick={() => setModalOpen(true)}
                  className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem] me-2"
                >
                  <i className="ri-add-line font-semibold align-middle"></i>
                  New Billing
                </button>
              </div>
            </div>

            <CreateModal
              modalOpen={isModalOpen}
              setModalOpen={setModalOpen}
              fetchBillings={fetchBillings}
              pageData={pageData}
              caseInfo={caseInfo}
            />

            <ViewBilling
              showModalOpen={showModalOpen}
              setShowModalOpen={setShowModalOpen}
              selectedBilling={selectedBilling}
              fetchBillings={fetchBillings}
              caseInfo={caseInfo}
            />
            <EditModal
              editModalOpen={editModalOpen}
              setEditModalOpen={setEditModalOpen}
              selectedBilling={selectedBilling}
              fetchBillings={fetchBillings}
              caseInfo={caseInfo}
            />

            <BillingPdfDownload
              setDownloadModalOpen={setDownloadModalOpen}
              downloadModalOpen={downloadModalOpen}
              selectedBilling={selectedBilling}
            />

            <div className="box-body !p-0">
              <div className="table-responsive">
                <table className="table whitespace-nowrap min-w-full">
                  <thead>
                    <tr>
                      <th scope="col" className="text-start">
                        Bill Number
                      </th>
                      <th scope="col" className="text-start">
                        Title
                      </th>
                      <th scope="col" className="text-start">
                        Bill Type
                      </th>
                      <th scope="col" className="text-start">
                        Bill From
                      </th>
                      <th scope="col" className="text-start">
                        Date Of Reciept
                      </th>
                      <th scope="col" className="text-start">
                        Total Amount
                      </th>
                      <th scope="col" className="text-start">
                        Status
                      </th>
                      <th scope="col" className="text-start">
                        Action
                      </th>
                      <th scope="col" className="text-start"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {isFetching && (
                      <td colSpan={5}>
                        <div className="flex justify-center mb-6">
                          <div className="ti-spinner" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                        </div>
                      </td>
                    )}
                    {!isFetching &&
                      data?.docs?.map((item: any) => {
                        return (
                          <tr
                            className="border border-defaultborder crm-contact"
                            key={Math.random()}
                          >
                            <td>{item?.billNumber}</td>
                            <td>{item?.title}</td>
                            <td>{item?.billingType}</td>
                            <td>{item?.clientData?.companyName ?? ""}</td>
                            <td>{formatDate(item?.date)}</td>
                            <td>{formatAmount(item?.grandTotal)}</td>
                            <td>{toWordUpperCase(item?.status)}</td>

                            <td>
                              <div className="btn-list flex gap-2">
                                <button
                                  onClick={() => {
                                    setShowModalOpen(true);
                                    setSelectedBilling(item);
                                  }}
                                  aria-label="view button"
                                  type="button"
                                  className="ti-btn ti-btn-sm ti-btn-info ti-btn-icon"
                                >
                                  <i className="ri-eye-line"></i>
                                </button>
                                <button
                                  onClick={() => {
                                    setDownloadModalOpen(true);
                                    setSelectedBilling(item);
                                  }}
                                  aria-label="view button"
                                  type="button"
                                  className="ti-btn ti-btn-sm ti-btn-danger ti-btn-icon contact-view"
                                >
                                  <i className="ri-download-line"></i>
                                </button>

                                <button
                                  className="ti-btn ti-btn-sm ti-btn-info ti-btn-icon"
                                  onClick={() => {
                                    setSelectedBilling(item);
                                    setEditModalOpen(true);
                                  }}
                                >
                                  <i className="ri-pencil-line"></i>
                                </button>
                                <button
                                  aria-label="button"
                                  type="button"
                                  className="ti-btn ti-btn-sm ti-btn-danger ti-btn-icon contact-delete"
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        "Are you sure you want to delete this item?"
                                      )
                                    ) {
                                      handleDelete(item?._id);
                                    }
                                  }}
                                >
                                  <i className="ri-delete-bin-line"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BillingOverview;
