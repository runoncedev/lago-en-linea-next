import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const SENSOR_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

const SENSOR_NAMES: Record<number, string> = {
  1: "Santa Rosa Final",
  2: "Cerro Philippi",
  3: "Aliviadero Santa Rosa",
  4: "Diego Portales",
  5: "Walker Martínez",
  6: "Muelle",
  7: "Hotel Radisson",
  8: "Hotel Bellavista",
  9: "Vicente Pérez Rosales",
  10: "Antonio Varas",
  11: "Eleuterio Ramírez",
  12: "Freire",
  13: "Aliviadero Pto. Chico",
  14: "Quebrada Honda",
  15: "Marina de Puerto Varas",
  16: "Doña Ema",
}


async function fetchSensorData(sensorId: number) {
  try {
    const formData = new URLSearchParams({
      since: "2024-12-31",
      to: "2025-12-31",
      sensor: sensorId.toString(),
    })

    const response = await fetch("https://www.lagoenlinea.cl/api/getMediciones.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Accept: "*/*",
      },
      body: formData.toString(),
      next: {
        revalidate: 60 * 60 * 24, // 24 hours
      },
    })

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
      }
    }

    const data = await response.json()

    const hasData = data.muestras && data.muestras.length > 0 && data.muestras_last

    const lastMeasurement = Number.parseInt(data.muestras_last || "0")
    const threshold = data.muestras_constant?.[data.muestras_constant.length - 1] || 1000
    const isExceeded = lastMeasurement > threshold

    const contaminatedCount = (data.muestras || []).reduce((count: number, value: string, index: number) => {
      const measurement = Number.parseInt(value)
      const measurementThreshold = data.muestras_constant?.[index] || 1000
      return measurement > measurementThreshold ? count + 1 : count
    }, 0)

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
    }
  } catch (error) {
    console.error(`Error fetching sensor ${sensorId}:`, error)
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
    }
  }
}

export default async function Dashboard() {

  const promises = SENSOR_IDS.map((sensorId) => {
    return fetchSensorData(sensorId);
  });

  const sensors = await Promise.all(promises);

  console.log('sensors!!', sensors);

  return (
    <div className="flex flex-col gap-4 max-w-lg mx-auto">
      {sensors
        .sort((a, b) => {
          // Empty ones go to the end
          if (!a.hasData && b.hasData) return 1
          if (a.hasData && !b.hasData) return -1
          // If both have data or both are empty, sort by isExceeded
          if (a.isExceeded && !b.isExceeded) return -1
          if (!a.isExceeded && b.isExceeded) return 1
          return 0
        })
        .map((sensor) => (
          <Card
            key={sensor.id}
            className={cn(
              sensor.isExceeded ? "border-red-500 dark:bg-red-500/15 dark:border-red-500" : "",
              !sensor.hasData ? "border-slate-400 dark:bg-yellow-400/15 dark:border-yellow-400/50" : "",
            )}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 flex items-center justify-between gap-2">
                  <CardTitle>
                    {/* <Droplet className={`h-5 w-5 ${sensor.isExceeded ? "text-destructive" : "text-primary"}`} /> */}
                    {sensor.name}
                  </CardTitle>
                  {sensor.isExceeded && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-red-500"
                    >
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
                      <path d="M12 9v4" />
                      <path d="M12 17h.01" />
                    </svg>
                  )}
                  {/* <CardDescription className="mt-1">{formatDate(sensor.muestras_last_fecha)}</CardDescription> */}
                </div>
                {/* <div className="flex items-center gap-2">
                {!isProduction && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                        <Bug className="h-4 w-4" />
                        <span className="sr-only">Ver datos completos</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          Datos del Sensor #{sensor.id} - {sensor.name}
                        </DialogTitle>
                        <DialogDescription>Respuesta completa del endpoint getMediciones</DialogDescription>
                      </DialogHeader>
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
                        {JSON.stringify(sensor.rawResponse, null, 2)}
                      </pre>
                    </DialogContent>
                  </Dialog>
                )}
              </div> */}
              </div>
            </CardHeader>
            <CardContent>
              {sensor.hasData && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`text-3xl font-bold ${sensor.isExceeded ? "text-destructive" : "text-foreground"}`}
                      >
                        {sensor.muestras_last}
                      </span>
                      <span className="text-sm text-muted-foreground">UFC/100ml</span>
                    </div>
                  </div>

                  {sensor.muestras.length > 1 && (
                    <div className="pt-3">
                      <div className="flex gap-1 items-end">
                        {sensor.muestras.slice(-8).map((value: string, idx: number) => {
                          const actualIdx = sensor.muestras.length - 8 + idx

                          const minValue = Math.min(...sensor.muestras.map((d: string) => Number.parseInt(d)))
                          const maxValue = Math.max(...sensor.muestras.map((d: string) => Number.parseInt(d)))

                          const normalizedHeight = 4 + ((Number.parseInt(value) - minValue) / (maxValue - minValue)) * 36

                          const threshold = sensor.muestras_constant[actualIdx] || sensor.threshold
                          const isHigh = Number.parseInt(value) > threshold

                          const date = sensor.label[actualIdx] || ""

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
                        {sensor.label.slice(-8).map((date: string, idx: number) => (
                          <div key={idx} className="flex-1 text-[8px] text-muted-foreground text-center truncate">
                            {date.split("-").reverse().slice(1).join("/")}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* 
                <Button
                  variant="outline"
                  className="w-full mt-2 bg-transparent"
                  onClick={() => handleOpenSensorDetail(sensor.id)}
                >
                  <Maximize2 className="h-4 w-4 mr-2" />
                  Ver Detalles
                </Button> */}
                </div>
              )}

              {!sensor.hasData && (
                <p className="text-slate-400">No hay datos disponibles</p>
              )}
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
