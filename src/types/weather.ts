// Define the interface for the weather data structure
interface WeatherUnits {
	time: string;
	interval?: string; // Optional for hourly
	temperature_2m: string;
	wind_speed_10m: string;
	relative_humidity_2m?: string; // Optional for current
}

interface CurrentWeather {
	time: string;
	interval: number;
	temperature_2m: number;
	wind_speed_10m: number;
}

interface HourlyWeather {
	time: string[];
	temperature_2m: number[];
	relative_humidity_2m: number[];
	wind_speed_10m: number[];
}

interface WeatherData {
	latitude: number;
	longitude: number;
	generationtime_ms: number;
	utc_offset_seconds: number;
	timezone: string;
	timezone_abbreviation: string;
	elevation: number;
	current_units: WeatherUnits;
	current: CurrentWeather;
	hourly_units: WeatherUnits;
	hourly: HourlyWeather;
}
