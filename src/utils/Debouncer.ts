export class Debouncer {
    protected timeout: number | null = null;
    protected nextCallId = 1;

    constructor(
        protected msec: number,
        protected action: (callId: number) => void,
    ) {}

    schedule(): void {
        if (this.timeout !== null) {
            window.clearTimeout(this.timeout);
        }
        this.timeout = window.setTimeout(() => {
            this.timeout = null;
            this.action(this.nextCallId++);
        }, this.msec);
    }

    runSync(): void {
        if (this.timeout !== null) {
            window.clearTimeout(this.timeout);
        }
        this.action(this.nextCallId++);
    }

    isScheduled(): boolean {
        return this.timeout !== null;
    }

    getLastCallId(): number | null {
        return this.nextCallId === 1 ? null : this.nextCallId - 1;
    }
}
