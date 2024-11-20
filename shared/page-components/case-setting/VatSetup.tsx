import React, { useEffect, useState } from "react";
import ButtonSpinner from "@/shared/layout-components/loader/ButtonSpinner";
import { userPrivateRequest } from "@/config/axios.config";
import { toast } from "react-toastify";
import { useConfig } from "@/shared/providers/ConfigProvider";

export default function VatSetup() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [values, setValues] = useState<{ rate: number; type: string }[]>([]);
  const [inputRate, setInputRate] = useState<number | "">("");
  const [rateType, setRateType] = useState("percentage");

  const config = useConfig();

  // Handle form submission
  const handleSubmit = () => {
    setIsSubmitting(true);
    // Save operation for VAT settings
    userPrivateRequest
      .post(
        `api/config/update`,
        {
          records: [
            {
              name: "VAT_SETTINGS",
              value: values,
            },
          ],
        },
        {}
      )
      .then((res) => {
        config.fetchConfig();
        toast.success("VAT rates updated successfully!");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  useEffect(() => {
    setValues(config?.VAT_SETTINGS ?? []);
  }, [config?.VAT_SETTINGS]);

  // Handle rate input change
  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (rateType === "percentage" && (value < 0 || value > 50)) {
      toast.error("Percentage VAT rate must be between 0% and 50%");
      return;
    }
    setInputRate(value);
  };

  // Handle key press event for Enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputRate !== "" && !isNaN(inputRate)) {
      // Add rate if not already present
      setValues([...values, { rate: inputRate, type: rateType }]);
      setInputRate(""); // Reset input field
    }
  };

  // Handle removing a VAT rate
  const handleRemove = (index: number) => {
    if (window.confirm("Are you sure you want to delete this VAT rate?")) {
      setValues(values.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="xl:col-span-4 col-span-12">
      <div className="box custom-box">
        <div className="box-header">
          <div className="box-title !text-start">VAT Rates Setup</div>
        </div>
        <div className="box-body">
          <p>
            Define the VAT rates for case management. You can set both
            percentage-based VAT rates and flat rates for different services.
            The percentage rates can range between 0% and 50%. To add a new VAT
            rate, enter the rate below and press <b>Enter</b>.
          </p>
          <div className="xl:col-span-6 col-span-12">
            <label htmlFor="rate-type" className="form-label">
              VAT Rate Type
            </label>
            <select
              className="form-control"
              id="rate-type"
              value={rateType}
              onChange={(e) => setRateType(e.target.value)}
            >
              <option value="percentage">Percentage</option>
              <option value="flat">Flat Rate</option>
            </select>
          </div>
          <div className="xl:col-span-6 col-span-12 mt-3">
            <label htmlFor="vat-rate" className="form-label">
              {rateType === "percentage" ? "VAT Rate (%)" : "VAT Amount (Flat)"}
            </label>
            <input
              type="number"
              className="form-control"
              id="vat-rate"
              placeholder={`Enter ${
                rateType === "percentage" ? "percentage" : "flat rate"
              } and press Enter`}
              value={inputRate}
              onChange={handleRateChange}
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
                {value.type === "percentage"
                  ? `${value.rate}%`
                  : `Flat Rate: ${value.rate}`}
                <button
                  type="button"
                  className="text-white hover:bg-blue-700 px-1"
                  onClick={() => handleRemove(index)}
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
