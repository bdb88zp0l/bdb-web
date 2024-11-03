import React, { useEffect, useState } from "react";
import ButtonSpinner from "@/shared/layout-components/loader/ButtonSpinner";
import { userPrivateRequest } from "@/config/axios.config";
import { toast } from "react-toastify";
import { useConfig } from "@/shared/providers/ConfigProvider";
import Editor from "@/shared/common-components/Editor";

export default function CurrencySetting() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [inputValue, setInputValue] = useState("");

  const config = useConfig();

  // Handle form submission
  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate a save operation
    userPrivateRequest
      .post(
        `api/config/update`,
        {
          records: [
            {
              name: "ANNOUNCEMENT_SETTINGS",
              value: announcement,
            },
          ],
        },
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
  useEffect(() => {
    setAnnouncement(config?.ANNOUNCEMENT_SETTINGS ?? "");
  }, [config?.ANNOUNCEMENT_SETTINGS]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnnouncement(e.target.value);
  };

  return (
    <div className="xl:col-span-6 col-span-12">
      <div className="box custom-box">
        <div className="box-header">
          <div className="box-title !text-start">Announcement Setup</div>
        </div>
        <div className="box-body">
          <div className="xl:col-span-6 col-span-12">
            <label htmlFor="service-type" className="form-label">
              Announcement
            </label>
            {/* <input
              type="text"
              className="form-control"
              id="service-type"
              placeholder="Type announcement"
              value={announcement}
              onChange={handleInputChange}
            /> */}
            <div id="project-descriptioin-editor">
              <Editor
                onChange={(html) => {
                  setAnnouncement(html);
                }}
                value={announcement ?? ""}
              />
            </div>
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
  );
}
