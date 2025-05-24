import { tool } from "@langchain/core/tools";
import { IAgent } from "../types/agent";
import { Action } from "../types/action";
import { ZodObject, ZodRawShape, ZodType } from "zod";

export function createLangchainTools(
    agentKit: IAgent,
    actions: Action[],
) {
    if (actions.length > 128) {
        console.warn(
            `Too many actions provided. Only a maximum of 128 actions allowed. You provided ${actions.length}, the last ${actions.length - 128} will be ignored.`,
        );
    }

    const tools = actions.slice(0, 127).map((action) => {
        const toolInstance = tool(
            async (inputs) =>
                JSON.stringify(await action.handler(agentKit, inputs)),
            {
                name: action.name,
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
                )}`,
                // convert action.schema from ZodType to ZodObject
                schema: transformToZodObject(action.schema),
            },
        );

        return toolInstance;
    });

    return tools;
}

export function transformToZodObject<T extends ZodRawShape>(
    schema: ZodType<any>,
): ZodObject<T> {
    if (schema instanceof ZodObject) {
        return schema as ZodObject<T>;
    }
    throw new Error(
        `The provided schema is not a ZodObject: ${JSON.stringify(schema)}`,
    );
}