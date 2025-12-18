import React from "react";

const CategoryMenu = ({ categories, onCategoryClick, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="bg-gray-800 border-t border-gray-700 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h3 className="text-white font-semibold mb-4 text-lg">Genres</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {categories.map((cat) => {
            const isObject = typeof cat === 'object';
            const categoryName = isObject ? cat._id : cat;
            const count = isObject ? cat.count : null;
            
            if (!categoryName) return null;

            return (
              <button
                key={categoryName}
                onClick={() => onCategoryClick(categoryName)}
                className="bg-gray-700 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg text-left text-sm capitalize transition transform hover:scale-105 flex items-center justify-between"
              >
                <span>{categoryName}</span>
                {count !== null && (
                  <span className="text-xs text-gray-300 ml-2 bg-black/20 px-2 py-0.5 rounded-full">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryMenu;
