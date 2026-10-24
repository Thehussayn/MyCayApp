"use client";
import Link from "next/link";
import { InvestorLogo, InvestorFooter } from "@/components/portal/FigmaAsset";
import { usePortal } from "@/components/portal/usePortal";
export default function OnboardingComplete(){const {user}=usePortal();return <div className="workspace kyc-workspace"><header className="kyc-header"><div className="kyc-header-inner"><InvestorLogo/><Link href="/portal/dashboard" className="text-white text-xs">Dashboard →</Link></div></header><main className="kyc-main"><section className="kyc-success"><span className="text-brand-gold text-4xl" aria-hidden>✓</span><h1 className="mt-6">Biodata registration successful</h1><p>{user?.kycStatus==="APPROVED"?"Your KYC is verified.":"Your KYC has been submitted. Our team will review your details and documents, and notify you of the outcome."}</p><Link className="action" href="/portal/dashboard">Go to Dashboard →</Link></section></main><InvestorFooter/></div>}
