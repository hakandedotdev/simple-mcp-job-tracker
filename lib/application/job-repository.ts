import type { Job } from "@/lib/domain/job";

export interface JobRepository {
  findAll(): Promise<Job[]>;
  findById(id: string): Promise<Job | null>;
  save(job: Job): Promise<Job>;
  delete(id: string): Promise<boolean>;
}
