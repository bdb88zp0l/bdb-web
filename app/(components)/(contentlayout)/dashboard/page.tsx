"use client";
import { Dealsstatistics } from "@/shared/data/dashboards/crmdata";
import Seo from "@/shared/layout-components/seo/seo";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import * as Crmdata from "@/shared/data/dashboards/crmdata";
import dynamic from "next/dynamic";
import { userPrivateRequest } from "@/config/axios.config";
import { useConfig } from "@/shared/providers/ConfigProvider";
import moment from "moment";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
import store from "@/shared/redux/store";
import { formatAmount, formatMonth, getImageUrl } from "@/utils/utils";

const Crm = () => {



  const { auth } = store.getState();
  const config = useConfig();

  const getAnnouncement = config?.ANNOUNCEMENT_SETTINGS;
  const [data, setData] = useState<any>({
    caseStatusStatistics: []
  })

  const fetchDashboardData = async () => {
    const res = await userPrivateRequest.get(`api/dashboard`)
    setData(res.data?.data ?? {})
  }

  useEffect(() => {
    fetchDashboardData()

  }, []);



  console.log("Crmdata.Sourcedata.series", auth?.user)
  return (
    <Fragment>
      <Seo title={"Crm"} />
      <div className="md:flex block items-center justify-between my-[1.5rem] page-header-breadcrumb">
        <div>
          <p className="font-semibold text-[1.125rem] text-defaulttextcolor dark:text-defaulttextcolor/70 !mb-0 ">
            Welcome back, {auth?.user?.firstName} {auth?.user?.lastName}!
          </p>
          <p className="font-normal text-[#8c9097] dark:text-white/50 text-[0.813rem]">
            {auth?.user?.roleType === "superAdmin"
              ? "Super Admin"
              : auth?.user?.role?.name ?? ""}
          </p>
        </div>
        <div className="btn-list md:mt-0 mt-2">
          <button
            type="button"
            className="ti-btn bg-primary text-white btn-wave !font-medium !me-[0.45rem] !ms-0 !text-[0.85rem] !rounded-[0.35rem] !py-[0.51rem] !px-[0.86rem] shadow-none"
          >
            <i className="ri-filter-3-fill  inline-block"></i>Filters
          </button>
          <button
            type="button"
            className="ti-btn ti-btn-outline-secondary btn-wave !font-medium  !me-[0.45rem]  !ms-0 !text-[0.85rem] !rounded-[0.35rem] !py-[0.51rem] !px-[0.86rem] shadow-none"
          >
            <i className="ri-upload-cloud-line  inline-block"></i>Export
          </button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="xxl:col-span-9 xl:col-span-12  col-span-12">
          <div className="grid grid-cols-12 gap-x-6">
            <div className="xxl:col-span-4 xl:col-span-4  col-span-12">
              {getAnnouncement &&
                <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
                  <div className="box crm-highlight-card">
                    <div className="box-body">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-[1.125rem] text-white mb-2">
                            Announcement
                          </div>
                          <span className="block text-[0.75rem] text-white">
                            <span className="opacity-[0.7]  me-1 rtl:ms-1">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: getAnnouncement,
                                }}
                              />
                              {/* {getAnnouncement} */}
                            </span>
                          </span>
                        </div>
                        {/* <div>
                          <div id="crm-main">
                            <ReactApexChart
                              options={Crmdata.Target.options}
                              series={Crmdata.Target.series}
                              type="radialBar"
                              width={100}
                              height={127}
                            />
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>}
              <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
                <div className="box">
                  <div className="box-header flex justify-between">
                    <div className="box-title">Top Clients</div>
                    <div className="hs-dropdown ti-dropdown">
                      <Link
                        aria-label="anchor"
                        href="#!"
                        scroll={false}
                        className="flex items-center justify-center w-[1.75rem] h-[1.75rem]  !text-[0.8rem] !py-1 !px-2 rounded-sm bg-light border-light shadow-none !font-medium"
                        aria-expanded="false"
                      >
                        <i className="fe fe-more-vertical text-[0.8rem]"></i>
                      </Link>
                      <ul className="hs-dropdown-menu ti-dropdown-menu hidden">
                        <li>
                          <Link
                            className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                            href="#!"
                            scroll={false}
                          >
                            Week
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                            href="#!"
                            scroll={false}
                          >
                            Month
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                            href="#!"
                            scroll={false}
                          >
                            Year
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="box-body">
                    <ul className="list-none crm-top-deals mb-0">

                      {data?.topClients?.map((item: any, index: number) => (
                        <li className="mb-[0.9rem]">
                          <div className="flex items-start flex-wrap">
                            <div className="me-2">
                              <span className=" inline-flex items-center justify-center">

                                <span className="avatar avatar-rounded avatar-sm">
                                  {getImageUrl(item?.clientInfo?.logo) ? (
                                    <img
                                      src={`  ${getImageUrl(item?.clientInfo?.logo) ||
                                        "../../assets/images/user-circle.png"
                                        }`}
                                      alt=""
                                      style={{ objectFit: "cover" }}
                                    />
                                  ) : (
                                    <i className="ri-account-circle-line me-1 align-middle text-3xl  text-[#8c9097]"></i>
                                  )}
                                </span>
                              </span>
                            </div>
                            <div className="flex-grow w-[50%]">
                              <p className="font-semibold mb-[1.4px]  text-[0.813rem]">
                                {item?.clientInfo?.companyName ?? ""}
                              </p>
                              <p className="text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                                {item?.clientInfo?.emails?.length > 0 ? item?.clientInfo?.emails?.[0]?.value : ""}
                              </p>
                            </div>
                            <div className="font-semibold text-[0.9375rem] ">
                              {formatAmount(item?.totalContractPrice ?? 0)}
                            </div>
                          </div>
                        </li>))}
                    </ul>
                  </div>
                </div>
              </div>
              {/* <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
                <div className="box">
                  <div className="box-header justify-between">
                    <div className="box-title">Profit Earned</div>
                    <div className="hs-dropdown ti-dropdown">
                      <Link
                        href="#!"
                        scroll={false}
                        className="px-2 font-normal text-[0.75rem] text-[#8c9097] dark:text-white/50"
                        aria-expanded="false"
                      >
                        View All
                        <i className="ri-arrow-down-s-line align-middle ms-1 inline-block"></i>
                      </Link>
                      <ul
                        className="hs-dropdown-menu ti-dropdown-menu hidden"
                        role="menu"
                      >
                        <li>
                          <Link
                            className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                            href="#!"
                            scroll={false}
                          >
                            Today
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                            href="#!"
                            scroll={false}
                          >
                            This Week
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                            href="#!"
                            scroll={false}
                          >
                            Last Week
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="box-body !py-0 !ps-0">
                    <div id="crm-profits-earned">
                      <ReactApexChart
                        options={Crmdata.Earned.options}
                        series={Crmdata.Earned.series}
                        type="bar"
                        width={"100%"}
                        height={180}
                      />
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
            <div className="xxl:col-span-8  xl:col-span-8  col-span-12">
              <div className="grid grid-cols-12 gap-x-6">
                <div className="xxl:col-span-6 xl:col-span-6 col-span-12">
                  <div className="box overflow-hidden">
                    <div className="box-body">
                      <div className="flex items-top justify-between">
                        <div>
                          <span className="!text-[0.8rem]  !w-[2.5rem] !h-[2.5rem] !leading-[2.5rem] !rounded-full inline-flex items-center justify-center bg-primary">
                            <i className="ti ti-users text-[1rem] text-white"></i>
                          </span>
                        </div>
                        <div className="flex-grow ms-4">
                          <div className="flex items-center justify-between flex-wrap">
                            <div>
                              <p className="text-[#8c9097] dark:text-white/50 text-[0.813rem] mb-0">
                                Total Client
                              </p>
                              <h4 className="font-semibold  text-[1.5rem] !mb-2 ">
                                {data?.clientMonthlyData?.active?.totalCount ?? 0}
                              </h4>
                            </div>
                            <div id="crm-total-customers">
                              <ReactApexChart
                                options={Crmdata.Customers.options}
                                // series={Crmdata.Customers.series}

                                series={[{
                                  name: "Value",
                                  data: data?.clientMonthlyData?.active?.monthlyData?.map((item: any) => { return item?.growthPercentage < 0 ? 0 : item?.growthPercentage }),
                                },]}
                                type="line"
                                height={40}
                                width={100}
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between !mt-1">
                            <div>
                              <Link
                                className="text-primary text-[0.813rem]"
                                href="/client-management/"
                                scroll={false}
                              >
                                View All
                                <i className="ti ti-arrow-narrow-right ms-2 font-semibold inline-block"></i>
                              </Link>
                            </div>
                            <div className="text-end">
                              <p className={`mb-0 text-[0.813rem] font-semibold ${data?.clientMonthlyData?.active?.latestGrowth > 0 ? "text-success" : "text-danger"}`}>
                                {data?.clientMonthlyData?.active?.latestGrowth > 0 ? "+" : "-"}
                                {(data?.clientMonthlyData?.active?.latestGrowth ?? 0).toFixed(2)}%
                              </p>
                              <p className="text-[#8c9097] dark:text-white/50 opacity-[0.7] text-[0.6875rem]">
                                this month
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="xxl:col-span-6 xl:col-span-6 col-span-12">
                  <div className="box overflow-hidden">
                    <div className="box-body">
                      <div className="flex items-top justify-between">
                        <div>
                          <span className="!text-[0.8rem]  !w-[2.5rem] !h-[2.5rem] !leading-[2.5rem] !rounded-full inline-flex items-center justify-center bg-secondary">
                            <i className="ti ti-wallet text-[1rem] text-white"></i>
                          </span>
                        </div>
                        <div className="flex-grow ms-4">
                          <div className="flex items-center justify-between flex-wrap">
                            <div>
                              <p className="text-[#8c9097] dark:text-white/50 text-[0.813rem] mb-0">
                                Total Cases
                              </p>
                              <h4 className="font-semibold text-[1.5rem] !mb-2 ">
                                {data?.caseMonthlyData?.active?.totalCount ?? 0}
                              </h4>
                            </div>
                            <div id="crm-total-revenue">
                              <ReactApexChart
                                options={Crmdata.Revenue.options}
                                series={[{
                                  name: "Value",
                                  data: data?.caseMonthlyData?.active?.monthlyData?.reverse()?.map((item: any) => { return item?.growthPercentage < 0 ? 0 : item?.growthPercentage }),
                                },]}
                                type="line"
                                height={40}
                                width={100}
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <div>
                              <Link
                                className="text-secondary text-[0.813rem]"
                                href="/cases/list/"
                                scroll={false}
                              >
                                View All
                                <i className="ti ti-arrow-narrow-right ms-2 font-semibold inline-block"></i>
                              </Link>
                            </div>
                            <div className="text-end">
                              <p className={`mb-0 text-[0.813rem] font-semibold ${data?.caseMonthlyData?.active?.latestGrowth > 0 ? "text-success" : "text-danger"}`}>
                                {/* +25% */}

                                {data?.caseMonthlyData?.active?.latestGrowth > 0 ? "+" : "-"}
                                {(data?.caseMonthlyData?.active?.latestGrowth ?? 0).toFixed(2)}
                                %
                              </p>
                              <p className="text-[#8c9097] dark:text-white/50 opacity-[0.7] text-[0.6875rem]">
                                this month
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="xxl:col-span-6 xl:col-span-6 col-span-12">
                  <div className="box overflow-hidden">
                    <div className="box-body">
                      <div className="flex items-top justify-between">
                        <div>
                          <span className="!text-[0.8rem]  !w-[2.5rem] !h-[2.5rem] !leading-[2.5rem] !rounded-full inline-flex items-center justify-center bg-success">
                            <i className="ti ti-wave-square text-[1rem] text-white"></i>
                          </span>
                        </div>
                        <div className="flex-grow ms-4">
                          <div className="flex items-center justify-between flex-wrap">
                            <div>
                              <p className="text-[#8c9097] dark:text-white/50 text-[0.813rem] mb-0">
                                Inactive Clients
                              </p>
                              <h4 className="font-semibold text-[1.5rem] !mb-2 ">
                                {data?.clientMonthlyData?.inactive?.totalCount ?? 0}
                              </h4>
                            </div>
                            <div id="crm-conversion-ratio">
                              <ReactApexChart
                                options={Crmdata.Ratio.options}
                                series={[{
                                  name: "Value",
                                  data: data?.clientMonthlyData?.inactive?.monthlyData?.map((item: any) => { return item?.growthPercentage < 0 ? 0 : item?.growthPercentage }),
                                },]}
                                type="line"
                                height={40}
                                width={100}
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <div>
                              <Link
                                className="text-success text-[0.813rem]"
                                href="#!"
                                scroll={false}
                              >
                                View All
                                <i className="ti ti-arrow-narrow-right ms-2 font-semibold inline-block"></i>
                              </Link>
                            </div>
                            <div className="text-end">
                              <p className={`mb-0 text-[0.813rem] font-semibold ${data?.caseMonthlyData?.inactive?.latestGrowth > 0 ? "text-success" : "text-danger"}`}>
                                {data?.clientMonthlyData?.inactive?.latestGrowth > 0 ? "+" : "-"}
                                {(data?.clientMonthlyData?.inactive?.latestGrowth ?? 0).toFixed(2)}%
                              </p>
                              <p className="text-[#8c9097] dark:text-white/50 opacity-[0.7] text-[0.6875rem]">
                                this month
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="xxl:col-span-6 xl:col-span-6 col-span-12">
                  <div className="box overflow-hidden">
                    <div className="box-body">
                      <div className="flex items-top justify-between">
                        <div>
                          <span className="!text-[0.8rem]  !w-[2.5rem] !h-[2.5rem] !leading-[2.5rem] !rounded-full inline-flex items-center justify-center bg-warning">
                            <i className="ti ti-briefcase text-[1rem] text-white"></i>
                          </span>
                        </div>
                        <div className="flex-grow ms-4">
                          <div className="flex items-center justify-between flex-wrap">
                            <div>
                              <p className="text-[#8c9097] dark:text-white/50 text-[0.813rem] mb-0">
                                Inactive Cases
                              </p>
                              <h4 className="font-semibold text-[1.5rem] !mb-2 ">
                                {data?.caseMonthlyData?.inactive?.totalCount ?? 0}
                              </h4>
                            </div>
                            <div id="crm-total-deals">
                              <ReactApexChart
                                options={Crmdata.Deals.options}
                                series={[{
                                  name: "Value",
                                  data: data?.caseMonthlyData?.inactive?.monthlyData?.map((item: any) => { return item?.growthPercentage < 0 ? 0 : item?.growthPercentage }),
                                },]}
                                type="line"
                                height={40}
                                width={100}
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <div>
                              <Link
                                className="text-warning text-[0.813rem]"
                                href="#!"
                                scroll={false}
                              >
                                View All
                                <i className="ti ti-arrow-narrow-right ms-2 font-semibold inline-block"></i>
                              </Link>
                            </div>
                            <div className="text-end">
                              <p className={`mb-0 text-[0.813rem] font-semibold ${data?.caseMonthlyData?.inactive?.latestGrowth > 0 ? "text-success" : "text-danger"}`}>

                                {data?.caseMonthlyData?.inactive?.latestGrowth > 0 ? "+" : "-"}
                                {(data?.caseMonthlyData?.inactive?.latestGrowth ?? 0).toFixed(2)}%
                              </p>
                              <p className="text-[#8c9097] dark:text-white/50  opacity-[0.7] text-[0.6875rem]">
                                this month
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
                  <div className="box">
                    <div className="box-header !gap-0 !m-0 justify-between">
                      <div className="box-title">Contracts per Month</div>
                      <div className="hs-dropdown ti-dropdown">
                        <Link
                          href="#!"
                          scroll={false}
                          className="text-[0.75rem] px-2 font-normal text-[#8c9097] dark:text-white/50"
                          aria-expanded="false"
                        >
                          View All
                          <i className="ri-arrow-down-s-line align-middle ms-1 inline-block"></i>
                        </Link>
                        <ul
                          className="hs-dropdown-menu ti-dropdown-menu hidden"
                          role="menu"
                        >
                          <li>
                            <Link
                              className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                              href="#!"
                              scroll={false}
                            >
                              Today
                            </Link>
                          </li>
                          <li>
                            <Link
                              className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                              href="#!"
                              scroll={false}
                            >
                              This Week
                            </Link>
                          </li>
                          <li>
                            <Link
                              className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                              href="#!"
                              scroll={false}
                            >
                              Last Week
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="box-body !py-5">
                      <div id="crm-revenue-analytics">
                        <ReactApexChart
                          options={Crmdata.Revenueanalytics.options}
                          series={[{
                            group: "apexcharts-axis-0",
                            name: "Contract Price",
                            type: "line",
                            data: data?.contractPriceMonthlyStats?.map((item: any, index: number) => {
                              return {
                                x: formatMonth(item?._id),
                                y: item?.totalContractPrice
                              }
                            })
                          }]}
                          type="line"
                          width={"100%"}
                          height={350}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="xxl:col-span-12 xl:col-span-6  col-span-12">
              <div className="box">
                <div className="box-header justify-between">
                  <div className="box-title">Recent Activity</div>
                  <div className="hs-dropdown ti-dropdown">
                    <Link
                      href="#!"
                      scroll={false}
                      className="text-[0.75rem] px-2 font-normal text-[#8c9097] dark:text-white/50"
                      aria-expanded="false"
                    >
                      View All
                      <i className="ri-arrow-down-s-line align-middle ms-1 inline-block"></i>
                    </Link>
                    <ul
                      className="hs-dropdown-menu ti-dropdown-menu hidden"
                      role="menu"
                    >
                      <li>
                        <Link
                          className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                          href="#!"
                          scroll={false}
                        >
                          Today
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                          href="#!"
                          scroll={false}
                        >
                          This Week
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                          href="#!"
                          scroll={false}
                        >
                          Last Week
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="box-body">
                  <div>
                    <ul className="list-none mb-0 crm-recent-activity">
                      {data?.recentActivities?.map((item: any, index: number) => (
                        <li className="crm-recent-activity-content">
                          <div className="flex items-start">
                            <div className="me-4">
                              <span className="w-[1.25rem] h-[1.25rem] inline-flex items-center justify-center font-medium leading-[1.25rem] text-[0.65rem] text-primary bg-primary/10 rounded-full">
                                <i className="bi bi-circle-fill text-[0.5rem]"></i>
                              </span>
                            </div>

                            <div className="crm-timeline-content text-defaultsize">
                              <span>
                                {item?.title}
                              </span>
                              <span className="block text-[0.75rem] text-[#8c9097] dark:text-white/50">
                                {item?.user?.firstName} {item?.user?.lastName}
                              </span>
                            </div>
                            <div className="flex-grow text-end">
                              <span className="block text-[#8c9097] dark:text-white/50 text-[0.6875rem] opacity-[0.7]">
                                {moment(item?.createdAt).format("DD MMM YYYY, HH:mm")}
                              </span>
                            </div>
                          </div>
                        </li>))}

                    </ul>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="xxl:col-span-12 xl:col-span-12 col-span-12">
              <div className="box custom-card">
                <div className="box-header justify-between">
                  <div className="box-title">Deals Statistics</div>
                  <div className="flex flex-wrap gap-2">
                    <div>
                      <input
                        className="ti-form-control form-control-sm"
                        type="text"
                        placeholder="Search Here"
                        aria-label=".form-control-sm example"
                      />
                    </div>
                    <div className="hs-dropdown ti-dropdown">
                      <Link
                        href="#!"
                        scroll={false}
                        className="ti-btn ti-btn-primary !bg-primary !text-white !py-1 !px-2 !text-[0.75rem] !m-0 !gap-0 !font-medium"
                        aria-expanded="false"
                      >
                        Sort By
                        <i className="ri-arrow-down-s-line align-middle ms-1 inline-block"></i>
                      </Link>
                      <ul
                        className="hs-dropdown-menu ti-dropdown-menu !-mt-2 hidden"
                        role="menu"
                      >
                        <li>
                          <Link
                            className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                            href="#!"
                            scroll={false}
                          >
                            New
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                            href="#!"
                            scroll={false}
                          >
                            Popular
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                            href="#!"
                            scroll={false}
                          >
                            Relevant
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="box-body">
                  <div className="overflow-x-auto">
                    <table className="table min-w-full whitespace-nowrap table-hover border table-bordered">
                      <thead>
                        <tr className="border border-inherit border-solid dark:border-defaultborder/10">
                          <th scope="row" className="!ps-4 !pe-5">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="checkboxNoLabel1"
                              defaultValue=""
                              aria-label="..."
                            />
                          </th>
                          <th
                            scope="col"
                            className="!text-start !text-[0.85rem] min-w-[200px]"
                          >
                            Sales Rep
                          </th>
                          <th
                            scope="col"
                            className="!text-start !text-[0.85rem]"
                          >
                            Category
                          </th>
                          <th
                            scope="col"
                            className="!text-start !text-[0.85rem]"
                          >
                            Mail
                          </th>
                          <th
                            scope="col"
                            className="!text-start !text-[0.85rem]"
                          >
                            Location
                          </th>
                          <th
                            scope="col"
                            className="!text-start !text-[0.85rem]"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="!text-start !text-[0.85rem]"
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Dealsstatistics.map((idx) => (
                          <tr
                            className="border border-inherit border-solid hover:bg-gray-100 dark:border-defaultborder/10 dark:hover:bg-light"
                            key={Math.random()}
                          >
                            <th scope="row" className="!ps-4 !pe-5">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                defaultChecked={
                                  idx.checked === "defaultChecked"
                                }
                                defaultValue=""
                                aria-label="..."
                              />
                            </th>
                            <td>
                              <div className="flex items-center font-semibold">
                                <span className="!me-2 inline-flex justify-center items-center">
                                  <img
                                    src={idx.src}
                                    alt="img"
                                    className="w-[1.75rem] h-[1.75rem] leading-[1.75rem] text-[0.65rem]  rounded-full"
                                  />
                                </span>
                                {idx.name}
                              </div>
                            </td>
                            <td>{idx.role}</td>
                            <td>{idx.mail}</td>
                            <td>
                              <span
                                className={`inline-flex text-${idx.color} !py-[0.15rem] !px-[0.45rem] rounded-sm !font-semibold !text-[0.75em] bg-${idx.color}/10`}
                              >
                                {idx.location}
                              </span>
                            </td>
                            <td>{idx.date}</td>
                            <td>
                              <div className="flex flex-row items-center !gap-2 text-[0.9375rem]">
                                <Link
                                  aria-label="anchor"
                                  href="#!"
                                  scroll={false}
                                  className="ti-btn ti-btn-icon ti-btn-wave !gap-0 !m-0 !h-[1.75rem] !w-[1.75rem] text-[0.8rem] bg-success/10 text-success hover:bg-success hover:text-white hover:border-success"
                                >
                                  <i className="ri-download-2-line"></i>
                                </Link>
                                <Link
                                  aria-label="anchor"
                                  href="#!"
                                  scroll={false}
                                  className="ti-btn ti-btn-icon ti-btn-wave !gap-0 !m-0 !h-[1.75rem] !w-[1.75rem] text-[0.8rem] bg-primary/10 text-primary hover:bg-primary hover:text-white hover:border-primary"
                                >
                                  <i className="ri-edit-line"></i>
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="box-footer">
                  <div className="sm:flex items-center">
                    <div className="text-defaulttextcolor dark:text-defaulttextcolor/70">
                      Showing 5 Entries{" "}
                      <i className="bi bi-arrow-right ms-2 font-semibold"></i>
                    </div>
                    <div className="ms-auto">
                      <nav
                        aria-label="Page navigation"
                        className="pagination-style-4"
                      >
                        <ul className="ti-pagination mb-0">
                          <li className="page-item disabled">
                            <Link
                              className="page-link"
                              href="#!"
                              scroll={false}
                            >
                              Prev
                            </Link>
                          </li>
                          <li className="page-item">
                            <Link
                              className="page-link active"
                              href="#!"
                              scroll={false}
                            >
                              1
                            </Link>
                          </li>
                          <li className="page-item">
                            <Link
                              className="page-link"
                              href="#!"
                              scroll={false}
                            >
                              2
                            </Link>
                          </li>
                          <li className="page-item">
                            <Link
                              className="page-link !text-primary"
                              href="#!"
                              scroll={false}
                            >
                              next
                            </Link>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
        <div className="xxl:col-span-3 xl:col-span-12 col-span-12">
          <div className="grid grid-cols-12 gap-x-6">
            <div className="xxl:col-span-12 xl:col-span-12  col-span-12">
              <div className="box">
                <div className="box-header justify-between">
                  <div className="box-title">Case by Status</div>
                  <div className="hs-dropdown ti-dropdown">
                    <Link
                      aria-label="anchor"
                      href="#!"
                      scroll={false}
                      className="flex items-center justify-center w-[1.75rem] h-[1.75rem] ! !text-[0.8rem] !py-1 !px-2 rounded-sm bg-light border-light shadow-none !font-medium"
                      aria-expanded="false"
                    >
                      <i className="fe fe-more-vertical text-[0.8rem]"></i>
                    </Link>
                    <ul className="hs-dropdown-menu ti-dropdown-menu hidden">
                      <li>
                        <Link
                          className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                          href="#!"
                          scroll={false}
                        >
                          Week
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                          href="#!"
                          scroll={false}
                        >
                          Month
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                          href="#!"
                          scroll={false}
                        >
                          Year
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="box-body overflow-hidden">
                  <div className="leads-source-chart flex items-center justify-center">
                    <ReactApexChart
                      // options={{ ...Crmdata.Sourcedata.options, labels: data?.caseStatusStatistics?.filter((item: any) => item?._id).map((item: any, index: number) => item?._id) }}
                      options={{ ...Crmdata.Sourcedata.options, labels: data?.caseStatusStatistics?.filter((item: any) => item?._id).map((item: any, index: number) => { return item?._id }) }}
                      series={data?.caseStatusStatistics?.filter((item: any) => item?._id).map((item: any, index: number) => item?.count)}
                      type="donut"
                      width={"100%"}
                      height={250}
                    />
                    <div className="lead-source-value ">
                      <span className="block text-[0.875rem] ">Total</span>
                      <span className="block text-[1.5625rem] font-bold">
                        {data?.caseStatusStatistics?.reduce((acc: number, curr: any) => acc + curr?.count, 0)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 border-t border-dashed dark:border-defaultborder/10">
                  {data?.caseStatusStatistics?.filter((item: any) => item?._id).map((item: any, index: number) => (

                    <div className="col !p-0">
                      <div className="!ps-4 p-[0.95rem] text-center border-e border-dashed dark:border-defaultborder/10">
                        <span className={"text-[#8c9097] dark:text-white/50 text-[0.75rem] mb-1 crm-lead-legend inline-block " + ` ${item?._id}`}>
                          {item?._id}
                        </span>
                        <div>
                          <span className="text-[1rem]  font-semibold">
                            {item?.count}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                </div>
              </div>
            </div>
            <div className="xxl:col-span-12 xl:col-span-6  col-span-12">
              <div className="box">
                <div className="box-header justify-between">
                  <div className="box-title">Top Cases</div>
                  <div className="hs-dropdown ti-dropdown">
                    <Link
                      href="#!"
                      scroll={false}
                      className="text-[0.75rem] px-2 font-normal text-[#8c9097] dark:text-white/50"
                      aria-expanded="false"
                    >
                      View All
                      <i className="ri-arrow-down-s-line align-middle ms-1 inline-block"></i>
                    </Link>
                    <ul
                      className="hs-dropdown-menu ti-dropdown-menu hidden"
                      role="menu"
                    >
                      <li>
                        <Link
                          className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                          href="#!"
                          scroll={false}
                        >
                          Today
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                          href="#!"
                          scroll={false}
                        >
                          This Week
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                          href="#!"
                          scroll={false}
                        >
                          Last Week
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="box-body">
                  {/* <div className="flex items-center mb-[0.8rem]">
                    <h4 className="font-bold mb-0 text-[1.5rem] ">4,289</h4>
                    <div className="ms-2">
                      <span className="py-[0.18rem] px-[0.45rem] rounded-sm text-success !font-medium !text-[0.75em] bg-success/10">
                        1.02
                        <i className="ri-arrow-up-s-fill align-mmiddle ms-1"></i>
                      </span>
                      <span className="text-[#8c9097] dark:text-white/50 text-[0.813rem] ms-1">
                        compared to last week
                      </span>
                    </div>
                  </div>

                  <div className="flex w-full h-[0.3125rem] mb-6 rounded-full overflow-hidden">
                    <div
                      className="flex flex-col justify-center rounded-s-[0.625rem] overflow-hidden bg-primary w-[21%]"
                      aria-valuenow={21}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                    <div
                      className="flex flex-col justify-center rounded-none overflow-hidden bg-info w-[26%]"
                      aria-valuenow={26}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                    <div
                      className="flex flex-col justify-center rounded-none overflow-hidden bg-warning w-[35%]"
                      aria-valuenow={35}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                    <div
                      className="flex flex-col justify-center rounded-e-[0.625rem] overflow-hidden bg-success w-[18%]"
                      aria-valuenow={18}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                  </div> */}
                  <ul className="list-none mb-0 pt-2 crm-deals-status">
                    {/* <li className="primary">
                      <div className="flex items-center text-[0.813rem]  justify-between">
                        <div>Case Title</div>
                        <div className="text-[0.75rem] text-[#8c9097] dark:text-white/50">
                          Contact Price
                        </div>
                      </div>
                    </li> */}
                    {data?.topCases?.map((item: any, index: number) => (
                      <li className={`${item?._id}`}>
                        <div className="flex items-center text-[0.813rem]  justify-between">
                          <div>
                            <span>
                              {item?.caseNumber}
                            </span>
                            <span className="block text-[0.75rem] text-[#8c9097] dark:text-white/50">
                              {item?.client?.companyName}
                            </span>
                          </div>
                          <div className="text-[0.75rem] text-[#8c9097] dark:text-white/50">
                            {formatAmount(item?.contractPrice)}
                          </div>
                        </div>
                      </li>
                    ))}

                  </ul>
                </div>
              </div>
            </div>
            {/* <div className="xxl:col-span-12 xl:col-span-6  col-span-12">
              <div className="box">
                <div className="box-header justify-between">
                  <div className="box-title">Recent Activity</div>
                  <div className="hs-dropdown ti-dropdown">
                    <Link
                      href="#!"
                      scroll={false}
                      className="text-[0.75rem] px-2 font-normal text-[#8c9097] dark:text-white/50"
                      aria-expanded="false"
                    >
                      View All
                      <i className="ri-arrow-down-s-line align-middle ms-1 inline-block"></i>
                    </Link>
                    <ul
                      className="hs-dropdown-menu ti-dropdown-menu hidden"
                      role="menu"
                    >
                      <li>
                        <Link
                          className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                          href="#!"
                          scroll={false}
                        >
                          Today
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                          href="#!"
                          scroll={false}
                        >
                          This Week
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block"
                          href="#!"
                          scroll={false}
                        >
                          Last Week
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="box-body">
                  <div>
                    <ul className="list-none mb-0 crm-recent-activity">
                      {data?.recentActivities?.map((item: any, index: number) => (
                        <li className="crm-recent-activity-content">
                          <div className="flex items-start">
                            <div className="me-4">
                              <span className="w-[1.25rem] h-[1.25rem] inline-flex items-center justify-center font-medium leading-[1.25rem] text-[0.65rem] text-primary bg-primary/10 rounded-full">
                                <i className="bi bi-circle-fill text-[0.5rem]"></i>
                              </span>
                            </div>

                            <div className="crm-timeline-content text-defaultsize">
                              <span>
                                {item?.title}
                              </span>
                              <span className="block text-[0.75rem] text-[#8c9097] dark:text-white/50">
                                {item?.user?.firstName} {item?.user?.lastName}
                              </span>
                            </div>
                            <div className="flex-grow text-end">
                              <span className="block text-[#8c9097] dark:text-white/50 text-[0.6875rem] opacity-[0.7]">
                                {moment(item?.createdAt).format("DD MMM YYYY, HH:mm")}
                              </span>
                            </div>
                          </div>
                        </li>))}

                    </ul>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </Fragment>
  );
};
export default Crm;
