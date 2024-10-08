import { useProtectedJpg } from "@/utils/protectedImage";
import React, { useState } from "react";

const Thumbnail = ({ id, setSelectedThumbnail, page }) => {
  const protected_image = useProtectedJpg(page.jpg_url, "page");
  return (
    <>
      <div
        key={Math.random()}
        className="p-4 my-2"
        onClick={() => setSelectedThumbnail(id)}
      >
        <input type="checkbox" />
        <div className="items-center flex justify-center cursor-pointer">
          <div>{protected_image.data}</div>
        </div>
      </div>
    </>
  );
};

export default Thumbnail;
