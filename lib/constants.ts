export const SENSOR_IDS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
];

export const SENSORS_DATA: Record<
  number,
  {
    name: string;
    lat: number;
    lng: number;
  }
> = {
  1: { name: "Santa Rosa Final", lat: -41.31181944, lng: -72.97767778 },
  2: { name: "Cerro Philippi", lat: -41.31280556, lng: -72.97817222 },
  3: { name: "Aliviadero Santa Rosa", lat: -41.31548889, lng: -72.98222222 },
  4: { name: "Diego Portales", lat: -41.31612778, lng: -72.98223889 },
  5: { name: "Walker Martínez", lat: -41.31676111, lng: -72.98194444 },
  6: { name: "Muelle", lat: -41.31756389, lng: -72.98146389 },
  7: { name: "Hotel Radisson", lat: -41.31803333, lng: -72.98105556 },
  8: { name: "Hotel Bellavista", lat: -41.31916944, lng: -72.97945833 },
  9: { name: "Vicente Pérez Rosales", lat: -41.32541944, lng: -72.97068889 },
  10: { name: "Antonio Varas", lat: -41.32637778, lng: -72.96740556 },
  11: { name: "Eleuterio Ramírez", lat: -41.32686389, lng: -72.96543889 },
  12: { name: "Freire", lat: -41.32718333, lng: -72.96396389 },
  13: { name: "Aliviadero Pto. Chico", lat: -41.32779722, lng: -72.96060833 },
  14: { name: "Quebrada Honda", lat: -41.32780278, lng: -72.95788611 },
  15: { name: "Marina de Puerto Varas", lat: -41.32531667, lng: -72.95573889 },
  16: { name: "Doña Ema", lat: -41.32245833, lng: -72.95302222 },
};
