import React, { useEffect, useCallback, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

import { ChevronRight, Ellipsis, FileText, Table2 } from "lucide-react";
import { useSidebar } from "@shared/lib/sidebar/SidebarContext";
import { useGetPermissionsQuery } from "@entities/permission";
import { useLocalization } from "@shared/lib/useLocalization";
import {
  ATLS_GROUPS, getAtlsReferencePath, getGroupReferences } from "@entities/reference";
import { WAYBILL_MENU, getWaybillListPath } from "@entities/waybill";
import { ATLS_REPORTS, getAtlsReportPath } from "@entities/report";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string | string[];
  userType?: string;
  subItems?: {
    name: string;
    path: string | string[];
    pro?: boolean;
    new?: boolean;
    userType?: string;
    hasAccess?: { name: string; path: string; method: string };
  }[];
};

const AppSidebar = () => {
  const { t } = useLocalization();
  // Порядок как в прототипе: путевые листы, справочники по разделам, отчёты
  const navItems: NavItem[] = [
    {
      icon: <Table2 size={18} />,
      name: t("atls.groups.waybills"),
      subItems: WAYBILL_MENU.map((item) => ({
        name: t(`atls.waybills.menu.${item.slug}`),
        path: getWaybillListPath(item.slug),
      })),
    },
    ...ATLS_GROUPS.map(({ key, icon: Icon }) => ({
      icon: <Icon size={18} />,
      name: t(`atls.groups.${key}`),
      subItems: getGroupReferences(key).map((reference) => ({
        name: t(`atls.refs.${reference.slug}`),
        path: getAtlsReferencePath(reference.slug),
      })),
    })),
    {
      icon: <FileText size={18} />,
      name: t("atls.groups.reports"),
      subItems: ATLS_REPORTS.map((report) => ({
        name: t(`atls.reports.titles.${report.slug}`),
        path: getAtlsReportPath(report.slug),
      })),
    },
  ];

  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const { data: permissions = [], isLoading: isLoadingPermissions } =
    useGetPermissionsQuery();
  const hasAccess = useCallback(
    (accessConfig: { name: string; path: string; method: string }) => {
      return permissions.some(
        (p) =>
          p.name === accessConfig.name &&
          p.path === accessConfig.path &&
          p.method === accessConfig.method,
      );
    },
    [permissions],
  );

  const getFilteredSubItems = useCallback(
    (subItems: NavItem["subItems"]) => {
      if (!subItems) return undefined;

      return subItems.filter((subItem) => {
        if (subItem.hasAccess) {
          return hasAccess(subItem.hasAccess);
        }
        return true;
      });
    },
    [hasAccess],
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {},
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (paths: string | string[]) => {
      const current = location.pathname;
      const list = Array.isArray(paths) ? paths : [paths];

      return list.some((p) =>
        p === "/"
          ? current === "/"
          : current === p || current.startsWith(p + "/"),
      );
    },
    [location.pathname],
  );

  useEffect(() => {
    let submenuMatched = false;
    navItems.forEach((nav, index) => {
      const filteredSubItems = getFilteredSubItems(nav.subItems);
      if (filteredSubItems && filteredSubItems.length > 0) {
        filteredSubItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({ type: "main", index });
            submenuMatched = true;
          }
        });
      }
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive, getFilteredSubItems]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const LoadingSkeleton = ({ isExpanded }: { isExpanded: boolean }) => {
    const showExpanded = isExpanded || isHovered;

    return (
      <nav className="mb-6">
        <div className="flex flex-col gap-4">
          <div>
            <h2
              className={`mb-2 px-3 text-[10.5px] font-bold tracking-[0.12em] uppercase flex leading-[20px] text-[#8a86c4] ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
              }`}
            >
              {showExpanded ? (
                <div className="w-12 h-4 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
              ) : (
                <Ellipsis className="w-6 h-6 text-gray-400" />
              )}
            </h2>

            <div className="flex flex-col gap-[18px]">
              <div
                className={`flex items-center ${showExpanded ? "gap-3" : "lg:justify-center"} p-2 rounded-lg`}
              >
                <div className="w-6 h-6 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                {showExpanded && (
                  <div className="flex-1 h-4 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                )}
              </div>

              <div
                className={`flex items-center ${showExpanded ? "gap-3" : "lg:justify-center"} p-2 rounded-lg`}
              >
                <div className="w-6 h-6 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                {showExpanded && (
                  <>
                    <div className="flex-1 h-4 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                    <div className="w-5 h-5 ml-auto bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                  </>
                )}
              </div>

              <div
                className={`flex items-center ${showExpanded ? "gap-3" : "lg:justify-center"} p-2 rounded-lg`}
              >
                <div className="w-6 h-6 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                {showExpanded && (
                  <>
                    <div className="flex-1 h-4 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                    <div className="w-5 h-5 ml-auto bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                  </>
                )}
              </div>

              <div
                className={`flex items-center ${showExpanded ? "gap-3" : "lg:justify-center"} p-2 rounded-lg`}
              >
                <div className="w-6 h-6 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                {showExpanded && (
                  <>
                    <div className="flex-1 h-4 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                    <div className="flex items-center gap-2 ml-auto">
                      <div className="w-4 h-4 bg-gray-200 rounded-full dark:bg-gray-700 animate-pulse"></div>
                      <div className="w-5 h-5 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                    </div>
                  </>
                )}
              </div>

              <div
                className={`flex items-center ${showExpanded ? "gap-3" : "lg:justify-center"} p-2 rounded-lg`}
              >
                <div className="w-6 h-6 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                {showExpanded && (
                  <>
                    <div className="flex-1 h-4 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                    <div className="w-5 h-5 ml-auto bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                  </>
                )}
              </div>

              <div
                className={`flex items-center ${showExpanded ? "gap-3" : "lg:justify-center"} p-2 rounded-lg`}
              >
                <div className="w-6 h-6 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                {showExpanded && (
                  <>
                    <div className="flex-1 h-4 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                    <div className="w-5 h-5 ml-auto bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                  </>
                )}
              </div>
              <div
                className={`flex items-center ${showExpanded ? "gap-3" : "lg:justify-center"} p-2 rounded-lg`}
              >
                <div className="w-6 h-6 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                {showExpanded && (
                  <>
                    <div className="flex-1 h-4 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                    <div className="w-5 h-5 ml-auto bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-3">
            <h2
              className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
              }`}
            >
              {showExpanded ? (
                <div className="w-40 h-4 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
              ) : (
                <Ellipsis className="w-6 h-6 text-gray-400" />
              )}
            </h2>

            <div className="flex flex-col gap-[20px]">
              <div
                className={`flex items-center ${showExpanded ? "gap-3" : "lg:justify-center"} p-2 rounded-lg`}
              >
                <div className="w-6 h-6 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                {showExpanded && (
                  <>
                    <div className="flex-1 h-4 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                    <div className="w-5 h-5 ml-auto bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                  </>
                )}
              </div>

              <div
                className={`flex items-center ${showExpanded ? "gap-3" : "lg:justify-center"} p-2 rounded-lg`}
              >
                <div className="w-6 h-6 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                {showExpanded && (
                  <div className="flex-1 h-4 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                )}
              </div>

              <div
                className={`flex items-center ${showExpanded ? "gap-3" : "lg:justify-center"} p-2 rounded-lg`}
              >
                <div className="w-6 h-6 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                {showExpanded && (
                  <div className="flex-1 h-4 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => {
    return (
      <ul className="flex flex-col gap-1">
        {items.map((nav, index) => {
          const filteredSubItems = getFilteredSubItems(nav.subItems);
          const hasVisibleSubItems =
            filteredSubItems && filteredSubItems.length > 0;

          return (
            <li key={nav.name}>
              {nav.subItems ? (
                hasVisibleSubItems ? (
                  <button
                    onClick={() => handleSubmenuToggle(index, menuType)}
                    className={`menu-item group ${
                      openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                        ? "menu-item-active"
                        : "menu-item-inactive"
                    } cursor-pointer ${
                      !isExpanded && !isHovered
                        ? "lg:justify-center"
                        : "lg:justify-start"
                    }`}
                  >
                    <span
                      className={`${
                        openSubmenu?.type === menuType &&
                        openSubmenu?.index === index
                          ? "menu-item-icon-active"
                          : "menu-item-icon-inactive"
                      }`}
                    >
                      {nav.icon}
                    </span>
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <span className="flex items-center gap-2 menu-item-text">
                        {nav.name}
                      </span>
                    )}

                    {(isExpanded || isHovered || isMobileOpen) && (
                      <ChevronRight
                        className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                          openSubmenu?.type === menuType &&
                          openSubmenu?.index === index
                            ? "rotate-90 text-brand-500"
                            : ""
                        }`}
                      />
                    )}
                  </button>
                ) : (
                  nav.path && (
                    <Link
                      to={Array.isArray(nav.path) ? nav.path[0] : nav.path}
                      className={`menu-item group ${
                        isActive(nav.path)
                          ? "menu-item-active"
                          : "menu-item-inactive"
                      }`}
                    >
                      <span
                        className={`${
                          isActive(nav.path)
                            ? "menu-item-icon-active"
                            : "menu-item-icon-inactive"
                        }`}
                      >
                        {nav.icon}
                      </span>
                      {(isExpanded || isHovered || isMobileOpen) && (
                        <span className="menu-item-text">{nav.name}</span>
                      )}
                    </Link>
                  )
                )
              ) : (
                nav.path && (
                  <Link
                    to={Array.isArray(nav.path) ? nav.path[0] : nav.path}
                    className={`menu-item group ${
                      isActive(nav.path)
                        ? "menu-item-active"
                        : "menu-item-inactive"
                    }`}
                  >
                    <span
                      className={`${
                        isActive(nav.path)
                          ? "menu-item-icon-active"
                          : "menu-item-icon-inactive"
                      }`}
                    >
                      {nav.icon}
                    </span>
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <span className="menu-item-text">{nav.name}</span>
                    )}
                  </Link>
                )
              )}
              {hasVisibleSubItems &&
                (isExpanded || isHovered || isMobileOpen) && (
                  <div
                    ref={(el) => {
                      subMenuRefs.current[`${menuType}-${index}`] = el;
                    }}
                    className="overflow-hidden transition-all duration-300"
                    style={{
                      height:
                        openSubmenu?.type === menuType &&
                        openSubmenu?.index === index
                          ? `${subMenuHeight[`${menuType}-${index}`]}px`
                          : "0px",
                    }}
                  >
                    <ul className="mt-1 mb-2 ml-[21px] space-y-0.5 border-l border-white/10 pl-3">
                      {filteredSubItems.map((subItem) => (
                        <li key={subItem.name}>
                          <Link
                            to={
                              Array.isArray(subItem.path)
                                ? subItem.path[0]
                                : subItem.path
                            }
                            className={`menu-dropdown-item ${
                              isActive(subItem.path)
                                ? "menu-dropdown-item-active"
                                : "menu-dropdown-item-inactive"
                            }`}
                          >
                            {subItem.name}
                            <span className="flex items-center gap-1 ml-auto">
                              {subItem.new && (
                                <span
                                  className={`ml-auto ${
                                    isActive(subItem.path)
                                      ? "menu-dropdown-badge-active"
                                      : "menu-dropdown-badge-inactive"
                                  } menu-dropdown-badge`}
                                >
                                  new
                                </span>
                              )}
                              {subItem.pro && (
                                <span
                                  className={`ml-auto ${
                                    isActive(subItem.path)
                                      ? "menu-dropdown-badge-active"
                                      : "menu-dropdown-badge-inactive"
                                  } menu-dropdown-badge`}
                                >
                                  pro
                                </span>
                              )}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <>
      <aside
        className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-4 left-0 bg-gradient-to-b from-[#1e1b4b] to-[#2e1f6b] dark:from-[#120f2e] dark:to-[#1d1544] text-[#c9c6f2] h-screen z-50
          ${
            isExpanded || isMobileOpen
              ? "w-[290px]"
              : isHovered
                ? "w-[290px]"
                : "w-[90px]"
          }
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0`}
        onMouseEnter={() => !isExpanded && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`py-5 flex ${
            !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
        >
          <Link to="/" className="flex items-center gap-3">
            <img src="/main_logo.png" alt="Logo" width={34} height={34} />
            {(isExpanded || isHovered || isMobileOpen) && (
              <div>
                <p className="text-[15px] font-bold tracking-[-0.01em] leading-tight text-white">
                  {t("atls.brand.name")}
                </p>
                <p className="text-[11px] leading-tight text-[#8a86c4]">
                  {t("atls.brand.subtitle")}
                </p>
              </div>
            )}
          </Link>
        </div>
        <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
          <nav className="mb-6">
            {isLoadingPermissions ? (
              <LoadingSkeleton
                isExpanded={isExpanded || isHovered || isMobileOpen}
              />
            ) : (
              <div className="flex flex-col gap-4">
                <div>
                  <h2
                    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                      !isExpanded && !isHovered
                        ? "lg:justify-center"
                        : "justify-start"
                    }`}
                  >
                    {isExpanded || isHovered || isMobileOpen ? (
                      "Меню"
                    ) : (
                      <Ellipsis />
                    )}
                  </h2>
                  {renderMenuItems(navItems, "main")}
                </div>
              </div>
            )}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
