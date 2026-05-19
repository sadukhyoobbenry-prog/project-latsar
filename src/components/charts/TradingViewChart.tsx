"use client";

import {
  createChart,
  ColorType,
  LineStyle,
} from "lightweight-charts";

import {
  useEffect,
  useRef,
} from "react";

type TradingViewChartProps = {
  data: any[];
  komoditas: string;
  showHET: boolean;
  showHAP: boolean;
  HET: number | null;
  HAP: number | null;
};

export default function TradingViewChart({
  data,
  komoditas,
  showHET,
  showHAP,
  HET,
  HAP,
}: TradingViewChartProps) {

  const chartContainerRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {

    if (!chartContainerRef.current)
      return;

    // =========================
    // CREATE CHART
    // =========================
    const chart = createChart(
      chartContainerRef.current,
      {

        width:
          chartContainerRef.current
            .clientWidth,

        height: 500,

        layout: {

          background: {
            type: ColorType.Solid,
            color: "#ffffff",
          },

          textColor: "#374151",

        },

        grid: {

          vertLines: {
            color: "#f1f5f9",
          },

          horzLines: {
            color: "#f1f5f9",
          },

        },

        crosshair: {

          vertLine: {
            color: "#9ca3af",
            width: 1,
            style:
              LineStyle.Dashed,
          },

          horzLine: {
            color: "#9ca3af",
            width: 1,
            style:
              LineStyle.Dashed,
          },

        },

        rightPriceScale: {

          borderColor:
            "#e5e7eb",

        },

        timeScale: {

          borderColor:
            "#e5e7eb",

          timeVisible: false,

        },

      }
    );

    // =========================
    // MAIN SERIES
    // =========================
    const series =
      chart.addLineSeries({

        color: "#2563eb",

        lineWidth: 3,

        priceLineVisible: false,

        lastValueVisible: true,

        crosshairMarkerVisible:
          true,

        autoscaleInfoProvider: () => {

          // =========================
          // SEMUA HARGA DATA
          // =========================
          const values =
            data.map(
              (item) => item.value
            );

          // =========================
          // TAMBAHKAN HET
          // =========================
          if (
            showHET &&
            HET
          ) {

            values.push(HET);

          }

          // =========================
          // TAMBAHKAN HAP
          // =========================
          if (
            showHAP &&
            HAP
          ) {

            values.push(HAP);

          }

          // =========================
          // MIN MAX
          // =========================
          const min =
            Math.min(...values);

          const max =
            Math.max(...values);

          // =========================
          // PADDING DINAMIS
          // =========================
          const padding =
            (max - min) * 0.15;

          return {

            priceRange: {

              minValue:
                min - padding,

              maxValue:
                max + padding,

            },

          };

        },

      });

    // =========================
    // SET DATA
    // =========================
    series.setData(data);

    // =========================
    // HET LINE
    // =========================
    let hetLine: any = null;

    if (
      showHET &&
      HET
    ) {

      hetLine =
        series.createPriceLine({

          price: HET,

          color: "#ef4444",

          lineWidth: 2,

          lineStyle:
            LineStyle.Dashed,

          axisLabelVisible: true,

          title: "HET",

        });

    }

    // =========================
    // HAP LINE
    // =========================
    let hapLine: any = null;

    if (
      showHAP &&
      HAP
    ) {

      hapLine =
        series.createPriceLine({

          price: HAP,

          color: "#f59e0b",

          lineWidth: 2,

          lineStyle:
            LineStyle.Dashed,

          axisLabelVisible: true,

          title: "HAP",

        });

    }

    // =========================
    // FIT CONTENT
    // =========================
    chart.timeScale().fitContent();

    // =========================
    // RESIZE
    // =========================
    const handleResize = () => {

      if (
        chartContainerRef.current
      ) {

        chart.applyOptions({

          width:
            chartContainerRef.current
              .clientWidth,

        });

      }

    };

    window.addEventListener(
      "resize",
      handleResize
    );

    // =========================
    // CLEANUP
    // =========================
    return () => {

      window.removeEventListener(
        "resize",
        handleResize
      );

      if (hetLine) {

        series.removePriceLine(
          hetLine
        );

      }

      if (hapLine) {

        series.removePriceLine(
          hapLine
        );

      }

      chart.remove();

    };

  }, [
    data,
    komoditas,
    showHET,
    showHAP,
    HET,
    HAP,
  ]);

  return (

    <div
      ref={chartContainerRef}
      className="w-full"
    />

  );

}