import {
  JOB_STATUSES,
  JOB_WORK_TYPES,
  type JobStatus,
  type JobWorkType,
} from "@/lib/domain/job";
import { STATUS_LABELS, WORK_TYPE_LABELS } from "@/app/components/job-constants";
import type { JobFormState } from "@/app/components/job-form-state";

type JobFormFieldsProps = {
  form: JobFormState;
  onChange: (updates: Partial<JobFormState>) => void;
  autoFocus?: boolean;
};

export function JobFormFields({
  form,
  onChange,
  autoFocus = false,
}: JobFormFieldsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="flex flex-col gap-1 text-sm sm:col-span-2">
        <span className="font-medium text-zinc-700">Company</span>
        <input
          required
          autoFocus={autoFocus}
          value={form.company}
          onChange={(event) => onChange({ company: event.target.value })}
          className="rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
          placeholder="Acme Corp"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm sm:col-span-2">
        <span className="font-medium text-zinc-700">Role</span>
        <input
          required
          value={form.role}
          onChange={(event) => onChange({ role: event.target.value })}
          className="rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
          placeholder="Frontend Engineer"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm sm:col-span-2">
        <span className="font-medium text-zinc-700">URL</span>
        <input
          type="url"
          value={form.url}
          onChange={(event) => onChange({ url: event.target.value })}
          className="rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
          placeholder="https://company.com/jobs/123"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-zinc-700">Status</span>
        <select
          value={form.status}
          onChange={(event) =>
            onChange({ status: event.target.value as JobStatus })
          }
          className="rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
        >
          {JOB_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-zinc-700">Work type</span>
        <select
          value={form.workType}
          onChange={(event) =>
            onChange({ workType: event.target.value as JobWorkType | "" })
          }
          className="rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
        >
          <option value="">Not set</option>
          {JOB_WORK_TYPES.map((workType) => (
            <option key={workType} value={workType}>
              {WORK_TYPE_LABELS[workType]}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-zinc-700">Region</span>
        <input
          value={form.region}
          onChange={(event) => onChange({ region: event.target.value })}
          className="rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
          placeholder="Europe, US, UK..."
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-zinc-700">Fit (%)</span>
        <input
          type="number"
          min={0}
          max={100}
          value={form.fit}
          onChange={(event) => onChange({ fit: event.target.value })}
          className="rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
          placeholder="85"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm sm:col-span-2">
        <span className="font-medium text-zinc-700">Summary</span>
        <textarea
          value={form.summary}
          onChange={(event) => onChange({ summary: event.target.value })}
          rows={2}
          className="rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
          placeholder="Short summary of the role and why it fits..."
        />
      </label>

      <label className="flex flex-col gap-1 text-sm sm:col-span-2">
        <span className="font-medium text-zinc-700">Job description</span>
        <textarea
          value={form.jobDescription}
          onChange={(event) =>
            onChange({ jobDescription: event.target.value })
          }
          rows={4}
          className="rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
          placeholder="Paste or summarize the job posting..."
        />
      </label>

      <label className="flex flex-col gap-1 text-sm sm:col-span-2">
        <span className="font-medium text-zinc-700">CV file path</span>
        <input
          value={form.cvFilePath}
          onChange={(event) => onChange({ cvFilePath: event.target.value })}
          className="rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
          placeholder="/Users/you/Documents/cv-acme.pdf"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm sm:col-span-2">
        <span className="font-medium text-zinc-700">Cover letter file path</span>
        <input
          value={form.coverLetterFilePath}
          onChange={(event) =>
            onChange({ coverLetterFilePath: event.target.value })
          }
          className="rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
          placeholder="/Users/you/Documents/cover-letter-acme.pdf"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm sm:col-span-2">
        <span className="font-medium text-zinc-700">Feedback note</span>
        <textarea
          value={form.feedbackNote}
          onChange={(event) => onChange({ feedbackNote: event.target.value })}
          rows={3}
          className="rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
          placeholder="Recruiter said they will follow up next week..."
        />
      </label>
    </div>
  );
}
