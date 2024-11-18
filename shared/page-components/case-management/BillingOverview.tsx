"use client";
import { userPrivateRequest } from "@/config/axios.config";
import { useConfig } from "@/shared/providers/ConfigProvider";
import { formatAmount, formatDate, toWordUpperCase } from "@/utils/utils";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
// import BillingPdfDownload from "../billing/BillingPdfDownload";
import CreateModal from "../billing/CreateModal";
import EditModal from "../billing/EditModal";
import ViewBilling from "../billing/ViewBilling";

// Dynamically import react-select to avoid SSR issues
const Select = dynamic(() => import("react-select"), { ssr: false });

const BillingOverview = ({ caseInfo }: any) => {
  const config = useConfig();

  const [isModalOpen, setModalOpen] = useState(false);
  const [showModalOpen, setShowModalOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [pageData, setPageData] = useState<any>({});

  const fetchPageData = async () => {
    const res = await userPrivateRequest.get("/api/billing/data/get");
    setPageData(res.data.data ?? {});
  };
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [search, setSearch] = useState("");
  const [temporaryKeyword, setTemporaryKeyword] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<any>({});
  const [selectedBilling, setSelectedBilling] = useState<any>(null);

  useEffect(() => {
    fetchPageData();
  }, []);

  const fetchBillings = async () => {
    if (!caseInfo?._id) return;
    setIsFetching(true);
    const res = await userPrivateRequest
      .get("/api/billing", {
        params: {
          page,
          limit,
          sortBy,
          sortOrder,
          search,
          case: caseInfo?._id,
        },
      })
      .then((res) => {
        setData(res.data.data ?? {});
      })
      .catch((error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to fetch billings"
        );
      })
      .finally(() => {
        setIsFetching(false);
      });
  };
  useEffect(() => {
    fetchBillings();
  }, [caseInfo, page, limit, sortBy, sortOrder, search]);

  const handleDelete = async (id: string) => {
    await userPrivateRequest.delete(`/api/billing/${id}`).then((res) => {
      toast.success("Billing deleted successfully");
      fetchBillings();
    });
  };

  // Download code

  const downloadPDF = () => {
    const invoiceContent = document.getElementById("invoice-content");
    console.log(downloadPDF, "downloadPDF");

    if (invoiceContent) {
      html2canvas(invoiceContent).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const scale = Math.min(
          (pageWidth - 20) / (canvas.width * 0.26458333),
          pageHeight / (canvas.height * 0.26458333)
        );

        const imgWidth = canvas.width * 0.26458333 * scale;
        const imgHeight = canvas.height * 0.26458333 * scale;

        const xOffset = (pageWidth - imgWidth) / 2;
        const yOffset = 10;

        pdf.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight);

        pdf.save("invoice.pdf");
      });
    }
  };

  return (
    <>
      <div className="box custom-box">
        <div className="box-header">
          <div className="box-title">Billing Information</div>

          <div className="flexflex-wrap gap-2">
            <button
              onClick={() => setModalOpen(true)}
              className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem] me-2"
            >
              <i className="ri-add-line font-semibold align-middle"></i>
              New Billing
            </button>
          </div>
        </div>
        <div className="box-body">
          <div className="grid grid-cols-12 gap-6">
            <div className="xl:col-span-12 col-span-12">
              <div className="">
                <div className="box-header flex items-center justify-between flex-wrap gap-4">
                  <div className="flex" role="search">
                    <input
                      className="form-control me-2 h-[36.47px]"
                      type="text"
                      placeholder="Search"
                      aria-label="Search"
                    />
                    <button
                      className="ti-btn ti-btn-light !mb-0 h-[36.47px]"
                      type="submit"
                    >
                      Search
                    </button>
                    <button className="text-info !py-1 !px-4 !text-[0.75rem] !m-0 h-[36.47px] content-center text-nowrap">
                      Clear Search Results
                    </button>
                  </div>
                </div>

                <CreateModal
                  modalOpen={isModalOpen}
                  setModalOpen={setModalOpen}
                  fetchBillings={fetchBillings}
                  pageData={pageData}
                  caseInfo={caseInfo}
                />

                <ViewBilling
                  showModalOpen={showModalOpen}
                  setShowModalOpen={setShowModalOpen}
                  selectedBilling={selectedBilling}
                  fetchBillings={fetchBillings}
                  caseInfo={caseInfo}
                />
                <EditModal
                  editModalOpen={editModalOpen}
                  setEditModalOpen={setEditModalOpen}
                  selectedBilling={selectedBilling}
                  fetchBillings={fetchBillings}
                  caseInfo={caseInfo}
                />

                {/* <BillingPdfDownload
                  setDownloadModalOpen={setDownloadModalOpen}
                  downloadModalOpen={downloadModalOpen}
                  selectedBilling={selectedBilling}
                /> */}

                <div className="box-body !p-0">
                  <div className="table-responsive">
                    <table className="table whitespace-nowrap min-w-full">
                      <thead>
                        <tr>
                          <th scope="col" className="text-start">
                            Bill Number
                          </th>
                          <th scope="col" className="text-start">
                            Title
                          </th>
                          <th scope="col" className="text-start">
                            Bill Type
                          </th>
                          <th scope="col" className="text-start">
                            Bill From
                          </th>
                          <th scope="col" className="text-start">
                            Date Of Reciept
                          </th>
                          <th scope="col" className="text-start">
                            Total Amount
                          </th>
                          <th scope="col" className="text-start">
                            Status
                          </th>
                          <th scope="col" className="text-start">
                            Action
                          </th>
                          <th scope="col" className="text-start"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {isFetching && (
                          <td colSpan={5}>
                            <div className="flex justify-center mb-6">
                              <div className="ti-spinner" role="status">
                                <span className="sr-only">Loading...</span>
                              </div>
                            </div>
                          </td>
                        )}
                        {!isFetching &&
                          data?.docs?.map((item: any) => {
                            return (
                              <tr
                                className="border border-defaultborder crm-contact"
                                key={Math.random()}
                              >
                                <td>{item?.billNumber}</td>
                                <td>{item?.title}</td>
                                <td>{item?.billingType}</td>
                                <td>{item?.clientData?.companyName ?? ""}</td>
                                <td>{formatDate(item?.billingStart)}</td>
                                <td>{formatAmount(item?.grandTotal)}</td>
                                <td>{toWordUpperCase(item?.status)}</td>

                                <td>
                                  <div className="btn-list flex gap-2">
                                    <button
                                      onClick={() => {
                                        setShowModalOpen(true);
                                        setSelectedBilling(item);
                                      }}
                                      aria-label="view button"
                                      type="button"
                                      className="ti-btn ti-btn-sm ti-btn-info ti-btn-icon"
                                    >
                                      <i className="ri-eye-line"></i>
                                    </button>
                                    <button
                                      onClick={() => {
                                        setSelectedBilling(item);
                                        downloadPDF();
                                      }}
                                      aria-label="view button"
                                      type="button"
                                      className="ti-btn ti-btn-sm ti-btn-danger ti-btn-icon contact-view"
                                    >
                                      <i className="ri-download-line"></i>
                                    </button>

                                    <button
                                      className="ti-btn ti-btn-sm ti-btn-info ti-btn-icon"
                                      onClick={() => {
                                        setSelectedBilling(item);
                                        setEditModalOpen(true);
                                      }}
                                    >
                                      <i className="ri-pencil-line"></i>
                                    </button>
                                    <button
                                      aria-label="button"
                                      type="button"
                                      className="ti-btn ti-btn-sm ti-btn-danger ti-btn-icon contact-delete"
                                      onClick={() => {
                                        if (
                                          window.confirm(
                                            "Are you sure you want to delete this item?"
                                          )
                                        ) {
                                          handleDelete(item?._id);
                                        }
                                      }}
                                    >
                                      <i className="ri-delete-bin-line"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto hidden" id="invoice-content">
        <div className="flex justify-between gap-12 mb-8">
          <div className="flex flex-col space-y-2">
            <h4 className="text-xl font-semibold">
              GLOBAL TRANSFER PRICING RESOURCE CENTER INC
            </h4>
            <p className="text-black">
              20th Floor Chatham House V.A. Rufino cor. Valero St.,
            </p>
            <p className="text-black">
              Salcedo Village Bel-Air, 1209 City of Makati
            </p>
            <p className="text-black">NCR Fourth District Philippines</p>
            <p className="text-black">VAT Reg. TIN: 010-768-534-00000</p>
          </div>

          <div className="flex flex-col space-y-2 text-right">
            <h4 className="text-xl font-semibold">BILLING INVOICE</h4>
            <p className="text-black">Invoice No: {selectedBilling?.title}</p>
            <p className="text-black">
              Date: {formatDate(selectedBilling?.date)}
            </p>
            <p className="text-black">
              Our Ref: {formatDate(selectedBilling?.dueDate)}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <div className="border border-black p-4">
            <h4 className="text-lg font-semibold text-black">SOLD TO:</h4>
            <div className="space-y-3 pl-4">
              <p className="text-black">Name: {selectedBilling?.title}</p>
              <p className="text-black">Attention:</p>
              <p className="text-black">Address:</p>
              <p className="text-black">TIN:</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto border border-black mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-black">
                <th
                  colSpan={3}
                  className="p-2 text-center font-bold border-b border-black"
                >
                  PARTICULARS
                </th>
              </tr>
            </thead>

            <thead>
              <tr className="border-b border-black">
                <th className="p-2 font-bold text-left border-r border-black">
                  DESCRIPTION/NATURE OF SERVICE:
                </th>
                <th className="p-2 font-bold text-center border-r border-black">
                  FEE:
                </th>
                <th className="p-2 font-bold text-center">AMOUNT</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="p-2 align-top border-r border-black"></td>
                <td className="p-2 space-y-2 border-r border-black">
                  <div>VATable Sales</div>
                  <div>VATable Out of Pocket Expenses (OPEs)</div>
                  <div>VAT</div>
                  <div>VAT Exempt Sales</div>
                  <div>Zero-Rated Sales</div>
                  <div>Total Sales (VAT Inclusive)</div>
                  <div>Less: VAT</div>
                  <div>Amount: Net of VAT</div>
                  <div>Less: Discount</div>
                  <div>Add: VAT</div>
                  <div>Less: Withholding Tax</div>
                  <div>Add: Non-VATable OPES</div>
                  <div className="font-bold">TOTAL AMOUNT DUE</div>
                </td>
                <td className="p-2 border-l space-y-2 align-top border-black">
                  {selectedBilling?.items?.map((item: any, index: number) => (
                    <div key={index} className="py-1">
                      {item.amount ? item.amount.toFixed(2) : "-"}
                    </div>
                  ))}

                  <div>VATable Sales</div>
                  <div>VATable Out of Pocket Expenses (OPEs)</div>
                  <div>VAT</div>
                  <div>VAT Exempt Sales</div>
                  <div>Zero-Rated Sales</div>
                  <div>Total Sales (VAT Inclusive)</div>
                  <div>Less: VAT</div>
                  <div>Amount: Net of VAT</div>
                  <div>Less: Discount</div>
                  <div>Add: VAT</div>
                  <div>Less: Withholding Tax</div>
                  <div>Add: Non-VATable OPES</div>
                  <div className="font-bold">TOTAL AMOUNT DUE</div>
                </td>
              </tr>
            </tbody>

            <tfoot>
              <tr className="border-t border-black">
                <td className="p-2 font-bold border-r border-black flex gap-6">
                  <p>QUANTITY:</p>
                  <div className="border-l border-black"></div>
                  <p> UNIT COST/PRICE:</p>
                </td>
                <td className="p-2 font-bold text-center border-r border-black"></td>
                <td className="p-2" />
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="border border-black p-4">
          <p className="text-black mb-4">
            <span className="font-bold">NOTE:</span> Please make all checks
            payable to{" "}
            <span className="font-bold">
              Global Transfer Pricing Resource Center Inc.
            </span>
          </p>

          <p className="text-black mb-4">
            The total amount due is payable within 60 days from the date of this
            invoice. For payment, you may call Dolly L. Tumbokon at 8403-2001
            loc. 200 or you may deposit directly to the following account of{" "}
            <span className="font-bold">
              Global Pricing Resource Center Inc.
            </span>
          </p>

          <div className="pl-4 mb-4 space-y-2">
            <p className="text-black">Bank Name:</p>
            <p className="text-black">Savings Account No./Swift Code:</p>
          </div>

          <p className="text-black mb-4">
            Kindly email proof of remittance to Dolly L. Tumbokon at dolly.
            tumbokon@globaltpcenter-manila.com.ph
          </p>

          <div className="flex justify-center items-center mt-8">
            <div className="font-bold text-black">By:</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BillingOverview;
