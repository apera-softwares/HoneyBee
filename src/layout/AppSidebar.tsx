"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  BoxCubeIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  // ListIcon,
  // PageIcon,
  PieChartIcon,
  PlugInIcon,
  // TableIcon,
  Graph,
  Send,
  Users,
  CoinHand,
  AudioSetting,
} from "../icons/index";
import Logo from '../assets/logo/logo.png'
import { TbLogout2 } from "react-icons/tb";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/slices/userSlice";
import { resetUserProfile } from "@/lib/redux/slices/loginPersonProfile";
import LogoutConfirmationModal from "@/components/common/LogoutConfirmationModal";
import { MdOutlineFeedback } from "react-icons/md";

import { setPageTitle } from "@/lib/redux/slices/appSlice";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <Graph />,
    name: "Dashboard",
    // subItems: [{ name: "Ecommerce", path: "/", pro: false }],
    path: "/",

  },

  {
    icon: <CoinHand />,
    name: "Referrals",
    path: "/referrals",
  },

  {
    icon: <Users />,
    name: "Team",
    path: "/team",
  },

  {
    icon: <AudioSetting />,
    name: "User Management",
    path: "/user-management",
  },
  {
    icon: <GridIcon />,
    name: "Product Catalog",
    path: "/product-catalog",
  },

  // {
  //   name: "Forms",
  //   icon: <ListIcon />,
  //   subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
  // },
  // {
  //   name: "Tables",
  //   icon: <TableIcon />,
  //   subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
  // },
  // {
  //   name: "Pages",
  //   icon: <PageIcon />,
  //   subItems: [
  //     { name: "Blank Page", path: "/blank", pro: false },
  //     { name: "404 Error", path: "/error-404", pro: false },
  //   ],
  // },
];

const team_A: NavItem[] = [
  {
    icon: <Graph />,
    name: "Dashboard",
    // subItems: [{ name: "Ecommerce", path: "/", pro: false }],
    path: "/",

  },
  // {
  //   icon: <Send />,
  //   name: "Landing page and submit referral",
  //   path: "/referral",
  // },
  {
    icon: <Users />,
    name: "Member",
    path: "/members",
  },
  {
    icon: <CoinHand />,
    name: "Referrals",
    path: "/referrals",
  },

  {
    icon: <GridIcon />,
    name: "Product Catalog",
    path: "/product-catalog",
  },

];

const team_B: NavItem[] = [
  {
    icon: <Graph />,
    name: "Dashboard",
    // subItems: [{ name: "Ecommerce", path: "/", pro: false }],
    path: "/",

  },
  {
    icon: <Send />,
    name: "Landing page and submit referral",
    path: "/referral-form",
  },

  {
    icon: <CoinHand />,
    name: "Referrals",
    path: "/referrals",
  },

  {
    icon: <Users />,
    name: "Team",
    path: "/team",
  },
  {
    icon: <GridIcon />,
    name: "Select Product",
    path: "/product-catalog/select-products",
  },


];

const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Charts",
    subItems: [
      { name: "Line Chart", path: "/line-chart", pro: false },
      { name: "Bar Chart", path: "/bar-chart", pro: false },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "UI Elements",
    subItems: [
      { name: "Alerts", path: "/alerts", pro: false },
      { name: "Avatar", path: "/avatars", pro: false },
      { name: "Badge", path: "/badge", pro: false },
      { name: "Buttons", path: "/buttons", pro: false },
      { name: "Images", path: "/images", pro: false },
      { name: "Videos", path: "/videos", pro: false },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/signin", pro: false },
      { name: "Sign Up", path: "/signup", pro: false },
    ],
  },
];

const AppSidebar: React.FC = () => {

  const dispatch = useAppDispatch();
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const [isLogoutConfirmModalOpen, setIsLogoutConfirmModalOpen] = useState<boolean>(false);
  const { userProfile } = useAppSelector((state) => state.userProfile);

  const router = useRouter();
  const pathname = usePathname();

  const handleSetPageTitle = (title:string)=>{
    dispatch(setPageTitle(title));
  }

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-3">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index
                ? "menu-item-active"
                : "menu-item-inactive"
                } cursor-pointer ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
                }`}
            >
              <span
                className={` ${openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
                  }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                    ? "rotate-180 text-orange-500"
                    : ""
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group p-2 ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
                  onClick={()=>handleSetPageTitle(nav.name)}
              >
                <span
                  className={`${isActive(nav.path)
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${isActive(subItem.path)
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
                        }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge `}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${isActive(subItem.path)
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge `}
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
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => path === pathname;
  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
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

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
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

  const handleOpenLogoutConfirmationModal = () => {
    setIsLogoutConfirmModalOpen(true);
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch(logout());
    dispatch(resetUserProfile());
    router.replace("/")

  }

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
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
        className={` h-auto py-6 flex  ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link href="/" onClick={()=>handleSetPageTitle("Dashboard")} >
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src={Logo}
                alt="Logo"
                width={200}
                height={40}
              />
              <Image
                className="hidden dark:block"
                src={Logo}
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <Image
              src={Logo}
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className=" h-8/12 flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  ""
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(
                userProfile?.role === "A_TEAM"
                  ? team_A
                  : userProfile?.role === "B_TEAM"
                    ? team_B
                    : navItems,
                "main"
              )}

            </div>

          </div>
        </nav>

      </div>

      <div className="hidden lg:block h-auto mt-auto  w-full py-3 border-t ">
        <button onClick={()=>{
          handleSetPageTitle("Feedback");
          router.push("/feedback");
        }} className="flex items-center gap-2 text-gray-700 dark:text-white w-full px-5 py-3 rounded-lg cursor-pointer">
          {/* <MdFeedback /> */}
          <MdOutlineFeedback className="text-lg"/>
          {(isExpanded || isHovered || isMobileOpen) && <span>Feedback</span>}
        </button>

        <button className="flex items-center gap-2 text-gray-700 dark:text-white w-full px-5 py-3 rounded-lg   cursor-pointer " onClick={handleOpenLogoutConfirmationModal}>
          <TbLogout2 className="w-5 h-5" />
          {(isExpanded || isHovered || isMobileOpen) && <span>Logout</span>}
        </button>
      </div>
      <LogoutConfirmationModal isOpen={isLogoutConfirmModalOpen} closeModal={() => {
        setIsLogoutConfirmModalOpen(false);

      }} onLogoutConfirm={handleLogout} />
    </aside>
  );
};

export default AppSidebar;
