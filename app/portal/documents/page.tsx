"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import PortalShell from "@/components/portal/PortalShell";
import KycUpload from "@/components/portal/KycUpload";
import {usePortal,request} from "@/components/portal/usePortal";
import {Status} from "@/components/portal/Investments";
export default function Documents(){
 const {user,refresh}=usePortal();const [data,setData]=useState<any>(null),[tab,setTab]=useState("KYC"),[error,setError]=useState(""),[busy,setBusy]=useState(false);
 function load(){return request("/api/portal/documents").then(setData).catch(e=>setError(e.message))}
 useEffect(()=>{if(user)load()},[user]);
 async function submit(){setBusy(true);setError("");try{await request("/api/portal/documents/submit",{});await load();await refresh()}catch(e){setError((e as Error).message)}finally{setBusy(false)}}
 const docs=(data?.portalDocuments||[]).filter((d:any)=>tab==="RECEIPTS"?/RECEIPT/.test(d.category):!/RECEIPT/.test(d.category));
 return <PortalShell user={user} currentTitle="Documents"><div className="space-y-6">{error&&<p className="error" role="alert">{error}</p>}<nav className="investor-tabs underline" aria-label="Document categories">{[["KYC","KYC Verification"],["AGREEMENTS","Investment Agreements"],["RECEIPTS","Payment Receipts"]].map(([id,title])=><button key={id} className={tab===id?"active":""} onClick={()=>setTab(id)}>{title}{id==="KYC"&&data?` (${data.documents.length}/3)`:""}</button>)}</nav>
 {!data?<p className="text-sm">Loading documents…</p>:tab==="KYC"?<><section className="investor-compliance-banner"><div><p>Compliance status</p><h2>KYC verification documents</h2><small>{data.documents.length} of 3 documents uploaded</small></div><Status value={data.kycStatus}/></section><div className="grid lg:grid-cols-3 gap-5"><KycUpload type="GOVERNMENT_ID" title="Government-issued ID" onChange={load}/><KycUpload type="PROOF_OF_ADDRESS" title="Proof of address" onChange={load}/><KycUpload type="SPECIMEN_SIGNATURE" title="Specimen signature" onChange={load}/></div><section className="investor-submit-docs"><div><h2>{data.biodata?.isSubmitted?"Submit updated documents":"Complete your seven-step KYC"}</h2><p>{data.biodata?.isSubmitted?"Send replacement documents to staff for review.":"Your details and documents are submitted together at the final step."}</p></div>{data.biodata?.isSubmitted?<button className="action" disabled={busy||data.documents.length<3||data.kycStatus==="APPROVED"} onClick={submit}>{busy?"Submitting…":"Submit for review"}</button>:<Link className="action" href="/portal/biodata">Complete KYC →</Link>}</section></>:<section className="panel"><h2 className="investor-section-title">{tab==="RECEIPTS"?"Payment receipts":"Investment agreements"}</h2>{docs.length?docs.map((d:any)=><div key={d.id} className="investor-doc-row"><div><p>{d.name}</p><small>{d.uploadDate} · {d.category.replaceAll("_"," ")}</small></div><a className="action secondary" href={`/api/portal/files/${d.id}`}>Download PDF</a></div>):<p className="text-sm text-neutral-500">No {tab==="RECEIPTS"?"receipts":"agreements"} available.</p>}</section>}</div></PortalShell>
}
