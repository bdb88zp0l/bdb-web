/**
 * The `CaseSetting` component is the main entry point for the case setting page in the admin section of the application.
 * It renders the page header, SEO metadata, and the `CurrencySetting` component, which handles the currency-related settings.
 * This component is used within the `app/(components)/(contentlayout)/admin/case-setting/page.tsx` file.
 */
"use client";
import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import React, { Fragment, useEffect, useState } from "react";
import { useConfig } from "@/shared/providers/ConfigProvider";
import { userPrivateRequest } from "@/config/axios.config";
import { toast } from "react-toastify";
import Editor from "@/shared/common-components/Editor";
import ButtonSpinner from "@/shared/layout-components/loader/ButtonSpinner";
import store from "@/shared/redux/store";

const CaseSetting = () => {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<any>({})

  const config = useConfig();
  
  const { auth } = store.getState();
  useEffect(() => {
    setData(auth?.user?.defaultWorkspace ?? {})
  }, [auth?.user?.defaultWorkspace])

  // Handle form submission
  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate a save operation
    userPrivateRequest
      .patch(
        `api/workspaces/${data?._id}`,
        data,
        {}
      )
      .then((res) => {
        config.fetchConfig();
        toast.success("Setting updated successfully!");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    setData({
      ...data,
      [e.target.name]: e.target.value
    })
  };
  return (
    <Fragment>
      <Seo title={"Workspace Setting"} />
      <Pageheader
        currentpage="Workspace Setting"
        activepage="Admin"
        mainpage="Workspace Setting"
      />
      <div className="grid grid-cols-12 gap-6">

        <div className="xl:col-span-6 col-span-12">
          <div className="box custom-box">
            <div className="box-header">
              <div className="box-title !text-start">Workspace Setting</div>
            </div>
            <div className="box-body">
              <div className="xl:col-span-6 col-span-12">
                <label htmlFor="service-type" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="service-type"
                  placeholder="Type name"
                  value={data?.name}
                  name="name"
                  onChange={handleInputChange}
                />
              </div>
              <div className="xl:col-span-6 col-span-12">
                <label htmlFor="service-type" className="form-label">
                  Phone
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="service-type"
                  placeholder="Type phone"
                  value={data?.phone}
                  name="phone"
                  onChange={handleInputChange}
                />
              </div>

              <div className="xl:col-span-6 col-span-12">
                <label htmlFor="service-type" className="form-label">
                  Email
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="service-type"
                  placeholder="Type email"
                  value={data?.email}
                  name="email"
                  onChange={handleInputChange}
                />
              </div>

              <div className="xl:col-span-6 col-span-12">
                <label htmlFor="service-type" className="form-label">
                  Address Line 1
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="service-type"
                  placeholder="Type address line 1"
                  value={data?.addressLine1 ?? ""}
                  name="addressLine1"
                  onChange={handleInputChange}
                />
              </div>

              <div className="xl:col-span-6 col-span-12">
                <label htmlFor="service-type" className="form-label">
                  Address Line 2
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="service-type"
                  placeholder="Type address line 2"
                  value={data?.addressLine2 ?? ""}
                  name="addressLine2"
                  onChange={handleInputChange}
                />
              </div>


            </div>
            <div className="box-body">
              <button
                type="button"
                className="ti-btn bg-primary text-white !font-medium"
                onClick={handleSubmit}
                disabled={isSubmitting} // Disable button when submitting
              >
                {isSubmitting ? <ButtonSpinner text="Saving" /> : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CaseSetting;
