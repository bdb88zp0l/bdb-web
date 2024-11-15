/**
 * The `ClientSetting` component is the main entry point for the client setting page in the admin section of the application. It renders the following sub-components:
 * - `Pageheader`: Displays the page header with the current page, active page, and main page information.
 * - `Seo`: Provides SEO-related metadata for the page.
 * - `CodeSetting`: Allows the user to manage code-related settings.
 * - `AccountTypeSetting`: Allows the user to manage account type settings.
 * - `ServiceTypeSetting`: Allows the user to manage service type settings.
 * - `IndustrySetting`: Allows the user to manage industry settings.
 *
 * This component is used within the `app/(components)/(contentlayout)/admin/client-setting/page.tsx` file.
 */
"use client";
import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import React, { Fragment, useEffect, useState } from "react";
import AccountTypeSetting from "@/shared/page-components/client-setting/AccountTypeSetting";
import CodeSetting from "@/shared/page-components/client-setting/CodeSetting";
import IndustrySetting from "@/shared/page-components/client-setting/IndustrySetting";

const ClientSetting = () => {
  return (
    <Fragment>
      <Seo title={"Client Setting"} />
      <Pageheader
        currentpage="Client Setting"
        activepage="Admin"
        mainpage="Client Setting"
      />
      <div className="grid grid-cols-12 gap-6">
        <CodeSetting />
        <AccountTypeSetting />
        <IndustrySetting />
      </div>
    </Fragment>
  );
};

export default ClientSetting;
