import { promises as fs } from "fs";
import path from "path";
import type { JobRepository } from "@/lib/application/job-repository";
import type { Job } from "@/lib/domain/job";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "jobs.json");

function normalizeJob(raw: Job): Job {
  return {
    id: raw.id,
    company: raw.company,
    role: raw.role,
    status: raw.status,
    url: raw.url ?? null,
    jobDescription: raw.jobDescription ?? null,
    summary: raw.summary ?? null,
    fit: raw.fit ?? null,
    workType: raw.workType ?? null,
    region: raw.region ?? null,
    cvFilePath: raw.cvFilePath ?? null,
    coverLetterFilePath: raw.coverLetterFilePath ?? null,
    feedbackNote: raw.feedbackNote ?? null,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

export class JsonJobRepository implements JobRepository {
  private async ensureDataFile(): Promise<void> {
    await fs.mkdir(DATA_DIR, { recursive: true });

    try {
      await fs.access(DATA_FILE);
    } catch {
      await fs.writeFile(DATA_FILE, "[]", "utf-8");
    }
  }

  private async readJobs(): Promise<Job[]> {
    await this.ensureDataFile();
    const content = await fs.readFile(DATA_FILE, "utf-8");
    const jobs = (JSON.parse(content) as Job[]).map(normalizeJob);

    return jobs.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }

  private async writeJobs(jobs: Job[]): Promise<void> {
    await this.ensureDataFile();

    const tempFile = `${DATA_FILE}.tmp`;
    await fs.writeFile(tempFile, JSON.stringify(jobs, null, 2), "utf-8");
    await fs.rename(tempFile, DATA_FILE);
  }

  async findAll(): Promise<Job[]> {
    return this.readJobs();
  }

  async findById(id: string): Promise<Job | null> {
    const jobs = await this.readJobs();
    return jobs.find((job) => job.id === id) ?? null;
  }

  async save(job: Job): Promise<Job> {
    const jobs = await this.readJobs();
    const index = jobs.findIndex((existing) => existing.id === job.id);

    if (index === -1) {
      jobs.push(job);
    } else {
      jobs[index] = job;
    }

    await this.writeJobs(jobs);
    return job;
  }

  async delete(id: string): Promise<boolean> {
    const jobs = await this.readJobs();
    const nextJobs = jobs.filter((job) => job.id !== id);

    if (nextJobs.length === jobs.length) {
      return false;
    }

    await this.writeJobs(nextJobs);
    return true;
  }
}

export function createJobRepository(): JobRepository {
  return new JsonJobRepository();
}
