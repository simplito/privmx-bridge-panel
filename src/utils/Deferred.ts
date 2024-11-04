type PromiseResolver<T> = (value: T | PromiseLike<T>) => void;
type PromiseRejector = (reason?: unknown) => void;

export enum DeferredState {
    Pending = "pending",
    Rejected = "rejected",
    Resolved = "resolved",
}

export class Deferred<T> {
    protected _promise: Promise<T>;
    protected _state: DeferredState = DeferredState.Pending;
    protected promiseResolver: PromiseResolver<T> | null = null;
    protected promiseRejector: PromiseRejector | null = null;

    get promise(): Promise<T> {
        return this._promise;
    }

    private set promise(promise: Promise<T>) {
        this._promise = promise;
    }

    get state(): DeferredState {
        return this._state;
    }

    private set state(state: DeferredState) {
        this._state = state;
    }

    get isPending(): boolean {
        return this.state === DeferredState.Pending;
    }

    get isFinalized(): boolean {
        return this.state === DeferredState.Resolved || this.state === DeferredState.Rejected;
    }

    get isResolved(): boolean {
        return this.state === DeferredState.Resolved;
    }

    get isRejected(): boolean {
        return this.state === DeferredState.Rejected;
    }

    constructor() {
        this._promise = new Promise<T>((resolve, reject) => {
            this.promiseResolver = resolve;
            this.promiseRejector = reject;
        });
    }

    resolve(value: T): void {
        if (this.promiseResolver && this.isPending) {
            this.state = DeferredState.Resolved;
            this.promiseResolver(value);
        }
    }

    reject(reason?: unknown): void {
        if (this.promiseRejector && this.isPending) {
            this.state = DeferredState.Rejected;
            this.promiseRejector(reason);
        }
    }
}
