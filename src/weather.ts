export type WeatherSnapshot = {
  temperature: number;
  apparentTemperature: number;
  precipitation: number;
  rain: number;
  showers: number;
  precipitationProbability: number | null;
  next2hMaxPrecipitationProbability: number | null;
  weatherCode: number;
  windSpeed: number;
  observedAt: string;
  fetchedAt: string;
  description: string;
  source: "Open-Meteo";
};

export type KmaForecastRow = {
  venue_id: "stadium" | "samgeori";
  venue_name: string;
  forecast_date: string;
  forecast_time: string;
  grid_x: number;
  grid_y: number;
  temperature_c?: string;
  rain_probability_pct?: string;
  precipitation?: string;
  humidity_pct?: string;
  wind_speed_ms?: string;
  sky_code?: string;
  source_timestamp: string;
};

export type KmaWeatherSnapshot = {
  schema_version: string;
  source: "기상청 단기예보 조회서비스";
  endpoint: string;
  data_as_of: string;
  base_date: string;
  base_time: string;
  not_live_observation: true;
  venues: KmaForecastRow[];
};

type OpenMeteoResponse = {
  current?: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    precipitation: number;
    rain: number;
    showers: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  hourly?: {
    time: string[];
    precipitation_probability: number[];
  };
};

export function weatherCodeLabel(code: number) {
  if (code === 0) return "맑음";
  if (code <= 2) return "대체로 맑음";
  if (code === 3) return "흐림";
  if (code === 45 || code === 48) return "안개";
  if (code >= 51 && code <= 57) return "이슬비";
  if (code >= 61 && code <= 67) return "비";
  if (code >= 71 && code <= 77) return "눈";
  if (code >= 80 && code <= 82) return "소나기";
  if (code >= 85 && code <= 86) return "눈 소나기";
  if (code >= 95) return "뇌우";
  return "기상 확인";
}

export function nextKmaForecast(snapshot: KmaWeatherSnapshot, venueId: "stadium" | "samgeori", now = new Date()) {
  const nowEpoch = now.getTime();
  return snapshot.venues
    .filter((row) => row.venue_id === venueId)
    .map((row) => {
      const date = row.forecast_date;
      const time = row.forecast_time.padStart(4, "0");
      const iso = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}T${time.slice(0, 2)}:${time.slice(2, 4)}:00+09:00`;
      return { row, epoch: new Date(iso).getTime() };
    })
    .filter(({ epoch }) => Number.isFinite(epoch) && epoch >= nowEpoch)
    .sort((left, right) => left.epoch - right.epoch)[0]?.row ?? null;
}

export async function fetchLiveWeather(latitude: number, longitude: number, signal?: AbortSignal): Promise<WeatherSnapshot> {
  const params = new URLSearchParams({
    latitude: latitude.toFixed(5),
    longitude: longitude.toFixed(5),
    current: "temperature_2m,apparent_temperature,precipitation,rain,showers,weather_code,wind_speed_10m",
    hourly: "precipitation_probability",
    forecast_hours: "2",
    timezone: "Asia/Seoul",
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, { signal });
  if (!response.ok) throw new Error(`weather api ${response.status}`);
  const data = await response.json() as OpenMeteoResponse;
  if (!data.current) throw new Error("weather current data unavailable");
  const currentHour = data.current.time.slice(0, 13);
  const hourlyIndex = data.hourly?.time.findIndex((time) => time.startsWith(currentHour)) ?? -1;
  const precipitationProbability = hourlyIndex >= 0 ? data.hourly?.precipitation_probability[hourlyIndex] ?? null : null;
  const next2hProbabilities = data.hourly?.precipitation_probability.filter((value) => Number.isFinite(value)) ?? [];
  const next2hMaxPrecipitationProbability = next2hProbabilities.length > 0 ? Math.max(...next2hProbabilities) : null;
  return {
    temperature: Math.round(data.current.temperature_2m * 10) / 10,
    apparentTemperature: Math.round(data.current.apparent_temperature * 10) / 10,
    precipitation: data.current.precipitation,
    rain: data.current.rain,
    showers: data.current.showers,
    precipitationProbability,
    next2hMaxPrecipitationProbability,
    weatherCode: data.current.weather_code,
    windSpeed: Math.round(data.current.wind_speed_10m * 10) / 10,
    observedAt: data.current.time,
    fetchedAt: new Date().toISOString(),
    description: weatherCodeLabel(data.current.weather_code),
    source: "Open-Meteo",
  };
}
