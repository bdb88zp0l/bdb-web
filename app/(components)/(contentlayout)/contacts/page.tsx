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
import EditModal from "@/shared/page-components/contacts/EditModal";
import CreateModal from "@/shared/page-components/contacts/CreateModal";
import ShowModal from "@/shared/page-components/contacts/ShowModal";
import { getImageUrl, hasPermission } from "@/utils/utils";
import SortBy from "@/shared/common-components/SortBy";

const Contacts = () => {
  const [startDate, setStartDate] = useState(new Date());
  const handleDelete = (id: number) => {
    userPrivateRequest
      .delete(`/api/contacts/${id}`)
      .then((res) => {
        toast.success("Contact deleted successfully");
        fetchContacts();
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const [roles, setRoles] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [search, setSearch] = useState("");
  const [temporaryKeyword, setTemporaryKeyword] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<any>({});
  const [pageData, setPageData] = useState({});

  const fetchPageData = async () => {
    const res = await userPrivateRequest.get("/api/contacts/data/get");
    setPageData(res.data.data ?? {});
  };
  useEffect(() => {
    fetchPageData();
  }, []);

  const fetchContacts = async () => {
    setIsFetching(true);
    const res = await userPrivateRequest
      .get(
        `/api/contacts?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}&sortOrder=${sortOrder}`
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
    fetchContacts();
  }, [page, limit, search, sortBy, sortOrder]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShowModalOpen, setIsShowModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const openShowModal = () => {
    setIsShowModalOpen(true);
  };

  const closeShowModal = () => {
    setIsShowModalOpen(false);
    setSelectedContact(null);
  };
  const sortOptions = [
    { label: "Name", value: "firstName" },
    { label: "Email", value: "emails" },
    { label: "Phone", value: "phones" },
    { label: "Latest", value: "createdAt" },
  ];

  console.log("data", temporaryKeyword);

  return (
    <Fragment>
      <Seo title={"Contacts"} />

      <Pageheader
        currentpage="Contacts"
        activepage="Admin"
        mainpage="Contacts"
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
                  className="ti-btn ti-btn-light !py-1 !px-2 !text-[0.75rem] !m-0 h-[36.47px]"
                  type="submit"
                  onClick={() => {
                    setSearch(temporaryKeyword); // Set search term
                    setPage(1); // Go to first page
                  }}
                >
                  Search
                </button>
                <button
                  className="text-info !py-1 !px-4 !text-[0.75rem] !m-0 h-[36.47px] content-center text-nowrap"
                  onClick={(e) => {
                    e.preventDefault();
                    setTemporaryKeyword(""); // Clear the temporary keyword
                    setSearch(""); // Clear the search results
                    setPage(1);
                  }}
                  onKeyDown={(e) => {
                    e.preventDefault();
                    if (e.key === "Enter") {
                      setSearch(temporaryKeyword);
                    }
                  }}
                >
                  Clear Search Results
                </button>
              </div>

              <div className="flexflex-wrap gap-2">
                {hasPermission("contact.create") && (
                  <CreateModal
                    roles={roles}
                    fetchContacts={fetchContacts}
                    pageData={pageData}
                    fetchPageData={fetchPageData}
                  />
                )}
                {hasPermission("contact.read") && selectedContact && (
                  <EditModal
                    // isShowModalOpen={isShowModalOpen}
                    // closeShowModal={closeShowModal}
                    isEditModalOpen={isEditModalOpen}
                    setIsEditModalOpen={setIsEditModalOpen}
                    contact={selectedContact}
                    fetchContacts={fetchContacts}
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
                        Email
                      </th>
                      <th scope="col" className="text-start">
                        Phone
                      </th>
                      <th scope="col" className="text-start">
                        Company
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
                      data?.docs?.map((user: any) => (
                        <tr
                          className="border border-defaultborder crm-contact"
                          key={Math.random()}
                        >
                          <td>
                            <div className="flex items-center gap-2">
                              <div className="leading-none">
                                <span className="avatar avatar-rounded avatar-sm">
                                  {getImageUrl(user?.photo) ? (
                                    <img
                                      src={`  ${
                                        getImageUrl(user?.photo) ||
                                        "../../assets/images/user-circle.png"
                                      }`}
                                      alt=""
                                      style={{ objectFit: "cover" }}
                                    />
                                  ) : (
                                    <i className="ri-account-circle-line me-1 align-middle text-3xl text-[#8c9097]"></i>
                                  )}
                                </span>
                              </div>
                              <div>
                                <button
                                  // href="#offcanvasExample"
                                  // aria-controls="offcanvasExample"
                                  // data-hs-overlay="#hs-overlay-contacts"
                                  onClick={() => {
                                    setIsEditModalOpen(true);
                                    setSelectedContact(user);
                                  }}
                                >
                                  <span className="block font-semibold">
                                    {user?.firstName ?? ""}{" "}
                                    {user?.lastName ? user?.lastName : ""}
                                  </span>
                                </button>
                                <span
                                  className="block text-[#8c9097] dark:text-white/50 text-[0.6875rem]"
                                  title="Created at"
                                >
                                  {user?.createdAt}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>
                            {user?.emails?.map((email: any) => {
                              return (
                                <div>
                                  <span className="block mb-1">
                                    <i className="ri-mail-line me-2 align-middle text-[.875rem] text-[#8c9097] dark:text-white/50 inline-flex"></i>
                                    <Link href={`mailto:${email.value}`}>
                                      {email.value}
                                    </Link>
                                  </span>
                                </div>
                              );
                            })}
                          </td>
                          <td>
                            {user?.phones?.map((phone: any) => {
                              return (
                                <div>
                                  <span className="block mb-1">
                                    <i className="ri-phone-line me-2 align-middle text-[.875rem] text-[#8c9097] dark:text-white/50 inline-flex"></i>
                                    <Link
                                      href={`tel:${phone.dialCode}${phone.phoneNumber}`}
                                    >
                                      {phone.dialCode} {phone.phoneNumber}
                                    </Link>
                                  </span>
                                </div>
                              );
                            })}
                          </td>
                          <td>
                            {user?.companyGroups &&
                              user?.companyGroups?.map((companyGroup: any) => {
                                return (
                                  <div>
                                    <span className="block mb-1">
                                      {companyGroup?.name}
                                    </span>
                                  </div>
                                );
                              })}
                          </td>
                          <td>
                            <div className="btn-list">
                              {hasPermission("contact.update") && (
                                <button
                                  aria-label="button"
                                  type="button"
                                  className="ti-btn ti-btn-sm ti-btn-info ti-btn-icon  me-2"
                                  onClick={() => {
                                    setIsEditModalOpen(true);
                                    setSelectedContact(user);
                                  }}
                                >
                                  <i className="ri-pencil-line"></i>
                                </button>
                              )}{" "}
                              {hasPermission("contact.delete") && (
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
                                      handleDelete(user?._id);
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
