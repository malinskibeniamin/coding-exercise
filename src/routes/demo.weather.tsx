import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { parseAsFloat, useQueryState } from "nuqs";

export const Route = createFileRoute("/demo/weather")({
	component: WeatherDemo,
});

function WeatherDemo() {
	// London = 51.5072° N, 0.1276° W
	const [latitude, setLatitude] = useQueryState(
		"latitude",
		parseAsFloat.withDefault(51.5072),
	);
	const [longitude, setLongitude] = useQueryState(
		"longitude",
		parseAsFloat.withDefault(0.1276),
	);

	const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,apparent_temperature,is_day,weather_code,precipitation,cloud_cover,pressure_msl,visibility&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature,precipitation_probability,precipitation,weather_code,cloud_cover,visibility,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_hours,precipitation_probability_max&timezone=auto`;

	const { data } = useQuery<WeatherData, Error>({
		queryKey: ["weatherData", latitude, longitude],
		queryFn: () =>
			fetch(apiUrl)
				.then((res) => {
					if (!res.ok) {
						throw new Error(`HTTP error! status: ${res.status}`);
					}
					return res.json();
				})
				.then((d) => d as WeatherData),
		enabled: typeof latitude === "number" && typeof longitude === "number",
	});

	// Event handlers for input changes
	const handleLatitudeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = Number.parseFloat(event.target.value);
		setLatitude(Number.isNaN(value) ? null : value);
	};

	const handleLongitudeChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const value = Number.parseFloat(event.target.value);
		setLongitude(Number.isNaN(value) ? null : value);
	};

	return (
		<div className="p-4">
			<div className="mb-4 flex gap-4">
				<div>
					<label htmlFor="latitude" className="block text-sm font-medium mb-1">
						Latitude:
					</label>
					<input
						type="number"
						id="latitude"
						value={latitude ?? ""}
						onChange={handleLatitudeChange}
						step="0.01"
						className="p-2 border rounded"
					/>
				</div>
				<div>
					<label htmlFor="longitude" className="block text-sm font-medium mb-1">
						Longitude:
					</label>
					<input
						type="number"
						id="longitude"
						value={longitude ?? ""}
						onChange={handleLongitudeChange}
						step="0.01"
						className="p-2 border rounded"
					/>
				</div>
			</div>

			<h1 className="text-2xl mb-4">
				Current Weather at Lat: {latitude?.toFixed(2)}, Lon:{" "}
				{longitude?.toFixed(2)}
			</h1>
			{data && (
				<div>
					<p>
						Temperature: {data.current.temperature_2m}
						{data.current_units.temperature_2m}
					</p>
					<p>
						Wind Speed: {data.current.wind_speed_10m}
						{data.current_units.wind_speed_10m}
					</p>
					<p>Timezone: {data.timezone}</p>
					<p>Elevation: {data.elevation}m</p>
					<p>Fetched Time: {new Date(data.current.time).toLocaleString()}</p>

					{/* Optionally display some hourly forecast data */}
					<h2 className="text-xl mt-4 mb-2">Hourly Forecast (next 3 hours)</h2>
					<ul>
						{data.hourly.time.slice(0, 3).map((time, index) => (
							<li key={time}>
								{new Date(time).toLocaleTimeString()}:{" "}
								{data.hourly.temperature_2m[index]}
								{data.hourly_units.temperature_2m},{" "}
								{data.hourly.wind_speed_10m[index]}
								{data.hourly_units.wind_speed_10m}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
