"use client";

type FilterSectionProps = {

  komoditas: string;

  setKomoditas:
    React.Dispatch<
      React.SetStateAction<string>
    >;

  tanggal: Date | null;

  setTanggal:
    React.Dispatch<
      React.SetStateAction<
        Date | null
      >
    >;

};

export default function
FilterSection({

  komoditas,
  setKomoditas,

  tanggal,
  setTanggal,

}: FilterSectionProps) {

  // DATA KOMODITAS
  const komoditasList = [
    "Beras Nona Kupang (Medium)",
    "Beras Fatuleu (Medium)",
    "Beras Nona Kupang (Premium)",
    "Beras Nyong Kupang (Premium)",
    "Beras SPHP",
    "Kedelai Impor",
    "Cabai Merah Keriting",
    "Cabai Merah Besar",
    "Cabai Rawit Merah",
    "Bawang Merah",
    "Gula Pasir Curah",
    "Gula Pasir Kemasan",
    "Minyak Goreng Kemasan Premium",
    "Minyakita",
    "Tepung Terigu",
    "Daging Ayam Ras Karkas",
    "Telur Ayam ras",
    "Daging Sapi Paha Belakang",
    "Ikan Kembung",
    "Ikan Tongkol",
    "Ikan Teri Asin",
    "Udang Basah",
    "Tempe Bungkus",
    "Tahu Putih",
    "Bawang Putih",
    "Bawang Bombai",
    "Tomat",
    "Ketimun",
    "Sawi Hijau",
    "Kangkung",
    "Kacang Panjang",
    "Kentang Sedang",
    "Pisang Lokal",
    "Susu Bubuk Balita (Setara SGM), 400 gr",
    "Jagung Pipilan",
    "Mie Instan Kari",
    "Garam Halus",
    "Susu Kental Manis, 370 Gr",
    "Susu Bubuk (Setara Dancow), 400 gr",
    "Ketela Pohon",
    "Ayam Kampung Ukuran Sedang",
    "Kacang Hijau",
    "Kacang Tanah",
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow">

      {/* HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

        {/* TITLE */}
        <div>

          <h1 className="text-3xl font-bold">
            Perkembangan Harga Komoditas
          </h1>

          <p className="text-gray-500 mt-2">
            Monitoring harga harian komoditas pangan
          </p>

        </div>

        {/* FILTER */}
        <div className="flex flex-col md:flex-row gap-4">

          {/* KOMODITAS */}
          <div className="min-w-[320px]">

            <label className="block text-sm font-medium mb-2">
              Pilih Komoditas
            </label>

            <select
              value={komoditas}
              onChange={(e) =>
                setKomoditas(e.target.value)
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >

              {komoditasList.map((item, index) => (

                <option
                  key={index}
                  value={item}
                >
                  {item}
                </option>

              ))}

            </select>

          </div>

          

        </div>

      </div>

      {/* INFO */}
      <div className="mt-6 bg-blue-50 rounded-xl p-4">

        <p className="text-sm text-gray-700">

          Komoditas dipilih:
          <span className="font-semibold ml-2">
            {komoditas}
          </span>

        </p>

      </div>

    </div>
  );
}