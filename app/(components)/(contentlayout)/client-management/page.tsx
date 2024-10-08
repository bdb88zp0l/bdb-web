"use client";
import { Data, Data1, Loopingdata } from "@/shared/data/apps/crm/contactsdata";
import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import dynamic from "next/dynamic";
const Select = dynamic(() => import("react-select"), { ssr: false });
import Swal from "sweetalert2";
import { userPrivateRequest } from "@/config/axios.config";
import ButtonSpinner from "@/shared/layout-components/loader/ButtonSpinner";
import { AnyListenerPredicate } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import Modal from "@/shared/modals/Modal";
import Pagination from "@/shared/common-components/Pagination";
import Spinners from "../ui-elements/spinners/page";
import EditModal from "@/shared/page-components/client-management/EditModal";
import CreateModal from "@/shared/page-components/client-management/CreateModal";
import ShowModal from "@/shared/page-components/client-management/ShowModal";
import { useConfig } from "@/shared/providers/ConfigProvider";
import { getImageUrl, hasPermission, toWordUpperCase } from "@/utils/utils";
import SortBy from "@/shared/common-components/SortBy";

const CaseManagement = () => {
  const [pageData, setPageData] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [search, setSearch] = useState("");
  const [temporaryKeyword, setTemporaryKeyword] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<any>({});

  const handleDelete = (id: number) => {
    userPrivateRequest
      .delete(`/api/clients/${id}`)
      .then((res) => {
        toast.success("User deleted successfully");
        fetchClients();
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };
  const fetchClients = async () => {
    setIsFetching(true);
    const res = await userPrivateRequest
      .get(
        `/api/clients?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      )
      .then((res) => {
        setData(res.data?.data ?? {});
      })
      .finally(() => {
        setIsFetching(false);
      });
  };
  const fetchPageData = async () => {
    const res = await userPrivateRequest.get("/api/clients/data/get");
    setPageData(res.data.data ?? {});
  };
  useEffect(() => {
    fetchPageData();
  }, []);
  useEffect(() => {
    fetchClients();
  }, [page, limit, search, sortBy, sortOrder]);
  const [IsmodalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <Fragment>
      <Seo title={"Client Management"} />
      <Pageheader
        currentpage="Client Management"
        activepage="Admin"
        mainpage="Client Management"
      />
      <div className="grid grid-cols-12 gap-6">
        <div className="xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-header flex items-center justify-between flex-wrap gap-4">
              <div className="flex" role="search">
                <input
                  className="form-control me-2 h-[36.47px]"
                  type="text"
                  placeholder="Search"
                  aria-label="Search"
                  value={temporaryKeyword}
                  onChange={(e) => {
                    setTemporaryKeyword(e.target.value);
                  }}
                />
                <button
                  className="ti-btn ti-btn-light !mb-0 h-[36.47px]"
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    setSearch(temporaryKeyword);
                    setPage(1);
                  }}
                >
                  Search
                </button>
                <button
                  className="text-info !py-1 !px-4 !text-[0.75rem] !m-0 h-[36.47px] content-center text-nowrap"
                  onClick={() => {
                    setTemporaryKeyword("");
                    setSearch("");
                    setPage(1);
                  }}
                >
                  Clear Search Results
                </button>
              </div>
              <div className="flexflex-wrap gap-2">
                {hasPermission("client.create") && (
                  <CreateModal
                    fetchClients={fetchClients}
                    pageData={pageData}
                    fetchPageData={fetchPageData}
                  />
                )}
                {hasPermission("client.read") && selectedClient && (
                  <ShowModal
                    data={selectedClient}
                    IsmodalOpen={IsmodalOpen}
                    closeModal={closeModal}
                  />
                )}
                <button
                  type="button"
                  className="ti-btn ti-btn-success !py-1 !px-2 !text-[0.75rem] me-2"
                >
                  Export as XLSX
                </button>

                <SortBy
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  options={[
                    {
                      label: "Company Name",
                      value: "companyName",
                    },
                    {
                      label: "Company Code",
                      value: "clientNumber",
                    },
                    {
                      label: "Company",
                      value: "companyGroup.name",
                    },
                    {
                      label: "Contact Person",
                      value: "contact.firstName",
                    },
                    {
                      label: "Latest",
                      value: "createdAt",
                    },
                  ]}
                  onChange={(field: string, sortOrder: string) => {
                    setSortBy(field);
                    setSortOrder(sortOrder);
                    setPage(1);
                  }}
                />
              </div>
            </div>
            <div className="box-body !p-0">
              <div className="table-responsive">
                <table className="table whitespace-nowrap min-w-full">
                  <thead>
                    <tr>
                      <th scope="col" className="text-start">
                        Company Name
                      </th>
                      <th scope="col" className="text-start">
                        Company Code
                      </th>
                      <th scope="col" className="text-start">
                        Company
                      </th>
                      <th scope="col" className="text-start">
                        Contact Person
                      </th>
                      <th scope="col" className="text-start">
                        Status
                      </th>
                      <th scope="col" className="text-start"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {isFetching && (
                      <td colSpan={7}>
                        <div className="flex justify-center mb-6">
                          <div className="ti-spinner" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                        </div>
                      </td>
                    )}
                    {!isFetching &&
                      data?.docs?.map((row: any) => (
                        <tr
                          className="border border-defaultborder crm-contact"
                          key={Math.random()}
                        >
                          <td>
                            <button
                              // href="#offcanvasExample"
                              // aria-controls="offcanvasExample"
                              // data-hs-overlay="#hs-overlay-contacts"
                              onClick={() => {
                                setSelectedClient(row);
                                openModal();
                              }}
                            >
                              <span className="block font-semibold">
                                {row?.companyName}
                              </span>
                            </button>
                          </td>
                          <td>{row?.clientNumber}</td>
                          <td>
                            <div>
                              <span className="block mb-1">
                                {row?.companyGroup?.name}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <div className="leading-none">
                                {/*
                                <span className="avatar avatar-rounded avatar-sm">
                                  {getImageUrl(row?.contact?.photo) ? (
                                    <img
                                      src={`  ${
                                        getImageUrl(row?.contact?.photo) ||
                                        "../../assets/images/user-circle.png"
                                      }`}
                                      alt=""
                                          style={{ objectFit: "cover" }}
                                    />
                                  ) : (
                                    <i className="ri-account-circle-line me-1 align-middle text-3xl  text-[#8c9097]"></i>
                                  )}
                                </span>
                                */}
                              </div>
                              <div>
                                <Link
                                  href="#offcanvasExample"
                                  aria-controls="offcanvasExample"
                                  data-hs-overlay="#hs-overlay-contacts"
                                >
                                  <span className="block font-semibold">
                                    {row?.contact?.firstName ?? ""}{" "}
                                    {row?.contact?.lastName ?? ""}
                                  </span>
                                </Link>
                                {/* <span
                                  className="block text-[#8c9097] dark:text-white/50 text-[0.6875rem]"
                                  title="Email"
                                >
                                  <i className="ri-account-circle-line me-1  text-[#8c9097] align-middle"></i>
                                  {row?.contact?.email}
                                </span> */}
                              </div>
                            </div>
                          </td>
                          <td>{toWordUpperCase(row?.status)}</td>
                          <td>
                            <div className="btn-list">
                              {hasPermission("client.update") && (
                                <EditModal
                                  row={row}
                                  pageData={pageData}
                                  fetchClients={fetchClients}
                                  fetchPageData={fetchPageData}
                                />
                              )}
                              {hasPermission("client.delete") && (
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
                                      handleDelete(row._id);
                                    }
                                  }}
                                >
                                  <i className="ri-delete-bin-line"></i>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Pagination
              limit={limit}
              page={page}
              totalRow={data?.totalDocs ?? 0}
              handlePageChange={(
                limit: number,
                newOffset: number,
                page: number
              ) => {
                setPage(page);
              }}
              handleLimitChange={(updatedLimit: number) => {
                setLimit(updatedLimit);
              }}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CaseManagement;
