import React, { useEffect, useState } from "react";
import ButtonSpinner from "@/shared/layout-components/loader/ButtonSpinner";
import { userPrivateRequest } from "@/config/axios.config";
import { toast } from "react-toastify";
import { useConfig } from "@/shared/providers/ConfigProvider";

export default function IndustrySetting() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [values, setValues] = useState<string[]>([]);
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
              name: "CLIENT_INDUSTRY",
              value: values,
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
    setValues(config?.CLIENT_INDUSTRY ?? []);
  }, [config?.CLIENT_INDUSTRY]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Handle key press event for Enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      if (!values.includes(inputValue.trim())) {
        setValues([...values, inputValue.trim()]);
      }
      setInputValue(""); // Reset input field
    }
  };

  // Handle removing a value
  const handleRemove = (valueToRemove: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setValues(values.filter((value) => value !== valueToRemove));
    }
  };

  return (
    <div className="xl:col-span-4 col-span-12">
      <div className="box custom-box">
        <div className="box-header">
          <div className="box-title !text-start">Industry Setup</div>
        </div>
        <div className="box-body">
          <p>
            Define the types of industry available for your client. This setup
            allows you to categorize the different industries your system will
            support. To add a new industry, enter the industry name below and
            press
            <b> Enter</b>.
          </p>
          <div className="xl:col-span-6 col-span-12">
            <label htmlFor="service-type" className="form-label">
              Industry
            </label>
            <input
              type="text"
              className="form-control"
              id="service-type"
              placeholder="Enter service type and press Enter"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-blue-500 text-white text-sm font-medium pl-2 flex items-center gap-2"
                style={{
                  borderRadius: "2px",
                }}
              >
                {value}
                <button
                  type="button"
                  className="text-white hover:bg-blue-700 px-1"
                  onClick={() => handleRemove(value)}
                >
                  &times;
                </button>
              </div>
            ))}
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
