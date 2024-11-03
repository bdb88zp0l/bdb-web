/**
 * The `CaseSetting` component is the main entry point for the case setting page in the admin section of the application.
 * It renders the page header, SEO metadata, and the `CurrencySetting` component, which handles the currency-related settings.
 * This component is used within the `app/(components)/(contentlayout)/admin/case-setting/page.tsx` file.
 */
"use client";
import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import React, { Fragment, useEffect, useState } from "react";
import Announcement from "@/shared/page-components/dashboard-setting/Announcement";

const CaseSetting = () => {
  return (
    <Fragment>
      <Seo title={"Dashboard Setting"} />
      <Pageheader
        currentpage="Dashboard Setting"
        activepage="Admin"
        mainpage="Dashboard Setting"
      />
      <div className="grid grid-cols-12 gap-6">
        <Announcement />
      </div>
    </Fragment>
  );
};

export default CaseSetting;
