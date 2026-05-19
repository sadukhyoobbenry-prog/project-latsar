"use client";

import { useState }
from "react";

import {
  useRouter,
} from "next/navigation";

export default function LoginPage() {

  const router = useRouter();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  // =========================
  // LOGIN
  // =========================
  const handleLogin = (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    // =====================
    // LOGIN SIMPLE
    // =====================
    if (
  username === "admin" &&
  password === "TTS2026@Admin"
) {

  localStorage.setItem(
    "adminLogin",
    "true"
  );
  
  router.push("/input");

  window.location.href =
    "/harga-komoditas";

} else {

  setError(
    "Username atau password salah"
  );

}

  };

  return (

    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gray-50
        dark:bg-gray-950
        px-4
      "
    >

      <div
        className="
          w-full
          max-w-md
          bg-white
          dark:bg-gray-900
          rounded-2xl
          shadow-lg
          p-8
          border
          border-gray-100
          dark:border-gray-800
        "
      >

        {/* HEADER */}
        <div className="mb-8 text-center">

          <h1
            className="
              text-3xl
              font-bold
              text-gray-900
              dark:text-white
            "
          >

            Login Admin

          </h1>

          <p
            className="
              mt-2
              text-gray-500
              dark:text-gray-400
            "
          >

            Sistem Monitoring Harga
            Bapok Kab. Timor Tengah Selatan

          </p>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          {/* USERNAME */}
          <div>

            <label
              className="
                block
                mb-2
                text-sm
                font-medium
                text-gray-700
                dark:text-gray-300
              "
            >

              Username

            </label>

            <input
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(
                  e.target.value
                )
              }
              placeholder="Masukkan username"
              className="
                w-full
                px-4
                py-3
                rounded-xl
                border
                border-gray-300
                dark:border-gray-700
                bg-white
                dark:bg-gray-800
                text-gray-900
                dark:text-white
                focus:outline-none
                focus:ring-2
                focus:ring-brand-500
              "
            />

          </div>

          {/* PASSWORD */}
          <div>

            <label
              className="
                block
                mb-2
                text-sm
                font-medium
                text-gray-700
                dark:text-gray-300
              "
            >

              Password

            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              placeholder="Masukkan password"
              className="
                w-full
                px-4
                py-3
                rounded-xl
                border
                border-gray-300
                dark:border-gray-700
                bg-white
                dark:bg-gray-800
                text-gray-900
                dark:text-white
                focus:outline-none
                focus:ring-2
                focus:ring-brand-500
              "
            />

          </div>

          {/* ERROR */}
          {error && (

            <div
              className="
                bg-red-100
                text-red-600
                text-sm
                rounded-xl
                px-4
                py-3
              "
            >

              {error}

            </div>

          )}

          {/* BUTTON */}
          <button
            type="submit"
            className="
              w-full
              py-3
              rounded-xl
              bg-brand-500
              hover:bg-brand-600
              text-white
              font-semibold
              transition
            "
          >

            Login

          </button>

        </form>

        {/* FOOTER */}
        <div
          className="
            mt-8
            text-center
            text-sm
            text-gray-500
            dark:text-gray-400
          "
        >

          Sistem Monitoring Harga
          Bapok Kabupaten TTS

        </div>

      </div>

    </div>

  );

}