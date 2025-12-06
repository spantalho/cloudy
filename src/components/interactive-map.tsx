import { Map } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useConfig } from "../contexts/config-context";

export default function InteractiveMap({
  active,
  lon,
  lat,
}: {
  active: boolean;
  lon: number;
  lat: number;
}) {
  const { appConfig } = useConfig();

  const MAP_STYLE =
    appConfig.ENV === "production"
      ? ""
      : "https://demotiles.maplibre.org/style.json";

  return (
    <div
      className={`flex w-full min-h-screen dark:opacity-40 opacity-70 ${
        active ? "" : "pointer-events-none"
      }`}
    >
      <Map
        initialViewState={{
          longitude: lon,
          latitude: lat,
          zoom: 1.5,
        }}
        style={{ width: "100%", height: "auto" }}
        mapStyle={MAP_STYLE}
      />
    </div>
  );
}
