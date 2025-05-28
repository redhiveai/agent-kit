import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { Action } from "../types/action";
import type { IAgent } from "../types/agent";
import { z } from "zod";

export type MCPSchemaShape = {
    [key: string]: z.ZodType<any>;
};

function isZodOptional(schema: z.ZodTypeAny): schema is z.ZodOptional<any> {
    return schema instanceof z.ZodOptional;
}

function isZodObject(schema: z.ZodTypeAny): schema is z.ZodObject<any> {
    return (
        schema instanceof z.ZodObject || schema?._def?.typeName === "ZodObject"
    );
}

export function zodToMCPShape(schema: z.ZodTypeAny): {
    result: MCPSchemaShape;
    keys: string[];
} {
    if (!isZodObject(schema)) {
        throw new Error("MCP tools require an object schema at the top level");
    }

    const shape = schema.shape;
    const result: MCPSchemaShape = {};

    for (const [key, value] of Object.entries(shape)) {
        result[key] = isZodOptional(value as any) ? (value as any).unwrap() : value;
    }

    return {
        result,
        keys: Object.keys(result),
    };
}

export function createMcpServer(
    actions: Record<string, Action>,
    agentKit: IAgent,
    options: {
        name: string;
        version: string;
    },
) {
    const server = new McpServer({
        name: options.name,
        version: options.version,
    });

    for (const [_key, action] of Object.entries(actions)) {
        const { result } = zodToMCPShape(action.schema);
        server.tool(action.name, action.description, result, async (params) => {
            try {
                const result = await action.handler(agentKit, params);

                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                };
            } catch (error) {
                console.error("error", error);
                return {
                    isError: true,
                    content: [
                        {
                            type: "text",
                            text:
                                error instanceof Error
                                    ? error.message
                                    : "Unknown error occurred",
                        },
                    ],
                };
            }
        });

        if (action.examples && action.examples.length > 0) {
            server.prompt(
                `${action.name}-examples`,
                {
                    showIndex: z
                        .string()
                        .optional()
                        .describe("Example index to show (number)"),
                },
                (args) => {
                    const showIndex = args.showIndex
                        ? parseInt(args.showIndex)
                        : undefined;
                    const examples = action.examples.flat();
                    const selectedExamples =
                        typeof showIndex === "number" ? [examples[showIndex]] : examples;

                    const exampleText = selectedExamples
                        .map(
                            (ex, idx) => `
Example ${idx + 1}:
Input: ${JSON.stringify(ex.input, null, 2)}
Output: ${JSON.stringify(ex.output, null, 2)}
Explanation: ${ex.explanation}
            `,
                        )
                        .join("\n");

                    return {
                        messages: [
                            {
                                role: "user",
                                content: {
                                    type: "text",
                                    text: `Examples for ${action.name}:\n${exampleText}`,
                                },
                            },
                        ],
                    };
                },
            );
        }
    }

    return server;
}

export async function startMcpServer(
    actions: Record<string, Action>,
    agentKit: IAgent,
    options: {
        name: string;
        version: string;
    },
) {
    try {
        const server = createMcpServer(actions, agentKit, options);
        const transport = new StdioServerTransport();
        await server.connect(transport);
        return server;
    } catch (error) {
        console.error("Error starting MCP server", error);
        throw error;
    }
}