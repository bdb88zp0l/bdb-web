/**
 * The CaseSetting component is the main entry point for the case setting page in the admin section of the application.
 * It renders the page header, SEO metadata, and the CurrencySetting component, which handles the currency-related settings.
 * This component is used within the app/(components)/(contentlayout)/admin/case-setting/page.tsx file.
 */
"use client";
import Pageheader from "@/shared/layout-components/page-header/pageheader";
import Seo from "@/shared/layout-components/seo/seo";
import React, { Fragment, useEffect, useState } from "react";
import CurrencySetting from "@/shared/page-components/case-setting/CurrencySetting";
import CaseTeamDesignationSetup from "@/shared/page-components/case-setting/CaseTeamDesignationSetup";
import CaseStatusSetup from "@/shared/page-components/case-setting/CaseStatusSetup";
import VatSetup from "@/shared/page-components/case-setting/VatSetup";
import BillingTypeSetup from "@/shared/page-components/case-setting/BillingTypeSetup";
import ServiceTypeSetting from "@/shared/page-components/case-setting/ServiceTypeSetting";

const CaseSetting = () => {
  return (
    <Fragment>
      <Seo title={"Billing Setting"} />
      <Pageheader
        currentpage="Billing Setting"
        activepage="Admin"
        mainpage="Billing Setting"
      />
      <div className="grid grid-cols-12 gap-6">
        <CurrencySetting />
        <VatSetup />
      </div>
    </Fragment>
  );
};

export default CaseSetting;
