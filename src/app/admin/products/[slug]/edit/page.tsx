import { notFound } from "next/navigation";

type AdminEditProductRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return [];
}

export default async function AdminEditProductRoute({ params }: AdminEditProductRouteProps) {
  await params;
  notFound();
}
