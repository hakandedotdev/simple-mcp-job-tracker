"use client";

import Link from "next/link";
import { JOB_STATUSES, type Job, type JobStatus } from "@/lib/domain/job";
import {
  STATUS_BADGE_CLASSES,
  STATUS_LABELS,
  WORK_TYPE_LABELS,
} from "@/app/components/job-constants";

export type StatusFilter = JobStatus | "all";

type JobsTableProps = {
  jobs: Job[];
  totalJobCount: number;
  totalFiltered: number;
  loading: boolean;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
  page: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onStatusChange: (jobId: string, status: JobStatus) => void;
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
};

export function JobsTable({
  jobs,
  totalJobCount,
  totalFiltered,
  loading,
  searchQuery,
  onSearchQueryChange,
  statusFilter,
  onStatusFilterChange,
  page,
  totalPages,
  pageSize,
  onPageChange,
  onStatusChange,
  onEdit,
  onDelete,
}: JobsTableProps) {
  const rangeStart =
    totalFiltered === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalFiltered);
  const showPaginationControls = totalFiltered > pageSize;

  return (
    <section className="rounded-xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-zinc-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-medium text-zinc-900">Applications</h2>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            placeholder="Search company or role…"
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-500 sm:w-56"
          />
          <select
            value={statusFilter}
            onChange={(event) =>
              onStatusFilterChange(event.target.value as StatusFilter)
            }
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500 sm:w-44"
          >
            <option value="all">All statuses</option>
            {JOB_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="px-6 py-8 text-sm text-zinc-500">Loading jobs...</p>
      ) : totalJobCount === 0 ? (
        <p className="px-6 py-8 text-sm text-zinc-500">
          No jobs yet. Click &quot;Add job&quot; to track your first application.
        </p>
      ) : totalFiltered === 0 ? (
        <p className="px-6 py-8 text-sm text-zinc-500">
          No applications match your search or filter.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200 text-sm">
              <thead className="bg-zinc-50 text-left text-zinc-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Fit</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {jobs.map((job) => (
                  <tr key={job.id} className="align-top">
                    <td className="px-4 py-3 font-medium text-zinc-900">
                      {job.company}
                    </td>
                    <td className="px-4 py-3 text-zinc-700">{job.role}</td>
                    <td className="px-4 py-3">
                      <select
                        value={job.status}
                        onChange={(event) =>
                          onStatusChange(
                            job.id,
                            event.target.value as JobStatus,
                          )
                        }
                        className={`rounded-full border-0 px-2.5 py-1 text-xs font-medium outline-none ${STATUS_BADGE_CLASSES[job.status]}`}
                      >
                        {JOB_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {STATUS_LABELS[status]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-zinc-600">
                      {job.workType ? WORK_TYPE_LABELS[job.workType] : "—"}
                    </td>
                    <td className="px-4 py-3 text-zinc-600">
                      {job.fit !== null ? `${job.fit}%` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/jobs/${job.id}`}
                          className="rounded-md border border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => onEdit(job)}
                          className="rounded-md border border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(job)}
                          className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-zinc-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-600">
              Showing {rangeStart}–{rangeEnd} of {totalFiltered}
            </p>
            {showPaginationControls ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => onPageChange(page - 1)}
                  className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => onPageChange(page + 1)}
                  className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            ) : null}
          </div>
        </>
      )}
    </section>
  );
}
