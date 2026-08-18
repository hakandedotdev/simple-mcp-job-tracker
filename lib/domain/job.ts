export const JOB_STATUSES = [
  "wishlist",
  "applied",
  "interviewing",
  "offer",
  "rejected",
  "withdrawn",
] as const;

export type JobStatus = (typeof JOB_STATUSES)[number];

export const JOB_WORK_TYPES = ["remote", "onsite", "hybrid"] as const;

export type JobWorkType = (typeof JOB_WORK_TYPES)[number];

export type Job = {
  id: string;
  company: string;
  role: string;
  status: JobStatus;
  url: string | null;
  jobDescription: string | null;
  summary: string | null;
  fit: number | null;
  workType: JobWorkType | null;
  region: string | null;
  cvFilePath: string | null;
  coverLetterFilePath: string | null;
  feedbackNote: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateJobInput = {
  company: string;
  role: string;
  status?: JobStatus;
  url?: string | null;
  jobDescription?: string | null;
  summary?: string | null;
  fit?: number | null;
  workType?: JobWorkType | null;
  region?: string | null;
  cvFilePath?: string | null;
  coverLetterFilePath?: string | null;
  feedbackNote?: string | null;
};

export type UpdateJobInput = {
  company?: string;
  role?: string;
  status?: JobStatus;
  url?: string | null;
  jobDescription?: string | null;
  summary?: string | null;
  fit?: number | null;
  workType?: JobWorkType | null;
  region?: string | null;
  cvFilePath?: string | null;
  coverLetterFilePath?: string | null;
  feedbackNote?: string | null;
};

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

function trimOrNull(value: string | null | undefined): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function requireNonEmpty(value: string | undefined, field: string): string {
  const trimmed = value?.trim() ?? "";

  if (!trimmed) {
    throw new ValidationError(`${field} is required`);
  }

  return trimmed;
}

function validateFit(value: number | null | undefined): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (!Number.isInteger(value) || value < 0 || value > 100) {
    throw new ValidationError("Fit must be an integer between 0 and 100");
  }

  return value;
}

export function isJobStatus(value: string): value is JobStatus {
  return JOB_STATUSES.includes(value as JobStatus);
}

export function isJobWorkType(value: string): value is JobWorkType {
  return JOB_WORK_TYPES.includes(value as JobWorkType);
}

export function validateCreateJobInput(input: CreateJobInput): Omit<
  Job,
  "id" | "createdAt" | "updatedAt"
> {
  const status = input.status ?? "wishlist";

  if (!isJobStatus(status)) {
    throw new ValidationError("Invalid status");
  }

  const workType = input.workType ?? null;

  if (workType !== null && !isJobWorkType(workType)) {
    throw new ValidationError("Invalid work type");
  }

  return {
    company: requireNonEmpty(input.company, "Company"),
    role: requireNonEmpty(input.role, "Role"),
    status,
    url: trimOrNull(input.url),
    jobDescription: trimOrNull(input.jobDescription),
    summary: trimOrNull(input.summary),
    fit: validateFit(input.fit),
    workType,
    region: trimOrNull(input.region),
    cvFilePath: trimOrNull(input.cvFilePath),
    coverLetterFilePath: trimOrNull(input.coverLetterFilePath),
    feedbackNote: trimOrNull(input.feedbackNote),
  };
}

export function validateUpdateJobInput(input: UpdateJobInput): UpdateJobInput {
  const validated: UpdateJobInput = {};

  if (input.company !== undefined) {
    validated.company = requireNonEmpty(input.company, "Company");
  }

  if (input.role !== undefined) {
    validated.role = requireNonEmpty(input.role, "Role");
  }

  if (input.status !== undefined) {
    if (!isJobStatus(input.status)) {
      throw new ValidationError("Invalid status");
    }

    validated.status = input.status;
  }

  if (input.url !== undefined) {
    validated.url = trimOrNull(input.url);
  }

  if (input.jobDescription !== undefined) {
    validated.jobDescription = trimOrNull(input.jobDescription);
  }

  if (input.summary !== undefined) {
    validated.summary = trimOrNull(input.summary);
  }

  if (input.fit !== undefined) {
    validated.fit = validateFit(input.fit);
  }

  if (input.workType !== undefined) {
    if (input.workType !== null && !isJobWorkType(input.workType)) {
      throw new ValidationError("Invalid work type");
    }

    validated.workType = input.workType;
  }

  if (input.region !== undefined) {
    validated.region = trimOrNull(input.region);
  }

  if (input.cvFilePath !== undefined) {
    validated.cvFilePath = trimOrNull(input.cvFilePath);
  }

  if (input.coverLetterFilePath !== undefined) {
    validated.coverLetterFilePath = trimOrNull(input.coverLetterFilePath);
  }

  if (input.feedbackNote !== undefined) {
    validated.feedbackNote = trimOrNull(input.feedbackNote);
  }

  if (Object.keys(validated).length === 0) {
    throw new ValidationError("At least one field is required to update");
  }

  return validated;
}

export function createJob(input: CreateJobInput): Job {
  const validated = validateCreateJobInput(input);
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    ...validated,
    createdAt: now,
    updatedAt: now,
  };
}

export function applyJobUpdate(job: Job, input: UpdateJobInput): Job {
  const validated = validateUpdateJobInput(input);

  return {
    ...job,
    ...validated,
    updatedAt: new Date().toISOString(),
  };
}
