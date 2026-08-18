import { JOB_STATUSES, type Job, type JobStatus } from "@/lib/domain/job";
import {
  countJobsByStatus,
  HIGHLIGHT_STATUSES,
  STATUS_CARD_ACCENTS,
  STATUS_CHART_COLORS,
  STATUS_LABELS,
} from "@/app/components/job-constants";

type JobStatsProps = {
  jobs: Job[];
};

function buildPieGradient(counts: Record<JobStatus, number>, total: number) {
  if (total === 0) {
    return "#e4e4e7";
  }

  let currentAngle = 0;
  const segments: string[] = [];

  for (const status of JOB_STATUSES) {
    const count = counts[status];

    if (count === 0) {
      continue;
    }

    const sliceAngle = (count / total) * 360;
    const nextAngle = currentAngle + sliceAngle;
    segments.push(
      `${STATUS_CHART_COLORS[status]} ${currentAngle}deg ${nextAngle}deg`,
    );
    currentAngle = nextAngle;
  }

  return `conic-gradient(${segments.join(", ")})`;
}

function PieChart({
  counts,
  total,
}: {
  counts: Record<JobStatus, number>;
  total: number;
}) {
  const activeStatuses = JOB_STATUSES.filter((status) => counts[status] > 0);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div
        className="mx-auto h-40 w-40 shrink-0 rounded-full border border-zinc-200"
        style={{ background: buildPieGradient(counts, total) }}
        aria-hidden="true"
      />

      <ul className="flex flex-1 flex-col gap-2 text-sm">
        {activeStatuses.length === 0 ? (
          <li className="text-zinc-500">No applications yet</li>
        ) : (
          activeStatuses.map((status) => (
            <li key={status} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-zinc-700">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: STATUS_CHART_COLORS[status] }}
                />
                {STATUS_LABELS[status]}
              </span>
              <span className="font-medium text-zinc-900">
                {counts[status]}
                <span className="ml-1 font-normal text-zinc-500">
                  ({Math.round((counts[status] / total) * 100)}%)
                </span>
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

function BarChart({ counts }: { counts: Record<JobStatus, number> }) {
  const maxCount = Math.max(...JOB_STATUSES.map((status) => counts[status]), 1);

  return (
    <div className="flex h-48 items-end gap-2 sm:gap-3">
      {JOB_STATUSES.map((status) => {
        const count = counts[status];
        const height = count === 0 ? 4 : Math.max((count / maxCount) * 100, 12);

        return (
          <div
            key={status}
            className="flex min-w-0 flex-1 flex-col items-center gap-2"
          >
            <span className="text-xs font-medium text-zinc-700">{count}</span>
            <div className="flex w-full flex-1 items-end">
              <div
                className="w-full rounded-t-md transition-all"
                style={{
                  height: `${height}%`,
                  backgroundColor: STATUS_CHART_COLORS[status],
                  minHeight: count > 0 ? "12px" : "4px",
                  opacity: count > 0 ? 1 : 0.25,
                }}
                title={`${STATUS_LABELS[status]}: ${count}`}
              />
            </div>
            <span className="w-full truncate text-center text-[10px] font-medium uppercase tracking-wide text-zinc-500">
              {STATUS_LABELS[status].slice(0, 4)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function JobStats({ jobs }: JobStatsProps) {
  const counts = countJobsByStatus(jobs);
  const total = jobs.length;

  return (
    <section className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm lg:col-span-1">
          <p className="text-sm font-medium text-zinc-500">Total jobs</p>
          <p className="mt-2 text-3xl font-semibold text-zinc-900">{total}</p>
        </div>

        {HIGHLIGHT_STATUSES.map((status) => (
          <div
            key={status}
            className={`rounded-xl border border-zinc-200 border-l-4 bg-white p-4 shadow-sm ${STATUS_CARD_ACCENTS[status]}`}
          >
            <p className="text-sm font-medium text-zinc-500">
              {STATUS_LABELS[status]}
            </p>
            <p className="mt-2 text-2xl font-semibold text-zinc-900">
              {counts[status]}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-900">Status breakdown</h3>
          <p className="mt-1 text-sm text-zinc-500">
            Share of applications by current status
          </p>
          <div className="mt-5">
            <PieChart counts={counts} total={total} />
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-medium text-zinc-900">Status counts</h3>
          <p className="mt-1 text-sm text-zinc-500">
            Compare volume across each pipeline stage
          </p>
          <div className="mt-5">
            <BarChart counts={counts} />
          </div>
        </div>
      </div>
    </section>
  );
}
