import { SENSOR_NAMES } from "@/lib/constants";
import { cache } from "react";

async function fetchSensorData(sensorId: number) {
  try {
    const formData = new URLSearchParams({
      since: "2024-12-31",
      to: "2025-12-31",
      sensor: sensorId.toString(),
    });

    const response = await fetch(
      "https://www.lagoenlinea.cl/api/getMediciones.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Accept: "*/*",
        },
        body: formData.toString(),
        next: {
          revalidate: 60 * 60 * 24, // 24 hours
        },
      }
    );

    if (!response.ok) {
      return {
        id: sensorId,
        name: SENSOR_NAMES[sensorId] || `Sensor ${sensorId}`,
        label: [],
        muestras: [],
        muestras_constant: [],
        muestras_last: "0",
        muestras_last_fecha: "",
        isExceeded: false,
        threshold: 1000,
        hasData: false,
        contaminatedCount: 0,
        rawResponse: null,
      };
    }

    const data = await response.json();

    const hasData =
      data.muestras && data.muestras.length > 0 && data.muestras_last;

    const lastMeasurement = Number.parseInt(data.muestras_last || "0");
    const threshold =
      data.muestras_constant?.[data.muestras_constant.length - 1] || 1000;
    const isExceeded = lastMeasurement > threshold;

    const contaminatedCount = (data.muestras || []).reduce(
      (count: number, value: string, index: number) => {
        const measurement = Number.parseInt(value);
        const measurementThreshold = data.muestras_constant?.[index] || 1000;
        return measurement > measurementThreshold ? count + 1 : count;
      },
      0
    );

    return {
      id: sensorId,
      name: SENSOR_NAMES[sensorId] || `Sensor ${sensorId}`,
      label: data.label || [],
      muestras: data.muestras || [],
      muestras_constant: data.muestras_constant || [],
      muestras_last: data.muestras_last || "0",
      muestras_last_fecha: data.muestras_last_fecha || "",
      isExceeded,
      threshold,
      hasData,
      contaminatedCount,
      rawResponse: data,
    };
  } catch (error) {
    console.error(`Error fetching sensor ${sensorId}:`, error);
    return {
      id: sensorId,
      name: SENSOR_NAMES[sensorId] || `Sensor ${sensorId}`,
      label: [],
      muestras: [],
      muestras_constant: [],
      muestras_last: "0",
      muestras_last_fecha: "",
      isExceeded: false,
      threshold: 1000,
      hasData: false,
      contaminatedCount: 0,
      rawResponse: null,
    };
  }
}

export default cache(fetchSensorData);
