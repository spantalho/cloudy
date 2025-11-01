import { motion } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";
import { useConfig } from "@/contexts/config-context";

export default function Header() {
  const { theme } = useTheme();
  const { appConfig } = useConfig();

  return (
    <header className="flex flex-col items-center justify-between gap-5 w-full my-15 max-w-2xl md:max-w-3xl md:max-h-3xl lg:max-w-4xl md:h-[130px] md:flex-row md:items-top md:my-35">
      <div className="relative flex justify-center items-center w-full h-[100px] md:h-[130px]">
        <motion.img
          src="/icon_light.png"
          alt="Cloudy Light logo"
          className="absolute pointer-events-none scale-60 max-h-[160px] md:scale-100"
          animate={{
            opacity: theme === "dark" ? 0 : 1,
          }}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
        />
        <motion.img
          src="/icon_dark.png"
          alt="Cloudy Dark logo"
          className="absolute pointer-events-none scale-60 max-h-[160px] md:scale-100"
          animate={{
            opacity: theme === "dark" ? 1 : 0,
          }}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
        />
      </div>
      <div className="pointer-events-none flex w-full items-center justify-center md:justify-start md:items-top md:p-5 rounded-bl-lg md:border-b md:border-l">
        <div className="flex flex-col gap-5 justify-between items-center text-center md:text-start md:items-start">
          <h1 className="font-unbounded text-4xl tracking-tighter font-bold md:text-5xl lg:text-6xl">
            {appConfig.APP.name}.
          </h1>
          <p className="font-medium text-primary/90 text-sm w-auto">
            Um website de{" "}
            <span className="font-unbounded">previsão do tempo</span>. Bem
            simples & open-source.
          </p>
        </div>
      </div>
    </header>
  );
}
