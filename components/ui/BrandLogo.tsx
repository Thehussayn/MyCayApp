import React from "react";
import Image from "next/image";
import Link from "next/link";

interface BrandLogoProps {
  href?: string;
  variant?: "light" | "dark" | "emblem";
  className?: string;
  width?: number;
  height?: number;
  showText?: boolean;
}

export default function BrandLogo({
  href = "/",
  variant = "dark",
  className = "",
  width,
  height,
}: BrandLogoProps) {
  if (variant === "emblem") {
    return (
      <Link href={href} className={`inline-flex items-center ${className}`}>
        <Image
          src="/brand/mycayapp-emblem.svg"
          alt="MyCayApp Logo Emblem"
          width={width || 44}
          height={height || 44}
          priority
          className="h-auto object-contain"
        />
      </Link>
    );
  }

  const logoSrc =
    variant === "light"
      ? "/brand/mycayapp-horizontal-light.svg"
      : "/brand/mycayapp-horizontal-dark.svg";

  return (
    <Link
      href={href}
      className={`inline-flex items-center group transition-opacity hover:opacity-90 ${className}`}
    >
      <Image
        src={logoSrc}
        alt="MyCayApp by Jeje-Ola"
        width={width || 210}
        height={height || 44}
        priority
        className="h-full w-auto max-w-full object-contain"
      />
    </Link>
  );
}
