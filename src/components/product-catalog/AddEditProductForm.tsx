import { FORM_INPUT_CLASS, REQUIRED_ERROR } from "@/constant/constantClassName";
import React from "react";
import { TbArrowNarrowRight } from "react-icons/tb";

const AddEditProductForm = () => {
  return (
    <div className="w-full max-w-[1500px] bg-white p-8 rounded-xl ">

      <div className="w-full ">
        <div className="w-full space-y-10 lg:space-y-14 mb-8">
          <div className="w-full grid grid-cols-1  ">
            <div className="w-full">
              <input
                type="text"
                placeholder="Product Name"
                className={`${FORM_INPUT_CLASS}`}
              />
              <span className={`${REQUIRED_ERROR}`}></span>
            </div>
         
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 ">
            <div className="w-full">
              <input
                type="text"
                placeholder="Bullet point 1"
                className={`${FORM_INPUT_CLASS}`}
              />
              <span className={`${REQUIRED_ERROR}`}></span>
            </div>
            <div className="w-full">
              <input
                type="text"
                placeholder="Bullet ponit 2"
                className={`${FORM_INPUT_CLASS}`}
              />
              <span className={`${REQUIRED_ERROR}`}></span>
            </div>
            <div className="w-full">
              <input
                type="text"
                placeholder="Bullet point 3"
                className={`${FORM_INPUT_CLASS}`}
              />
              <span className={`${REQUIRED_ERROR}`}></span>
            </div>
          </div>
              <div className="w-full grid grid-cols-1 ">
            <div className="w-full">
              <textarea
                placeholder="Write an elevator pitch"
                className={`h-24 md:h-32 ${FORM_INPUT_CLASS}`}
              />
              <span className="text-sm text-red-500"></span>
            </div>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 ">
           
            <div className="w-full">
       <select
                        value={""}
                        onChange={(e) => {}}
                       className={`${FORM_INPUT_CLASS}`}>
                        <option value="">{`Assign To A-Team(s)`}</option>
                        <option value="">{`Assign To A-Team(s)`}</option>
                        <option value="">{`Assign To A-Team(s)`}</option>
                      
                    </select>
              <span className={`${REQUIRED_ERROR}`}></span>
            </div>
            <div className="w-full">
              <input
                type="text"
                placeholder={`Assign To member's`}
                className={`${FORM_INPUT_CLASS}`}
              />
              <span className={`${REQUIRED_ERROR}`}></span>
            </div>
            <div className="w-full">
             <div className="flex items-center gap-6 ">
              <label className="block text-base font-medium text-gray-700 ">Status</label>
                  <div className="flex items-center space-x-6">
                     <label className="flex items-center space-x-3 cursor-pointer">
                       < input
                          type="radio"
                           name="status"
                            value="active"
                            className="form-radio h-3 w-3 text-orange-500"
                         />
                       <span className="text-gray-700">Active</span>
                     </label>
    <label className="flex items-center space-x-3 cursor-pointer">
      <input
        type="radio"
        name="status"
        value="inactive"
        className="form-radio h-3 w-3 text-orange-500"
      />
      <span className="text-gray-700">Inactive</span>
    </label>
  </div>
</div>

              <span className={`${REQUIRED_ERROR}`}></span>
            </div>
          </div>
          

      
        </div>
        <div className="w-full flex items-center gap-4  ">
          <button className="py-3 px-8 bg-[#FF9912] text-white rounded-md cursor-pointer ">Save Product</button>
          <button className="py-3 px-8 border border-black dark:border-white dark:text-white text-black rounded-md cursor-pointer ">Cancel</button>
        </div>

      </div>
    </div>
  );
};

export default AddEditProductForm;
