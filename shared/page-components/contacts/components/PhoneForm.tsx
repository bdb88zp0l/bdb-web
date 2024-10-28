import React from "react";

const PhoneForm = ({
  phones,
  setPhones,
  addField,
  removeField,
  isDisabled,
}: any) => {
  const handleFieldChange = (index: number, field: string, value: string) => {
    setPhones(
      phones.map((phone: any, i: number) =>
        i === index ? { ...phone, [field]: value } : phone
      )
    );
  };

  return (
    <div className="col-span-12">
      <label className="form-label">Phone Numbers</label>
      {phones.map((phone: any, index: number) => (
        <div key={index} className="grid grid-cols-4 gap-2 items-center mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Label"
            disabled={isDisabled}
            value={phone.label}
            onChange={(e) => handleFieldChange(index, "label", e.target.value)}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Country Code"
            disabled={isDisabled}
            value={phone.dialCode}
            onChange={(e) =>
              handleFieldChange(index, "dialCode", e.target.value)
            }
          />
          <input
            type="text"
            className="form-control"
            placeholder="Phone Number"
            disabled={isDisabled}
            value={phone.phoneNumber}
            onChange={(e) =>
              handleFieldChange(index, "phoneNumber", e.target.value)
            }
          />
          {index !== 0 && (
            <div>
              {" "}
              <button
                type="button"
                className="ti-btn ti-btn-danger ti-btn-xs"
                onClick={() => removeField(setPhones, phones, index)}
              >
                &times;
              </button>
            </div>
          )}
        </div>
      ))}
      {!isDisabled && (
        <button
          type="button"
          className="mt-4 px-4 py-2 ti-btn bg-primary text-white !font-medium"
          onClick={() => addField(setPhones, phones)}
        >
          + Add Phone
        </button>
      )}
    </div>
  );
};

export default PhoneForm;
