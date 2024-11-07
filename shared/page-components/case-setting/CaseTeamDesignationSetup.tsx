"use client";
import { useEffect, useState } from "react";
/**
 * A loading spinner component to be displayed on buttons during submission.
 */
import ButtonSpinner from "@/shared/layout-components/loader/ButtonSpinner";
/**
 * A utility function that provides a private request instance for making authenticated requests to the server.
 * This request instance is configured with the necessary headers and authentication credentials to make secure requests on behalf of the authenticated user.
 */
import { userPrivateRequest } from "@/config/axios.config";
import { toast } from "react-toastify";
/**
 * Provides access to the application's configuration settings.
 * This hook can be used to retrieve any configuration values that are needed by the component.
 */
import { useConfig } from "@/shared/providers/ConfigProvider";

interface DesignationRecord {
  _id: string;
  name: string;
}

export default function CaseTeamDesignationSetup() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [values, setValues] = useState<DesignationRecord[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null); // Track which record is being edited
  const [deletedIds, setDeletedIds] = useState<string[]>([]); // Track deleted items

  const config = useConfig();

  // Fetch the designations from the backend on mount
  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const response = await userPrivateRequest.get(
          `/api/case-team-designations`
        );
        setValues(response.data.data); // Set the values from the server
      } catch (err) {
        toast.error("Failed to load designations");
      }
    };

    fetchDesignations();
  }, []);

  // Handle form submission for saving changes to the server
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Send deleted records to be removed from the DB
      if (deletedIds.length > 0) {
        await userPrivateRequest.delete(`/api/case-team-designations`, {
          data: { ids: deletedIds }, // Send deleted IDs to backend
        });
      }

      // Send new or updated records to be saved in the DB
      const modifiedValues = values.filter(
        (value) => !deletedIds.includes(value._id)
      );
      await userPrivateRequest.post(`/api/case-team-designations`, {
        data: modifiedValues,
      });

      toast.success("Settings updated successfully!");
      config.fetchConfig(); // Optionally refetch the config if needed
      setDeletedIds([]); // Reset deleted IDs after successful save
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving data");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input change for adding or editing a currency
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Handle pressing Enter to either add a new currency or update an existing one
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      if (editingId) {
        // Handle update (rename)
        const updatedValues = values.map((value) =>
          value._id === editingId
            ? { ...value, name: inputValue.trim() }
            : value
        );
        setValues(updatedValues);
        setEditingId(null); // Exit edit mode
      } else {
        // Handle create (add new)
        if (!values.some((value) => value.name === inputValue.trim())) {
          setValues([...values, { _id: null, name: inputValue.trim() }]); // Temporary ID until saved in DB
        }
      }
      setInputValue(""); // Reset input field
    }
  };

  // Handle removing a value (mark for deletion)
  const handleRemove = (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setValues(values.filter((value) => value._id !== id));
      if (id && !id.startsWith("temp_")) {
        setDeletedIds([...deletedIds, id]); // Mark for deletion
      }
    }
  };

  // Handle editing a value
  const handleEdit = (id: string, name: string) => {
    setEditingId(id);
    setInputValue(name); // Set input field to the current value for editing
  };

  return (
    <div className="xl:col-span-4 col-span-12">
      <div className="box custom-box">
        <div className="box-header">
          <div className="box-title !text-start">Team Designation Setup</div>
        </div>
        <div className="box-body">
          <p>
            Setup and manage team designations for cases. You can define
            different roles that team members can take, such as "Lead,"
            "Analyst," etc. Add a new designation by entering the name below and
            pressing <b>Enter</b>.
          </p>
          <div className="xl:col-span-6 col-span-12">
            <label htmlFor="service-type" className="form-label">
              {editingId ? "Rename Designation" : "Add Designation"}
            </label>
            <input
              type="text"
              className="form-control"
              id="currency-input"
              placeholder="Enter currency and press Enter"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {values.map((value) => (
              <div
                key={value._id}
                className="bg-blue-500 text-white text-sm font-medium pl-2 flex items-center gap-2"
                style={{
                  borderRadius: "2px",
                }}
              >
                {value.name}
                <button
                  type="button"
                  className="text-white hover:bg-blue-700 px-1"
                  onClick={() => handleRemove(value._id)}
                >
                  &times;
                </button>
                <button
                  type="button"
                  className="text-white hover:bg-blue-700 px-1"
                  onClick={() => handleEdit(value._id, value.name)}
                >
                  ✎
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
            disabled={isSubmitting}
          >
            {isSubmitting ? <ButtonSpinner text="Saving" /> : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
