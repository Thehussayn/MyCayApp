import React from "react";
import { InvestorFooter, InvestorLogo } from "@/components/portal/FigmaAsset";
interface AuthShellProps { children: React.ReactNode; kicker?: string; title: string; subtitle?: string; }
export default function AuthShell({ children, title, subtitle }: AuthShellProps) {
  return <div className="auth-layout">
    <aside className="auth-aside"><img className="auth-background" src="/figma/investor/f573d.png" alt="" /><div className="auth-shade" /><div className="auth-aside-brand"><InvestorLogo href="/" /><p>Institutional Real Estate Platform</p></div><div className="auth-aside-copy"><h2>Your property.<br />Your future.</h2><p>Access your direct property allocations, track 70/30 GIAP growth, and receive fixed monthly WealthStream distributions backed by tangible Nigerian property assets.</p></div></aside>
    <section className="auth-main"><header className="auth-mobile-header"><InvestorLogo dark href="/" /></header><div className="auth-form-wrap"><h1>{title}</h1>{subtitle && <p className="auth-subtitle">{subtitle}</p>}<div className="auth-form">{children}</div></div><InvestorFooter /></section>
  </div>;
}
