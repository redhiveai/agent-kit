import { Core } from "@quicknode/sdk";
import { Action } from "../types/action";
import { z } from "zod";

export const walletNFTs: Action = {
    name: "WALLET_NFTS",
    similes: [
        "wallet nfts",
        "get wallet nfts",
        "check wallet nfts",
        "nfts",
        "get nfts",
        "check nfts",
    ],
    schema: z.object({
        address: z.string(),
    }),
    description: "Get the wallet nfts of a given address",
    examples: [
        [
            {
                input: {
                    address: "0x1234567890abcdef1234567890abcdef12345678",
                },
                output: {
                    status: "success",
                    nfts: [
                        {
                            collectionName: "Loopy Donuts",
                            collectionTokenId: "1747",
                            collectionAddress: "0x2106c00ac7da0a3430ae667879139e832307aeaa",
                            name: "Loopy Donut #1747",
                            description: "",
                            imageUrl: "https://quicknode-content.quicknode-ipfs.com/ipfs/QmSNmVFTJv6cG9M8ZRU8T9F4Kz9HHxmV85ssGP5W8ZsTPa/1747.png",
                            chain: "ETH",
                            network: "MAINNET"
                        },
                    ],
                },
                explanation: "Get the wallet nfts of a given address",
            },
        ],
    ],
    handler: async (agent, input) => {
        const quicknode = new Core({
            endpointUrl: agent.config.quicknodeEndpoint,
            config: { addOns: { nftTokenV2: true } },
        });
        const nfts = await quicknode.client.qn_fetchNFTs({
            wallet: input.address,
            perPage: 1000
        });
        return {
            status: "success",
            nfts: nfts.assets.map((nft) => ({
                collectionName: nft.collectionName,
                collectionTokenId: nft.collectionTokenId,
                collectionAddress: nft.collectionAddress,
                name: nft.name,
                description: nft.description,
                imageUrl: nft.imageUrl,
                chain: nft.chain,
                network: nft.network,
            })),
        }
    }
}