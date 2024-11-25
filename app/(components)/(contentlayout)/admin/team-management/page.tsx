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
import EditModal from "@/shared/page-components/team-management/EditModal";
import CreateModal from "@/shared/page-components/team-management/CreateModal";
import Pagination from "@/shared/common-components/Pagination";
import { hasPermission } from "@/utils/utils";
import ShowModal from "@/shared/page-components/contacts/ShowModal";
import SortBy from "@/shared/common-components/SortBy";

const Contacts = () => {
  const handleDelete = (id: number) => {
    return;
    userPrivateRequest
      .delete(`/api/team/${id}`)
      .then((res: any) => {
        toast.success("Team deleted successfully");
        fetchTeams();
      })
      .catch((err: any) => {
        toast.error(err.response.data.message);
      });
  };
  const [roles, setRoles] = useState([]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [search, setSearch] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<any>([]);
  const [pageData, setPageData] = useState({});
  const [temporaryKeyword, setTemporaryKeyword] = useState("");

  const fetchTeams = async () => {
    setIsFetching(true);
    const res = await userPrivateRequest
      .get(`/api/team`)
      .then((res) => {
        setData(res.data?.data ?? {});
      })
      .finally(() => {
        setIsFetching(false);
      });
  };
  useEffect(() => {
    fetchTeams();
  }, [page, limit, search, sortBy, sortOrder]);

  const fetchPageData = async () => {
    const res = await userPrivateRequest.get("/api/team/data/get");
    setPageData(res.data.data ?? {});
  };
  useEffect(() => {
    fetchPageData();
  }, []);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const openShowModal = () => {
    setIsShowModalOpen(true);
  };

  const closeShowModal = () => {
    setIsShowModalOpen(false);
    setSelectedContact(null);
  };

  const sortOptions = [
    { label: "Title", value: "Title" },
    { label: "Description", value: "Description" },
    { label: "Latest", value: "createdAt" },
  ];

  return (
    <Fragment>
      <Seo title={"Team Management"} />
      <Pageheader
        currentpage="Team Management"
        activepage="Admin"
        mainpage="Team Management"
      />
      <div className="grid grid-cols-12 gap-6">
        <div className="xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-header flex items-center justify-between flex-wrap gap-4">
              {/* <div className="box-title">
                Team Management
                <span className="badge bg-light text-default rounded-full ms-1 text-[0.75rem] align-middle">
                  {data?.length}
                </span>
              </div> */}
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setSearch(temporaryKeyword);
                    }
                  }}
                />
                <button
                  className="ti-btn ti-btn-light !py-1 !px-2 !text-[0.75rem] !m-0 h-[36.47px]"
                  type="submit"
                  onClick={() => {
                    setSearch(temporaryKeyword); // Set search term
                    setPage(1); // Go to first page
                  }}
                >
                  Search
                </button>
                <Link
                  href="#!"
                  className="text-info !py-1 !px-4 !text-[0.75rem] !m-0 h-[36.47px] content-center text-nowrap"
                  onClick={(e) => {
                    e.preventDefault();
                    setTemporaryKeyword(""); // Clear the temporary keyword
                    setSearch(""); // Clear the search results
                    setPage(1);
                  }}
                >
                  Clear Search Results
                </Link>
              </div>
              <div className="flexflex-wrap gap-2">
                {hasPermission("contact.create") && (
                  <CreateModal
                    roles={roles}
                    fetchTeams={fetchTeams}
                    pageData={pageData}
                    fetchPageData={fetchPageData}
                  />
                )}
                {hasPermission("contact.read") && selectedContact && (
                  <ShowModal
                    contact={selectedContact}
                    isShowModalOpen={isShowModalOpen}
                    closeShowModal={closeShowModal}
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
                  options={sortOptions}
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
                      <th scope="col">Title</th>
                      <th scope="col" className="text-start">
                        Description
                      </th>
                      <th scope="col" className="text-start">
                        Members
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
                      data?.docs?.map((team: any) => (
                        <tr
                          className="border border-defaultborder crm-contact"
                          key={Math.random()}
                        >
                          <td>{team.title}</td>
                          <td>{team.description}</td>
                          <td>
                            {team.users
                              ?.map((user: any) => {
                                return `${user?.firstName ?? ""}  ${
                                  user?.lastName ?? ""
                                }`;
                              })
                              .join(", ")}
                          </td>
                          <td>{team.createdAt}</td>

                          <td>
                            <div className="btn-list">
                              {hasPermission("team.update") && (
                                <EditModal
                                  team={team}
                                  fetchTeams={fetchTeams}
                                  pageData={pageData}
                                />
                              )}

                              {hasPermission("team.delete") && (
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
                                      handleDelete(team._id);
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

export default Contacts;
