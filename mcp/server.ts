import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as z from "zod";
import {
  createJob,
  deleteJob,
  getJob,
  JobTrackerApiError,
  JOB_STATUSES,
  JOB_WORK_TYPES,
  listJobs,
  updateJob,
} from "./api-client.js";

const jobStatusSchema = z.enum(JOB_STATUSES);
const jobWorkTypeSchema = z.enum(JOB_WORK_TYPES);

const optionalJobFields = {
  url: z.string().nullable().optional().describe("Job posting URL"),
  jobDescription: z
    .string()
    .nullable()
    .optional()
    .describe("Full or pasted job description"),
  summary: z
    .string()
    .nullable()
    .optional()
    .describe("Short summary of the role"),
  fit: z
    .number()
    .int()
    .min(0)
    .max(100)
    .nullable()
    .optional()
    .describe("Fit percentage (0-100)"),
  workType: jobWorkTypeSchema
    .nullable()
    .optional()
    .describe("Work type: remote, onsite, hybrid"),
  region: z
    .string()
    .nullable()
    .optional()
    .describe("Region or location (e.g. Europe, US)"),
  cvFilePath: z
    .string()
    .nullable()
    .optional()
    .describe("Local file path to the CV used"),
  coverLetterFilePath: z
    .string()
    .nullable()
    .optional()
    .describe("Local file path to the cover letter used"),
  feedbackNote: z
    .string()
    .nullable()
    .optional()
    .describe("Feedback or notes from the employer"),
};

function successResult(data: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

function errorResult(error: unknown) {
  const message =
    error instanceof JobTrackerApiError
      ? error.message
      : error instanceof Error
        ? error.message
        : "Unknown error";

  return {
    isError: true as const,
    content: [
      {
        type: "text" as const,
        text: message,
      },
    ],
  };
}

const server = new McpServer({
  name: "job-tracker",
  version: "1.0.0",
});

server.registerTool(
  "list_jobs",
  {
    description: "List all job applications",
  },
  async () => {
    try {
      return successResult(await listJobs());
    } catch (error) {
      return errorResult(error);
    }
  },
);

server.registerTool(
  "get_job",
  {
    description: "Get a single job application by id",
    inputSchema: {
      id: z.string().describe("Job id"),
    },
  },
  async ({ id }) => {
    try {
      return successResult(await getJob(id));
    } catch (error) {
      return errorResult(error);
    }
  },
);

server.registerTool(
  "add_job",
  {
    description: "Add a new job application",
    inputSchema: {
      company: z.string().describe("Company name"),
      role: z.string().describe("Job role or title"),
      status: jobStatusSchema
        .optional()
        .describe(
          "Application status: wishlist, applied, interviewing, offer, rejected, withdrawn",
        ),
      ...optionalJobFields,
    },
  },
  async (input) => {
    try {
      return successResult(await createJob(input));
    } catch (error) {
      return errorResult(error);
    }
  },
);

server.registerTool(
  "update_job",
  {
    description: "Update an existing job application",
    inputSchema: {
      id: z.string().describe("Job id"),
      company: z.string().optional().describe("Company name"),
      role: z.string().optional().describe("Job role or title"),
      status: jobStatusSchema
        .optional()
        .describe(
          "Application status: wishlist, applied, interviewing, offer, rejected, withdrawn",
        ),
      ...optionalJobFields,
    },
  },
  async ({ id, ...updates }) => {
    try {
      return successResult(await updateJob(id, updates));
    } catch (error) {
      return errorResult(error);
    }
  },
);

server.registerTool(
  "delete_job",
  {
    description: "Delete a job application by id",
    inputSchema: {
      id: z.string().describe("Job id"),
    },
  },
  async ({ id }) => {
    try {
      await deleteJob(id);
      return successResult({ deleted: true, id });
    } catch (error) {
      return errorResult(error);
    }
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Job tracker MCP server running on stdio");
}

main().catch((error) => {
  console.error("MCP server error:", error);
  process.exit(1);
});
