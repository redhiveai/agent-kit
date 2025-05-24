import { TokenInfo } from "../types/tokenInfo";

export const ETHToken = {
    address: "0x0000000000000000000000000000000000000000",
    chainId: 1,
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
};

export async function fetchTokensList(chainId: number) {
    const tokens = (await fetch(`https://tokens.uniswap.org`).then((res) =>
        res.json()
    )) as {
        tokens: Array<TokenInfo>;
    };

    const finalTokens = tokens.tokens;
    finalTokens.push(ETHToken);

    return finalTokens.filter(
        (t) =>
            t.chainId === chainId &&
            t.address !== "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
    );
}

export function getResolvedTokenAddress({
    token,
    chainId,
    tokens,
}: {
    token: string;
    chainId: number;
    tokens: TokenInfo[];
}) {
    const tokenInfo = tokens.find(
        (t) =>
            t.chainId === chainId &&
            (t.address.toLowerCase() === token.toLowerCase() ||
                t.name.toLowerCase() === token.toLowerCase() ||
                t.symbol.toLowerCase() == token.toLowerCase() ||
                t.symbol.toLowerCase() === token.toLowerCase())
    );
    return tokenInfo?.address;
}