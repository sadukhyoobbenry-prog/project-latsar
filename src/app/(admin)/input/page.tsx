"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import Flatpickr from "react-flatpickr";

import { Indonesian } from "flatpickr/dist/l10n/id.js";

import * as XLSX from "xlsx";

import { hargaData } from "@/data/HargaData";

type Komoditas = {
  id: number;
  nama: string;
  satuan: string;
  harga: number;
  saved: boolean;
  isEditing: boolean;
};

export default function InputHargaPage() {

  const router = useRouter();

  // =========================
  // PROTECT PAGE
  // =========================
  const [isAllowed, setIsAllowed] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // STATE
  // =========================
  const [tanggal, setTanggal] =
    useState<Date>(new Date());

  const [data, setData] =
    useState<Komoditas[]>([]);

  const pasar =
    "Pasar Inpres SoE";

  // =========================
  // PROTECT LOGIN
  // =========================
  useEffect(() => {

    const isLogin =
      localStorage.getItem(
        "adminLogin"
      );

    if (isLogin === "true") {

      setIsAllowed(true);

    } else {

      router.replace(
        "/harga-komoditas"
      );

    }

    setLoading(false);

  }, [router]);

  // =========================
  // LOAD DATA BERDASARKAN TANGGAL
  // =========================
  useEffect(() => {

    const tanggalFormat =
      tanggal
        .toISOString()
        .split("T")[0];

    const generatedData =
      Object.keys(
        hargaData
      ).map(
        (
          nama,
          index
        ) => {

          const komoditas =
            hargaData[nama];

          const found =
            komoditas.data.find(
              (item: any) =>
                item.tanggal ===
                tanggalFormat
            );

          return {

            id: index + 1,

            nama,

            satuan:
              komoditas.satuan,

            harga:
              found?.harga || 0,

            saved: !!found,

            isEditing: false,

          };

        }
      );

    setData(
      generatedData
    );

  }, [tanggal]);

  // =========================
  // LOADING
  // =========================
  if (loading) {

    return (
      <div className="p-10">
        Memeriksa login...
      </div>
    );

  }

  // =========================
  // BLOCK PAGE
  // =========================
  if (!isAllowed) {

    return null;

  }

  // =========================
  // CEK TANGGAL LAMA
  // =========================
  const isTanggalLama =
    tanggal.toDateString() !==
    new Date().toDateString();

  // =========================
  // FORMAT RUPIAH
  // =========================
  const formatRupiah = (
    angka: number
  ) => {

    return angka.toLocaleString(
      "id-ID"
    );

  };

  // =========================
  // HANDLE INPUT
  // =========================
  const handleHargaChange = (
    id: number,
    value: string
  ) => {

    const angka =
      Number(
        value.replace(/\D/g, "")
      ) || 0;

    setData((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              harga: angka,
              saved: false,
            }
          : item
      )
    );

  };

  // =========================
  // SAVE ITEM
  // =========================
  const handleSaveItem = (
    item: Komoditas
  ) => {

    const tanggalFormat =
      tanggal
        .toISOString()
        .split("T")[0];

    const komoditas =
      hargaData[
        item.nama
      ];

    const existingIndex =
      komoditas.data.findIndex(
        (x: any) =>
          x.tanggal ===
          tanggalFormat
      );

    if (
      existingIndex >= 0
    ) {

      komoditas.data[
        existingIndex
      ].harga =
        item.harga;

    } else {

      komoditas.data.push(
        {
          tanggal:
            tanggalFormat,
          harga:
            item.harga,
        }
      );

    }

    setData((prev) =>
      prev.map((x) =>
        x.id === item.id
          ? {
              ...x,
              saved: true,
              isEditing: false,
            }
          : x
      )
    );

    console.log(
      "UPDATED:",
      hargaData
    );

  };

  // =========================
  // SAVE ALL
  // =========================
  const handleSaveAll =
    () => {

      data.forEach(
        (item) => {

          handleSaveItem(
            item
          );

        }
      );

      alert(
        "Semua data berhasil disimpan!"
      );

    };

  // =========================
  // EDIT ITEM
  // =========================
  const handleEdit = (
    id: number
  ) => {

    setData((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              isEditing: true,
              saved: false,
            }
          : item
      )
    );

  };

  // =========================
  // UPLOAD EXCEL
  // FORMAT:
  // Komoditas | Harga
  // =========================
  const handleUploadExcel =
    async (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {

      const file =
        e.target.files?.[0];

      if (!file) return;

      const reader =
        new FileReader();

      reader.onload = (
        evt
      ) => {

        const binaryStr =
          evt.target?.result;

        const workbook =
          XLSX.read(binaryStr, {
            type: "binary",
          });

        const sheetName =
          workbook.SheetNames[0];

        const worksheet =
          workbook.Sheets[
            sheetName
          ];

        const jsonData: any[] =
          XLSX.utils.sheet_to_json(
            worksheet
          );

        const updatedData =
          [...data];

        jsonData.forEach(
          (row) => {

            const komoditasNama =
              row.Komoditas;

            const harga =
              Number(
                row.Harga
              ) || 0;

            const index =
              updatedData.findIndex(
                (item) =>
                  item.nama ===
                  komoditasNama
              );

            if (
              index >= 0
            ) {

              updatedData[
                index
              ].harga =
                harga;

              updatedData[
                index
              ].saved =
                false;

            }

          }
        );

        setData(
          updatedData
        );

        alert(
          "Upload Excel berhasil!"
        );

      };

      reader.readAsBinaryString(
        file
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
          Input Harga Komoditas
        </h1>

        <p
          className="
            text-gray-500
            mt-2
          "
        >
          Input dan edit harga
          komoditas Pasar
          Inpres SoE
        </p>

      </div>

      {/* FILTER */}
      <div
        className="
          bg-white
          border
          border-gray-100
          rounded-3xl
          shadow-sm
          p-6
        "
      >

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-4
          "
        >

          {/* PASAR */}
          <div>

            <label
              className="
                block
                text-sm
                font-semibold
                text-gray-700
                mb-2
              "
            >
              Pasar
            </label>

            <input
              type="text"
              value={pasar}
              disabled
              className="
                w-full
                border
                border-gray-200
                bg-gray-100
                rounded-2xl
                px-4
                py-3
                text-gray-600
              "
            />

          </div>

          {/* TANGGAL */}
          <div>

            <label
              className="
                block
                text-sm
                font-semibold
                text-gray-700
                mb-2
              "
            >
              Pilih Tanggal
            </label>

            <Flatpickr
              options={{
                locale:
                  Indonesian,
                dateFormat:
                  "d M Y",
              }}
              value={tanggal}
              onChange={(date) =>
                setTanggal(
                  date[0]
                )
              }
              className="
                w-full
                border
                border-gray-200
                rounded-2xl
                px-4
                py-3
              "
            />

          </div>

        </div>

        {/* INFO */}
        {isTanggalLama && (

          <div
            className="
              mt-5
              bg-yellow-50
              border
              border-yellow-200
              text-yellow-700
              rounded-2xl
              px-4
              py-3
              text-sm
            "
          >
            Anda sedang
            mengedit data
            tanggal sebelumnya.
          </div>

        )}

        {/* ACTION */}
        <div
          className="
            mt-5
            flex
            flex-wrap
            gap-3
          "
        >

          {/* SAVE ALL */}
          <button
            onClick={
              handleSaveAll
            }
            className="
              bg-green-600
              hover:bg-green-700
              text-white
              px-5
              py-3
              rounded-2xl
              font-semibold
            "
          >
            Simpan Semua
          </button>

          {/* IMPORT EXCEL */}
          <label
            className="
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-5
              py-3
              rounded-2xl
              font-semibold
              cursor-pointer
            "
          >
            Upload Excel

            <input
              type="file"
              accept=".xlsx,.xls"
              hidden
              onChange={
                handleUploadExcel
              }
            />

          </label>

        </div>

      </div>

      {/* TABLE */}
      <div
        className="
          bg-white
          border
          border-gray-100
          rounded-3xl
          shadow-sm
          overflow-hidden
        "
      >

        <div
          className="
            overflow-x-auto
          "
        >

          <table
            className="
              w-full
              min-w-[1000px]
            "
          >

            {/* HEAD */}
            <thead
              className="
                bg-gray-50
                border-b
              "
            >

              <tr>

                <th className="px-6 py-4">
                  No
                </th>

                <th className="px-6 py-4 text-left">
                  Komoditas
                </th>

                <th className="px-6 py-4 text-center">
                  Satuan
                </th>

                <th className="px-6 py-4 text-left">
                  Harga
                </th>

                <th className="px-6 py-4 text-center">
                  Status
                </th>

                <th className="px-6 py-4 text-center">
                  Aksi
                </th>

              </tr>

            </thead>

            {/* BODY */}
            <tbody>

              {data.map(
                (
                  item,
                  index
                ) => (

                  <tr
                    key={item.id}
                    className="
                      border-b
                      hover:bg-gray-50
                    "
                  >

                    {/* NO */}
                    <td className="px-6 py-4">
                      {index + 1}
                    </td>

                    {/* KOMODITAS */}
                    <td className="px-6 py-4 font-medium">
                      {item.nama}
                    </td>

                    {/* SATUAN */}
                    <td
                      className="
                        px-6
                        py-4
                        text-center
                      "
                    >
                      Rp/{item.satuan}
                    </td>

                    {/* HARGA */}
                    <td className="px-6 py-4">

                      <input
                        type="text"
                        value={formatRupiah(
                          item.harga
                        )}
                        onChange={(e) =>
                          handleHargaChange(
                            item.id,
                            e.target
                              .value
                          )
                        }
                        disabled={
                          !item.isEditing &&
                          item.saved
                        }
                        className="
                          w-full
                          border
                          border-gray-200
                          rounded-2xl
                          px-4
                          py-3
                          text-right
                          disabled:bg-gray-100
                        "
                      />

                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4 text-center">

                      {item.saved ? (

                        <span
                          className="
                            bg-green-100
                            text-green-700
                            px-3
                            py-1
                            rounded-full
                            text-sm
                          "
                        >
                          Tersimpan
                        </span>

                      ) : item.isEditing ? (

                        <span
                          className="
                            bg-yellow-100
                            text-yellow-700
                            px-3
                            py-1
                            rounded-full
                            text-sm
                          "
                        >
                          Sedang Edit
                        </span>

                      ) : (

                        <span
                          className="
                            bg-gray-100
                            text-gray-600
                            px-3
                            py-1
                            rounded-full
                            text-sm
                          "
                        >
                          Belum Disimpan
                        </span>

                      )}

                    </td>

                    {/* AKSI */}
                    <td className="px-6 py-4">

                      <div
                        className="
                          flex
                          justify-center
                          gap-2
                        "
                      >

                        <button
                          onClick={() =>
                            handleSaveItem(
                              item
                            )
                          }
                          className="
                            bg-green-600
                            hover:bg-green-700
                            text-white
                            px-4
                            py-2
                            rounded-xl
                          "
                        >
                          Simpan
                        </button>

                        <button
                          onClick={() =>
                            handleEdit(
                              item.id
                            )
                          }
                          className="
                            border
                            border-gray-200
                            px-4
                            py-2
                            rounded-xl
                          "
                        >
                          Edit
                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}