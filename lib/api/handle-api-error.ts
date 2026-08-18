import { ValidationError } from "@/lib/domain/job";

export function handleApiError(error: unknown): Response {
  if (error instanceof ValidationError) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  console.error(error);
  return Response.json({ error: "Internal server error" }, { status: 500 });
}
