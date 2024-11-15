import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CustomToasterContainer({}: any) {
  // Custom Close Button Component
  const CustomCloseButton = ({ closeToast }: { closeToast: () => void }) => (
    <div className="m-auto">
      <button
        type="button"
        className="inline-flex justify-center items-center h-6 w-6 focus:outline-none focus:ring-0 transition-all"
        aria-label="Close"
        onClick={closeToast} // You can replace this with the actual close functionality.
      >
        <span className="sr-only">Close</span>
        <svg
          className="w-4 h-4"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.925 0.687C1.126 0.486 1.398 0.373 1.682 0.373C1.966 0.373 2.238 0.486 2.439 0.687L8.105 6.358L13.771 0.687C13.870 0.585 13.988 0.503 14.119 0.447C14.249 0.391 14.390 0.361 14.532 0.36C14.674 0.359 14.815 0.386 14.947 0.44C15.078 0.494 15.198 0.573 15.298 0.674C15.399 0.774 15.478 0.894 15.532 1.026C15.586 1.157 15.613 1.298 15.612 1.441C15.611 1.583 15.581 1.724 15.525 1.854C15.469 1.985 15.387 2.103 15.285 2.202L9.619 7.873L15.285 13.544C15.480 13.746 15.588 14.017 15.585 14.298C15.583 14.579 15.471 14.847 15.272 15.046C15.073 15.245 14.805 15.357 14.524 15.36C14.244 15.362 13.973 15.254 13.771 15.059L8.105 9.388L2.439 15.059C2.237 15.254 1.967 15.362 1.686 15.36C1.405 15.357 1.137 15.245 0.938 15.046C0.74 14.847 0.627 14.579 0.625 14.298C0.622 14.017 0.73 13.746 0.925 13.544L6.591 7.873L0.925 2.202C0.725 2.001 0.612 1.729 0.612 1.445C0.612 1.161 0.725 0.888 0.925 0.687Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  );

  return (
    <>
      <ToastContainer
        // autoClose={300000}
        position="bottom-right"
        hideProgressBar={true}
        toastClassName={(instance: any) => {
          let type = instance.type;
          // return type.includes("success")
          //   ? "flex p-4 ti-toast bg-success/10 text-sm text-success bg-[#E7F7F1]"
          //   : type.includes("error")
          //   ? "flex p-4 ti-toast bg-danger/10 text-sm text-danger bg-[#FDEAE7]"
          //   : type.includes("warning")
          //   ? "flex p-4 ti-toast bg-warning/10 text-sm text-warning bg-[#FEF6EA]"
          //   : type.includes("info")
          //   ? "flex p-4 ti-toast bg-info/10 text-sm text-info  bg-[#EAF5FD]"
          //         : "";
          return type.includes("success")
            ? // ? "flex p-4 ti-toast bg-success/10 text-sm text-success"
              "flex p-4 ti-toast bg-[#FDEAE7] text-sm text-success"
            : type.includes("error")
            ? "flex p-4 ti-toast bg-[#FDEAE7] text-sm text-danger"
            : type.includes("warning")
            ? "flex p-4 ti-toast bg-warning/10 text-sm text-warning"
            : type.includes("info")
            ? "flex p-4 ti-toast bg-info/10 text-sm text-info"
            : "";
        }}
        theme="dark"
        icon={false}
        closeButton={<CustomCloseButton />} // Use custom close button
      />
    </>
  );
}

export default CustomToasterContainer;
