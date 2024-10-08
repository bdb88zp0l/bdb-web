import Thumbnail from "./Thumbnail";

const ThumbnailPanel = ({ showThumbnail, setSelectedThumbnail, data }) => {
  return (
    <>
      <div
        className={`h-[80vh] w-64 bg-[#535353] text-white top-0 left-0 flex flex-col gap-4 p-4 overflow-y-scroll ${
          !showThumbnail && "hidden"
        }`}
      >
        {data?.pages?.map((page, i) => (
          <Thumbnail
            setSelectedThumbnail={setSelectedThumbnail}
            id={i}
            key={i}
            page={page}
          />
        ))}
      </div>
    </>
  );
};

export default ThumbnailPanel;
