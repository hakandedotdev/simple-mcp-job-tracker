"use client";

import { useEffect, useRef } from "react";
import type { UpdateJobInput } from "@/lib/domain/job";
import { JobFormFields } from "@/app/components/job-form-fields";
import {
  formStateToUpdateInput,
  type JobFormState,
} from "@/app/components/job-form-state";

type EditJobDialogProps = {
  open: boolean;
  form: JobFormState;
  submitting: boolean;
  title?: string;
  onClose: () => void;
  onChange: (updates: Partial<JobFormState>) => void;
  onSubmit: (payload: UpdateJobInput) => Promise<void>;
};

export function EditJobDialog({
  open,
  form,
  submitting,
  title = "Edit job",
  onClose,
  onChange,
  onSubmit,
}: EditJobDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit(formStateToUpdateInput(form));
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="w-[min(100vw-2rem,42rem)] rounded-xl border border-zinc-200 bg-white p-0 text-zinc-900 shadow-xl"
    >
      <form
        onSubmit={handleSubmit}
        className="flex max-h-[min(90vh,48rem)] flex-col"
      >
        <div className="border-b border-zinc-200 px-6 py-4">
          <h2 className="text-lg font-medium">{title}</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Update application details and files used.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <JobFormFields form={form} onChange={onChange} autoFocus />
        </div>

        <div className="flex justify-end gap-2 border-t border-zinc-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
