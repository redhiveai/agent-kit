import { Core } from "@quicknode/sdk";
import { Action } from "../types/action";
import { z } from "zod";

export const resolveENS: Action = {
    name: "RESOLVE_ENS",
    similes: [
        "resolve ens",
        "get ens address",
        "ens address",
        "ens",
        "resolve ens name",
        "get ens name",
        "ens name",
        "resolve ens domain",
    ],
    schema: z.object({
        name: z.string().describe("The ENS name to resolve, e.g. 'vitalik.eth'"),
    }),
    description: "Resolve an ENS name to an Ethereum address.",
    examples: [
        [
            {
                input: {
                    name: "vitalik.eth",
                },
                output: {
                    status: "success",
                    address: "0x5A69bE6d8c1f2e3F4a7B9cD3b8C1f2e3F4a7B9cD3",
                    name: "vitalik.eth",
                },
                explanation: "Resolved 'vitalik.eth' to its Ethereum address.",
            },
        ],
    ],
    handler: async (agent, input) => {
        const quicknode = new Core({
            endpointUrl: agent.config.quicknodeEndpoint,
            config: { addOns: { nftTokenV2: true } },
        });
        const result = await quicknode.client.getEnsAddress({
            name: input.name,
        });
        return {
            status: "success",
            address: result,
            name: input.name,
        };
    }
}