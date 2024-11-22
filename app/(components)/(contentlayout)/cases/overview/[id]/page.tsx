"use client";
import { userPrivateRequest } from "@/config/axios.config";
import Editor from "@/shared/common-components/Editor";
import JsonPreview from "@/shared/common-components/JsonPreview";
import ButtonSpinner from "@/shared/layout-components/loader/ButtonSpinner";
import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import CaseTeamOverview from "@/shared/page-components/case-management/CaseTeamOverview";
// import ViweModal from "@/shared/page-components/case-management/ViewModal";
import FileRow from "@/shared/page-components/case-management/FileRow";
import { useConfig } from "@/shared/providers/ConfigProvider";
import store from "@/shared/redux/store";
import { getImageUrl, hasPermission, toWordUpperCase } from "@/utils/utils";
import moment from "moment";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import CreateModal from "@/shared/page-components/billing/CreateModal";
import BillingOverview from "@/shared/page-components/case-management/BillingOverview";
const Select = dynamic(() => import("react-select"), { ssr: false });
export default function CaseOverview({ params }: { params: { id: string } }) {
  const { auth } = store.getState();

  const [data, setData] = useState<any>({});
  const [statusFormData, setStatusFormData] = useState<any>({});
  const [addMemberData, setAddMemberData] = useState<any>({});
  const [pageData, setPageData] = useState<any>({});
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const DatePicker = dynamic(() => import("react-datepicker"), { ssr: false });
  const [isModalOpen, setModalOpen] = useState(false);
  const [showModalOpen, setShowModalOpen] = useState(false);

  const fetchPageData = async () => {
    const res = await userPrivateRequest.get("/api/cases/data/get");
    setPageData(res.data.data ?? {});
  };

  const fetchData = async () => {
    userPrivateRequest.get(`/api/cases/${params.id}`).then((res) => {
      setData(res.data?.data);
    });
  };
  useEffect(() => {
    fetchPageData();
    fetchData();
  }, []);

  const submitStatus = async (id: any) => {
    setUpdatingStatus(true);
    try {
      const res = await userPrivateRequest.patch(
        `/api/cases/${id}/status`,
        statusFormData
      );
      setStatusFormData({ status: "", description: "" });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error occurred");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCase = () => {
    setIsEdit(!isEdit);
  };

  const config = useConfig();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const res = await userPrivateRequest.patch(`/api/cases/${params.id}`, {
        ...data,
        ...(data.client && typeof data.client == "object"
          ? { client: data.client._id }
          : { client: data.client }),
        ...(data.team && typeof data.team == "object"
          ? { team: data.team._id }
          : { team: data.team }),
        // startDate: data?.startDate,
        // endDate: data?.endDate,
        // title: data?.title,
        // description: data?.description,
        // caseNumber: data?.caseNumber,
        // serviceType: data?.serviceType,
      });
      toast.success(res.data?.message);
    } catch (err) {
      console.log(err.message);
      toast.error(err.response?.data?.message || "Error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log(data);
  return (
    <Fragment>
      <>
        <Seo title={"Case Overview"} />
        <Pageheader
          currentpage="Case Overview"
          activepage="Cases"
          mainpage="Case Overview"
        />
        <div className="grid grid-cols-12 gap-6">
          <div className="xl:col-span-8 col-span-12">
            <div className="box custom-box">
              <div className="box-header justify-between flex">
                <div className="box-title">Case Overview</div>
                <div className=" flex gap-2">
                  {hasPermission("case.update") && (
                    <button
                      onClick={handleCase}
                      className="ti-btn !py-1 !px-2 !text-[0.75rem] ti-btn-secondary-full btn-wave"
                    >
                      {isEdit ? "Cancel" : "Edit Case"}
                    </button>
                  )}
                  {isEdit && (
                    <button
                      type="button"
                      className="ti-btn bg-primary text-white !font-medium ms-auto !py-1 !px-2 !text-[0.75rem] btn-wave"
                      disabled={isSubmitting}
                      onClick={handleSubmit}
                    >
                      {isSubmitting ? (
                        <ButtonSpinner text="Updating Case" />
                      ) : (
                        "Update Case"
                      )}
                    </button>
                  )}
                </div>
              </div>
              <div className="box-body">
                <div className="text-[.9375rem] font-semibold mb-2">
                  Matter :
                </div>
                {isEdit ? (
                  <input
                    type="text"
                    className="form-control"
                    id="input-label"
                    placeholder="Enter Matter"
                    value={data?.title}
                    onChange={(e) => {
                      setData({
                        ...data,
                        title: e.target.value,
                      });
                    }}
                  />
                ) : (
                  <h5 className="font-semibold mb-4 task-title">
                    {data?.title}
                  </h5>
                )}
                <div className="text-[.9375rem] font-semibold mb-2">
                  Case Description :
                </div>

                {isEdit ? (
                  <div id="project-descriptioin-editor">
                    <Editor
                      onChange={(html) => {
                        setData({
                          ...data,
                          description: html,
                        });
                      }}
                      value={data?.description ?? ""}
                    />
                  </div>
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: data?.description,
                    }}
                  />
                )}
              </div>
              <div className="grid grid-cols-12 gap-4">
                <div className="xl:col-span-4 col-span-12"></div>
              </div>
              <div className="box-footer">
                <div className="grid grid-cols-12 gap-4">
                  <div className="xl:col-span-4 col-span-12">
                    <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                      Case Number
                    </span>
                    {isEdit ? (
                      <>
                        <input
                          type="text"
                          className="form-control"
                          id="input-label"
                          placeholder="Enter Case Number"
                          value={data?.caseNumber}
                          onChange={(e) => {
                            setData({
                              ...data,
                              caseNumber: e.target.value,
                            });
                          }}
                        />
                      </>
                    ) : (
                      <span className="block text-[.875rem] font-semibold">
                        {data?.caseNumber ?? ""}
                      </span>
                    )}
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                      Client / Stakeholder
                    </span>

                    {isEdit ? (
                      <Select
                        name="client"
                        options={pageData?.clients?.map((option: any) => {
                          return {
                            value: option._id,
                            label: `${option?.companyName ?? ""}`,
                          };
                        })}
                        defaultValue={pageData?.clients
                          ?.map((option: any) => {
                            return {
                              value: option._id,
                              label: `${option?.companyName ?? ""}`,
                            };
                          })
                          ?.find((option: any) => {
                            return option.value === data?.client?._id;
                          })}
                        value={pageData?.clients
                          ?.map((option: any) => {
                            return {
                              value: option._id,
                              label: `${option?.companyName ?? ""}`,
                            };
                          })
                          ?.find((option: any) => {
                            return option.value === data?.client?._id;
                          })}
                        className="basic-multi-select"
                        menuPlacement="auto"
                        classNamePrefix="Select2"
                        placeholder="Select Client/Stakeholder"
                        onChange={(e: any) =>
                          setData({ ...data, client: e.value })
                        }
                      />
                    ) : (
                      <>
                        <span className="block text-[.875rem] font-semibold">
                          {`${data?.client?.companyName ?? ""}`}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                      Partners Incharge
                    </span>

                    <>
                      <span className="block text-[.875rem] font-semibold">
                        {`${data?.client?.supervisingPartner?.firstName ?? ""}`}{" "}
                        {`${data?.client?.supervisingPartner?.lastName ?? ""}`}
                      </span>
                    </>
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                      Relationship Partner
                    </span>

                    <>
                      <span className="block text-[.875rem] font-semibold">
                        {`${data?.client?.referredBy?.firstName ?? ""}`}{" "}
                        {`${data?.client?.referredBy?.lastName ?? ""}`}
                      </span>
                    </>
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                      Start Date
                    </span>
                    {isEdit ? (
                      <>
                        <div className="form-group">
                          <div className="input-group">
                            <div className="input-group-text text-muted">
                              {" "}
                              <i className="ri-calendar-line"></i>{" "}
                            </div>
                            <DatePicker
                              className="ti-form-input ltr:rounded-l-none rtl:rounded-r-none focus:z-10"
                              selected={data?.startDate}
                              onChange={(date) => {
                                setData({ ...data, startDate: date });
                              }}
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <span className="block text-[.875rem] font-semibold">
                        {data?.startDate
                          ? moment
                              .utc(data.startDate)
                              .format("DD,MMM YYYY")
                              ?.toString()
                          : "N/A"}
                      </span>
                    )}
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                      End Date
                    </span>
                    {isEdit ? (
                      <>
                        <div className="form-group">
                          <div className="input-group">
                            <div className="input-group-text text-muted">
                              {" "}
                              <i className="ri-calendar-line"></i>{" "}
                            </div>
                            <DatePicker
                              className="ti-form-input ltr:rounded-l-none rtl:rounded-r-none focus:z-10"
                              selected={data?.endDate}
                              onChange={(date) => {
                                setData({ ...data, endDate: date });
                              }}
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <span className="block text-[.875rem] font-semibold">
                        {data?.endDate
                          ? moment
                              .utc(data.endDate)
                              .format("DD,MMM YYYY")
                              ?.toString()
                          : "N/A"}
                      </span>
                    )}
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                      Assigned To
                    </span>
                    <div className="avatar-list-stacked flex">
                      {data?.team?.users?.map(
                        (team: { user: any }, index: number) => (
                          <div key={index} className="relative group">
                            <span className="avatar avatar-sm avatar-rounded">
                              {team?.user?.photo ? (
                                <img
                                  src={
                                    getImageUrl(team.user?.photo) ||
                                    "../../../assets/images/faces/2.jpg"
                                  }
                                  alt={team.user?.firstName || "User"}
                                  style={{ objectFit: "cover" }}
                                />
                              ) : (
                                <i className="ri-account-circle-line me-1 align-middle text-3xl"></i>
                              )}
                            </span>

                            {/* Tooltip */}
                            {team.user?.firstName && (
                              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 invisible group-hover:visible bg-black text-white text-xs rounded py-1 px-2 z-10">
                                {`${team.user?.firstName ?? ""} ${
                                  team.user?.lastName ?? ""
                                }`}
                              </div>
                            )}
                          </div>
                        )
                      )}
                      {data?.members?.map(
                        (team: { user: any }, index: number) => (
                          <div key={index} className="relative group">
                            <span className="avatar avatar-sm avatar-rounded">
                              {team?.user?.photo ? (
                                <img
                                  src={
                                    getImageUrl(team.user?.photo) ||
                                    "../../../assets/images/faces/2.jpg"
                                  }
                                  alt={team.user?.firstName || "User"}
                                  style={{ objectFit: "cover" }}
                                />
                              ) : (
                                <i className="ri-account-circle-line me-1 align-middle text-3xl"></i>
                              )}
                            </span>

                            {/* Tooltip */}
                            {team.user?.firstName && (
                              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 invisible group-hover:visible bg-black text-white text-xs rounded py-1 px-2 z-10">
                                {`${team.user?.firstName ?? ""} ${
                                  team.user?.lastName ?? ""
                                }`}
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                      Service Type
                    </span>

                    {isEdit ? (
                      <Select
                        name="serviceType"
                        options={config?.CASE_SERVICE_TYPE?.map(
                          (option: any) => {
                            return {
                              value: option,
                              label: `${option}`,
                            };
                          }
                        )}
                        value={config?.CASE_SERVICE_TYPE?.map(
                          (option: any) => ({
                            value: option,
                            label: option,
                          })
                        )?.find((option: any) => {
                          return option.value === data?.serviceType;
                        })}
                        className="basic-multi-select"
                        menuPlacement="auto"
                        classNamePrefix="Select2"
                        placeholder="Select Service Type"
                        onChange={(e: any) =>
                          setData({ ...data, serviceType: e.value })
                        }
                      />
                    ) : (
                      <span className="block">
                        <span className="badge bg-primary/10 text-primary">
                          {toWordUpperCase(data?.serviceType ?? "N/A")}
                        </span>
                      </span>
                    )}
                  </div>
                  {/* <div>
                  <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                    Status
                  </span>
                  <span className="block">
                    <span className="badge bg-primary/10 text-primary">
                      {toWordUpperCase(data?.status ?? "")}
                    </span>
                  </span>
                </div> */}
                  {/* <div>
                  <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                    Priority
                  </span>
                  <span className="block text-[.875rem] font-semibold">
                    <span className="badge bg-success/10 text-success">
                      {toWordUpperCase(data?.priority ?? "")}
                    </span>
                  </span>
                </div> */}
                  <div className="xl:col-span-4 col-span-12">
                    <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                      Nature Of Work
                    </span>
                    {isEdit ? (
                      <>
                        <input
                          type="text"
                          className="form-control"
                          id="input-label"
                          placeholder=" Nature Of Work"
                          value={data?.natureOfWork}
                          onChange={(e) => {
                            setData({
                              ...data,
                              natureOfWork: e.target.value,
                            });
                          }}
                        />
                      </>
                    ) : (
                      <span className="block text-[.875rem] font-semibold">
                        {data?.natureOfWork ?? ""}
                      </span>
                    )}
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                      Fixed Fee
                    </span>
                    {isEdit ? (
                      <>
                        <input
                          type="number"
                          className="form-control"
                          id="input-label"
                          placeholder="Fixed Fee"
                          value={data?.fixedFee}
                          onChange={(e) => {
                            setData({
                              ...data,
                              fixedFee: e.target.value,
                            });
                          }}
                        />
                      </>
                    ) : (
                      <span className="block text-[.875rem] font-semibold">
                        {data?.fixedFee ?? ""}
                      </span>
                    )}
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                      Acceptance Fee
                    </span>
                    {isEdit ? (
                      <>
                        <input
                          type="number"
                          className="form-control"
                          id="input-label"
                          placeholder="Acceptance Fee :"
                          value={data?.acceptanceFee}
                          onChange={(e) => {
                            setData({
                              ...data,
                              acceptanceFee: e.target.value,
                            });
                          }}
                        />
                      </>
                    ) : (
                      <span className="block text-[.875rem] font-semibold">
                        {data?.acceptanceFee ?? ""}
                      </span>
                    )}
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                      Success Fee
                    </span>
                    {isEdit ? (
                      <>
                        <input
                          type="number"
                          className="form-control"
                          id="input-label"
                          placeholder="Success Fee"
                          value={data?.successFee}
                          onChange={(e) => {
                            setData({
                              ...data,
                              successFee: e.target.value,
                            });
                          }}
                        />
                      </>
                    ) : (
                      <span className="block text-[.875rem] font-semibold">
                        {data?.successFee ?? ""}
                      </span>
                    )}
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                      Cap Fee
                    </span>
                    {isEdit ? (
                      <>
                        <input
                          type="number"
                          className="form-control"
                          id="input-label"
                          placeholder="Cap Fee"
                          value={data?.capFee}
                          onChange={(e) => {
                            setData({
                              ...data,
                              capFee: e.target.value,
                            });
                          }}
                        />
                      </>
                    ) : (
                      <span className="block text-[.875rem] font-semibold">
                        {data?.capFee ?? ""}
                      </span>
                    )}
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                      Fixed Ope
                    </span>
                    {isEdit ? (
                      <>
                        <input
                          type="number"
                          className="form-control"
                          id="input-label"
                          placeholder="Fixed Ope"
                          value={data?.fixedOpe}
                          onChange={(e) => {
                            setData({
                              ...data,
                              fixedOpe: e.target.value,
                            });
                          }}
                        />
                      </>
                    ) : (
                      <span className="block text-[.875rem] font-semibold">
                        {data?.fixedOpe ?? ""}
                      </span>
                    )}
                  </div>
                  <div className="xl:col-span-4 col-span-12">
                    <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                      Non Fixed Ope
                    </span>
                    {isEdit ? (
                      <>
                        <input
                          type="number"
                          className="form-control"
                          id="input-label"
                          placeholder="Non Fixed Ope"
                          value={data?.nonFixedOpe}
                          onChange={(e) => {
                            setData({
                              ...data,
                              nonFixedOpe: e.target.value,
                            });
                          }}
                        />
                      </>
                    ) : (
                      <span className="block text-[.875rem] font-semibold">
                        {data?.nonFixedOpe ?? ""}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="box custom-box">
              <div className="box-header">
                <div className="box-title">Case History</div>
              </div>
              <div className="box-body">
                <ul className="list-unstyled profile-timeline">
                  {data?.statusHistory?.map((history) => {
                    return (
                      <li>
                        <div>
                          <span className="avatar avatar-sm bg-primary/10 !text-primary !rounded-full profile-timeline-avatar">
                            <img
                              src={
                                getImageUrl(auth.user?.photo) ||
                                "../../../assets/images/faces/2.jpg"
                              }
                              alt=""
                              className="!rounded-full"
                              style={{ objectFit: "cover" }}
                            />
                          </span>
                          <p className="mb-2">
                            <b>
                              {auth.user?.email?.toString() ==
                              history?.updatedBy?.email?.toString()
                                ? "You"
                                : history?.updatedBy?.firstName}
                            </b>{" "}
                            {toWordUpperCase(history.status)} this case{" "}
                            <span className="float-end text-[0.6875rem] text-[#8c9097] dark:text-white/50">
                              {moment
                                .utc(history.date)
                                .format("DD,MMM YYYY - HH:mm")
                                ?.toString()}
                            </span>
                          </p>
                          <p className="text-[#8c9097] dark:text-white/50 mb-0">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: history.description,
                              }}
                            />
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="box-footer">
                <div className="list-group-item">
                  <div className="sm:flex items-center leading-none">
                    <div className="me-4">
                      <span className="avatar avatar-md ">
                        <img
                          src={
                            getImageUrl(auth.user?.photo) ||
                            "../../../assets/images/faces/2.jpg"
                          }
                          alt=""
                          className="!rounded-full"
                          style={{ objectFit: "cover" }}
                        />
                      </span>
                    </div>
                    <div className="flex-grow">
                      <div className="inline-flex !w-full">
                        <Select
                          name="status"
                          options={config?.CASE_STATUSES?.map((option: any) => {
                            return {
                              value: option,
                              label: `${option}`,
                            };
                          })}
                          className="basic-multi-select mr-2 min-w-[10rem]"
                          menuPlacement="auto"
                          classNamePrefix="Select2"
                          placeholder="Select Status"
                          onChange={(e: any) => {
                            setStatusFormData({
                              ...statusFormData,
                              status: e.value,
                            });
                          }}
                        />
                        <input
                          type="text"
                          className="form-control !w-full !rounded-e-none"
                          placeholder="Post Anything"
                          aria-label="Recipient's username with two button addons"
                          value={statusFormData?.description}
                          onChange={(e) => {
                            setStatusFormData({
                              ...statusFormData,
                              description: e.target.value,
                            });
                          }}
                        />

                        <button
                          className="ti-btn bg-primary text-white !mb-0 !rounded-s-none"
                          type="button"
                          onClick={() => {
                            submitStatus(data._id);
                          }}
                          disabled={updatingStatus}
                        >
                          {updatingStatus ? <ButtonSpinner text="" /> : "Post"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* billing overview */}
            {data && <BillingOverview caseInfo={data} />}

            {Object.keys(data?.metaData ?? {}).length > 0 && (
              <div className="box custom-box">
                <div className="box-header">
                  <div className="box-title">Meta Data</div>
                </div>
                <div className="box-body">
                  {Object.keys(data?.metaData ?? {}).length > 0 && (
                    <JsonPreview data={data?.metaData ?? {}} />
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="xl:col-span-4 col-span-12">
            <CaseTeamOverview
              fetchData={fetchData}
              data={data}
              pageData={pageData}
              fetchPageData={fetchPageData}
            />

            <div className="box custom-box overflow-hidden">
              <div className="box-header justify-between">
                <div className="box-title">Case Documents</div>
                <Link
                  href={
                    "/file-manager/?mode=explorer&id=" + data?.paperMergeNodeId
                  }
                  scroll={false}
                  className="px-2 font-normal text-[0.75rem] text-[#8c9097] dark:text-white/50"
                  aria-expanded="false"
                >
                  View All
                </Link>
              </div>
              <div className="box-body !p-0">
                <ul className="list-group list-group-flush">
                  {data.files?.map((file: any) => {
                    return <FileRow file={file} />;
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </>
    </Fragment>
  );
}
