import type {
  CreateJobInput,
  Job,
  JobStatus,
  JobWorkType,
  UpdateJobInput,
} from "@/lib/domain/job";

export type JobFormState = {
  company: string;
  role: string;
  status: JobStatus;
  url: string;
  jobDescription: string;
  summary: string;
  fit: string;
  workType: JobWorkType | "";
  region: string;
  cvFilePath: string;
  coverLetterFilePath: string;
  feedbackNote: string;
};

export const emptyJobForm = (): JobFormState => ({
  company: "",
  role: "",
  status: "wishlist",
  url: "",
  jobDescription: "",
  summary: "",
  fit: "",
  workType: "",
  region: "",
  cvFilePath: "",
  coverLetterFilePath: "",
  feedbackNote: "",
});

export function jobToFormState(job: Job): JobFormState {
  return {
    company: job.company,
    role: job.role,
    status: job.status,
    url: job.url ?? "",
    jobDescription: job.jobDescription ?? "",
    summary: job.summary ?? "",
    fit: job.fit !== null ? String(job.fit) : "",
    workType: job.workType ?? "",
    region: job.region ?? "",
    cvFilePath: job.cvFilePath ?? "",
    coverLetterFilePath: job.coverLetterFilePath ?? "",
    feedbackNote: job.feedbackNote ?? "",
  };
}

function parseFit(value: string): number | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  return Number.parseInt(trimmed, 10);
}

export function formStateToCreateInput(form: JobFormState): CreateJobInput {
  return {
    company: form.company,
    role: form.role,
    status: form.status,
    url: form.url || null,
    jobDescription: form.jobDescription || null,
    summary: form.summary || null,
    fit: parseFit(form.fit),
    workType: form.workType || null,
    region: form.region || null,
    cvFilePath: form.cvFilePath || null,
    coverLetterFilePath: form.coverLetterFilePath || null,
    feedbackNote: form.feedbackNote || null,
  };
}

export function formStateToUpdateInput(form: JobFormState): UpdateJobInput {
  return {
    company: form.company,
    role: form.role,
    status: form.status,
    url: form.url || null,
    jobDescription: form.jobDescription || null,
    summary: form.summary || null,
    fit: parseFit(form.fit),
    workType: form.workType || null,
    region: form.region || null,
    cvFilePath: form.cvFilePath || null,
    coverLetterFilePath: form.coverLetterFilePath || null,
    feedbackNote: form.feedbackNote || null,
  };
}
