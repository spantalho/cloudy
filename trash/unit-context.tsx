import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type TempUnit = "celsius" | "fahrenheit";
type SpeedUnit = "kmh" | "mph";
// maybe... type LengthUnit = "millimeter" | "inches";

interface UnitContextType {
  tempUnit: TempUnit;
  speedUnit: SpeedUnit;
  setTempUnit: (unit: TempUnit) => void;
  setSpeedUnit: (unit: SpeedUnit) => void;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

export function UnitProvider({ children }: { children: ReactNode }) {
  const [tempUnit, setTempUnitState] = useState<TempUnit>("celsius");
  const [speedUnit, setSpeedUnitState] = useState<SpeedUnit>("kmh");

  useEffect(() => {
    const storedTemp = localStorage.getItem("tempUnit") as TempUnit | null;
    const storedSpeed = localStorage.getItem("speedUnit") as SpeedUnit | null;
    if (storedTemp) setTempUnitState(storedTemp);
    if (storedSpeed) setSpeedUnitState(storedSpeed);
  }, []);

  const setTempUnit = (unit: TempUnit) => {
    setTempUnitState(unit);
    localStorage.setItem("tempUnit", unit);
  };

  const setSpeedUnit = (unit: SpeedUnit) => {
    setSpeedUnitState(unit);
    localStorage.setItem("speedUnit", unit);
  };

  return (
    <UnitContext.Provider
      value={{ tempUnit, speedUnit, setTempUnit, setSpeedUnit }}
    >
      {children}
    </UnitContext.Provider>
  );
}

export function useUnit() {
  const ctx = useContext(UnitContext);
  if (!ctx) throw new Error("useUnit must be used within a UnitProvider");
  return ctx;
}
