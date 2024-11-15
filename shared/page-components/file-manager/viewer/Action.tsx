import React from 'react';

const Action = () => {
    return (
        <div>
            <div className="ml-5 mt-6 flex justify-between">
                <div className="flex gap-6">
                    <div className="h-10 w-10 text-gray-600">
                        <i className="ri-edit-box-line text-[20px]"></i>
                    </div>

                    <div className="h-10 w-10 text-gray-600">
                        <i class="ri-download-cloud-2-line text-[20px]"></i>
                    </div>
                    <div className="flex gap-1">
                        <i class="ri-focus-fill text-green-600 text-[20px]"></i>
                        <h2 className="text-[20px]">Run OCR</h2>
                    </div>
                </div>
                <div className="h-10 w-10 text-gray-600">
                    <i className="ri-book-shelf-line text-[20px]"></i>
                </div>
            </div>
        </div>
    );
};

export default Action;
