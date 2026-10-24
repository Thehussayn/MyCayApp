import { redirect } from "next/navigation";
export default function Page({
  searchParams,
}: {
  searchParams: { plan?: string };
}) {
  redirect(
    `/portal/investments/new${searchParams.plan ? `?plan=${encodeURIComponent(searchParams.plan)}` : ""}`,
  );
}
