import React from "react";

const HeaderSection = ({ name, breadcrumbs }) => {
  return (
    <div className="relative w-full h-[60vh] flex flex-col items-center justify-center gap-5 text-white py-16 text-center">
      <h1 className="text-5xl font-bold">{name}</h1>
      <div className="mt-4 flex justify-center items-center gap-2">
        {breadcrumbs.map((item, index) => (
          <span key={index} className="flex items-center">
            {index > 0 && <span className="mx-2">•</span>}
            <a
              href={item.link}
              className="bg-yellow-600 text-black px-3 py-1 rounded-md font-semibold hover:bg-yellow-700 transition"
            >
              {item.label}
            </a>
          </span>
        ))}
      </div>
    </div>
  );
};

export default HeaderSection;
