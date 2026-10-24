import Investments from "@/components/portal/Investments";
export default function Page({ params }: { params: { id: string } }) {
  return <Investments id={params.id} />;
}
