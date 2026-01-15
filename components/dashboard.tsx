import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SENSOR_IDS } from "@/lib/constants"
import fetchSensorData from "@/lib/sensor-data"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default async function Dashboard() {

  const promises = SENSOR_IDS.map((sensorId) => {
    return fetchSensorData(sensorId);
  });

  const sensors = await Promise.all(promises);

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
              "flex flex-col gap-2",
              sensor.isExceeded ? "border-red-500 dark:bg-red-500/15 dark:border-red-500" : "",
              !sensor.hasData ? "border-slate-400 dark:bg-yellow-400/15 dark:border-yellow-400/50" : "",
            )}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 flex items-center justify-between gap-2">
                  <CardTitle>
                    {/* <Droplet className={`h-5 w-5 ${sensor.isExceeded ? "text-destructive" : "text-primary"}`} /> */}
                    {sensor.hasData ? (
                      <Link href={`/sensor/${sensor.id}`} className="flex items-center gap-2">
                        {sensor.name}
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
                          className="h-5 w-5 text-slate-500"
                        >
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                      </Link>
                    ) : (
                      <span>{sensor.name}</span>
                    )}
                  </CardTitle>
                  <div className="flex items-center gap-2">
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
                        className="h-6 w-6 text-red-500"
                      >
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
                        <path d="M12 9v4" />
                        <path d="M12 17h.01" />
                      </svg>
                    )}
                    {/* <a
                      href="#"
                      className={`flex items-center gap-2 place-self-end py-2 px-4 rounded-md text-center text-slate-200 ${sensor.isExceeded ? "bg-red-900" : "dark:bg-slate-700 bg-slate-500"}`}
                    >
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
                          className="h-5 w-5 "
                        >
                          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
                          <path d="M12 9v4" />
                          <path d="M12 17h.01" />
                        </svg>
                      )}
                      Ver detalles
                    </a> */}
                  </div>
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
                    </div>
                  )}
                </div>
              )}

              {!sensor.hasData && (
                <p className="dark:text-slate-400 text-slate-500">No hay datos disponibles</p>
              )}
            </CardContent>
            {/* {sensor.hasData && (
              <CardFooter className="px-2">
                <CardAction>
                  <a
                    href="#"
                    className={`block place-self-end py-2 px-4 rounded-md text-center text-slate-200 ${sensor.isExceeded ? "bg-red-600" : "dark:bg-slate-700 bg-slate-500"}`}
                  >
                    Ver detalles
                  </a>
                </CardAction>
              </CardFooter>
            )} */}
          </Card>
        ))
      }
    </div >
  );
}
