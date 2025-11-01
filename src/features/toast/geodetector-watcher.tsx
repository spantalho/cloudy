// import { useCity } from "@/contexts/city-context";
// import { Globe } from "lucide-react";
// import { useEffect, useRef } from "react";
// import { useTranslation } from "react-i18next";
// import { toast } from "sonner";

// export default function GeoDetectorWatcher() {
//   const { geoDetected, setGeoDetected } = useCity();
//   const { t } = useTranslation();
//   const geoDetectedToast = useRef<string | number | null>(null);

//   useEffect(() => {
//     if (!geoDetected && geoDetectedToast.current) return;

//     const id = toast.info("Proximidade Encontrada", {
//       id: "geodetection",
//       description: "Cidade atualizada. Pode conter equívocos.",
//       icon: <Globe size={20}/>,
//       duration: 9000,
//     });

//     geoDetectedToast.current = id;

//     const timer = setTimeout(() => {
//       setGeoDetected(false);
//       geoDetectedToast.current = null;
//     }, 9200);

//     return () => clearTimeout(timer);
//   }, [geoDetected, setGeoDetected, t]);

//   return null;
// }
