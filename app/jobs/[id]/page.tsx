import { JobDetail } from "@/app/components/job-detail";

export default async function JobDetailPage({
  params,
}: PageProps<"/jobs/[id]">) {
  const { id } = await params;

  return <JobDetail jobId={id} />;
}
