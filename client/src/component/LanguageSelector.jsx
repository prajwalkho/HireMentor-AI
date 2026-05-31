// import { useState } from "react";
// import { LANGUAGE_VERSIONS } from "../constants";

// const languages = Object.entries(LANGUAGE_VERSIONS);

// const LanguageSelector = ({ language, onSelect }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleMenu = () => setIsOpen((prev) => !prev);
//   const closeMenu = () => setIsOpen(false);

//   return (
//     <div className="relative ml-2 mb-4">
//       {/* <h2 className="mb-2 text-lg font-medium">Language:</h2> */}
//       <button
//         className="flex gap-4 px-4 py-2 bg-[#e5f2ea] hover:bg-[#d9ece1] text-[#005151] rounded-md transition-colors shadow-md capitalize font-semibold"
//         onClick={toggleMenu}
//       >
//         {language}
//         <span className="rotate-90">&#10095; </span>
//       </button>
//       {isOpen && (
//         <ul className="absolute z-10 w-56 mt-2 border rounded-md shadow-lg bg-[#f4f4f4] p-3">
//           {languages.map(([lang, version]) => (
//             <li
//               key={lang}
//               className={`px-4 py-2 cursor-pointer transition-colors rounded-md capitalize ${
//                 lang === language
//                   ? "bg-white shadow"
//                   : "hover:bg-gray-200"
//               }`}
//               onClick={() => {
//                 onSelect(lang);
//                 closeMenu();
//               }}
//             >
//               <div className="flex justify-between">
//                 <span>{lang}</span>
//                 <span className="ml-1 text-sm text-gray-500">({version})</span>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default LanguageSelector;


import { useState } from "react";
import { LANGUAGE_VERSIONS } from "../constants";

const languages = Object.entries(LANGUAGE_VERSIONS);

const LanguageSelector = ({ language, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="relative ml-2 mb-4">
      <button
        className="flex gap-4 px-4 py-2 bg-[#e5f2ea] hover:bg-[#d9ece1] text-[#005151] rounded-md transition-colors shadow-md capitalize font-semibold"
        onClick={toggleMenu}
      >
        {language}
        <span className="rotate-90">&#10095;</span>
      </button>
      {isOpen && (
        <ul
          className="absolute z-10 w-56 mt-2 border rounded-md shadow-lg bg-[#f4f4f4] p-2 overflow-y-auto"
          style={{
            maxHeight: "220px", // Show only 5 items with a height of 44px each
          }}
        >
          {languages.map(([lang, version]) => (
            <li
              key={lang}
              className={`px-4 py-2 cursor-pointer transition-colors rounded-md capitalize ${
                lang === language
                  ? "bg-white shadow"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => {
                onSelect(lang);
                closeMenu();
              }}
            >
              <div className="flex justify-between">
                <span>{lang}</span>
                <span className="ml-1 text-sm text-gray-500">({version})</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSelector;
