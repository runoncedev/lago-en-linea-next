import {
  Map,
  MapMarker,
  MapTileLayer
} from "@/components/ui/map";
import { SENSOR_IDS } from "@/lib/constants";
import { fetchSensorData } from "@/lib/sensor-data";

export async function generateStaticParams() {
  return SENSOR_IDS.map((id) => ({ id: id.toString() }));
}

const CITIES = [
  {
    name: "Toronto",
    coordinates: [43.6532, -79.3832],
  },
]

export default async function SensorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sensorId = Number.parseInt(id);
  const sensorData = await fetchSensorData(sensorId);

  console.log('sensorData!!', sensorData);

  return (
    <div className="px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-4xl font-bold py-4">{sensorData.name}</h1>
        {/* <div className="py-2 text-sm text-gray-500 dark:text-gray-400">
          {sensorData.muestras_last_fecha
            ? new Date(sensorData.muestras_last_fecha).toLocaleString("es-CL", {
              dateStyle: "medium",
            })
            : null}
        </div> */}
        <div className="flex flex-col gap-8 pb-8">
          <div className="bg-[#212121] rounded-lg p-4 flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="text-[#9E9E9E] text-sm mb-2">
                {sensorData.muestras_last_fecha
                  ? new Date(sensorData.muestras_last_fecha).toLocaleString("es-CL", {
                    dateStyle: "medium",
                  })
                  : null}
              </div>
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-4xl font-bold ${sensorData.isExceeded ? "text-[#FF5252]" : "text-foreground"}`}
                >
                  {sensorData.muestras_last}
                </span>
                <span className="text-base text-[#9E9E9E]">UFC/100ml</span>
              </div>
            </div>
            {sensorData.isExceeded && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-red-400"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
              </svg>
            )}
          </div>
          <div className="border rounded-lg border-gray-700 dark:border-gray-600 bg-gray-900/50 dark:bg-gray-800/50">
            {sensorData.muestras && sensorData.muestras.length > 0 ? (
              <div className="divide-y divide-gray-700 dark:divide-gray-600">
                {[...sensorData.muestras].reverse().map((muestra: string, index: number) => {
                  // Calculate original index since we're reversing
                  const originalIndex = sensorData.muestras.length - 1 - index;
                  const value = Number.parseInt(muestra || "0");
                  const threshold = sensorData.muestras_constant?.[originalIndex] || 1000;
                  const isExceeded = value > threshold;
                  const dateLabel = sensorData.label?.[originalIndex] || "";

                  // Format date from label to DD-MM-YYYY format
                  let formattedDate = dateLabel;
                  if (dateLabel) {
                    try {
                      const date = new Date(dateLabel);
                      if (!isNaN(date.getTime())) {
                        const day = date.getDate().toString().padStart(2, "0");
                        const month = (date.getMonth() + 1).toString().padStart(2, "0");
                        const year = date.getFullYear();
                        formattedDate = `${day}-${month}-${year}`;
                      }
                    } catch (e) {
                      // Keep original format if parsing fails
                    }
                  }

                  // Format number with thousands separator
                  const formattedValue = value.toLocaleString("es-CL");

                  return (
                    <div key={originalIndex} className="px-4 py-3 flex items-center justify-between">
                      <span className="text-foreground">{formattedDate}</span>
                      <div className="flex items-baseline gap-1">
                        <span className={`font-medium ${isExceeded ? "text-red-600 dark:text-red-400" : "text-foreground"}`}>
                          {formattedValue}
                        </span>
                        <span className="text-sm text-muted-foreground">UFC/100ml</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="px-4 py-8 text-center text-muted-foreground">
                No hay mediciones disponibles
              </div>
            )}
          </div>

          {sensorData.muestras.length > 1 && (
            <div className="pt-3">
              <div className="flex gap-1 items-end">
                {sensorData.muestras.slice(-8).map((value, idx) => {
                  const actualIdx = sensorData.muestras.length - 8 + idx
                  const minValue = Math.min(...sensorData.muestras.map((d) => Number.parseInt(d)))
                  const maxValue = Math.max(...sensorData.muestras.map((d) => Number.parseInt(d)))
                  const normalizedHeight = 10 + ((Number.parseInt(value) - minValue) / (maxValue - minValue)) * 90
                  const threshold = sensorData.muestras_constant[actualIdx] || sensorData.threshold
                  const isHigh = Number.parseInt(value) > threshold
                  const date = sensorData.label[actualIdx] || ""
                  return (
                    <div
                      key={idx}
                      className={`flex-1 h-12 rounded-sm ${isHigh ? "bg-red-500" : "bg-green-500/30 dark:bg-green-300/50"}`}
                      style={{
                        height: `${normalizedHeight}px`,
                      }}
                      title={`${value} UFC/100ml\n${date}`}
                    />
                  )
                })}
              </div>
              <div className="flex gap-1 mt-1">
                {sensorData.label.slice(-8).map((date, idx) => (
                  <div key={idx} className="flex-1 text-xs text-slate-300 text-center truncate">
                    {/* Format date as 31-12 (day-month) */}
                    {(() => {
                      const parts = date.split("-");
                      if (parts.length >= 3) {
                        const day = parts[2];
                        const month = parts[1];
                        return `${day}-${month}`;
                      }
                      return date;
                    })()}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Map center={[-41.324098, -72.969830]} className="min-h-[300px] rounded-xl [&_.leaflet-div-icon]:bg-transparent! [&_.leaflet-div-icon]:border-transparent!">
            <MapTileLayer />
            <MapMarker position={[-41.324098, -72.969830]} />
          </Map>
        </div>
      </div>
    </div>
  )
}