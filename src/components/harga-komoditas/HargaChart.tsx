"use client";

import { useMemo, useState } from "react";

import TradingViewChart from "../charts/TradingViewChart";

import { hargaData } from "../../data/HargaData";

type HargaChartProps = {
  komoditas: string;
};

export default function HargaChart({
  komoditas,
}: HargaChartProps) {

  // =========================
  // FILTER
  // =========================
  const [range, setRange] =
    useState("1H");

  // =========================
  // TOGGLE HET
  // =========================
  const [showHET, setShowHET] =
    useState(true);

  // =========================
  // TOGGLE HAP
  // =========================
  const [showHAP, setShowHAP] =
    useState(true);

  // =========================
  // HET & HAP VALUE
  // =========================
  const HET =
    komoditas === "Minyakita"
      ? 15700
      : null;

  const HAP =
    komoditas ===
    "Daging Sapi Paha Belakang"
      ? 140000
      : null;

  // =========================
  // UNIT
  // =========================
  const unit =
    komoditas === "Minyakita"
      ? "lt"
      : "kg";

  // =========================
  // DATA TERPILIH
  // =========================
  const selectedData =
  hargaData[komoditas]?.data || [];

  const satuan =
  hargaData[komoditas]?.satuan || "kg";

  // =========================
  // FILTER DATA
  // =========================
  const filteredData = useMemo(() => {

    // =====================
    // HARIAN
    // =====================
    if (range === "1H") {

      return selectedData;

    }

    // =====================
    // MINGGUAN
    // =====================
    if (range === "1M") {

      const weeklyAverage = [];

      for (
        let i = 0;
        i < selectedData.length;
        i += 5
      ) {

        const chunk =
          selectedData.slice(i, i + 5);

        if (chunk.length === 0)
          continue;

        const avg =
          chunk.reduce(
            (
              sum: number,
              item: any
            ) =>
              sum + item.harga,
            0
          ) / chunk.length;

        weeklyAverage.push({

          tanggal:
            chunk[
              chunk.length - 1
            ]?.tanggal,

          harga:
            Math.round(avg),

        });

      }

      return weeklyAverage;

    }

    // =====================
    // BULANAN
    // =====================
    if (range === "1B") {

      const monthlyAverage = [];

      for (
        let i = 0;
        i < selectedData.length;
        i += 30
      ) {

        const chunk =
          selectedData.slice(i, i + 30);

        if (chunk.length === 0)
          continue;

        const avg =
          chunk.reduce(
            (
              sum: number,
              item: any
            ) =>
              sum + item.harga,
            0
          ) / chunk.length;

        monthlyAverage.push({

          tanggal:
            chunk[
              chunk.length - 1
            ]?.tanggal,

          harga:
            Math.round(avg),

        });

      }

      return monthlyAverage;

    }

    return selectedData;

  }, [range, selectedData]);

  // =========================
  // FORMAT CHART
  // =========================
  const tradingViewData =
    filteredData.map(
      (item: any) => ({

        time:
          item.tanggal?.includes("s/d")
            ? item.tanggal.split(
                " s/d "
              )[0]
            : item.tanggal,

        value: item.harga,

      })
    );

  // =========================
  // LABEL
  // =========================
  const labelHarga =
    range === "1H"
      ? "Harga Harian"
      : range === "1M"
      ? "Harga Mingguan"
      : "Harga Bulanan";

  const labelPerubahan =
    range === "1H"
      ? "Perubahan Harian"
      : range === "1M"
      ? "Perubahan Mingguan"
      : "Perubahan Bulanan";

  const labelPersentase =
    range === "1H"
      ? "Persentase Harian"
      : range === "1M"
      ? "Persentase Mingguan"
      : "Persentase Bulanan";

  // =========================
  // STATISTIK
  // =========================
  let hargaSekarang = 0;
  let hargaSebelumnya = 0;

  // =====================
  // HARIAN
  // =====================
  if (range === "1H") {

    hargaSekarang =
      selectedData[
        selectedData.length - 1
      ]?.harga || 0;

    hargaSebelumnya =
      selectedData[
        selectedData.length - 2
      ]?.harga || 0;

  }

  // =====================
  // MINGGUAN
  // =====================
  if (range === "1M") {

    const mingguIni =
      selectedData.slice(-5);

    const mingguLalu =
      selectedData.slice(-10, -5);

    hargaSekarang =
      mingguIni.length > 0
        ? mingguIni.reduce(
            (sum, item) =>
              sum + item.harga,
            0
          ) / mingguIni.length
        : 0;

    hargaSebelumnya =
      mingguLalu.length > 0
        ? mingguLalu.reduce(
            (sum, item) =>
              sum + item.harga,
            0
          ) / mingguLalu.length
        : 0;

  }

  // =====================
  // BULANAN
  // =====================
  if (range === "1B") {

    const bulanIni =
      selectedData.slice(-30);

    const bulanLalu =
      selectedData.slice(-60, -30);

    hargaSekarang =
      bulanIni.length > 0
        ? bulanIni.reduce(
            (sum, item) =>
              sum + item.harga,
            0
          ) / bulanIni.length
        : 0;

    hargaSebelumnya =
      bulanLalu.length > 0
        ? bulanLalu.reduce(
            (sum, item) =>
              sum + item.harga,
            0
          ) / bulanLalu.length
        : 0;

  }

  // =========================
  // PEMBULATAN
  // =========================
  hargaSekarang =
    Math.round(hargaSekarang);

  hargaSebelumnya =
    Math.round(hargaSebelumnya);

  // =========================
  // SELISIH
  // =========================
  const selisih =
    hargaSekarang -
    hargaSebelumnya;

  // =========================
  // PERSENTASE
  // =========================
  const persen =
    hargaSebelumnya > 0
      ? (
          (selisih /
            hargaSebelumnya) *
          100
        ).toFixed(2)
      : "0";

  return (

    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

      {/* HEADER */}
      <div className="flex flex-col gap-4 mb-5">

        {/* TOP */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          {/* LEFT */}
          <div>

            <h2 className="text-2xl font-bold text-gray-900">
              {komoditas}
            </h2>

            <p className="text-sm text-gray-500">
              Grafik harga komoditas
            </p>

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2 flex-wrap">

            {/* FILTER */}
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">

              {[
                "1H",
                "1M",
                "1B",
              ].map((item) => (

                <button
                  type="button"
                  key={item}
                  onClick={() =>
                    setRange(item)
                  }
                  className={`px-4 py-2 text-sm transition-all ${
                    range === item
                      ? "bg-blue-500 text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {item}
                </button>

              ))}

            </div>

            {/* HET */}
            {HET && (

              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">

                <span className="text-sm text-gray-600">
                  HET
                </span>

                <button
                  onClick={() =>
                    setShowHET(!showHET)
                  }
                  className={`w-12 h-6 rounded-full relative transition ${
                    showHET
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                >

                  <div
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition ${
                      showHET
                        ? "right-0.5"
                        : "left-0.5"
                    }`}
                  />

                </button>

              </div>

            )}

            {/* HAP */}
            {HAP && (

              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">

                <span className="text-sm text-gray-600">
                  HAP
                </span>

                <button
                  onClick={() =>
                    setShowHAP(!showHAP)
                  }
                  className={`w-12 h-6 rounded-full relative transition ${
                    showHAP
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                >

                  <div
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition ${
                      showHAP
                        ? "right-0.5"
                        : "left-0.5"
                    }`}
                  />

                </button>

              </div>

            )}

          </div>

        </div>

        {/* =========================
            STATISTIK
        ========================= */}
        <div className="flex flex-wrap items-center gap-10 border-b border-gray-100 pb-5">

          {/* HARGA */}
          <div>

            <p className="text-[11px] tracking-wide text-gray-400 uppercase mb-1">
              {labelHarga}
            </p>

            <h3 className="text-3xl font-semibold text-gray-900 leading-none">

              Rp.
              {hargaSekarang.toLocaleString(
                "id-ID"
              )}
              /{satuan}

            </h3>

          </div>

          {/* PERUBAHAN */}
          <div>

            <p className="text-[11px] tracking-wide text-gray-400 uppercase mb-1">
              {labelPerubahan}
            </p>

            <div className="flex items-center gap-2">

              <span
                className={`text-xl ${
                  selisih > 0
                    ? "text-red-500"
                    : selisih < 0
                    ? "text-green-500"
                    : "text-gray-400"
                }`}
              >

                {selisih > 0
                  ? "▲"
                  : selisih < 0
                  ? "▼"
                  : "▬"}

              </span>

              <h3
                className={`text-2xl font-semibold leading-none ${
                  selisih > 0
                    ? "text-red-500"
                    : selisih < 0
                    ? "text-green-500"
                    : "text-gray-500"
                }`}
              >

                {selisih > 0 ? "+" : ""}
                Rp.
                {Math.abs(selisih).toLocaleString(
                  "id-ID"
                )}
                /{satuan}

              </h3>

            </div>

          </div>

          {/* PERSENTASE */}
          <div>

            <p className="text-[11px] tracking-wide text-gray-400 uppercase mb-1">
              {labelPersentase}
            </p>

            <div className="flex items-center gap-2">

              <span
                className={`text-xl ${
                  Number(persen) > 0
                    ? "text-red-500"
                    : Number(persen) < 0
                    ? "text-green-500"
                    : "text-gray-400"
                }`}
              >

                {Number(persen) > 0
                  ? "▲"
                  : Number(persen) < 0
                  ? "▼"
                  : "▬"}

              </span>

              <h3
                className={`text-2xl font-semibold leading-none ${
                  Number(persen) > 0
                    ? "text-red-500"
                    : Number(persen) < 0
                    ? "text-green-500"
                    : "text-gray-500"
                }`}
              >

                {Number(persen) > 0
                  ? "+"
                  : ""}
                {Math.abs(
                  Number(persen)
                ).toFixed(2)}%

              </h3>

            </div>

          </div>

        </div>

      </div>

      {/* CHART */}
      <TradingViewChart
        data={tradingViewData}
        komoditas={komoditas}
        showHET={showHET}
        showHAP={showHAP}
        HET={HET}
        HAP={HAP}
        key={`${komoditas}-${range}`}
      />

    </div>

  );

}