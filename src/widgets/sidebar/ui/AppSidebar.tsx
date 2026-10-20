import React, { useEffect, useCallback, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

import {
  Box,
  ChevronRight,
  Ellipsis,
  FolderGit,
  HomeIcon,
  Link2,
  Loader2,
  Notebook,
  Truck,
  Users,
} from "lucide-react";
import { useSidebar } from "@context/SidebarContext";
import { useGetDocumentsForCheckingQuery } from "@pages/Company/page/TabsPage/DocumentCompany/api/api";
import { useGetPermissionsQuery } from "@permissions/permissionsApi";
import { useLocalization } from "@hooks/useLocalization";
import { useGetTransportDocumentsQuery } from "@pages/Documents/Transport/api/api";

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

const useDocumentCounts = () => {
  const { data: companyDocs, isLoading: isLoadingCompany } =
    useGetDocumentsForCheckingQuery({
      userType: "COMPANY",
      page: 0,
      size: 1,
    });

  const { data: individualDocs, isLoading: isLoadingIndividual } =
    useGetDocumentsForCheckingQuery({
      userType: "INDIVIDUAL",
      page: 0,
      size: 1,
    });

  const { data: entrepreneurDocs, isLoading: isLoadingEntrepreneur } =
    useGetDocumentsForCheckingQuery({
      userType: "ENTREPRENEUR",
      page: 0,
      size: 1,
    });

  const { data: transportDocs, isLoading: isLoadingTransport } =
    useGetTransportDocumentsQuery({
      userType: "TRANSPORT",
      page: 0,
      size: 1,
    });

  const isLoading =
    isLoadingCompany ||
    isLoadingIndividual ||
    isLoadingEntrepreneur ||
    isLoadingTransport;

  return {
    COMPANY: companyDocs?.meta?.totalCount || 0,
    INDIVIDUAL: individualDocs?.meta?.totalCount || 0,
    ENTREPRENEUR: entrepreneurDocs?.meta?.totalCount || 0,
    TRANSPORT: transportDocs?.meta?.totalCount || 0,
    isLoading,
  };
};

const AppSidebar = () => {
  const { t } = useLocalization();
  const navItems: NavItem[] = [
    {
      icon: <HomeIcon />,
      name: t("sidebar.main"),
      path: "/",
    },
    {
      name: t("sidebar.subject.name"),
      icon: <Users />,
      subItems: [
        {
          name: t("userType.individual"),
          path: "/registeredIndividuals/INDIVIDUAL",
          pro: false,
          hasAccess: {
            name: "individual",
            path: "/api/v1/individual/",
            method: "GET",
          },
        },
        {
          name: t("userType.company"),
          path: "/registeredCompanies/COMPANY",
          pro: false,
          hasAccess: {
            name: "company",
            path: "/api/v1/company/",
            method: "GET",
          },
        },
        {
          name: t("userType.entrepreneur"),
          path: "/registeredentrepreneurs/ENTREPRENEUR",
          pro: false,
          hasAccess: {
            name: "entrepreneur",
            path: "/api/v1/entrepreneur/",
            method: "GET",
          },
        },
      ],
    },
    {
      name: t("sidebar.objects.name"),
      icon: <Box />,
      subItems: [
        {
          name: t("sidebar.objects.transport"),
          path: "/transport/TRANSPORT",
          pro: false,
          hasAccess: {
            name: "transport",
            path: "/api/v1/transport/",
            method: "GET",
          },
        },
        // {
        //   name: t("sidebar.objects.rail"),
        //   path: "/under-development",
        //   pro: false,
        // },
        // {
        //   name: t("sidebar.objects.roads"),
        //   path: "/under-development",
        //   pro: false,
        // },
        // {
        //   name: t("sidebar.objects.ptk"),
        //   path: "/under-development",
        //   pro: false,
        // },
        // {
        //   name: t("sidebar.objects.roadService"),
        //   path: "/under-development",
        //   pro: false,
        // },
      ],
    },
    {
      name: t("sidebar.its.name"),
      icon: <Truck />,
      path: "/",
      subItems: [
        // {
        //   name: t("sidebar.its.licenses"),
        //   path: [
        //     "/licensing",
        //     "/licensing/companyPermitApplicationTable",
        //     "/licensing/entrepreneurPermitApplicationTable",
        //   ],
        //   pro: false,
        // },
        {
          name: "Товарно-транспортная накладная",
          path: "/certification",
          pro: false,
        },
        {
          name: t("sidebar.its.permits"),
          path: [
            "/permits",
            "/permits/blanksstats",
            "/permits/dozvolTable",
            "/permits/dozvolTable/view",
          ],
          pro: false,
        },
        {
          name: t("sidebar.its.specialPermits"),
          path: "/special-permits",
          pro: false,
        },
        {
          name: t("sidebar.its.waybill"),
          path: "/waybill",
          pro: false,
        },
        {
          name: t("sidebar.its.eTTN"),
          path: "/e-ttn",
          pro: false,
        },
        {
          name: t("sidebar.its.eCMR"),
          path: "/e-cmr",
          pro: false,
        },
        {
          name: t("sidebar.its.eTIR"),
          path: "/e-tir",
          pro: false,
        },
        {
          name: t("sidebar.its.tachograph"),
          path: "/tachograph",
          pro: false,
        },
      ],
    },
  ];

  const othersItems: NavItem[] = [
    {
      name: t("sidebar.others.reports"),
      icon: <FolderGit />,
      subItems: [
        {
          name: t("userType.individual"),
          path: "/reports/INDIVIDUAL",
          pro: false,
        },
        {
          name: t("userType.company"),
          path: "/reports/COMPANY",
          pro: false,
        },
        {
          name: t("userType.entrepreneur"),
          path: "/reports/ENTREPRENEUR",
          pro: false,
        },
        {
          name: t("sidebar.others.reportsTraffic"),
          path: "/reports/traffic-intensity",
          pro: false,
        },
      ],
    },
    {
      icon: <Notebook />,
      name: t("sidebar.others.references"),
      path: [
        "/references",
        "/references/cities",
        "/references/company-types",
        "/references/countries",
        "/references/districts",
        "/references/document-types",
        "/references/user-statuses",
        "/references/transport-types",
        "/references/transport-brands",
        "/references/transport-views",
        "/references/transport-ownerships",
        "/references/transport-owner-types",
        "/references/transport-fuels",
        "/references/licences",
      ],
    },
    {
      icon: <Link2 />,
      name: t("sidebar.others.integrations"),
      path: ["/integrations"],
    },
  ];

  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const { data: permissions = [], isLoading: isLoadingPermissions } =
    useGetPermissionsQuery();
  const {
    COMPANY,
    INDIVIDUAL,
    ENTREPRENEUR,
    TRANSPORT,
    isLoading: isLoadingDocumentCounts,
  } = useDocumentCounts();

  const totalDocumentsCount = COMPANY + INDIVIDUAL + ENTREPRENEUR;

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
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        const filteredSubItems = getFilteredSubItems(nav.subItems);
        if (filteredSubItems && filteredSubItems.length > 0) {
          filteredSubItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
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

  const DocumentCountBadge = ({ userType }: { userType: string }) => {
    let count = 0;

    switch (userType) {
      case "COMPANY":
        count = COMPANY;
        break;
      case "INDIVIDUAL":
        count = INDIVIDUAL;
        break;
      case "ENTREPRENEUR":
        count = ENTREPRENEUR;
        break;
      case "TRANSPORT":
        count = TRANSPORT;
        break;
      default:
        count = 0;
    }

    if (!count || count === 0) return null;

    return (
      <span className="ml-auto flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-500 rounded-full min-w-[20px]">
        {count > 99 ? "99+" : count}
      </span>
    );
  };

  const LoadingSkeleton = ({ isExpanded }: { isExpanded: boolean }) => {
    const showExpanded = isExpanded || isHovered;

    return (
      <nav className="mb-6">
        <div className="flex flex-col gap-4">
          <div>
            <h2
              className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
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
      <ul className="flex flex-col gap-4">
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
                        {(nav.name === "Документы на проверку" ||
                          nav.name === "Ҳуҷҷатҳо барои тасдиқ") &&
                          totalDocumentsCount > 0 && (
                            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                          )}
                      </span>
                    )}

                    {(isExpanded || isHovered || isMobileOpen) && (
                      <>
                        <ChevronRight
                          className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                            openSubmenu?.type === menuType &&
                            openSubmenu?.index === index
                              ? "rotate-90 text-brand-500"
                              : ""
                          }`}
                        />
                        {isLoadingDocumentCounts &&
                          nav.name === t("sidebar.documents.name") && (
                            <Loader2 className="w-4 h-4 ml-2 text-gray-400 animate-spin" />
                          )}
                      </>
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
                    <ul className="mt-2 space-y-1 ml-9">
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
                              {subItem.userType && (
                                <>
                                  <DocumentCountBadge
                                    userType={subItem.userType}
                                  />
                                  {isLoadingDocumentCounts && (
                                    <Loader2 className="w-3 h-3 text-gray-400 animate-spin" />
                                  )}
                                </>
                              )}
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
        className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen z-50 border-r border-gray-200 
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
          className={`py-8 flex ${
            !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
        >
          <Link to="/">
            {isExpanded || isHovered || isMobileOpen ? (
              <>
                <p className="text-center uppercase dark:text-gray-400">
                  Центр цифровизации транспортного сектора
                </p>
              </>
            ) : (
              <img src="/main_logo.png" alt="Logo" width={42} height={42} />
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

                <div className="">
                  <h2
                    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                      !isExpanded && !isHovered
                        ? "lg:justify-center"
                        : "justify-start"
                    }`}
                  >
                    {isExpanded || isHovered || isMobileOpen ? (
                      `${t("sidebar.additionally")}`
                    ) : (
                      <Ellipsis />
                    )}
                  </h2>
                  {renderMenuItems(othersItems, "others")}
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
