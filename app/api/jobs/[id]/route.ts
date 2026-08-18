import type { NextRequest } from "next/server";
import { getJobService } from "@/lib/get-job-service";
import { handleApiError } from "@/lib/api/handle-api-error";
import type { UpdateJobInput } from "@/lib/domain/job";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/api/jobs/[id]">,
) {
  try {
    const { id } = await ctx.params;
    const job = await getJobService().getById(id);

    if (!job) {
      return Response.json({ error: "Job not found" }, { status: 404 });
    }

    return Response.json(job);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/jobs/[id]">,
) {
  try {
    const { id } = await ctx.params;
    const body = (await request.json()) as UpdateJobInput;
    const job = await getJobService().update(id, body);

    if (!job) {
      return Response.json({ error: "Job not found" }, { status: 404 });
    }

    return Response.json(job);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/jobs/[id]">,
) {
  try {
    const { id } = await ctx.params;
    const deleted = await getJobService().delete(id);

    if (!deleted) {
      return Response.json({ error: "Job not found" }, { status: 404 });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    return handleApiError(error);
  }
}
