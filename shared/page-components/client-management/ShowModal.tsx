'use client';
/**
 * A reusable React component that renders a modal dialog for editing a user.
 *
 * @param {object} props - The component props.
 * @param {object} props.user - The user data to pre-fill the form.
 * @param {array} props.roles - The list of roles available for the user.
 * @param {function} props.fetchContacts - A callback function to refresh the user list.
 * @returns {React.ReactElement} The rendered modal component for editing a user.
 */

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';
import { userPrivateRequest } from '@/config/axios.config';
import ButtonSpinner from '@/shared/layout-components/loader/ButtonSpinner';
import Modal from '@/shared/modals/Modal';
import moment from 'moment';
import { toWordUpperCase } from '@/utils/utils';
import JsonPreview from '@/shared/common-components/JsonPreview';

// Dynamically import react-select to avoid SSR issues
const Select = dynamic(() => import('react-select'), { ssr: false });

const ShowModal = ({ data, IsmodalOpen, closeModal }: any) => {
    return (
        <>
            <Modal isOpen={IsmodalOpen} close={closeModal}>
                <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out h-[calc(100%-3.5rem)] min-h-[calc(100%-3.5rem)] flex items-center min-w-[calc(100%-3.5rem)]">
                    <div className="max-h-full overflow-hidden ti-modal-content text-balance min-w-full">
                        <div className="ti-modal-header">
                            <h6
                                className="modal-title text-[1rem] font-semibold text-defaulttextcolor"
                                id="mail-ComposeLabel"
                            >
                                {data?.firstName ?? ''} {data?.lastName ?? ''}
                            </h6>
                            <button
                                type="button"
                                className="hs-dropdown-toggle !text-[1rem] !font-semibold !text-defaulttextcolor"
                                data-hs-overlay="#todo-compose"
                                onClick={closeModal}
                            >
                                <span className="sr-only">Close</span>
                                <i className="ri-close-line"></i>
                            </button>
                        </div>
                        <div className="ti-modal-body px-4 overflow-y-auto">
                            <div className="sm:flex items-start px-6 py-2 main-profile-cover">
                                <div className="avatar avatar-xxl avatar-rounded online me-4 !bottom-0 !mb-0">
                                    <img
                                        src={
                                            data?.logo
                                                ? `${process.env.NEXT_PUBLIC_AWS_S3_URL}/${data?.logo}`
                                                : '../../../assets/images/faces/9.jpg'
                                        }
                                        alt=""
                                    />
                                </div>
                                <div className="flex-grow main-profile-info">
                                    <div className="flex items-center justify-between">
                                        <h6 className="font-semibold mb-1 text-white">
                                            {data?.companyName}
                                        </h6>
                                    </div>
                                    <p className="mb-1 text-white  op-7">
                                        {data?.companyGroup?.name ?? ''}
                                    </p>
                                </div>
                            </div>

                            {/* Two-column layout starts here */}
                            <div className="flex flex-wrap gap-x-8">
                                {/* Left column: Information section */}
                                <div className="w-full lg:w-1/2">
                                    {/* Information sections */}
                                    <div className="mb-6">
                                        <p className="text-[0.9375rem] font-semibold mb-1">
                                            Client Code:
                                        </p>
                                        <p className="text-[#8c9097] dark:text-white/50 op-8">
                                            {data?.clientNumber}
                                        </p>
                                    </div>
                                    <div className="mb-6">
                                        <p className="text-[.875rem] font-semibold mb-1">
                                            Account Type:
                                        </p>
                                        <p className="text-[#8c9097] dark:text-white/50 op-8">
                                            {toWordUpperCase(data?.accountType)}
                                        </p>
                                    </div>
                                    <div className="mb-6">
                                        <p className="text-[.875rem] font-semibold mb-1">
                                            Taxpayer Identification Number
                                            (TIN):
                                        </p>
                                        <p className="text-[#8c9097] dark:text-white/50 op-8">
                                            {data?.tin}
                                        </p>
                                    </div>
                                    <div className="mb-6">
                                        <p className="text-[.875rem] font-semibold mb-1">
                                            Business Style:
                                        </p>
                                        <p className="text-[#8c9097] dark:text-white/50 op-8">
                                            {data?.businessStyle}
                                        </p>
                                    </div>
                                    <div className="mb-6">
                                        <p className="text-[.875rem] font-semibold mb-1">
                                            Industry:
                                        </p>
                                        <p className="text-[#8c9097] dark:text-white/50 op-8">
                                            {toWordUpperCase(data?.industry)}
                                        </p>
                                    </div>

                                    {/* Status and badges */}
                                    <div className="mb-6">
                                        <p className="text-[.875rem] font-semibold mb-1">
                                            Status:
                                        </p>
                                        <span className="badge bg-light text-[#8c9097] dark:text-white/50">
                                            {toWordUpperCase(data?.status)}
                                        </span>
                                    </div>
                                    <div className="mb-6">
                                        <p className="text-[.875rem] font-semibold mb-1">
                                            Date Withdrawn:
                                        </p>
                                        <p className="text-[#8c9097] dark:text-white/50 op-8">
                                            {data?.withdrawnAt
                                                ? moment(
                                                    data?.withdrawnAt
                                                ).format('MMM DD, YYYY')
                                                : 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                {/* Right column: Contact Information section */}
                                <div className="w-full lg:w-1/2">
                                    {/* Contact Information */}
                                    <div className="mb-6">
                                        <p className="text-[.875rem] font-semibold mb-2">
                                            Contact Information:
                                        </p>
                                        <div className="avatar-list-stacked">
                                            <div className="flex mb-4">
                                                <div className="me-2">
                                                    <span className="avatar avatar-sm avatar-rounded bg-light !text-[#8c9097] dark:text-white/50">
                                                        <i className="ri-mail-line align-middle text-[.875rem]"></i>
                                                    </span>
                                                </div>
                                                <div>
                                                    {data?.emails?.map(
                                                        (email: any) => (
                                                            <div
                                                                key={
                                                                    email?.value
                                                                }
                                                            >
                                                                {email?.value}
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center mb-4">
                                                <div className="me-2">
                                                    <span className="avatar avatar-sm avatar-rounded bg-light !text-[#8c9097] dark:text-white/50">
                                                        <i className="ri-phone-line align-middle text-[.875rem]"></i>
                                                    </span>
                                                </div>
                                                <div>
                                                    {data?.phones?.map(
                                                        (phone: any) => (
                                                            <div
                                                                key={
                                                                    phone?.phoneNumber
                                                                }
                                                            >
                                                                {
                                                                    phone?.dialCode
                                                                }{' '}
                                                                {
                                                                    phone?.phoneNumber
                                                                }
                                                                {phone?.label && (
                                                                    <span className="badge bg-light text-[#8c9097] dark:text-white/50 m-1">
                                                                        {
                                                                            phone?.label
                                                                        }
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center mb-0">
                                                <div className="me-2">
                                                    <span className="avatar avatar-sm avatar-rounded bg-light !text-[#8c9097] dark:text-white/50">
                                                        <i className="ri-map-pin-line align-middle text-[.875rem]"></i>
                                                    </span>
                                                </div>
                                                <div>
                                                    {data?.addresses?.map(
                                                        (address: any) => (
                                                            <div
                                                                key={
                                                                    address?._id
                                                                }
                                                            >
                                                                {`${address.houseNumber ||
                                                                    'N/A'
                                                                    }, ${address.street ||
                                                                    'N/A'
                                                                    }, ${address.city ||
                                                                    'N/A'
                                                                    }, ${address.barangay ||
                                                                    'N/A'
                                                                    }, ${address.zip ||
                                                                    'N/A'
                                                                    }, ${address.region ||
                                                                    'N/A'
                                                                    }, ${address.country ||
                                                                    'N/A'
                                                                    }`}{' '}
                                                                <span className="badge bg-light text-[#8c9097] dark:text-white/50 m-1">
                                                                    {
                                                                        address?.label
                                                                    }
                                                                </span>{' '}
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>


                                        </div>
                                    </div>
                                    <JsonPreview data={data?.metaData} />
                                </div>
                            </div>
                            {/* Two-column layout ends here */}
                        </div>

                        <div className="ti-modal-footer">
                            <button
                                type="button"
                                className="hs-dropdown-toggle ti-btn  ti-btn-light align-middle"
                                data-hs-overlay="#todo-compose"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ShowModal;
