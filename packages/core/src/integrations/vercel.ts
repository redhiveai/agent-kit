import { type CoreTool, tool } from "ai";
import type { IAgent } from "../types/agent";
import type { Action } from "../types/action";
import { executeAction } from "../utils/executor";

export function createVerceTools(
    agentKit: IAgent,
    actions: Action[],
): Record<string, CoreTool> {
    const tools: Record<string, CoreTool> = {};

    if (actions.length > 128) {
        console.warn(
            `Too many actions provided. Only a maximum of 128 actions allowed. You provided ${actions.length}, the last ${actions.length - 128} will be ignored.`,
        );
    }

    for (const [index, action] of actions.slice(0, 127).entries()) {
        tools[index.toString()] = tool({
            id: action.name as `${string}.${string}`,
            description: `
      ${action.description}

      Similes: ${action.similes.map(
                (simile) => `
        ${simile}
      `,
            )}

      Examples: ${action.examples.map(
                (example) => `
        Input: ${JSON.stringify(example[0].input)}
        Output: ${JSON.stringify(example[0].output)}
        Explanation: ${example[0].explanation}
      `,
            )}
      `.slice(0, 1023),
            parameters: action.schema,
            execute: async (params: Record<string, unknown>) =>
                await executeAction(action, agentKit, params),
        });
    }

    return tools;
}
