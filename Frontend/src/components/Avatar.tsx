import { useState, useEffect, useRef } from "react";

interface AvatarProps {
  name: string;
  size?: "small" | "big";
  dropdownOptions?: {
    onMyBlogsClick: () => void;
    onUpdateProfileClick: () => void;
    onLogoutClick: () => void;
  };
}

export function Avatar({
  name,
  size = "small",
  dropdownOptions,
}: AvatarProps) {
  console.log("Avatar rendered");
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const handleButtonClick = (action: () => void) => {
    action();
    setIsOpen(false); 
  };

  return (
    <div ref={ref} className="relative inline-flex items-center justify-center">
      <button
        onClick={toggleDropdown}
        className={`overflow-hidden bg-gray-600 rounded-full focus:outline-none ${size === "small" ? "w-6 h-6" : "w-10 h-10"}`}
      >
        <span
          className={`${size === "small" ? "text-xs" : "text-md"} font-extralight text-gray-600 dark:text-gray-300 cursor-pointer`}
        >
          {name[0]}
        </span>
      </button>
      {isOpen && dropdownOptions && (
        <div className="absolute top-full left--1 mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          <button
            onClick={() => handleButtonClick(dropdownOptions.onMyBlogsClick)}
            className="font-chivo block w-full px-4 py-2 text-gray-800 hover:bg-gray-100 text-left"
          >
            My Blogs
          </button>
          <button
            onClick={() => handleButtonClick(dropdownOptions.onUpdateProfileClick)}
            className="font-chivo block w-full px-4 py-2 text-gray-800 hover:bg-gray-100 text-left"
          >
            Update Profile
          </button>
          <button
            onClick={() => handleButtonClick(dropdownOptions.onLogoutClick)}
            className="font-chivo block w-full px-4 py-2 text-gray-800 hover:bg-gray-100 text-left"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}