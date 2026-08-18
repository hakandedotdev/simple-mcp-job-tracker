import { JobService } from "@/lib/application/job-service";
import { createJobRepository } from "@/lib/infrastructure/json-job-repository";

let jobService: JobService | null = null;

export function getJobService(): JobService {
  if (!jobService) {
    jobService = new JobService(createJobRepository());
  }

  return jobService;
}
