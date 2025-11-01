import { useConfig } from "@/contexts/config-context";

export type TempUnit = "celsius" | "fahrenheit";
export type SpeedUnit = "kmh" | "mph";
// type LengthUnit = "millimeter" | "inches";

export function useUnit() {
  const { userPreferences, setUserPreferences } = useConfig();

  const setTempUnit = (unit: TempUnit) => {
    setUserPreferences((prev) => ({
      ...prev,
      units: { ...prev.units, temperature: unit },
    }));
  };

  const setSpeedUnit = (unit: SpeedUnit) => {
    setUserPreferences((prev) => ({
      ...prev,
      units: { ...prev.units, speed: unit },
    }));
  };

  return {
    tempUnit: userPreferences.units.temperature,
    speedUnit: userPreferences.units.speed,
    setTempUnit,
    setSpeedUnit,
  };
}
