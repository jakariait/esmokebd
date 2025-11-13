import { useState, memo, useRef, useCallback, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa6";
import useCategoryStore from "../../store/useCategoryStore.js";
import useSubCategoryStore from "../../store/useSubCategoryStore.js";
import useChildCategoryStore from "../../store/useChildCategoryStore.js";

const MenuBar = () => {
  const { categories } = useCategoryStore();
  const { subCategories } = useSubCategoryStore();
  const { childCategories } = useChildCategoryStore();
  const location = useLocation();

  // Build query string helper
  const buildQueryString = useCallback((params) => {
    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) urlParams.set(key, value);
    });
    return urlParams.toString();
  }, []);

  // Check if current route matches to prevent unnecessary navigation
  const isCurrentRoute = useCallback(
    (queryParams) => {
      const currentParams = new URLSearchParams(location.search);
      const newParams = new URLSearchParams(queryParams);

      // Compare relevant parameters
      return (
        currentParams.get("category") === newParams.get("category") &&
        currentParams.get("subcategory") === newParams.get("subcategory") &&
        currentParams.get("childCategory") === newParams.get("childCategory")
      );
    },
    [location.search],
  );

  return (
    <div className="lg:shadow lg:bg-white">
      <nav className="p-3 xl:container xl:mx-auto">
        <ul className="lg:flex space-x-3">
          <MenuItem
            label={
              <Link to="/" className="block">
                Home
              </Link>
            }
          />
          <MenuItem
            label={
              <Link to="/shop" className="block">
                Shop
              </Link>
            }
          />

          {categories?.length ? (
            categories
              .filter((category) => category.showOnNavbar)
              .map((category) => {
                const categoryQuery = buildQueryString({
                  category: category.name,
                });
                const categoryPath = `/shop?${categoryQuery}`;
                const hasSubCategories =
                  Array.isArray(subCategories) &&
                  subCategories.some(
                    (subCat) =>
                      subCat?.category?._id === category._id && subCat.isActive,
                  );

                return (
                  <MenuItem
                    key={category._id}
                    label={
                      <Link
                        to={categoryPath}
                        className="grid grid-cols-2 gap-1 items-center justify-center w-full text-left"
                        onClick={(e) => {
                          // Prevent navigation if already on this category
                          if (isCurrentRoute(categoryQuery)) {
                            e.preventDefault();
                          }
                        }}
                      >
                        {category.name}
                        {hasSubCategories && <FaAngleDown />}
                      </Link>
                    }
                  >
                    {hasSubCategories && (
                      <SubMenu
                        subCategories={subCategories}
                        categoryId={category._id}
                        childCategories={childCategories}
                        buildQueryString={buildQueryString}
                        isCurrentRoute={isCurrentRoute}
                      />
                    )}
                  </MenuItem>
                );
              })
          ) : (
            <MenuItem label={<span></span>} />
          )}

          <MenuItem
            label={
              <div className="flex items-center gap-1 cursor-pointer">
                More <FaAngleDown />
              </div>
            }
          >
            <SubMenu
              items={[
                { name: "About Us", path: "/about" },
                { name: "FAQ", path: "/faqs" },
                { name: "Privacy Policy", path: "/privacypolicy" },
                { name: "Refund Policy", path: "/refundpolicy" },
                { name: "Terms of Services", path: "/termofservice" },
                { name: "Blog", path: "/blog" },
                { name: "Contact", path: "/contact-us" },
              ]}
            />
          </MenuItem>
        </ul>
      </nav>
    </div>
  );
};

// ✅ Optimized MenuItem Component with better hover handling
const MenuItem = memo(({ label, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const timerRef = useRef(null);
  const menuRef = useRef(null);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setIsHovering(false);
  }, []);

  const openMenu = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsOpen(true);
    setIsHovering(true);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (children) {
      openMenu();
    }
  }, [children, openMenu]);

  const handleMouseLeave = useCallback(() => {
    if (children) {
      timerRef.current = setTimeout(closeMenu, 300);
    }
  }, [children, closeMenu]);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, closeMenu]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <li
      ref={menuRef}
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="px-4 py-2 text-gray-800 font-semibold cursor-pointer">
        {label}
      </div>

      {/* Use CSS transition for smoother animation */}
      <div
        className={`absolute left-0 mt-2 bg-white shadow-lg rounded-md w-56 z-50 transition-all duration-200 ${
          isOpen
            ? "opacity-100 visible transform translate-y-0"
            : "opacity-0 invisible transform -translate-y-2"
        }`}
        onMouseEnter={openMenu}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
    </li>
  );
});

// ✅ Optimized SubMenu Component using Links instead of navigate
const SubMenu = memo(
  ({
    subCategories,
    categoryId,
    childCategories,
    items,
    buildQueryString,
    isCurrentRoute,
  }) => {
    const filteredSubCategories = Array.isArray(subCategories)
      ? subCategories.filter(
          (subCategory) => subCategory?.category?._id === categoryId,
        )
      : [];

    return (
      <ul className="text-black p-2">
        {filteredSubCategories
          .filter((subCategory) => subCategory.isActive)
          .map((subCategory) => {
            const subCategoryQuery = buildQueryString({
              subcategory: subCategory.slug,
            });
            const subCategoryPath = `/shop?${subCategoryQuery}`;

            return (
              <li key={subCategory._id} className="px-4 py-2">
                <Link
                  to={subCategoryPath}
                  className="block w-full text-left hover:bg-gray-100 p-1 rounded transition-colors duration-150"
                  onClick={(e) => {
                    if (isCurrentRoute && isCurrentRoute(subCategoryQuery)) {
                      e.preventDefault();
                    }
                  }}
                >
                  {subCategory.name}
                </Link>
                <ChildSubMenu
                  subCategoryId={subCategory._id}
                  childCategories={childCategories}
                  buildQueryString={buildQueryString}
                  isCurrentRoute={isCurrentRoute}
                />
              </li>
            );
          })}

        {items?.map((item, index) => (
          <li key={index} className="px-4 py-2">
            <Link
              to={item.path}
              className="block w-full text-left hover:bg-gray-100 p-1 rounded transition-colors duration-150"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    );
  },
);

// ✅ Optimized ChildSubMenu Component using Links
const ChildSubMenu = memo(
  ({ childCategories, subCategoryId, buildQueryString, isCurrentRoute }) => {
    const filteredChildCategories = Array.isArray(childCategories)
      ? childCategories.filter(
          (childCategory) =>
            String(
              childCategory?.subCategory?._id || childCategory?.subCategory,
            ) === String(subCategoryId),
        )
      : [];

    if (filteredChildCategories.length === 0) return null;

    return (
      <ul className="ml-4">
        {filteredChildCategories
          .filter((childCategory) => childCategory.isActive)
          .map((childCategory) => {
            const childCategoryQuery = buildQueryString({
              childCategory: childCategory.slug,
            });
            const childCategoryPath = `/shop?${childCategoryQuery}`;

            return (
              <li key={childCategory._id} className="px-4 py-2">
                <Link
                  to={childCategoryPath}
                  className="text-left w-full hover:bg-gray-100 p-1 rounded text-sm block transition-colors duration-150"
                  onClick={(e) => {
                    if (isCurrentRoute && isCurrentRoute(childCategoryQuery)) {
                      e.preventDefault();
                    }
                  }}
                >
                  {childCategory.name}
                </Link>
              </li>
            );
          })}
      </ul>
    );
  },
);

export default MenuBar;
