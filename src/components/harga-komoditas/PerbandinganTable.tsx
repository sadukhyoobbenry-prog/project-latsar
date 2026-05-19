"use client";

import { useMemo, useState } from "react";

import Flatpickr from "react-flatpickr";

import { Indonesian } from "flatpickr/dist/l10n/id.js";

import { hargaData } from "../../data/HargaData";

export default function PerbandinganTable() {

  // =========================
  // DEFAULT DATE
  // =========================
  const today = new Date();

  const yesterday = new Date(today);

  yesterday.setDate(
    today.getDate() - 1
  );

  // =========================
  // STATE
  // =========================
  const [
    tanggalSebelum,
    setTanggalSebelum,
  ] = useState<Date | null>(
    yesterday
  );

  const [
    tanggalSesudah,
    setTanggalSesudah,
  ] = useState<Date | null>(
    today
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
  // GET PRICE
  // =========================
  const getHargaByTanggal = (
    komoditas: string,
    tanggal: string
  ) => {

    const dataKomoditas =
      hargaData[komoditas]
        ?.data || [];

    const found =
      dataKomoditas.find(
        (item: any) =>
          item.tanggal ===
          tanggal
      );

    return found?.harga || 0;

  };

  // =========================
  // GET UNIT
  // =========================
  const getUnit = (
    komoditas: string
  ) => {

    return (
      hargaData[komoditas]
        ?.satuan || "kg"
    );

  };

  // =========================
  // TABLE DATA
  // =========================
  const tableData = useMemo(() => {

    const beforeDate =
      formatTanggal(
        tanggalSebelum
      );

    const afterDate =
      formatTanggal(
        tanggalSesudah
      );

    return Object.keys(
      hargaData
    ).map((komoditas) => {

      const hargaSebelum =
        getHargaByTanggal(
          komoditas,
          beforeDate
        );

      const hargaSesudah =
        getHargaByTanggal(
          komoditas,
          afterDate
        );

      const selisih =
        hargaSesudah -
        hargaSebelum;

      const persen =
        hargaSebelum > 0
          ? (
              (selisih /
                hargaSebelum) *
              100
            ).toFixed(2)
          : "0.00";

      return {

        nama: komoditas,

        sebelum:
          hargaSebelum,

        sesudah:
          hargaSesudah,

        selisih,

        persen,

      };

    });

  }, [
    tanggalSebelum,
    tanggalSesudah,
  ]);

  return (

    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">

      {/* TITLE */}
      <div className="mb-6">

        <h2 className="text-2xl font-bold text-gray-900">
          Perbandingan Harga
        </h2>

        <p className="text-gray-500 mt-1">
          Perbandingan harga antar tanggal
        </p>

      </div>

      {/* FILTER */}
      <div className="space-y-4 mb-6">

        {/* PASAR */}
        <div>

          <label className="block text-sm font-medium mb-2">
            Pasar
          </label>

          <input
            type="text"
            value="Pasar Inpres SoE"
            disabled
            className="
              w-full
              border
              border-gray-200
              rounded-xl
              px-4
              py-3
              bg-gray-100
              text-gray-600
            "
          />

        </div>

        {/* DATE PICKER */}
        <div>

          <label className="block text-sm font-semibold mb-2 text-gray-700">

            Pilih Tanggal Pembanding

          </label>

          <p className="text-sm text-gray-500 mb-3">

            Bandingkan harga komoditas antar tanggal

          </p>

          <Flatpickr
            options={{
              mode: "range",
              dateFormat:
                "Y-m-d",
              locale:
                Indonesian,
              allowInput: true,
            }}
            value={[
              tanggalSebelum,
              tanggalSesudah,
            ]}
            onChange={(
              dates: Date[]
            ) => {

              const [
                start,
                end,
              ] = dates;

              setTanggalSebelum(
                start || null
              );

              setTanggalSesudah(
                end || null
              );

            }}
            className="
              w-full
              border
              border-gray-200
              rounded-xl
              px-4
              py-3
              text-sm
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
            placeholder="Pilih rentang tanggal"
          />

        </div>

      </div>

      {/* INFO */}
      <div className="bg-gray-50 rounded-xl p-4 mb-5 text-sm text-gray-600">

        <div className="flex flex-col gap-1">

          <span>

            Pasar:

            <span className="font-semibold ml-2">
              Pasar Inpres SoE
            </span>

          </span>

          <span>

            Perbandingan:

            <span className="font-semibold ml-2">

              {tanggalSebelum?.toLocaleDateString(
                "id-ID",
                {
                  day: "numeric",
                  month:
                    "short",
                  year:
                    "numeric",
                }
              )}

              {" → "}

              {tanggalSesudah?.toLocaleDateString(
                "id-ID",
                {
                  day: "numeric",
                  month:
                    "short",
                  year:
                    "numeric",
                }
              )}

            </span>

          </span>

        </div>

      </div>

      {/* TABLE */}
      <div className="overflow-auto rounded-xl border border-gray-200">

        <table className="w-full min-w-[850px]">

          {/* HEAD */}
          <thead className="bg-gray-50 border-b border-gray-200">

            <tr>

              {/* KOMODITAS */}
              <th className="text-left px-4 py-4 font-semibold text-gray-700 min-w-[280px]">

                Komoditas

              </th>

              {/* TANGGAL 1 */}
              <th className="text-right px-4 py-4 font-semibold text-gray-700 min-w-[180px]">

                {tanggalSebelum?.toLocaleDateString(
                  "id-ID",
                  {
                    day: "numeric",
                    month:
                      "short",
                  }
                )}

              </th>

              {/* TANGGAL 2 */}
              <th className="text-right px-4 py-4 font-semibold text-gray-700 min-w-[180px]">

                {tanggalSesudah?.toLocaleDateString(
                  "id-ID",
                  {
                    day: "numeric",
                    month:
                      "short",
                  }
                )}

              </th>

              {/* PERUBAHAN */}
              <th className="text-right px-4 py-4 font-semibold text-gray-700 min-w-[220px]">

                Perubahan

              </th>

            </tr>

          </thead>

          {/* BODY */}
          <tbody>

            {tableData.map(
              (
                item,
                index
              ) => {

                const isNaik =
                  item.selisih >
                  0;

                const isTurun =
                  item.selisih <
                  0;

                return (

                  <tr
                    key={index}
                    className="
                      border-b
                      border-gray-100
                      hover:bg-gray-50
                      transition
                    "
                  >

                    {/* KOMODITAS */}
                    <td className="px-4 py-4 font-medium text-gray-800">

                      {item.nama}

                    </td>

                    {/* SEBELUM */}
                    <td className="px-4 py-4 text-right">

                      {item.sebelum >
                      0 ? (

                        <>
                          Rp.
                          {item.sebelum.toLocaleString(
                            "id-ID"
                          )}
                          /
                          {getUnit(
                            item.nama
                          )}
                        </>

                      ) : (

                        <span className="text-gray-400 italic">

                          Data belum tersedia

                        </span>

                      )}

                    </td>

                    {/* SESUDAH */}
                    <td className="px-4 py-4 text-right">

                      {item.sesudah >
                      0 ? (

                        <>
                          Rp.
                          {item.sesudah.toLocaleString(
                            "id-ID"
                          )}
                          /
                          {getUnit(
                            item.nama
                          )}
                        </>

                      ) : (

                        <span className="text-gray-400 italic">

                          Data belum tersedia

                        </span>

                      )}

                    </td>

                    {/* PERUBAHAN */}
                    <td className="px-4 py-4 text-right">

                      {item.sebelum ===
                        0 ||
                      item.sesudah ===
                        0 ? (

                        <span className="text-gray-400 italic">

                          Data belum tersedia

                        </span>

                      ) : (

                        <span
                          className={`font-semibold px-3 py-1 rounded-full text-sm inline-block ${
                            isNaik
                              ? "bg-red-100 text-red-600"
                              : isTurun
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >

                          {isNaik &&
                            "+"}

                          Rp.
                          {Math.abs(
                            item.selisih
                          ).toLocaleString(
                            "id-ID"
                          )}
                          /
                          {getUnit(
                            item.nama
                          )}

                          {" "}
                          (
                          {isNaik &&
                            "+"}
                          {
                            item.persen
                          }
                          %)

                        </span>

                      )}

                    </td>

                  </tr>

                );

              }
            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}