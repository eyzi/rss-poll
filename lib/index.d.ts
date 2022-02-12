/// <reference types="node" />
import { EventEmitter } from "events";
import { GUID, PollConfig, Feed } from "./types";
declare enum PollerStatus {
    IDLE = 0,
    CHECKING = 1,
    STOPPED = 2
}
declare class Poller extends EventEmitter {
    config: PollConfig;
    lastGuid: GUID;
    status: PollerStatus;
    interval: any;
    constructor(config: PollConfig);
    handleNewFeed(items: Feed[]): void;
    trimSeen(items: Feed[]): Feed[];
    checkNewFeed(): Promise<void>;
    setStatus(status: PollerStatus): void;
    setLastGuid(guid: string): void;
    tryCheck(): void;
    toggle(value?: boolean): void;
}
export default Poller;
//# sourceMappingURL=index.d.ts.map