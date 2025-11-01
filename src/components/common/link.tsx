import type { ReactNode } from "react";

interface IconLinkProps {
  href: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

interface LinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

export const IconLink = ({
  href,
  icon,
  children,
  className = "",
  target = "_blank",
  rel = "noopener noreferrer",
}: IconLinkProps) => {
  return (
    <div className={`flex items-center text-xs ${className}`}>
      {icon}
      <a href={href} target={target} rel={rel} className="ml-2">
        {children}
      </a>
    </div>
  );
};

export const Link = ({
  href,
  children,
  className = "",
  target = "_blank",
  rel = "noopener noreferrer",
}: LinkProps) => {
  return (
    <a href={href} target={target} rel={rel} className={`${className}`}>
      {children}
    </a>
  );
};
