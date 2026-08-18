"use client";

import { useCallback, useEffect, useState } from "react";
import { AddJobDialog } from "@/app/components/add-job-dialog";
import { EditJobDialog } from "@/app/components/edit-job-dialog";
import { JobStats } from "@/app/components/job-stats";
import { JobsTable } from "@/app/components/jobs-table";
import {
  emptyJobForm,
  jobToFormState,
  type JobFormState,
} from "@/app/components/job-form-state";
import { parseError } from "@/lib/client/parse-api-error";
import {
  type CreateJobInput,
  type Job,
  type JobStatus,
  type UpdateJobInput,
} from "@/lib/domain/job";

export function JobTracker() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addForm, setAddForm] = useState<JobFormState>(emptyJobForm());
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [editForm, setEditForm] = useState<JobFormState>(emptyJobForm());
  const [submitting, setSubmitting] = useState(false);

  const loadJobs = useCallback(async () => {
    setError(null);

    try {
      const response = await fetch("/api/jobs");

      if (!response.ok) {
        throw new Error(await parseError(response));
      }

      const data = (await response.json()) as Job[];
      setJobs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchInitialJobs() {
      setError(null);

      try {
        const response = await fetch("/api/jobs");

        if (!response.ok) {
          throw new Error(await parseError(response));
        }

        const data = (await response.json()) as Job[];

        if (!cancelled) {
          setJobs(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load jobs");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchInitialJobs();

    return () => {
      cancelled = true;
    };
  }, []);

  function openEditDialog(job: Job) {
    setEditingJob(job);
    setEditForm(jobToFormState(job));
    setEditDialogOpen(true);
  }

  function closeEditDialog() {
    setEditDialogOpen(false);
    setEditingJob(null);
    setEditForm(emptyJobForm());
  }

  async function handleAdd(payload: CreateJobInput) {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await parseError(response));
      }

      setAddForm(emptyJobForm());
      setAddDialogOpen(false);
      await loadJobs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add job");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(jobId: string, status: JobStatus) {
    setError(null);

    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status } satisfies UpdateJobInput),
      });

      if (!response.ok) {
        throw new Error(await parseError(response));
      }

      const updated = (await response.json()) as Job;
      setJobs((current) =>
        current.map((job) => (job.id === updated.id ? updated : job)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  }

  async function handleUpdate(payload: UpdateJobInput) {
    if (!editingJob) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/jobs/${editingJob.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await parseError(response));
      }

      const updated = (await response.json()) as Job;
      setJobs((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      closeEditDialog();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save job");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(job: Job) {
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

      setJobs((current) => current.filter((item) => item.id !== job.id));

      if (editingJob?.id === job.id) {
        closeEditDialog();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete job");
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
            Job Tracker
          </h1>
          <p className="text-zinc-600">
            Track applications, status, CV/cover letter paths, and feedback notes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAddDialogOpen(true)}
          className="shrink-0 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
        >
          Add job
        </button>
      </header>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <JobStats jobs={jobs} />

      <JobsTable
        jobs={jobs}
        loading={loading}
        onStatusChange={(jobId, status) =>
          void handleStatusChange(jobId, status)
        }
        onEdit={openEditDialog}
        onDelete={(job) => void handleDelete(job)}
      />

      <AddJobDialog
        open={addDialogOpen}
        form={addForm}
        submitting={submitting}
        onClose={() => {
          setAddDialogOpen(false);
          setAddForm(emptyJobForm());
        }}
        onChange={(updates) =>
          setAddForm((current) => ({ ...current, ...updates }))
        }
        onSubmit={handleAdd}
      />

      <EditJobDialog
        open={editDialogOpen}
        form={editForm}
        submitting={submitting}
        title={
          editingJob ? `Edit ${editingJob.role}` : "Edit job"
        }
        onClose={closeEditDialog}
        onChange={(updates) =>
          setEditForm((current) => ({ ...current, ...updates }))
        }
        onSubmit={handleUpdate}
      />
    </div>
  );
}
