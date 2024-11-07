import Link from "next/link";
const SortBy = ({ sortBy, sortOrder, options, onChange }) => {
  return (
    <>
      <div className="hs-dropdown ti-dropdown">
        <Link
          href="#!"
          scroll={false}
          className="ti-btn ti-btn-light !py-1 !px-2 !text-[0.75rem] !m-0 btn-wave waves-effect waves-light"
          aria-expanded="false"
        >
          Sort By
          <i className="ri-arrow-down-s-line align-middle ms-1 inline-block"></i>
        </Link>
        <ul className="hs-dropdown-menu ti-dropdown-menu hidden" role="menu">
          {options.map((option: { label: string; value: string }) => (
            <li key={option.value}>
              <Link
                className="ti-dropdown-item justify-between"
                href="#!"
                scroll={false}
                onClick={() => {
                  if (sortBy === option.value) {
                    onChange(
                      option.value,
                      sortOrder === "asc" ? "desc" : "asc"
                    );
                  } else {
                    onChange(option.value, "asc");
                  }
                }}
              >
                {option.label}
                {sortBy === option.value && (
                  <>
                    <i className={`ri-sort-${sortOrder}`}></i>
                  </>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default SortBy;
