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
import { getImageUrl, toWordUpperCase } from '@/utils/utils';
import TwoFASetupModal from '@/shared/modals/TwoFASetupModal';

// Dynamically import react-select to avoid SSR issues
const Select = dynamic(() => import('react-select'), { ssr: false });

const ShowModal = ({ data, closeModal, modalOpen }: any) => {
    // const [modalOpen, setModalOpen] = useState(false);

    // const openModal = () => setModalOpen(true);
    // const closeModal = () => setModalOpen(false);

    const [isAuthenticatorModalOpen, setIsAuthenticatorModalOpen] =
        useState(false);
    const [changePasswordData, setChangePasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const [changePasswordLoading, setChangePasswordLoading] = useState(false);
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setChangePasswordLoading(true);
        const { currentPassword, newPassword, confirmNewPassword } =
            changePasswordData;
        if (newPassword !== confirmNewPassword) {
            toast.error('The new password and confirmation do not match. Please try again.');
            return;
        }
        userPrivateRequest
            .post('/api/security/changePassword/' + data._id, {
                // currentPassword,
                newPassword,
                confirmNewPassword,
                sourcePage: 'user-management',
            })
            .then((res) => {
                toast.success('Password changed successfully');
                setChangePasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmNewPassword: '',
                });
            })
            .catch((err) => {
                toast.error(err.response.data.message);
            })
            .finally(() => {
                setChangePasswordLoading(false);
            });
    };

    return (
        <>
            <Modal isOpen={modalOpen} close={closeModal}>
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
                            <div className="sm:flex items-start px-6 py-2 border-b border-dashed border-defaultborder dark:border-defaultborder/10 main-profile-cover">
                                <div className="avatar avatar-xxl avatar-rounded online me-4 !bottom-0 !mb-0">
                                    <img
                                        src={
                                            data?.photo
                                                ? `${getImageUrl(data?.photo)}`
                                                : '../../../assets/images/faces/9.jpg'
                                        }
                                        alt=""
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                                <div className="flex-grow main-profile-info">
                                    <div className="flex items-center justify-between">
                                        <h6 className="font-semibold mb-1 text-white">
                                            {data?.firstName} {data?.lastName}
                                        </h6>
                                    </div>
                                    <p className="mb-1 text-white  op-7">
                                        {data?.companyGroup?.name ?? ''}
                                    </p>
                                </div>
                            </div>
                            <div className="px-6 py-2 border-b border-dashed border-defaultborder dark:border-defaultborder/10">
                                <p className="text-[.875rem] mb-2 me-4 font-semibold">
                                    Role:
                                </p>

                                <div className="">
                                    <p className="text-[#8c9097] dark:text-white/50 op-8 mb-0">
                                        {data?.roleType === 'superAdmin'
                                            ? 'Super Admin'
                                            : data?.role?.name ?? ''}
                                    </p>
                                </div>
                            </div>
                            <div className="px-6 py-2 border-b border-dashed border-defaultborder dark:border-defaultborder/10">
                                <p className="text-[.875rem] mb-2 me-4 font-semibold">
                                    Status
                                </p>
                                <div>
                                    <span className="badge bg-light text-[#8c9097] dark:text-white/50 m-1">
                                        {toWordUpperCase(data?.status)}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="text-[.875rem] mb-2 font-semibold">
                                    Created At:
                                </p>
                                <div className="avatar-list-stacked">
                                    <p className="text-[#8c9097] dark:text-white/50 op-8 mb-0">
                                        {data?.createdAt
                                            ? moment(data?.createdAt).format(
                                                  'MMM DD, YYYY hh:mm A'
                                              )
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>

                            <div className="p-4">
                                <p className="text-[.875rem] mb-2 font-semibold">
                                    Contact Information:
                                </p>
                                <div className="avatar-list-stacked">
                                    <div className="flex  mb-2">
                                        <div className="me-2">
                                            <span className="avatar avatar-sm avatar-rounded bg-light !text-[#8c9097] dark:text-white/50">
                                                <i className="ri-mail-line align-middle text-[.875rem]"></i>
                                            </span>
                                        </div>
                                        <div>{data?.email}</div>
                                    </div>

                                    <div className="flex items-center mb-2">
                                        <div className="me-2">
                                            <span className="avatar avatar-sm avatar-rounded bg-light !text-[#8c9097] dark:text-white/50">
                                                <i className="ri-phone-line align-middle text-[.875rem]"></i>
                                            </span>
                                        </div>
                                        <div>{data?.phone}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Reset password */}

                            <div className="p-4 grid grid-cols-12 gap-4">
                                <div className="xl:col-span-6 col-span-12">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[0.875rem] mb-1 font-semibold">
                                                Reset Password
                                            </p>
                                            <p className="text-[0.75rem] text-[#8c9097] dark:text-white/50">
                                                Password should be min of{' '}
                                                <b className="text-success">
                                                    8 digits<sup>*</sup>
                                                </b>
                                                ,atleast{' '}
                                                <b className="text-success">
                                                    One Capital letter
                                                    <sup>*</sup>
                                                </b>{' '}
                                                and{' '}
                                                <b className="text-success">
                                                    One Special Character
                                                    <sup>*</sup>
                                                </b>{' '}
                                                included.
                                            </p>
                                            <div className="mb-2">
                                                <label
                                                    htmlFor="new-password"
                                                    className="form-label"
                                                >
                                                    New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    className="form-control w-full !rounded-md"
                                                    id="new-password"
                                                    placeholder="New Password"
                                                    value={
                                                        changePasswordData.newPassword
                                                    }
                                                    onChange={(e) => {
                                                        setChangePasswordData({
                                                            ...changePasswordData,
                                                            newPassword:
                                                                e.target.value,
                                                        });
                                                    }}
                                                />
                                            </div>
                                            <div className="mb-0">
                                                <label
                                                    htmlFor="confirm-password"
                                                    className="form-label"
                                                >
                                                    Confirm Password
                                                </label>
                                                <input
                                                    type="password"
                                                    className="form-control w-full !rounded-md"
                                                    id="confirm-password"
                                                    placeholder="Confirm Password"
                                                    value={
                                                        changePasswordData.confirmNewPassword
                                                    }
                                                    onChange={(e) => {
                                                        setChangePasswordData({
                                                            ...changePasswordData,
                                                            confirmNewPassword:
                                                                e.target.value,
                                                        });
                                                    }}
                                                />
                                            </div>

                                            <div className="ltr:float-right rtl:float-left mt-4">
                                                <button
                                                    type="button"
                                                    className="ti-btn bg-primary text-white"
                                                    onClick={
                                                        handleChangePassword
                                                    }
                                                >
                                                    {changePasswordLoading ? (
                                                        <ButtonSpinner text="Saving" />
                                                    ) : (
                                                        'Save Changes'
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="xl:col-span-6 col-span-12">
                                    <div className="box  shadow-none mb-0 border dark:border-defaultborder/10">
                                        <div className="box-body">
                                            <div className="sm:flex block items-center mb-6 justify-between">
                                                <div>
                                                    <p className="text-[0.875rem] mb-1 font-semibold">
                                                        Two Step Verification
                                                    </p>
                                                    <p className="text-[0.75rem] text-[#8c9097] dark:text-white/50 mb-0">
                                                        Two step verificatoin is
                                                        very secured and
                                                        restricts in happening
                                                        faulty practices.
                                                    </p>
                                                </div>
                                                <div className="custom-toggle-switch sm:ms-2 ms-0">
                                                    {data?.googleAuthenticator ==
                                                    'on' ? (
                                                        <>
                                                            <input
                                                                id="two-step"
                                                                name="authenticatorOn"
                                                                type="checkbox"
                                                                defaultChecked={
                                                                    true
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    setIsAuthenticatorModalOpen(
                                                                        true
                                                                    );
                                                                }}
                                                            />
                                                        </>
                                                    ) : (
                                                        <input
                                                            id="two-step"
                                                            name="authenticatorOff"
                                                            type="checkbox"
                                                            defaultChecked={
                                                                false
                                                            }
                                                            onChange={(e) => {
                                                                setIsAuthenticatorModalOpen(
                                                                    true
                                                                );
                                                            }}
                                                        />
                                                    )}
                                                    <label
                                                        htmlFor="two-step"
                                                        className="label-primary mb-1"
                                                    ></label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Reset password */}
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

            {/* Modal */}

            <TwoFASetupModal
                isOpen={isAuthenticatorModalOpen}
                onClose={() => {
                    setIsAuthenticatorModalOpen(false);
                }}
                user={data}
                sourcePage="user-management"
            />
            {/* Modal end */}
        </>
    );
};

export default ShowModal;
