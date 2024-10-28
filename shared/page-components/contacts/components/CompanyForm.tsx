import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { userPrivateRequest } from "@/config/axios.config";

// Dynamically import react-select to avoid SSR issues
const Select = dynamic(() => import("react-select"), { ssr: false });
const CreatableSelect = dynamic(() => import("react-select/creatable"), {
  ssr: false,
});

const CompanyForm = ({
  companies,
  setCompanies,
  addField,
  removeField,
  pageData,
  fetchPageData,
  isDisabled,
}: any) => {
  const handleFieldChange = (index: number, field: string, value: string) => {
    setCompanies(
      companies.map((company: any, i: number) =>
        i === index ? { ...company, [field]: value } : company
      )
    );
  };

  const handleCompanyLogoChange = (index: number, e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    if (file) {
      reader.onloadend = () => {
        setCompanies(
          companies.map((company: any, i: number) =>
            i === index ? { ...company, logo: reader.result } : company
          )
        );
      };
      reader.readAsDataURL(file); // Load file as DataURL for preview
    }
  };

  const [companyGroups, setCompanyGroups] = useState([]);

  useEffect(() => {
    setCompanyGroups(pageData?.groups ?? []);
  }, [pageData]);

  return (
    <div className="col-span-12">
      {companies.map((company, index) => (
        <div key={index} className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <label htmlFor="companies" className="mt-2 text-[18px]">
                  Company Information
                </label>
                {index !== 0 && (
                  <button
                    type="button"
                    className="ml-2 px-3 py-1 bg-red-400 text-white rounded-md ti-btn ti-btn-danger ti-btn-xs"
                    onClick={() => removeField(setCompanies, companies, index)}
                  >
                    &times;
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                {/* Company Name */}
                <div>
                  <label htmlFor="companyName" className="form-label">
                    Company Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Company Name"
                    value={company.companyName}
                    onChange={(e) =>
                      handleFieldChange(index, "companyName", e.target.value)
                    }
                    disabled={isDisabled}
                  />
                </div>

                {/* Company Group */}
                <div className="">
                  <label htmlFor="companyGroup" className="form-label">
                    Company Group
                  </label>
                  <CreatableSelect
                    name="companyGroup"
                    options={companyGroups?.map((option: any) => {
                      return {
                        value: option._id,
                        label: option.name,
                      };
                    })}
                    className="basic-multi-select"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="Select or Enter Company Group"
                    isDisabled={isDisabled}
                    onChange={(e: any) =>
                      handleFieldChange(index, "companyGroup", e?.value)
                    }
                    value={companyGroups
                      ?.map((option: any) => {
                        return {
                          value: option._id,
                          label: option.name,
                        };
                      })
                      ?.find((option: any) => {
                        if (typeof company.companyGroup === "object") {
                          return option.value === company.companyGroup?._id;
                        }

                        return option.value === company.companyGroup;
                      })}
                    onCreateOption={(inputValue: string) => {
                      const res = userPrivateRequest
                        .post("/api/company-group", {
                          name: inputValue,
                          description: inputValue,
                        })
                        .then((res) => {
                          const companyGroup = res.data?.data?.companyGroup;
                          setCompanyGroups([
                            ...companyGroups,
                            { _id: companyGroup._id, name: companyGroup.name },
                          ]);
                          handleFieldChange(
                            index,
                            "companyGroup",
                            companyGroup._id
                          );
                        });
                    }}
                  />
                </div>

                {/* TIN */}
                <div>
                  <label htmlFor="tin" className="form-label">
                    TIN
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Taxpayer Identification Number (TIN)"
                    value={company.tin}
                    onChange={(e) =>
                      handleFieldChange(index, "tin", e.target.value)
                    }
                    disabled={isDisabled}
                  />
                </div>

                {/* Business Style */}
                <div>
                  <label htmlFor="businessStyle" className="form-label">
                    Business Style
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Business Style"
                    value={company.businessStyle}
                    onChange={(e) =>
                      handleFieldChange(index, "businessStyle", e.target.value)
                    }
                    disabled={isDisabled}
                  />
                </div>

                {/* Industry */}
                <div>
                  <label htmlFor="industry" className="form-label">
                    Industry
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Industry"
                    value={company.industry}
                    onChange={(e) =>
                      handleFieldChange(index, "industry", e.target.value)
                    }
                    disabled={isDisabled}
                  />
                </div>

                {/* Supervising Partner */}
                <div>
                  <label htmlFor="supervisingPartner" className="form-label">
                    Supervising Partner
                  </label>
                  <Select
                    name="supervisingPartner"
                    options={pageData?.users?.map((user: any) => {
                      return {
                        value: user._id,
                        label: user.firstName + " " + user.lastName,
                      };
                    })}
                    className="basic-multi-select"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="Select Supervising Partner"
                    isDisabled={isDisabled}
                    onChange={(e: any) =>
                      handleFieldChange(index, "supervisingPartner", e.value)
                    }
                    value={pageData?.users
                      ?.map((user: any) => {
                        return {
                          value: user._id,
                          label: user.firstName + " " + user.lastName,
                        };
                      })
                      ?.find((option: any) => {
                        if (typeof company.supervisingPartner === "object") {
                          return (
                            option.value === company.supervisingPartner?._id
                          );
                        }
                        return option.value === company.supervisingPartner;
                      })}
                  />
                </div>

                {/* Referred By */}
                <div>
                  <label htmlFor="referredBy" className="form-label">
                    Referred By
                  </label>
                  <Select
                    name="referredBy"
                    options={pageData?.users?.map((user: any) => {
                      return {
                        value: user._id,
                        label: user.firstName + " " + user.lastName,
                      };
                    })}
                    className="basic-multi-select"
                    menuPlacement="auto"
                    classNamePrefix="Select2"
                    placeholder="Select Referred By"
                    isDisabled={isDisabled}
                    onChange={(e: any) =>
                      handleFieldChange(index, "referredBy", e.value)
                    }
                    value={pageData?.users
                      ?.map((user: any) => {
                        return {
                          value: user._id,
                          label: user.firstName + " " + user.lastName,
                        };
                      })
                      ?.find((option: any) => {
                        if (typeof company.referredBy === "object") {
                          return option.value === company.referredBy?._id;
                        }
                        return option.value === company.referredBy;
                      })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Logo Upload */}
          <div className="col-span-6">
            <div className="xl:col-span-12 col-span-12">
              <div className="pt-36 text-center flex justify-center items-center flex-col">
                <span
                  className="avatar avatar-xxl"
                  style={{
                    width: "200px",
                    height: "200px",
                  }}
                >
                  <img
                    src={
                      !company?.logo
                        ? "../../../assets/images/faces/9.jpg"
                        : company?.logo?.includes("base64")
                        ? company?.logo
                        : `${process.env.NEXT_PUBLIC_AWS_S3_URL}/${company?.logo}`
                    }
                    alt="Company Logo Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <span className="badge rounded-pill bg-primary avatar-badge absolute bottom-0 right-0">
                    <label
                      htmlFor={`company-logo-${index}`}
                      className="cursor-pointer flex justify-center items-center"
                      style={{
                        width: "40px",
                        height: "40px",
                      }}
                    >
                      <input
                        type="file"
                        className="absolute w-full h-full opacity-0"
                        id={`company-logo-${index}`}
                        onChange={(e) => handleCompanyLogoChange(index, e)}
                        disabled={isDisabled}
                      />
                      <i className="fe fe-camera text-[1.25rem] !text-white"></i>
                    </label>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {!isDisabled && (
        <button
          type="button"
          className="mt-4 px-4 py-2 ti-btn bg-primary text-white !font-medium"
          onClick={() => addField(setCompanies, companies)}
        >
          + Add Company
        </button>
      )}
    </div>
  );
};

export default CompanyForm;
