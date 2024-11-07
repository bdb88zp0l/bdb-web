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
                                <Link
                                  href="#offcanvasExample"
                                  aria-controls="offcanvasExample"
                                  data-hs-overlay="#hs-overlay-contacts"
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
                                </Link>
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
      {/* Show details */}
      <div
        className="hs-overlay hidden ti-offcanvas ti-offcanvas-right !max-w-[25rem] !border-0"
        id="hs-overlay-contacts"
        aria-labelledby="offcanvasExample"
      >
        <div className="ti-offcanvas-body !p-0">
          <div className="sm:flex items-start p-6 border-b border-dashed border-defaultborder dark:border-defaultborder/10 main-profile-cover">
            <div className="avatar avatar-xxl avatar-rounded online me-4 !bottom-0 !mb-0">
              <img src="../../../assets/images/faces/4.jpg" alt="" />
            </div>
            <div className="flex-grow main-profile-info">
              <div className="flex items-center justify-between">
                <h6 className="font-semibold mb-1 text-white">Lisa Convay</h6>
                <button
                  type="button"
                  className="ti-btn flex-shrink-0 !p-0  transition-none text-white opacity-70 hover:opacity-100 hover:text-white focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent focus:outline-0 focus-visible:outline-0 !mb-0"
                  data-hs-overlay="#hs-overlay-contacts"
                >
                  <span className="sr-only">Close modal</span>
                  <i className="ri-close-line leading-none text-lg"></i>
                </button>
              </div>
              <p className="mb-1 text-white  op-7">
                Chief Executive Officer (C.E.O)
              </p>
              <p className="text-[0.75rem] text-white mb-4 opacity-[0.5]">
                <span className="me-3">
                  <i className="ri-building-line me-1 align-middle"></i>
                  Georgia
                </span>
                <span>
                  <i className="ri-map-pin-line me-1 rtl:ms-1 align-middle"></i>
                  Washington D.C
                </span>
              </p>
              <div className="flex mb-0">
                <div className="me-4">
                  <p className="font-bold text-xl text-white text-shadow mb-0">
                    113
                  </p>
                  <p className="mb-0 text-[0.6875rem] opacity-[0.5] text-white">
                    Deals
                  </p>
                </div>
                <div className="me-4">
                  <p className="font-bold text-xl text-white text-shadow mb-0">
                    $12.2k
                  </p>
                  <p className="mb-0 text-[0.6875rem] opacity-[0.5] text-white">
                    Contributions
                  </p>
                </div>
                <div className="me-4">
                  <p className="font-bold text-xl text-white text-shadow mb-0">
                    $10.67k
                  </p>
                  <p className="mb-0 text-[0.6875rem] opacity-[0.5] text-white">
                    Comitted
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 border-b border-dashed border-defaultborder dark:border-defaultborder/10">
            <div className="mb-0">
              <p className="text-[0.9375rem] mb-2 font-semibold">
                Professional Bio :
              </p>
              <p className="text-[#8c9097] dark:text-white/50 op-8 mb-0">
                I am <b className="text-default">Lisa Convay,</b> here by
                conclude that,i am the founder and managing director of the
                prestigeous company name laugh at all and acts as the cheif
                executieve officer of the company.
              </p>
            </div>
          </div>
          <div className="p-6 border-b border-dashed border-defaultborder dark:border-defaultborder/10">
            <p className="text-[.875rem] mb-2 me-4 font-semibold">
              Contact Information :
            </p>
            <div className="">
              <div className="flex items-center mb-2">
                <div className="me-2">
                  <span className="avatar avatar-sm avatar-rounded bg-light !text-[#8c9097] dark:text-white/50">
                    <i className="ri-mail-line align-middle text-[.875rem]"></i>
                  </span>
                </div>
                <div>sonyataylor2531@gmail.com</div>
              </div>
              <div className="flex items-center mb-2">
                <div className="me-2">
                  <span className="avatar avatar-sm avatar-rounded bg-light !text-[#8c9097] dark:text-white/50">
                    <i className="ri-phone-line align-middle text-[.875rem]"></i>
                  </span>
                </div>
                <div>+(555) 555-1234</div>
              </div>
              <div className="flex items-center mb-0">
                <div className="me-2">
                  <span className="avatar avatar-sm avatar-rounded bg-light !text-[#8c9097] dark:text-white/50">
                    <i className="ri-map-pin-line align-middle text-[.875rem]"></i>
                  </span>
                </div>
                <div>
                  MIG-1-11, Monroe Street, Georgetown, Washington D.C, USA,20071
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 border-b border-dashed border-defaultborder dark:border-defaultborder/10 flex items-center">
            <p className="text-[.875rem] mb-0 me-4 font-semibold">
              Social Networks :
            </p>
            <div className="btn-list mb-0 gap-2 flex">
              <button
                aria-label="button"
                type="button"
                className="ti-btn w-[1.75rem] h-[1.75rem] text-[0.8rem] py-[0.26rem] px-2 rounded-sm ti-btn-primary mb-0"
              >
                <i className="ri-facebook-line font-semibold"></i>
              </button>
              <button
                aria-label="button"
                type="button"
                className="ti-btn w-[1.75rem] h-[1.75rem] text-[0.8rem] py-[0.26rem] px-2 rounded-sm ti-btn-secondary mb-0"
              >
                <i className="ri-twitter-x-line font-semibold"></i>
              </button>
              <button
                aria-label="button"
                type="button"
                className="ti-btn w-[1.75rem] h-[1.75rem] text-[0.8rem] py-[0.26rem] px-2 rounded-sm ti-btn-warning mb-0"
              >
                <i className="ri-instagram-line font-semibold"></i>
              </button>
              <button
                aria-label="button"
                type="button"
                className="ti-btn w-[1.75rem] h-[1.75rem] text-[0.8rem] py-[0.26rem] px-2 rounded-sm ti-btn-success mb-0"
              >
                <i className="ri-github-line font-semibold"></i>
              </button>
              <button
                aria-label="button"
                type="button"
                className="ti-btn w-[1.75rem] h-[1.75rem] text-[0.8rem] py-[0.26rem] px-2 rounded-sm ti-btn-danger mb-0"
              >
                <i className="ri-youtube-line font-semibold"></i>
              </button>
            </div>
          </div>
          <div className="p-6 border-b border-dashed border-defaultborder dark:border-defaultborder/10">
            <p className="text-[.875rem] mb-2 me-4 font-semibold">Tags :</p>
            <div>
              <span className="badge bg-light text-[#8c9097] dark:text-white/50 m-1">
                New Lead
              </span>
              <span className="badge bg-light text-[#8c9097] dark:text-white/50 m-1">
                Others
              </span>
            </div>
          </div>
          <div className="p-4">
            <p className="text-[.875rem] mb-2 font-semibold">
              Relationship Manager :
              <a
                className="text-[.875rem] text-primary mb-0 ltr:float-right rtl:float-left"
                href="#!"
              >
                <i className="ri-add-line me-1 align-middle"></i>
                Add Manager
              </a>
            </p>
            <div className="avatar-list-stacked">
              <span className="avatar avatar-rounded">
                <img src="../../../assets/images/faces/2.jpg" alt="img" />
              </span>
              <span className="avatar avatar-rounded">
                <img src="../../../assets/images/faces/8.jpg" alt="img" />
              </span>
              <span className="avatar avatar-rounded">
                <img src="../../../assets/images/faces/2.jpg" alt="img" />
              </span>
              <span className="avatar avatar-rounded">
                <img src="../../../assets/images/faces/10.jpg" alt="img" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Show details end */}
    </Fragment>
  );
};

export default Contacts;
