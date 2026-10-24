import Link from "next/link";
import dimensions from "./figma-assets.json";

export function FigmaIcon({ file, className = "" }: { file: keyof typeof dimensions; className?: string }) {
  const [width, height] = dimensions[file];
  return <img src={`/figma/investor/${file}`} width={Number(width)} height={Number(height)} alt="" aria-hidden="true" className={`figma-icon ${className}`} />;
}

export function InvestorLogo({ dark = false, href = "/portal/dashboard" }: { dark?: boolean; href?: string }) {
  return <Link href={href} className="investor-logo" aria-label="MyCayApp by Jeje-Ola">
    <span className="investor-logo-emblem"><FigmaIcon file="cca1c.svg" /></span>
    <span className="investor-logo-wordmark"><FigmaIcon file={dark ? "ac651.svg" : "3e29c.svg"} /></span>
    <span className="investor-logo-caption">BY JEJE-OLA</span>
  </Link>;
}

export function InvestorFooter() {
  return <footer className="investor-footer"><span>© {new Date().getFullYear()} Jeje-Ola Properties Nig. Ltd.</span><nav aria-label="Company links"><Link href="/about">About</Link><Link href="/contact">Support</Link><a href="tel:+2348066873988">+234 8066 873 988</a></nav></footer>;
}
