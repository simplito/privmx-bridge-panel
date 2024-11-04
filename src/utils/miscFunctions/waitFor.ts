import { wait } from "./wait";

export interface WaitForOptions {
    interval: number;
    maxAttempts: number;
}

export async function waitFor(conditionCallback: () => boolean | Promise<boolean>, options: WaitForOptions): Promise<boolean> {
    let attemptId = 0;
    while (attemptId < options.maxAttempts) {
        if (await conditionCallback()) {
            return true;
        }
        await wait(options.interval);
        attemptId++;
    }
    return false;
}
