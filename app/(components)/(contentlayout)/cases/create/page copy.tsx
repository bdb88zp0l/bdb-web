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
import { useRouter } from "next/navigation"; // Updated import

/**
 * The `CreateCase` component is responsible for rendering the UI and handling the logic for creating a new case.
 *
 * It fetches the necessary data from the server, such as users, clients, and designations, and allows the user to input
 * the case details, including the title, supervising partner, client, description, start and end dates, billing type,
 * currency, VAT setting, priority, team members, and attachments.
 *
 * The component uses various third-party libraries and components, such as `Editor`, `DatePicker`, `Select`, and `FilePond`,
 * to provide a rich and interactive user experience.
 *
 * When the user submits the form, the `handleSubmit` function is called, which sends the case data to the server and
 * displays a success or error message using the `toast` library.
 */
const CreateCase = () => {
  const router = useRouter();

  //Filepond
  const [files, setFiles] = useState<any>([]);
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
  useEffect(() => {
    fetchPageData();
  }, []);
  const config = useConfig();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    userPrivateRequest
      .post(`/api/cases`, {
        ...data,
        teams,
      })
      .then((res) => {
        setData({});
        setTeams([]);
        const caseDetails = res.data?.data ?? {};
        if (caseDetails?.paperMergeNodeId && files.length > 0) {
          let parentId = caseDetails?.paperMergeNodeId;
          let caseId = caseDetails?._id;
          const formData = new FormData();

          // Add uploaded files to FormData
          files?.forEach((fileItem: any) => {
            if (fileItem.file) {
              formData.append("files", fileItem.file);
            }
          });
          formData.append("caseId", caseId);
          formData.append("parentId", parentId);
          formData.append("visibility", "inherit");

          userPrivateRequest
            .post(`/api/file/documents/upload`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => {
              setIsSubmitting(false);
              toast.success(res.data?.message);
              router.push("/cases/list/");
            })
            .catch((err) => {
              toast.error(err.response?.data?.message);
            })
            .finally(() => {
              setIsSubmitting(false);
            });
        }
        toast.success(res.data?.message);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Error occurred");
        setIsSubmitting(false);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Fragment>
      <Seo title={"Create Case"} />
      <Pageheader
        currentpage="Create Case"
        activepage="Cases"
        mainpage="Create Case"
      />
      <div className="grid grid-cols-12 gap-6">
        <div className="xl:col-span-12 col-span-12">
          <div className="box custom-box">
            <div className="box-header">
              <div className="box-title">Create Case</div>
            </div>
            <div className="box-body">
              <div className="grid grid-cols-12 gap-4">
                <div className="xl:col-span-4 col-span-12">
                  <label htmlFor="input-label" className="form-label">
                    Title :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="input-label"
                    placeholder="Enter Title"
                    onChange={(e) => {
                      setData({
                        ...data,
                        title: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="xl:col-span-4 col-span-12">
                  <label htmlFor="input-label1" className="form-label">
                    Supervising Partner :
                  </label>

                  <Select
                    name="supervisingPartner"
                    options={pageData?.users?.map((option: any) => {
                      return {
                        value: option._id,
                        label: `${option?.firstName ?? ""}  ${
                          option?.lastName ?? ""
                        }`,
                      };
                    })}
                    className="basic-multi-select"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="Select Supervising Partner"
                    onChange={(e: any) =>
                      setData({ ...data, supervisingPartner: e.value })
                    }
                  />
                </div>
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
                          option?.code ?? ""
                        }`,
                      };
                    })}
                    className="basic-multi-select"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="Select Client/Stakeholder"
                    onChange={(e: any) => setData({ ...data, client: e.value })}
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
                <div className="xl:col-span-6 col-span-12">
                  <label className="form-label">Start Date :</label>
                  <div className="form-group">
                    <div className="input-group">
                      <div className="input-group-text text-muted">
                        {" "}
                        <i className="ri-calendar-line"></i>{" "}
                      </div>
                      <DatePicker
                        className="ti-form-input ltr:rounded-l-none rtl:rounded-r-none focus:z-10"
                        selected={data.startDate}
                        onChange={(date) => {
                          setData({ ...data, startDate: date });
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="xl:col-span-6 col-span-12">
                  <label className="form-label">End Date :</label>
                  <div className="form-group">
                    <div className="input-group">
                      <div className="input-group-text text-muted">
                        {" "}
                        <i className="ri-calendar-line"></i>{" "}
                      </div>
                      <DatePicker
                        className="ti-form-input ltr:rounded-l-none rtl:rounded-r-none focus:z-10"
                        selected={data.endDate}
                        onChange={(date) => {
                          setData({ ...data, endDate: date });
                        }}
                      />
                    </div>
                  </div>
                </div>{" "}
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
                    name="vatSetting"
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
                  <label className="form-label">Priority :</label>
                  <Select
                    name="priority"
                    options={priorities}
                    className="js-example-placeholder-multiple w-full js-states"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="High"
                    onChange={(e: any) =>
                      setData({ ...data, priority: e.value })
                    }
                  />
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
                  />
                </div>
                <div className="xl:col-span-12 col-span-12">
                  <label htmlFor="text-area" className="form-label">
                    Attachments
                  </label>
                  <FilePond
                    files={files}
                    onupdatefiles={setFiles} // Update files state when files are added/removed
                    allowMultiple={true}
                    maxFiles={5}
                    name="files"
                    acceptedFileTypes={[
                      "image/*",
                      "application/pdf",
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    ]}
                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                  />
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
                  <ButtonSpinner text="Creating Case" />
                ) : (
                  "Create Case"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CreateCase;
