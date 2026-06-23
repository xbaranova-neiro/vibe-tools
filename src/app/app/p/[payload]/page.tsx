import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ payload: string }>;
};

/** Старые ссылки /app/p/… → прямая HTML-страница. */
export default async function AppPayloadRedirect({ params }: PageProps) {
  const { payload } = await params;
  redirect(`/api/view/${payload}`);
}
