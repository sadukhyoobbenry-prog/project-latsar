import type { Metadata } from "next";
import React from "react";
import { redirect } from "next/navigation";




export const metadata: Metadata = {
  title:
    "Bapok Kab. Timor Tengah Selatan",
  description: "Monitoring Barang Kebutuhan Pokok Kab. Timor Tengah Selatan",
};

export default function Home() {
  redirect("/harga-komoditas");
} 
