import {
  applyJobUpdate,
  createJob,
  type CreateJobInput,
  type Job,
  type UpdateJobInput,
} from "@/lib/domain/job";
import type { JobRepository } from "@/lib/application/job-repository";

export class JobService {
  constructor(private readonly repository: JobRepository) {}

  list(): Promise<Job[]> {
    return this.repository.findAll();
  }

  getById(id: string): Promise<Job | null> {
    return this.repository.findById(id);
  }

  create(input: CreateJobInput): Promise<Job> {
    const job = createJob(input);
    return this.repository.save(job);
  }

  async update(id: string, input: UpdateJobInput): Promise<Job | null> {
    const existing = await this.repository.findById(id);

    if (!existing) {
      return null;
    }

    const updated = applyJobUpdate(existing, input);
    return this.repository.save(updated);
  }

  delete(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}
