import { redirect } from "next/navigation";
import AdminApp from "@/components/admin/AdminApp";
export default function Page({ params }: { params: { section?: string[] } }) {
  if (params.section?.[0] === "review") redirect("/admin/investors");
  return <AdminApp section={params.section?.[0] || "overview"} investorId={params.section?.[0] === "investors" ? params.section[1] : undefined} />;
}
