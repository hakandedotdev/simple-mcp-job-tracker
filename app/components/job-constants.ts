import { JOB_STATUSES, JOB_WORK_TYPES, type JobStatus, type JobWorkType } from "@/lib/domain/job";

export const STATUS_LABELS: Record<JobStatus, string> = {
  wishlist: "Wishlist",
  applied: "Applied",
  interviewing: "Interviewing",
  offer: "Offer",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

export const STATUS_BADGE_CLASSES: Record<JobStatus, string> = {
  wishlist: "bg-slate-100 text-slate-700",
  applied: "bg-blue-100 text-blue-700",
  interviewing: "bg-amber-100 text-amber-800",
  offer: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-700",
  withdrawn: "bg-zinc-100 text-zinc-600",
};

export const STATUS_CHART_COLORS: Record<JobStatus, string> = {
  wishlist: "#64748b",
  applied: "#2563eb",
  interviewing: "#d97706",
  offer: "#059669",
  rejected: "#dc2626",
  withdrawn: "#71717a",
};

export const STATUS_CARD_ACCENTS: Record<JobStatus, string> = {
  wishlist: "border-l-slate-400",
  applied: "border-l-blue-500",
  interviewing: "border-l-amber-500",
  offer: "border-l-emerald-500",
  rejected: "border-l-red-500",
  withdrawn: "border-l-zinc-400",
};

export const WORK_TYPE_LABELS: Record<JobWorkType, string> = {
  remote: "Remote",
  onsite: "Onsite",
  hybrid: "Hybrid",
};

export { JOB_WORK_TYPES };

export const JOBS_PAGE_SIZE = 10;

export const HIGHLIGHT_STATUSES: JobStatus[] = [
  "wishlist",
  "applied",
  "interviewing",
  "offer",
  "rejected",
];

export function countJobsByStatus(
  jobs: { status: JobStatus }[],
): Record<JobStatus, number> {
  const counts = Object.fromEntries(
    JOB_STATUSES.map((status) => [status, 0]),
  ) as Record<JobStatus, number>;

  for (const job of jobs) {
    counts[job.status]++;
  }

  return counts;
}
