"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EditJobDialog } from "@/app/components/edit-job-dialog";
import {
  emptyJobForm,
  jobToFormState,
  type JobFormState,
} from "@/app/components/job-form-state";
import {
  STATUS_BADGE_CLASSES,
  STATUS_LABELS,
  WORK_TYPE_LABELS,
} from "@/app/components/job-constants";
import { parseError } from "@/lib/client/parse-api-error";
import {
  JOB_STATUSES,
  type Job,
  type JobStatus,
  type UpdateJobInput,
} from "@/lib/domain/job";

type JobDetailProps = {
  jobId: string;
};

function DetailField({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-sm font-medium text-zinc-500">{label}</dt>
      <dd className="mt-1 text-sm text-zinc-900">{value}</dd>
    </div>
  );
}

function TextBlock({ label, value }: { label: string; value: string | null }) {
  if (!value) {
    return null;
  }

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-sm font-medium text-zinc-500">{label}</h2>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-800">
        {value}
      </p>
    </section>
  );
}

export function JobDetail({ jobId }: JobDetailProps) {
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<JobFormState>(emptyJobForm());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchJob() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/jobs/${jobId}`);

        if (!response.ok) {
          throw new Error(await parseError(response));
        }

        const data = (await response.json()) as Job;

        if (!cancelled) {
          setJob(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load job");
          setJob(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchJob();

    return () => {
      cancelled = true;
    };
  }, [jobId]);

  function openEditDialog() {
    if (!job) {
      return;
    }

    setEditForm(jobToFormState(job));
    setEditOpen(true);
  }

  async function handleStatusChange(status: JobStatus) {
    if (!job) {
      return;
    }

    setError(null);

    try {
      const response = await fetch(`/api/jobs/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status } satisfies UpdateJobInput),
      });

      if (!response.ok) {
        throw new Error(await parseError(response));
      }

      const updated = (await response.json()) as Job;
      setJob(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  }

  async function handleUpdate(payload: UpdateJobInput) {
    if (!job) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/jobs/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await parseError(response));
      }

      const updated = (await response.json()) as Job;
      setJob(updated);
      setEditOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save job");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!job) {
      return;
    }

    const confirmed = window.confirm(
      `Delete ${job.role} at ${job.company}? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setError(null);

    try {
      const response = await fetch(`/api/jobs/${job.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(await parseError(response));
      }

      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete job");
    }
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <p className="text-sm text-zinc-500">Loading job...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-10 sm:px-6">
        <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-900">
          ← Back to jobs
        </Link>
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error ?? "Job not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-900">
            ← Back to jobs
          </Link>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
              {job.role}
            </h1>
            <p className="mt-1 text-lg text-zinc-600">{job.company}</p>
          </div>
          <select
            value={job.status}
            onChange={(event) =>
              void handleStatusChange(event.target.value as JobStatus)
            }
            className={`w-fit rounded-full border-0 px-3 py-1.5 text-sm font-medium outline-none ${STATUS_BADGE_CLASSES[job.status]}`}
          >
            {JOB_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={openEditDialog}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => void handleDelete()}
            className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DetailField
            label="Work type"
            value={
              job.workType ? WORK_TYPE_LABELS[job.workType] : "Not set"
            }
          />
          <DetailField label="Region" value={job.region ?? "Not set"} />
          <DetailField
            label="Fit"
            value={job.fit !== null ? `${job.fit}%` : "Not set"}
          />
          <DetailField
            label="URL"
            className="sm:col-span-2 lg:col-span-3"
            value={
              job.url ? (
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-blue-600 hover:underline"
                >
                  {job.url}
                </a>
              ) : (
                "Not set"
              )
            }
          />
          <DetailField
            label="CV file path"
            className="sm:col-span-2"
            value={
              job.cvFilePath ? (
                <span className="break-all font-mono text-xs">
                  {job.cvFilePath}
                </span>
              ) : (
                "Not set"
              )
            }
          />
          <DetailField
            label="Cover letter file path"
            className="sm:col-span-2"
            value={
              job.coverLetterFilePath ? (
                <span className="break-all font-mono text-xs">
                  {job.coverLetterFilePath}
                </span>
              ) : (
                "Not set"
              )
            }
          />
          <DetailField
            label="Updated"
            value={new Date(job.updatedAt).toLocaleString()}
          />
        </dl>
      </section>

      <TextBlock label="Summary" value={job.summary} />
      <TextBlock label="Job description" value={job.jobDescription} />
      <TextBlock label="Feedback note" value={job.feedbackNote} />

      <EditJobDialog
        open={editOpen}
        form={editForm}
        submitting={submitting}
        title={`Edit ${job.role}`}
        onClose={() => setEditOpen(false)}
        onChange={(updates) =>
          setEditForm((current) => ({ ...current, ...updates }))
        }
        onSubmit={handleUpdate}
      />
    </div>
  );
}
