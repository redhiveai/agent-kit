import { Action } from "./action";
import { IAgent } from "./agent";

export interface Plugin {
    name: string;
    methods: Record<string, any>;
    actions: Action[];
    initialize(agent: IAgent): void;
}
