import { useEffect, useState } from "react";

function Pagination({
  totalRow,
  page,
  handlePageChange,
  limit,
  handleLimitChange,
}: any) {
  useEffect(() => {
    setCurrentPage(page ?? 1);
  }, [page]);
  const [currentPage, setCurrentPage] = useState(page ?? 1);
  const pageCount = Math.ceil(totalRow / limit);

  const gotoPage = (page: number) => {
    setCurrentPage(page);
    const newOffset = (page - 1) * limit;
    handlePageChange(limit, newOffset, page);
  };

  // Calculate the start and end page numbers for pagination
  const startPage = Math.max(1, currentPage - 4);
  const endPage = Math.min(pageCount, currentPage + 4);

  // Generate pagination numbers between startPage and endPage
  const paginationNumbers = () => {
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Determine if ellipses should be shown before the first page number
  const showPreviousEllipses = startPage > 1;

  // Determine if ellipses should be shown after the last page number
  const showNextEllipses = endPage < pageCount;

  return (
    <div className="box-footer border-t-0">
      <div className="flex items-center justify-between">
        <div>
          Showing {totalRow <= 0 ? 0 : limit * (currentPage - 1) + 1} to{" "}
          {Math.min(limit * currentPage, totalRow)} of {totalRow} entries
          <i className="bi bi-arrow-right ms-2 font-semibold"></i>
        </div>
        <div>
          <nav aria-label="Page navigation" className="pagination-style-4">
            <ul className="ti-pagination mb-0 flex">
              <li className={`page-item ${currentPage <= 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => gotoPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  Prev
                </button>
              </li>
              <li></li>

              {showPreviousEllipses && (
                <li className="page-item">
                  <span className="page-link">...</span>
                </li>
              )}

              {paginationNumbers().map((page) => (
                <li key={page} className="page-item">
                  <button
                    className={`page-link ${
                      currentPage === page ? "active" : ""
                    }`}
                    onClick={() => gotoPage(page)}
                  >
                    {page}
                  </button>
                </li>
              ))}

              {showNextEllipses && (
                <li className="page-item">
                  <span className="page-link">...</span>
                </li>
              )}

              <li></li>

              <li
                className={`page-item ${
                  currentPage >= pageCount ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => gotoPage(currentPage + 1)}
                  disabled={currentPage >= pageCount}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
