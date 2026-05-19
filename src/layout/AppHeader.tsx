"use client";

import { ThemeToggleButton }
from "@/components/common/ThemeToggleButton";

import { useSidebar }
from "@/context/SidebarContext";

import Image from "next/image";
import Link from "next/link";

import React, {
  useState,
  useEffect,
  useRef,
} from "react";

import {
  useRouter,
} from "next/navigation";

const AppHeader: React.FC = () => {

  const router = useRouter();

  const [
    isApplicationMenuOpen,
    setApplicationMenuOpen,
  ] = useState(false);

  const {
    isMobileOpen,
    toggleSidebar,
    toggleMobileSidebar,
  } = useSidebar();

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
  // LOGOUT
  // =========================
  const handleLogout = () => {

    localStorage.removeItem(
      "adminLogin"
    );

    router.push(
      "/harga-komoditas"
    );

    window.location.reload();

  };

  // =========================
  // SIDEBAR TOGGLE
  // =========================
  const handleToggle = () => {

    if (
      window.innerWidth >= 1024
    ) {

      toggleSidebar();

    } else {

      toggleMobileSidebar();

    }

  };

  // =========================
  // MOBILE MENU
  // =========================
  const toggleApplicationMenu =
    () => {

      setApplicationMenuOpen(
        !isApplicationMenuOpen
      );

    };

  // =========================
  // SEARCH SHORTCUT
  // =========================
  const inputRef =
    useRef<HTMLInputElement>(
      null
    );

  useEffect(() => {

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {

      if (
        (event.metaKey ||
          event.ctrlKey) &&
        event.key === "k"
      ) {

        event.preventDefault();

        inputRef.current?.focus();

      }

    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

    };

  }, []);

  return (

    <header
      className="
        sticky
        top-0
        flex
        w-full
        bg-white
        border-gray-200
        z-99999
        dark:border-gray-800
        dark:bg-gray-900
        lg:border-b
      "
    >

      <div
        className="
          flex
          flex-col
          items-center
          justify-between
          grow
          lg:flex-row
          lg:px-6
        "
      >

        {/* LEFT */}
        <div
          className="
            flex
            items-center
            justify-between
            w-full
            gap-2
            px-3
            py-3
            border-b
            border-gray-200
            dark:border-gray-800
            sm:gap-4
            lg:justify-normal
            lg:border-b-0
            lg:px-0
            lg:py-4
          "
        >

          {/* SIDEBAR BUTTON */}
          <button
            className="
              items-center
              justify-center
              w-10
              h-10
              text-gray-500
              border-gray-200
              rounded-lg
              z-99999
              dark:border-gray-800
              lg:flex
              dark:text-gray-400
              lg:h-11
              lg:w-11
              lg:border
            "
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >

            {isMobileOpen ? (

              <span className="text-xl">
                ✕
              </span>

            ) : (

              <span className="text-xl">
                ☰
              </span>

            )}

          </button>

          {/* MOBILE LOGO */}
          <Link
            href="/"
            className="lg:hidden"
          >

            <Image
              width={154}
              height={32}
              className="dark:hidden"
              src="/images/logo/logo.png"
              alt="Logo"
            />

            <Image
              width={154}
              height={32}
              className="hidden dark:block"
              src="/images/logo/logo.png"
              alt="Logo"
            />

          </Link>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={
              toggleApplicationMenu
            }
            className="
              flex
              items-center
              justify-center
              w-10
              h-10
              text-gray-700
              rounded-lg
              z-99999
              hover:bg-gray-100
              dark:text-gray-400
              dark:hover:bg-gray-800
              lg:hidden
            "
          >

            ⋮

          </button>

        </div>

        {/* RIGHT */}
        <div
          className={`
            ${
              isApplicationMenuOpen
                ? "flex"
                : "hidden"
            }

            items-center
            justify-between
            w-full
            gap-4
            px-5
            py-4
            lg:flex
            shadow-theme-md
            lg:justify-end
            lg:px-0
            lg:shadow-none
          `}
        >

          {/* DARK MODE */}
          <div
            className="
              flex
              items-center
              gap-2
              2xsm:gap-3
            "
          >

            <ThemeToggleButton />

          </div>

          {/* LOGIN AREA */}
          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            {!isLogin ? (

              <Link
                href="/login"
                className="
                  px-4
                  py-2
                  rounded-lg
                  bg-brand-500
                  text-white
                  hover:bg-brand-600
                  transition
                "
              >

                Login Admin

              </Link>

            ) : (

              <>

                {/* USER BADGE */}
                <div
                  className="
                    px-4
                    py-2
                    rounded-lg
                    bg-gray-100
                    dark:bg-gray-800
                    text-sm
                    font-medium
                  "
                >

                  Admin

                </div>

                {/* LOGOUT */}
                <button
                  onClick={
                    handleLogout
                  }
                  className="
                    px-4
                    py-2
                    rounded-lg
                    bg-red-500
                    text-white
                    hover:bg-red-600
                    transition
                  "
                >

                  Logout

                </button>

              </>

            )}

          </div>

        </div>

      </div>

    </header>

  );

};

export default AppHeader;