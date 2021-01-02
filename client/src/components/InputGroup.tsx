import React from "react";
import classNames from "classnames";

export default function InputGroup({
  errors,
  value,
  setValue,
  type,
  classname,
  placeholder,
}) {
  return (
    <div className={classname}>
      <input
        type={type}
        className={classNames(
          "w-full p-3 transition duration-200 border border-gray-300 rounded outline-none focus:bg-white hover:bg-white bg-gray-50",
          { "border-red-500": errors }
        )}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <small className="font-medium text-red-600">{errors}</small>
    </div>
  );
}
