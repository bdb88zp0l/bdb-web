"use client";
import { userPrivateRequest } from "@/config/axios.config";
import Editor from "@/shared/common-components/Editor";
import Editordata, {
  Data,
  Data1,
  multiselectdata,
} from "@/shared/data/apps/projects/createprojectdata";
import ButtonSpinner from "@/shared/layout-components/loader/ButtonSpinner";
import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import { useConfig } from "@/shared/providers/ConfigProvider";
import dynamic from "next/dynamic";
import React, { Fragment, useEffect, useState } from "react";
const DatePicker = dynamic(() => import("react-datepicker"), { ssr: false });
const Select = dynamic(() => import("react-select"), { ssr: false });
import { FilePond } from "react-filepond";
import CreatableSelect from "react-select/creatable";
import { toast } from "react-toastify";

/**
 * The `EditCase` component is responsible for rendering the edit case form. It fetches the necessary data from the server, including the case details, users, and clients, and allows the user to update the case information.
 *
 * The component uses various UI components, such as `Editor`, `DatePicker`, and `Select`, to provide a user-friendly interface for editing the case details. It also handles the submission of the updated case data to the server and displays success or error messages using the `toast` library.
 *
 * The component receives the `params` object as a prop, which contains the `id` of the case being edited.
 */
const EditCase = ({ params }: { params: { id: string } }) => {
  const [pageData, setPageData] = useState<any>({});
  const [data, setData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teams, setTeams] = useState<any>([]);
  const priorities = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  const fetchPageData = async () => {
    const res = await userPrivateRequest.get("/api/cases/data/get");
    let responseData = res.data.data ?? {};
    setPageData(responseData);
  };

  const fetchData = async () => {
    userPrivateRequest.get(`/api/cases/${params.id}`).then((res) => {
      setData(res.data?.data);
      setTeams(
        res.data?.data?.teams?.map((team: any) => {
          return {
            user: team.user?._id,
            designation: team.designation._id,
            rate: team.rate,
            _id: team._id,
          };
        })
      );
    });
  };
  useEffect(() => {
    fetchPageData();
    fetchData();
  }, []);
  const config = useConfig();

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const res = await userPrivateRequest.patch(`/api/cases/${params.id}`, {
        ...data,
        ...(typeof data.client == "object"
          ? { client: data.client._id }
          : { client: data.client }),
        ...(typeof data.team == "object"
          ? { team: data.team._id }
          : { team: data.team }),
      });
      toast.success(res.data?.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Fragment>
      <Seo title={"Update Case"} />
      <Pageheader
        currentpage="Update Case"
        activepage="Cases"
        mainpage="Update Case"
      />
      <div className="grid grid-cols-12 gap-6">
        <div className="xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-header">
              <div className="box-title">Update Case</div>
            </div>
            <div className="box-body">
              <div className="grid grid-cols-12 gap-4">
                <div className="xl:col-span-4 col-span-12">
                  <label htmlFor="input-label1" className="form-label">
                    Client / Stakeholder :
                  </label>

                  <Select
                    name="client"
                    options={pageData?.clients?.map((option: any) => {
                      return {
                        value: option._id,
                        label: `${option?.companyName ?? ""} - ${
                          option?.clientNumber ?? ""
                        }`,
                      };
                    })}
                    defaultValue={pageData?.clients
                      ?.map((option: any) => {
                        return {
                          value: option._id,
                          label: `${option?.companyName ?? ""} - ${
                            option?.clientNumber ?? ""
                          }`,
                        };
                      })
                      ?.find((option: any) => {
                        return option.value === data?.client?._id;
                      })}
                    value={pageData?.clients
                      ?.map((option: any) => {
                        return {
                          value: option._id,
                          label: `${option?.companyName ?? ""} - ${
                            option?.clientNumber ?? ""
                          }`,
                        };
                      })
                      ?.find((option: any) => {
                        return option.value === data?.client?._id;
                      })}
                    className="basic-multi-select"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="Select Client/Stakeholder"
                    onChange={(e: any) => setData({ ...data, client: e.value })}
                  />
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <label htmlFor="input-label" className="form-label">
                    Case Number :
                  </label>
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
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <label htmlFor="input-label" className="form-label">
                    Title :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="input-label"
                    placeholder="Enter Title"
                    value={data?.title}
                    onChange={(e) => {
                      setData({
                        ...data,
                        title: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="xl:col-span-12 col-span-12 mb-4">
                  <label htmlFor="text-area" className="form-label">
                    Description :
                  </label>
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
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <label htmlFor="input-label1" className="form-label">
                    Service Type :
                  </label>

                  <Select
                    name="serviceType"
                    options={config?.CASE_SERVICE_TYPE?.map((option: any) => {
                      return {
                        value: option,
                        label: `${option}`,
                      };
                    })}
                    value={config?.CASE_SERVICE_TYPE?.map((option: any) => ({
                      value: option,
                      label: option,
                    }))?.find((option: any) => {
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
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <label className="form-label">Start Date :</label>
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
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <label className="form-label">End Date :</label>
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
                </div>{" "}
                <div className="xl:col-span-12 col-span-12 mt-2">
                  <label
                    htmlFor="text-area"
                    className=" text-[1rem] font-semibold"
                  >
                    Case Members
                  </label>
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <label htmlFor="input-label1" className="form-label">
                    Team :
                  </label>

                  <Select
                    name="team"
                    options={pageData?.teams?.map((option: any) => {
                      return {
                        value: option._id,
                        label: `${option?.title ?? ""}`,
                      };
                    })}
                    className="basic-multi-select"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="Select Team"
                    onChange={(e: any) => setData({ ...data, team: e.value })}
                    defaultValue={pageData?.teams
                      ?.map((option: any) => {
                        return {
                          value: option._id,
                          label: `${option?.title ?? ""}`,
                        };
                      })
                      ?.find((option: any) => {
                        return option.value === data?.team?._id;
                      })}
                    value={pageData?.teams
                      ?.map((option: any) => {
                        return {
                          value: option._id,
                          label: `${option?.title ?? ""}`,
                        };
                      })
                      ?.find((option: any) => {
                        return option.value === data?.team?._id;
                      })}
                  />
                </div>
                <div className="xl:col-span-12 col-span-12">
                  <label
                    htmlFor="text-area"
                    className="text-[1rem] font-semibold"
                  >
                    Billing Information
                  </label>
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <label htmlFor="input-label1" className="form-label">
                    Billing Type :
                  </label>

                  <Select
                    name="defaultBillingType"
                    options={config?.CASE_BILLING_TYPES?.map((option: any) => {
                      return {
                        value: option,
                        label: `${option}`,
                      };
                    })}
                    className="basic-multi-select"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="Select Billing Type"
                    value={config?.CASE_BILLING_TYPES?.map((option: any) => ({
                      value: option,
                      label: option,
                    }))?.find((option: any) => {
                      return option.value === data?.defaultBillingType;
                    })}
                    defaultValue={config?.CASE_BILLING_TYPES?.map(
                      (option: any) => ({
                        value: option,
                        label: option,
                      })
                    )?.find((option: any) => {
                      return option.value === data?.defaultBillingType;
                    })}
                    onChange={(e: any) =>
                      setData({ ...data, defaultBillingType: e.value })
                    }
                  />
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <label htmlFor="input-label2" className="form-label">
                    Currency :
                  </label>

                  <Select
                    name="currency"
                    options={config?.CASE_CURRENCIES?.map((option: any) => {
                      return {
                        value: option,
                        label: `${option}`,
                      };
                    })}
                    defaultValue={config?.CASE_CURRENCIES?.map(
                      (option: any) => ({
                        value: option,
                        label: option,
                      })
                    )?.find((option: any) => {
                      return option.value === data?.currency;
                    })}
                    value={config?.CASE_CURRENCIES?.map((option: any) => ({
                      value: option,
                      label: option,
                    }))?.find((option: any) => {
                      return option.value === data?.currency;
                    })}
                    className="basic-multi-select"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="Select Currency"
                    onChange={(e: any) =>
                      setData({ ...data, currency: e.value })
                    }
                  />
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <label htmlFor="input-label2" className="form-label">
                    VAT Setting :
                  </label>

                  <Select
                    name="vat"
                    options={config?.CASE_VAT_SETTINGS?.map((option: any) => {
                      return {
                        value: option,
                        label:
                          option.type === "percentage"
                            ? `${option.rate}%`
                            : `Flat Rate: ${option.rate} ${
                                data?.currency ?? "PHP"
                              }`,
                      };
                    })}
                    value={config?.CASE_VAT_SETTINGS?.map((option: any) => ({
                      value: option,
                      label:
                        option.type === "percentage"
                          ? `${option.rate}%`
                          : `Flat Rate: ${option.rate} ${
                              data?.currency ?? "PHP"
                            }`,
                    }))?.find((option: any) => {
                      return (
                        JSON.stringify(option.value) ==
                        JSON.stringify(data?.vatSetting)
                      );
                    })}
                    defaultValue={config?.CASE_VAT_SETTINGS?.map(
                      (option: any) => ({
                        value: option,
                        label:
                          option.type === "percentage"
                            ? `${option.rate}%`
                            : `Flat Rate: ${option.rate} ${
                                data?.currency ?? "PHP"
                              }`,
                      })
                    )?.find((option: any) => {
                      return (
                        JSON.stringify(option.value) ==
                        JSON.stringify(data?.vatSetting)
                      );
                    })}
                    className="basic-multi-select"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="Select VAT Setting"
                    onChange={(e: any) =>
                      setData({ ...data, vatSetting: e.value })
                    }
                  />
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <label className="form-label">Billing Start At :</label>
                  <div className="form-group">
                    <div className="input-group">
                      <div className="input-group-text text-muted">
                        {" "}
                        <i className="ri-calendar-line"></i>{" "}
                      </div>
                      <DatePicker
                        className="ti-form-input ltr:rounded-l-none rtl:rounded-r-none focus:z-10"
                        selected={data.billingStart}
                        onChange={(date) => {
                          setData({ ...data, billingStart: date });
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <label className="form-label">Billing End At :</label>
                  <div className="form-group">
                    <div className="input-group">
                      <div className="input-group-text text-muted">
                        {" "}
                        <i className="ri-calendar-line"></i>{" "}
                      </div>
                      <DatePicker
                        className="ti-form-input ltr:rounded-l-none rtl:rounded-r-none focus:z-10"
                        selected={data.billingEnd}
                        onChange={(date) => {
                          setData({ ...data, billingEnd: date });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="box-footer">
              <button
                type="button"
                className="ti-btn bg-primary text-white !font-medium ms-auto float-right"
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <ButtonSpinner text="Updating Case" />
                ) : (
                  "Update Case"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default EditCase;
