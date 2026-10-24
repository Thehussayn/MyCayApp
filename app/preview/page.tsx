export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import PreviewLauncher from "@/components/portal/PreviewLauncher";
export default function Page() {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ENABLE_PREVIEW !== "true"
  )
    notFound();
  return <PreviewLauncher />;
}
