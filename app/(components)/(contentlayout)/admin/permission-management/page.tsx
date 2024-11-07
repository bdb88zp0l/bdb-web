"use client";
import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import dynamic from "next/dynamic";
const Select = dynamic(() => import("react-select"), { ssr: false });
import { userPrivateRequest } from "@/config/axios.config";
import ButtonSpinner from "@/shared/layout-components/loader/ButtonSpinner";
import { toast } from "react-toastify";

const PermissionManagement = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roles, setRoles] = useState<any>([]);
  const [permissions, setPermissions] = useState<any>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<any>({});

  // Fetch permissions and roles from the API
  const fetchPermissionsAndRoles = async () => {
    setIsFetching(true);
    try {
      const res = await userPrivateRequest.get(`/api/permission/setup`);
      const { roles, permissions } = res.data.data;
      setRoles(roles);
      setPermissions(permissions);

      // Initialize the selected permissions state based on roles
      const initialPermissions: any = {};
      roles.forEach((role: any) => {
        initialPermissions[role._id] = role.permissions.map(
          (permission: any) => permission._id
        );
      });
      setSelectedPermissions(initialPermissions);
    } catch (error) {
      console.error("Error fetching permissions and roles:", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchPermissionsAndRoles();
  }, []);

  // Toggle permission for a specific role
  const togglePermission = (roleId: string, permissionId: string) => {
    setSelectedPermissions((prev: any) => {
      const currentRolePermissions = prev[roleId] || [];
      if (currentRolePermissions.includes(permissionId)) {
        // Remove permission
        return {
          ...prev,
          [roleId]: currentRolePermissions.filter(
            (id: string) => id !== permissionId
          ),
        };
      } else {
        // Add permission
        return {
          ...prev,
          [roleId]: [...currentRolePermissions, permissionId],
        };
      }
    });
  };

  // Submit updated permissions for each role
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const payload = Object.keys(selectedPermissions).map((roleId) => ({
      roleId,
      permissions: selectedPermissions[roleId],
    }));
    userPrivateRequest
      .post(`/api/permission/setup`, {
        roles: payload,
      })
      .then((response) => {
        toast.success(response.data?.message);
      })
      .catch((error) => {
        console.error("Error updating permissions:", error);
        toast.error(error.response.data?.message);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Fragment>
      <Seo title={"Permission Setting"} />
      <Pageheader
        currentpage="Permission Setting"
        activepage="Admin"
        mainpage="Permission Setting"
      />
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="box custom-box">
            <div className="box-header">
              <div className="box-title !text-start">
                Role-Based Permission Setup
              </div>
            </div>
            <div className="box-body">
              {/* Table Header for Roles */}
              <div className="grid grid-cols-6 gap-4 border-b pb-2">
                <div className="text-start font-semibold">Permissions</div>
                {roles.map((role: any) => (
                  <div key={role._id} className="text-center font-semibold">
                    {role.name}
                  </div>
                ))}
              </div>

              {/* Permissions Rows */}
              {permissions.map((permission: any) => (
                <div
                  key={permission._id}
                  className="grid grid-cols-6 gap-4 items-center py-4 border-b"
                >
                  {/* Permission Name */}
                  <div className="text-left">{permission.name}</div>

                  {/* Checkboxes for each Role */}
                  {roles.map((role: any) => (
                    <div key={role._id} className="text-center">
                      <input
                        type="checkbox"
                        className="form-checkbox text-primary"
                        checked={
                          selectedPermissions[role._id]?.includes(
                            permission._id
                          ) || false
                        }
                        onChange={() =>
                          togglePermission(role._id, permission._id)
                        }
                      />
                    </div>
                  ))}
                </div>
              ))}

              {/* Submit Button */}
              <div className="mt-6 text-right">
                <button
                  type="button"
                  className="ti-btn bg-primary text-white !font-medium"
                  onClick={handleSubmit}
                >
                  {isSubmitting ? <ButtonSpinner text="Saving" /> : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default PermissionManagement;
