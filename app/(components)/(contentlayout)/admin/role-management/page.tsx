"use client";
import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import dynamic from "next/dynamic";
const Select = dynamic(() => import("react-select"), { ssr: false });
import Swal from "sweetalert2";
import { userPrivateRequest } from "@/config/axios.config";
import { AnyListenerPredicate } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import EditModal from "@/shared/page-components/role-management/EditModal";
import CreateModal from "@/shared/page-components/role-management/CreateModal";
import { hasPermission } from "@/utils/utils";
import SortBy from "@/shared/common-components/SortBy";

const Contacts = () => {
  const handleDelete = (id: number) => {
    userPrivateRequest
      .delete(`/api/roles/${id}`)
      .then((res: any) => {
        toast.success("Role deleted successfully");
        fetchRoles();
      })
      .catch((err: any) => {
        toast.error(err.response.data.message);
      });
  };
  const [pageData, setPageData] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [search, setSearch] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<any>([]);
  const [temporaryKeyword, setTemporaryKeyword] = useState("");

  const fetchRoles = async () => {
    setIsFetching(true);
    const res = await userPrivateRequest
      .get(`/api/roles`)
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
    fetchRoles();
  }, [page, limit, search, sortBy, sortOrder]);

  return (
    <Fragment>
      <Seo title={"Role Management"} />
      <Pageheader
        currentpage="Role Management"
        activepage="Admin"
        mainpage="Role Management"
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
                <Link
                  href="#!"
                  className="text-info !py-1 !px-4 !text-[0.75rem] !m-0 h-[36.47px] content-center text-nowrap"
                  onClick={() => {
                    setTemporaryKeyword("");
                    setSearch("");
                    setPage(1);
                  }}
                >
                  Clear Search Results
                </Link>
              </div>
              <div className="flexflex-wrap gap-2">
                {hasPermission("client.create") && (
                  <CreateModal
                    fetchRoles={fetchRoles}
                    pageData={pageData}
                    fetchPageData={fetchPageData}
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
                    { value: "name", label: "Name" },
                    { value: "createdAt", label: "Latest" },
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
                      <th scope="col">ID</th>
                      <th scope="col" className="text-start">
                        Name
                      </th>
                      <th scope="col" className="text-start">
                        Timestamp
                      </th>
                      <th scope="col" className="text-start">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isFetching && (
                      <td colSpan={4}>
                        <div className="flex justify-center mb-6">
                          <div className="ti-spinner" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                        </div>
                      </td>
                    )}
                    {!isFetching &&
                      data?.map((role: any) => (
                        <tr
                          className="border border-defaultborder crm-contact"
                          key={Math.random()}
                        >
                          <td>{role._id}</td>
                          <td>{role.name}</td>
                          <td>{role.createdAt}</td>

                          <td>
                            <div className="btn-list">
                              {hasPermission("role.update") && (
                                <EditModal
                                  role={role}
                                  fetchRoles={fetchRoles}
                                />
                              )}
                              {hasPermission("role.delete") && (
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
                                      handleDelete(role._id);
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
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Contacts;
