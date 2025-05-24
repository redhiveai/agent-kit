import type { IAgent } from "../types/agent";
import type { Action } from "../types/action";

export async function executeAction(
    action: Action,
    agent: IAgent,
    input: Record<string, any>,
): Promise<Record<string, any>> {
    try {
        const validatedInput = action.schema.parse(input);

        const result = await action.handler(agent, validatedInput);

        return {
            status: "success",
            ...result,
        };
    } catch (error: any) {
        if (error.errors) {
            return {
                status: "error",
                message: "Validation error",
                details: error.errors,
                code: "VALIDATION_ERROR",
            };
        }

        return {
            status: "error",
            message: error.message,
            code: error.code || "EXECUTION_ERROR",
        };
    }
}
