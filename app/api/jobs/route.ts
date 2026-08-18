import { getJobService } from "@/lib/get-job-service";
import { handleApiError } from "@/lib/api/handle-api-error";
import type { CreateJobInput } from "@/lib/domain/job";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const jobs = await getJobService().list();
    return Response.json(jobs);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateJobInput;
    const job = await getJobService().create(body);
    return Response.json(job, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
