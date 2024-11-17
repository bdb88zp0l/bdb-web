/**
 * Defines the menu items for the sidebar navigation.
 * The `MenuItems` array contains objects that represent the different menu items,
 * including their titles, icons, paths, and sub-menu items.
 * This configuration is used to render the sidebar navigation in the application.
 */
import { hasPermission } from "@/utils/utils";
import React from "react";

const DashboardIcon = <i className="bx bx-home side-menu__icon"></i>;

const CalIcon = <i className="bx bx-calendar side-menu__icon"></i>;

const ConIcon = <i className="bx bx-book-content side-menu__icon"></i>;

const ClIcon = <i className="bx bx-user side-menu__icon"></i>;

const CasIcon = <i className="bx bx-briefcase side-menu__icon"></i>;

const FolIcon = <i className="bx bx-library side-menu__icon"></i>;

const AdminIcon = <i className="bx bx-group side-menu__icon"></i>;
const HrIcon = <i className="bx bx-group side-menu__icon"></i>;

export const MenuItems: any = [
  {
    menutitle: "MAIN",
  },

  {
    path: "/dashboard",
    type: "link",
    active: false,
    selected: false,
    dirchange: false,
    title: "Dashboard",
    icon: DashboardIcon,
    permission: "dashboard",
  },

  {
    menutitle: "WEB APPS",
  },

  {
    path: "/calendar",
    type: "link",
    active: false,
    selected: false,
    dirchange: false,
    title: "Calendar",
    icon: CalIcon,
    permission: ["calendar.read", "event.read"],
  },
  {
    path: "/contacts",
    type: "link",
    active: false,
    selected: false,
    dirchange: false,
    title: "Contacts",
    icon: ConIcon,
    permission: "contact.read",
  },
  {
    path: "/client-management",
    type: "link",
    active: false,
    selected: false,
    dirchange: false,
    title: "Client Management",
    icon: ClIcon,
    permission: "client.read",
  },

  {
    title: "Case Management",
    icon: CasIcon,
    type: "link",
    active: false,
    selected: false,
    dirchange: false,
    path: "/cases/list",
    permission: "case.read",
  },
  {
    path: "/file-manager",
    type: "link",
    active: false,
    selected: false,
    dirchange: false,
    title: "Knowledge Base",
    icon: FolIcon,
    permission: "file_manager.read",
  },
  {
    title: "HRM",
    icon: HrIcon,
    type: "sub",
    menusub: true,
    active: false,
    selected: false,
    dirchange: false,
    permission: ["dsr.read"],
    children: [
      {
        path: "/hrm/dsr",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "DSR",
        permission: "dsr.read",
      },
    ],
  },

  {
    title: "Admin",
    icon: AdminIcon,
    type: "sub",
    menusub: true,
    active: false,
    selected: false,
    dirchange: false,
    permission: [
      "team.read",
      "user.read",
      "role.read",
      "permission.setup",
      "case.setting",
      "client.setting",
    ],
    children: [
      {
        path: "/admin/workspace-setting",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Workspace Setting",
        permission: "workspace.setting",
      },
      {
        path: "/admin/role-management",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Role Management",
        permission: "role.read",
      },
      {
        path: "/admin/permission-management",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Permission Management",
        permission: "permission.setup",
      },
      {
        path: "/admin/user-management",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "User Management",
        permission: "user.read",
      },
      {
        path: "/admin/team-management",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Team Management",
        permission: "team.read",
      },
      {
        path: "/admin/dashboard-setting",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Dashboard Setting",
        permission: "dashboard.setting",
      },
      {
        path: "/admin/client-setting",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Client Setting",
        permission: "client.setting",
      },
      {
        path: "/admin/case-setting",
        type: "link",
        active: false,
        selected: false,
        dirchange: false,
        title: "Case Setting",
        permission: "case.setting",
      },
    ],
  },
];
