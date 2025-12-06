import WeatherIcon from "@/utils/weather-icons";
import * as lucide from "lucide-react";

export default function Current({ className }: { className?: string }) {
  return (
    <div className={`flex pl-8 py-4 border-l w-full items-center ${className}`}>
      <div>
        <div className="flex items-center mb-1 text-xs text-muted">
          <p>
            Hoje, em <span className="font-bold">São Paulo</span>
          </p>
        </div>
        <h2 className="mb-5 text-2xl tracking-tight font-medium">
          É um dia parcialmente nublado.
        </h2>
        <div className="inline-flex w-full items-center justify-between">
          <div className="flex items-center">
            <WeatherIcon isDay={false} code={1003} size={75} className="mr-4" />
            <h1 className="text-6xl font-unbounded tracking-tighter">13</h1>
            <span className="self-baseline text-xl">°C</span>
          </div>
          <div>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center">
                <lucide.Umbrella size={24} />
                <span className="ml-2 text-muted text-sm">58%</span>
              </li>
              <li className="flex items-center">
                <lucide.Wind size={24} />
                <span className="ml-2 text-muted text-sm">32km/h</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
