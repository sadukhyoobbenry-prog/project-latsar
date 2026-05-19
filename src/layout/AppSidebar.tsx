"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { useSidebar } from "../context/SidebarContext";

import {
  ChevronDownIcon,
  DocsIcon,
  HorizontaLDots,
  InfoIcon,
  PencilIcon,
  TableIcon,
} from "../icons/index";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;

  subItems?: {
    name: string;
    path: string;
    new?: boolean;
    pro?: boolean;
  }[];
};

const AppSidebar: React.FC = () => {

  const {
    isExpanded,
    isMobileOpen,
    isHovered,
    setIsHovered,
  } = useSidebar();

  const pathname = usePathname();
  

  // =========================
  // LOGIN STATE
  // =========================
  const [isLogin, setIsLogin] =
    useState(false);

  useEffect(() => {

    const login =
      localStorage.getItem(
        "adminLogin"
      );

    setIsLogin(!!login);

  }, []);

  // =========================
  // NAVIGATION
  // =========================
  const navItems: NavItem[] =
    useMemo(() => {

      const menus: NavItem[] = [

        {
          icon: <TableIcon />,
          name: "Harga Komoditas",
          path: "/harga-komoditas",
        },

        {
          icon: <DocsIcon />,
          name: "Unduh Dokumen",
          path: "/unduh",
        },

        {
          icon: <InfoIcon />,
          name: "Tentang",
          path: "/tentang",
        },

      ];

      // =====================
      // MENU ADMIN
      // =====================
      if (isLogin) {

        menus.splice(2, 0, {

          icon: <PencilIcon />,
          name: "Input Harga",
          path: "/input",

        });

      }

      return menus;

    }, [isLogin]);

  const othersItems: NavItem[] = [];

  const [openSubmenu, setOpenSubmenu] =
    useState<{
      type: "main" | "others";
      index: number;
    } | null>(null);

  const [subMenuHeight, setSubMenuHeight] =
    useState<Record<string, number>>({});

  const subMenuRefs = useRef<
    Record<string, HTMLDivElement | null>
  >({});

  // =========================
  // ACTIVE MENU
  // =========================
  const isActive = useCallback(
    (path: string) => path === pathname,
    [pathname]
  );

  // =========================
  // AUTO OPEN SUBMENU
  // =========================
  useEffect(() => {

    let submenuMatched = false;

    ["main", "others"].forEach(
      (menuType) => {

        const items =
          menuType === "main"
            ? navItems
            : othersItems;

        items.forEach((nav, index) => {

          if (nav.subItems) {

            nav.subItems.forEach(
              (subItem) => {

                if (
                  isActive(
                    subItem.path
                  )
                ) {

                  setOpenSubmenu({

                    type:
                      menuType as
                        | "main"
                        | "others",

                    index,

                  });

                  submenuMatched = true;

                }

              }
            );

          }

        });

      }
    );

    if (!submenuMatched) {

      setOpenSubmenu(null);

    }

  }, [
    pathname,
    isActive,
    navItems,
  ]);

  // =========================
  // SUBMENU HEIGHT
  // =========================
  useEffect(() => {

    if (openSubmenu !== null) {

      const key =
        `${openSubmenu.type}-${openSubmenu.index}`;

      if (
        subMenuRefs.current[key]
      ) {

        setSubMenuHeight(
          (prev) => ({

            ...prev,

            [key]:
              subMenuRefs.current[
                key
              ]?.scrollHeight || 0,

          })
        );

      }

    }

  }, [openSubmenu]);

  // =========================
  // TOGGLE SUBMENU
  // =========================
  const handleSubmenuToggle = (
    index: number,
    menuType:
      | "main"
      | "others"
  ) => {

    setOpenSubmenu((prev) => {

      if (
        prev &&
        prev.type === menuType &&
        prev.index === index
      ) {

        return null;

      }

      return {

        type: menuType,
        index,

      };

    });

  };

  // =========================
  // RENDER MENU
  // =========================
  const renderMenuItems = (
    navItems: NavItem[],
    menuType:
      | "main"
      | "others"
  ) => (

    <ul className="flex flex-col gap-4">

      {navItems.map(
        (nav, index) => (

          <li key={nav.name}>

            {nav.subItems ? (

              <button
                onClick={() =>
                  handleSubmenuToggle(
                    index,
                    menuType
                  )
                }
                className={`
                  menu-item group
                  ${
                    openSubmenu?.type ===
                      menuType &&
                    openSubmenu?.index ===
                      index
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  }
                  cursor-pointer
                  ${
                    !isExpanded &&
                    !isHovered
                      ? "lg:justify-center"
                      : "lg:justify-start"
                  }
                `}
              >

                <span
                  className={`
                    ${
                      openSubmenu?.type ===
                        menuType &&
                      openSubmenu?.index ===
                        index
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }
                  `}
                >
                  {nav.icon}
                </span>

                {(isExpanded ||
                  isHovered ||
                  isMobileOpen) && (

                  <span className="menu-item-text">
                    {nav.name}
                  </span>

                )}

                {(isExpanded ||
                  isHovered ||
                  isMobileOpen) && (

                  <ChevronDownIcon
                    className={`
                      ml-auto
                      w-5
                      h-5
                      transition-transform
                      duration-200
                      ${
                        openSubmenu?.type ===
                          menuType &&
                        openSubmenu?.index ===
                          index
                          ? "rotate-180 text-brand-500"
                          : ""
                      }
                    `}
                  />

                )}

              </button>

            ) : (

              nav.path && (

                <Link
                  href={nav.path}
                  className={`
                    menu-item group
                    ${
                      isActive(nav.path)
                        ? "menu-item-active"
                        : "menu-item-inactive"
                    }
                  `}
                >

                  <span
                    className={`
                      ${
                        isActive(nav.path)
                          ? "menu-item-icon-active"
                          : "menu-item-icon-inactive"
                      }
                    `}
                  >
                    {nav.icon}
                  </span>

                  {(isExpanded ||
                    isHovered ||
                    isMobileOpen) && (

                    <span className="menu-item-text">
                      {nav.name}
                    </span>

                  )}

                </Link>

              )

            )}

          </li>

        )
      )}

    </ul>

  );

  return (

    <aside
      className={`
        fixed
        mt-16
        flex
        flex-col
        lg:mt-0
        top-0
        px-5
        left-0
        bg-white
        dark:bg-gray-900
        dark:border-gray-800
        text-gray-900
        h-dvh
        transition-all
        duration-300
        ease-in-out
        z-50
        border-r
        border-gray-200

        ${
          isExpanded ||
          isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }

        ${
          isMobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }

        lg:translate-x-0
      `}
      onMouseEnter={() =>
        !isExpanded &&
        setIsHovered(true)
      }
      onMouseLeave={() =>
        setIsHovered(false)
      }
    >

      {/* LOGO */}
      <div
        className={`
          py-1
          flex
          ${
            !isExpanded &&
            !isHovered
              ? "lg:justify-center"
              : "justify-start"
          }
        `}
      >

        <Link href="/">

          {isExpanded ||
          isHovered ||
          isMobileOpen ? (

            <>
              <Image
                className="dark:hidden"
                src="/images/logo/logo.png"
                alt="Logo"
                width={150}
                height={40}
              />

              <Image
                className="hidden dark:block"
                src="/images/logo/logo.png"
                alt="Logo"
                width={150}
                height={40}
              />
            </>

          ) : (

            <Image
              src="/images/logo/logo.png"
              alt="Logo"
              width={32}
              height={32}
            />

          )}

        </Link>

      </div>

      {/* MENU */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden duration-300 ease-linear no-scrollbar min-h-0">

        <nav className="mb-6">

          <div className="flex flex-col gap-4">

            <div>

              <h2
                className={`
                  mb-4
                  text-xs
                  uppercase
                  flex
                  leading-[20px]
                  text-gray-400
                  ${
                    !isExpanded &&
                    !isHovered
                      ? "lg:justify-center"
                      : "justify-start"
                  }
                `}
              >

                {isExpanded ||
                isHovered ||
                isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots />
                )}

              </h2>

              {renderMenuItems(
                navItems,
                "main"
              )}

            </div>

          </div>

        </nav>

      </div>

      {/* FOOTER */}
      <div
        className="
          border-t
          border-gray-200
          dark:border-gray-800
          py-4
          text-center
          text-xs
          text-gray-500
          dark:text-gray-400
          leading-relaxed
          mt-auto
        "
      >

        {(isExpanded ||
          isHovered ||
          isMobileOpen) && (

          <>
            <p>
              Dikelola oleh
            </p>

            <p>
              Bidang Bina Usaha
              Perdagangan
            </p>

            <p>
              Dinas Perdagangan
              Perindustrian
              Koperasi dan UMKM
              Kab. Timor Tengah
              Selatan
            </p>

            <p>
              Design By Yoob
              Benry Sadukh
            </p>

            <p>
              Copyright © 2026
            </p>
          </>

        )}

      </div>

    </aside>

  );

};

export default AppSidebar;