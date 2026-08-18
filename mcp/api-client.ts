import { JOB_STATUSES, JOB_WORK_TYPES, type CreateJobInput, type UpdateJobInput } from "../lib/domain/job";

const DEFAULT_BASE_URL = "http://localhost:3000";

function getBaseUrl(): string {
  return process.env.JOB_TRACKER_API_URL ?? DEFAULT_BASE_URL;
}

export class JobTrackerApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JobTrackerApiError";
  }
}

async function parseResponseError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { error?: string };
    return data.error ?? `Request failed with status ${response.status}`;
  } catch {
    return `Request failed with status ${response.status}`;
  }
}

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const url = `${getBaseUrl()}${path}`;

  let response: Response;

  try {
    response = await fetch(url, init);
  } catch {
    throw new JobTrackerApiError(
      `Could not reach job tracker API at ${getBaseUrl()}. Start the app with "npm run dev".`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  if (!response.ok) {
    throw new JobTrackerApiError(await parseResponseError(response));
  }

  return (await response.json()) as T;
}

export function listJobs() {
  return request<unknown[]>("/api/jobs");
}

export function getJob(id: string) {
  return request<unknown>(`/api/jobs/${id}`);
}

export function createJob(body: CreateJobInput) {
  return request<unknown>("/api/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function updateJob(id: string, body: UpdateJobInput) {
  return request<unknown>(`/api/jobs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function deleteJob(id: string) {
  return request<void>(`/api/jobs/${id}`, {
    method: "DELETE",
  });
}

export { JOB_STATUSES, JOB_WORK_TYPES };
