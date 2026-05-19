"use client";

import { useMemo, useState } from "react";

import Flatpickr from "react-flatpickr";

import { Indonesian } from "flatpickr/dist/l10n/id.js";

import { hargaData } from "@/data/HargaData";

import * as XLSX from "xlsx";

import { saveAs } from "file-saver";

export default function UnduhHargaPage() {

  // =========================
  // STATE
  // =========================
  const [
    showPreview,
    setShowPreview,
  ] = useState(false);

  const [
    tanggalAwal,
    setTanggalAwal,
  ] = useState<Date | null>(
    null
  );

  const [
    tanggalAkhir,
    setTanggalAkhir,
  ] = useState<Date | null>(
    null
  );

  const [
    selectedKomoditas,
    setSelectedKomoditas,
  ] = useState(
    "Semua Komoditas"
  );

  // =========================
  // FORMAT DATE
  // =========================
  const formatTanggal = (
    date: Date | null
  ) => {

    if (!date) return "";

    const year =
      date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;

  };

  // =========================
  // LIST KOMODITAS
  // =========================
  const komoditasList =
    Object.keys(hargaData);

  // =========================
  // LIST TANGGAL
  // =========================
  const tanggalList = Array.from(

    new Set(

      Object.values(
        hargaData
      )

        .flatMap(
          (item: any) =>
            item.data || []
        )

        .map(
          (item: any) =>
            item.tanggal
        )

    )

  ).sort();

  // =========================
  // GET UNIT
  // =========================
  const getSatuan = (
    komoditas: string
  ) => {

    return (
      hargaData[
        komoditas
      ]?.satuan || "kg"
    );

  };

  // =========================
  // GET HARGA
  // =========================
  const getHarga = (
    komoditas: string,
    tanggal: string
  ) => {

    const dataKomoditas =
      hargaData[
        komoditas
      ]?.data || [];

    const found =
      dataKomoditas.find(
        (item: any) =>
          item.tanggal ===
          tanggal
      );

    return found?.harga || 0;

  };

  // =========================
  // FILTER TANGGAL
  // =========================
  const filteredTanggalList =
    tanggalList.filter(
      (tanggal) => {

        const startDate =
          formatTanggal(
            tanggalAwal
          );

        const endDate =
          formatTanggal(
            tanggalAkhir
          );

        if (
          startDate &&
          tanggal < startDate
        ) {
          return false;
        }

        if (
          endDate &&
          tanggal > endDate
        ) {
          return false;
        }

        return true;

      }
    );

  // =========================
  // FILTER KOMODITAS
  // =========================
  const filteredKomoditas =
    useMemo(() => {

      if (
        selectedKomoditas ===
        "Semua Komoditas"
      ) {

        return komoditasList;

      }

      return komoditasList.filter(
        (item) =>
          item ===
          selectedKomoditas
      );

    }, [
      selectedKomoditas,
      komoditasList,
    ]);

  // =========================
  // DOWNLOAD
  // =========================
    const handleDownload = () => {

    // =========================
    // DATA EXCEL
    // =========================
    const excelData =
      filteredKomoditas.map(
        (
          komoditas,
          index
        ) => {

          const row: any = {

            No: index + 1,

            Komoditas:
              komoditas,

            Satuan:
            `Rp/${getSatuan(
              komoditas
            )}`,

          };

          // =====================
          // TANGGAL
          // =====================
          filteredTanggalList.forEach(
            (tanggal) => {

              const harga =
                getHarga(
                  komoditas,
                  tanggal
                );

              row[tanggal] =
                harga > 0
                  ? harga.toLocaleString(
                      "id-ID"
                    )
                  : "Data Belum tersedia";

            }
          );

          return row;

        }
      );

    // =========================
    // WORKSHEET
    // =========================
    const worksheet =
      XLSX.utils.json_to_sheet(
        excelData
      );

    // =========================
    // WORKBOOK
    // =========================
    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Data Harga"
    );

    // =========================
    // EXPORT BUFFER
    // =========================
    const excelBuffer =
      XLSX.write(
        workbook,
        {
          bookType: "xlsx",
          type: "array",
        }
      );

    // =========================
    // SAVE FILE
    // =========================
    const fileData =
      new Blob(
        [excelBuffer],
        {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        }
      );

    saveAs(
      fileData,
      `Data-Harga-Komoditas.xlsx`
    );

  };

  return (

    <div className="space-y-6">

      {/* HEADER */}
      <div>

        <h1
          className="
            text-3xl
            font-bold
            text-gray-900
          "
        >
          Unduh Data Harga
        </h1>

        <p
          className="
            text-gray-500
            mt-2
          "
        >
          Monitoring dan unduh data
          harga komoditas
          Pasar Inpres SoE
        </p>

      </div>

      {/* FILTER */}
      <div
        className="
          bg-white
          border
          border-gray-200
          rounded-2xl
          p-6
          shadow-sm
        "
      >

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-4
          "
        >

          {/* TANGGAL */}
          <div className="md:col-span-2">

            <label
              className="
                block
                text-sm
                font-semibold
                mb-2
              "
            >
              Rentang Tanggal
            </label>

            <Flatpickr
              options={{
                mode: "range",
                dateFormat:
                  "Y-m-d",
                locale:
                  Indonesian,
                allowInput: true,
              }}
              value={
              [
                tanggalAwal,
                tanggalAkhir,
              ].filter(Boolean) as Date[]
            }
              onChange={(
                dates: Date[]
              ) => {

                const [
                  start,
                  end,
                ] = dates;

                setTanggalAwal(
                  start || null
                );

                setTanggalAkhir(
                  end || null
                );

              }}
              className="
                w-full
                border
                border-gray-300
                rounded-xl
                px-4
                py-3
              "
              placeholder="Pilih rentang tanggal"
            />

          </div>

          {/* KOMODITAS */}
          <div>

            <label
              className="
                block
                text-sm
                font-semibold
                mb-2
              "
            >
              Komoditas
            </label>

            <select
              value={
                selectedKomoditas
              }
              onChange={(e) =>
                setSelectedKomoditas(
                  e.target.value
                )
              }
              className="
                w-full
                border
                border-gray-300
                rounded-xl
                px-4
                py-3
              "
            >

              <option>
                Semua Komoditas
              </option>

              {komoditasList.map(
                (
                  item,
                  index
                ) => (

                  <option
                    key={index}
                  >
                    {item}
                  </option>

                )
              )}

            </select>

          </div>

        </div>

        {/* BUTTON */}
        <div className="mt-5">

          <button
            onClick={() =>
              setShowPreview(true)
            }
            className="
              bg-green-600
              hover:bg-green-700
              text-white
              px-6
              py-3
              rounded-xl
              font-semibold
              transition
            "
          >
            Tampilkan Preview
          </button>

        </div>

      </div>

      {/* PREVIEW */}
      {showPreview && (

        <div
          className="
            bg-white
            border
            border-gray-200
            rounded-2xl
            shadow-sm
            overflow-hidden
          "
        >

          {/* HEADER */}
          <div
            className="
              p-5
              border-b
              border-gray-200
              flex
              items-center
              justify-between
            "
          >

            <div>

              <h2
                className="
                  text-xl
                  font-bold
                  text-gray-900
                "
              >
                Preview Data Harga
              </h2>

              <p
                className="
                  text-sm
                  text-gray-500
                  mt-1
                "
              >
                Data harga komoditas
                Pasar Inpres SoE
              </p>

            </div>

            <button
              onClick={
                handleDownload
              }
              className="
                bg-blue-600
                hover:bg-blue-700
                text-white
                px-5
                py-3
                rounded-xl
                font-semibold
              "
            >
              Unduh Excel
            </button>

          </div>

          {/* TABLE */}
          <div className="overflow-auto">

            <table
              className="
                border-collapse
                min-w-[1600px]
                w-full
                text-sm
              "
            >

              {/* HEAD */}
              <thead>

                <tr
                  className="
                    bg-blue-500
                    text-white
                  "
                >

                  {/* NO */}
                  <th
                    className="
                      border
                      border-gray-300
                      px-3
                      py-3
                      min-w-[60px]
                    "
                  >
                    No
                  </th>

                  {/* KOMODITAS */}
                  <th
                    className="
                      border
                      border-gray-300
                      px-4
                      py-3
                      min-w-[320px]
                      text-left
                    "
                  >
                    Komoditas
                  </th>

                  {/* SATUAN */}
                  <th
                    className="
                      border
                      border-gray-300
                      px-4
                      py-3
                      min-w-[120px]
                    "
                  >
                    Satuan
                  </th>

                  {/* TANGGAL */}
                  {filteredTanggalList.map(
                    (
                      tanggal,
                      index
                    ) => (

                      <th
                        key={index}
                        className="
                          border
                          border-gray-300
                          px-4
                          py-3
                          whitespace-nowrap
                          min-w-[120px]
                        "
                      >

                        {(() => {

                          const d =
                            new Date(
                              tanggal +
                                "T00:00:00"
                            );

                          return d.toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month:
                                "short",
                              year:
                                "2-digit",
                            }
                          );

                        })()}

                      </th>

                    )
                  )}

                </tr>

              </thead>

              {/* BODY */}
              <tbody>

                {filteredKomoditas.map(
                  (
                    komoditas,
                    index
                  ) => (

                    <tr
                      key={index}
                      className="
                        hover:bg-gray-50
                      "
                    >

                      {/* NO */}
                      <td
                        className="
                          border
                          border-gray-300
                          px-3
                          py-3
                          text-center
                        "
                      >
                        {index + 1}
                      </td>

                      {/* KOMODITAS */}
                      <td
                        className="
                          border
                          border-gray-300
                          px-4
                          py-3
                          font-medium
                        "
                      >
                        {komoditas}
                      </td>

                      {/* SATUAN */}
                      <td
                        className="
                          border
                          border-gray-300
                          px-4
                          py-3
                          text-center
                        "
                      >
                        Rp/{getSatuan(komoditas)}
                      </td>

                      {/* HARGA */}
                      {filteredTanggalList.map(
                        (
                          tanggal,
                          tIndex
                        ) => {

                          const harga =
                            getHarga(
                              komoditas,
                              tanggal
                            );

                          return (

                            <td
                              key={
                                tIndex
                              }
                              className="
                                border
                                border-gray-300
                                px-4
                                py-3
                                text-center
                                whitespace-nowrap
                              "
                            >

                              {harga > 0 ? (

                                  <>
                                    {harga.toLocaleString(
                                      "id-ID"
                                    )}
                                  </>

                                ) : (

                                <span className="text-gray-400 italic">

                                  Data Belum tersedia

                                </span>

                              )}

                            </td>

                          );

                        }
                      )}

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>

  );

}