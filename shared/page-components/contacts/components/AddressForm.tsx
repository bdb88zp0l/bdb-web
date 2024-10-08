import React from 'react';

const AddressForm = ({
    addresses,
    setAddresses,
    addField,
    removeField,
}: any) => {
    const handleFieldChange = (index: number, field: string, value: string) => {
        setAddresses(
            addresses.map((address: any, i: number) =>
                i === index ? { ...address, [field]: value } : address
            )
        );
    };

    return (
        <div className="col-span-12">
            <label htmlFor="addresses" className="form-label mt-2">
                Addresses
            </label>
            {addresses.map((address, index) => (
                <div>
                    <div
                        key={index}
                        className="grid grid-cols-9 gap-2 flex-wrap mb-2"
                    >
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Label"
                            value={address.label}
                            onChange={(e) =>
                                handleFieldChange(
                                    index,
                                    'label',
                                    e.target.value
                                )
                            }
                        />
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Number / Building"
                            value={address.houseNumber}
                            onChange={(e) =>
                                handleFieldChange(
                                    index,
                                    'houseNumber',
                                    e.target.value
                                )
                            }
                        />
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Street"
                            value={address.street}
                            onChange={(e) =>
                                handleFieldChange(
                                    index,
                                    'street',
                                    e.target.value
                                )
                            }
                        />
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Barangay"
                            value={address.barangay}
                            onChange={(e) =>
                                handleFieldChange(
                                    index,
                                    'barangay',
                                    e.target.value
                                )
                            }
                        />
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Region"
                            value={address.region}
                            onChange={(e) =>
                                handleFieldChange(
                                    index,
                                    'region',
                                    e.target.value
                                )
                            }
                        />
                        <input
                            type="text"
                            className="form-control"
                            placeholder="City"
                            value={address.city}
                            onChange={(e) =>
                                handleFieldChange(index, 'city', e.target.value)
                            }
                        />

                        <input
                            type="text"
                            className="form-control"
                            placeholder="ZIP Code"
                            value={address.zip}
                            onChange={(e) =>
                                handleFieldChange(index, 'zip', e.target.value)
                            }
                        />

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Country"
                            value={address.country}
                            onChange={(e) =>
                                handleFieldChange(
                                    index,
                                    'country',
                                    e.target.value
                                )
                            }
                        />
                        {index !== 0 && (
                            <div>
                                <button
                                    type="button"
                                    className="ti-btn ti-btn-danger ti-btn-xs"
                                    onClick={() =>
                                        removeField(
                                            setAddresses,
                                            addresses,
                                            index
                                        )
                                    }
                                >
                                    &times;
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
            <button
                type="button"
                className="mt-4 px-4 py-2 ti-btn bg-primary text-white !font-medium"
                onClick={() => addField(setAddresses, addresses)}
            >
                + Add Address
            </button>
        </div>
    );
};

export default AddressForm;
