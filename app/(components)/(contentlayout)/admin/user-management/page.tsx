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
import Spinners from "../../ui-elements/spinners/page";
import EditUserModal from "@/shared/page-components/user-management/EditUserModal";
import CreateModal from "@/shared/page-components/user-management/CreateModal";
import ShowModal from "@/shared/page-components/user-management/ShowModal";
import { getImageUrl, hasPermission } from "@/utils/utils";
import SortBy from "@/shared/common-components/SortBy";

const Contacts = () => {
  const [images, setImages] = useState<any>([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [temporaryKeyword, setTemporaryKeyword] = useState("");

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader: any = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const [startDate, setStartDate] = useState(new Date());
  const handleDelete = (id: number) => {
    userPrivateRequest
      .delete(`/api/users/${id}`)
      .then((res) => {
        toast.success("User deleted successfully");
        fetchUsers();
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  //Datepicker function
  const handleDateChange = (date: React.SetStateAction<Date>) => {
    // Ensure date is defined before setting it
    if (date) {
      setStartDate(date);
    }
  };

  const [roles, setRoles] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [search, setSearch] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<any>({});
  const [mode, setMode] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchUsers = async () => {
    setIsFetching(true);
    const res = await userPrivateRequest
      .get(
        `/api/users?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      )
      .then((res) => {
        setData(res.data?.data ?? {});
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  useEffect(() => {
    const fetchRoles = async () => {
      const res = await userPrivateRequest.get("/api/roles");
      setRoles(res.data.data);
    };
    fetchRoles();
  }, []);
  useEffect(() => {
    fetchUsers();
  }, [page, limit, search, sortBy, sortOrder]);

  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const openShowModal = () => {
    setIsShowModalOpen(true);
  };

  const closeShowModal = () => {
    setIsShowModalOpen(false);
    setSelectedRow(null);
  };
  const sortOptions = [
    { label: "Name", value: "firstName" },
    { label: "Email", value: "email" },
    { label: "Phone", value: "phone" },
    { label: "Latest", value: "createdAt" },
  ];
  return (
    <Fragment>
      <Seo title={"User Management"} />
      <Pageheader
        currentpage="User Management"
        activepage="Admin"
        mainpage="User Management"
      />
      <div className="grid grid-cols-12 gap-6">
        <div className="xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-header flex items-center justify-between flex-wrap gap-4">
              {/* <div className="box-title"></div> */}
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
                {hasPermission("user.create") && (
                  <CreateModal roles={roles} fetchUsers={fetchUsers} />
                )}

                {hasPermission("user.read") && isShowModalOpen && (
                  <ShowModal
                    data={selectedRow}
                    modalOpen={isShowModalOpen}
                    closeModal={closeShowModal}
                  />
                )}

                {hasPermission("user.update") && selectedItem && (
                  <EditUserModal
                    user={selectedItem}
                    roles={roles}
                    fetchUsers={fetchUsers}
                    showModal={showModal}
                    setShowModal={setShowModal}
                    mode={mode}
                    setMode={setMode}
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
                  }}
                />
              </div>
            </div>
            <div className="box-body !p-0">
              <div className="table-responsive">
                <table className="table whitespace-nowrap min-w-full">
                  <thead>
                    <tr>
                      {/* <th scope="col">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="checkboxNoLabel"
                          defaultValue=""
                          aria-label="..."
                        />
                      </th> */}
                      <th scope="col" className="text-start">
                        Name
                      </th>
                      <th scope="col" className="text-start">
                        Last Name
                      </th>
                      <th scope="col" className="text-start">
                        Email
                      </th>
                      <th scope="col" className="text-start">
                        Phone
                      </th>
                      <th scope="col" className="text-start">
                        Role
                      </th>
                      <th scope="col" className="text-start">
                        Actions
                      </th>
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
                      data?.docs?.map((user: any) => (
                        <tr
                          className="border border-defaultborder crm-contact"
                          key={Math.random()}
                        >
                          {/* <td>
                            <input
                              className="form-check-input"
                              type="checkbox"
                              defaultValue=""
                              aria-label="..."
                            />
                          </td> */}
                          <td>
                            <div className="flex items-center gap-2">
                              <div className="leading-none">
                                <span className="avatar avatar-rounded avatar-sm">
                                  {user?.photo ? (
                                    <img
                                      src={`${getImageUrl(user?.photo)}`}
                                      alt=""
                                      style={{
                                        objectFit: "cover",
                                      }}
                                    />
                                  ) : (
                                    <i className="ri-account-circle-line me-1 align-middle text-3xl text-[#8c9097]"></i>
                                  )}
                                </span>
                              </div>
                              <div>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();

                                    setSelectedItem(user);
                                    setShowModal(true);
                                    setMode("show");
                                  }}
                                >
                                  <span className="block font-semibold">
                                    {user.firstName}
                                  </span>
                                </button>
                                <span
                                  className="block text-[#8c9097] dark:text-white/50 text-[0.6875rem]"
                                  title="Last Contacted"
                                >
                                  {user.createdAt}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>{user.lastName}</td>
                          <td>
                            <div>
                              <span className="block mb-1">
                                <i className="ri-mail-line me-2 align-middle text-[.875rem] text-[#8c9097] dark:text-white/50 inline-flex"></i>
                                {user.email}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div>
                              <span className="block">
                                <i className="ri-phone-line me-2 align-middle text-[.875rem] text-[#8c9097] dark:text-white/50 inline-flex"></i>
                                {user.phone}
                              </span>
                            </div>
                          </td>

                          <td>
                            <div className="flex items-center flex-wrap gap-1">
                              <span
                                className={`badge bg-primary/10 text-primary`}
                              >
                                {user.roleType === "superAdmin"
                                  ? "Super Admin"
                                  : user?.role?.name}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="btn-list">
                              <button
                                aria-label="button"
                                type="button"
                                className="ti-btn ti-btn-sm ti-btn-info ti-btn-icon  me-2"
                                onClick={() => {
                                  setSelectedItem(user);
                                  setShowModal(true);
                                  setMode("edit");
                                }}
                              >
                                <i className="ri-pencil-line"></i>
                              </button>
                              {hasPermission("user.delete") && (
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
                                      handleDelete(user._id);
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
