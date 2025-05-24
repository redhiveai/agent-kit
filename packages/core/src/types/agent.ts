import { ethers } from "ethers";
import { Config } from "./config"
import { Action } from "./action";
import { Plugin } from "./plugin";

export type IAgent = {
    privider: ethers.AbstractProvider
    wallet: ethers.Wallet
    config: Config
}

type PluginMethods<T> = T extends Plugin ? T["methods"] : Record<string, never>;

export class AgentKit<TPlugins = Record<string, never>> implements IAgent {
    public privider: ethers.AbstractProvider
    public config: Config
    public wallet: ethers.Wallet

    private plugins: Map<string, Plugin> = new Map();
    public methods: TPlugins = {} as TPlugins;
    public actions: Action[] = [];

    constructor(wallet: ethers.Wallet, config: Config) {
        this.privider = ethers.getDefaultProvider(config.rpcURL)
        this.wallet = wallet.connect(this.privider)
        this.config = config
    }

    use<P extends Plugin>(
        plugin: P,
    ): AgentKit<TPlugins & PluginMethods<P>> {
        if (this.plugins.has(plugin.name)) {
            return this as AgentKit<TPlugins & PluginMethods<P>>;
        }
        plugin.initialize(this as AgentKit);

        for (const [methodName, method] of Object.entries(plugin.methods)) {
            if ((this.methods as Record<string, unknown>)[methodName]) {
                throw new Error(`Method ${methodName} already exists in methods`);
            }
            (this.methods as Record<string, unknown>)[methodName] =
                method.bind(plugin);
        }

        for (const action of plugin.actions) {
            this.actions.push(action);
        }

        this.plugins.set(plugin.name, plugin);
        return this as AgentKit<TPlugins & PluginMethods<P>>;
    }
}

const kit = new AgentKit(
    new ethers.Wallet("0x..."),
    {
        rpcURL: "https://rpc.ankr.com/eth",
        chainId: 1,
        quicknodeEndpoint: "https:/your-quicknode-endpoint",
    }
)
