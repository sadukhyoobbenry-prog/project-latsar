"use client";

import { useState } from "react";

import FilterSection from "@/components/harga-komoditas/FilterSection";
import HargaChart from "@/components/harga-komoditas/HargaChart";
import PerbandinganTable from "@/components/harga-komoditas/PerbandinganTable";

export default function HargaKomoditasPage() {

  // =========================
  // STATE GLOBAL KOMODITAS
  // =========================
  const [komoditas, setKomoditas] =
    useState(
      "Beras Nona Kupang (Medium)"
    );

  // =========================
  // STATE GLOBAL TANGGAL
  // =========================
  const [tanggal, setTanggal] =
    useState<Date | null>(
      new Date()
    );

  return (

    <div className="p-6 space-y-6">

      {/* ===================== */}
      {/* FILTER */}
      {/* ===================== */}
      <FilterSection
        komoditas={komoditas}
        setKomoditas={setKomoditas}
        tanggal={tanggal}
        setTanggal={setTanggal}
      />

      {/* ===================== */}
      {/* CHART */}
      {/* ===================== */}
      <HargaChart
        komoditas={komoditas}
        tanggal={tanggal}
      />

      {/* ===================== */}
      {/* TABLE */}
      {/* ===================== */}
      <PerbandinganTable />

    </div>

  );

}