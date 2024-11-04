/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

import { Env } from "./Env";
import { logLevels } from "./logLevels";

export class Logger {
    static log(...messages: any[]): void {
        const logLevel = Env.logLevel;
        if (logLevels.indexOf(logLevel) <= logLevels.indexOf("log")) {
            console.log(...messages);
        }
    }
    static warn(...messages: any[]): void {
        const logLevel = Env.logLevel;
        if (logLevels.indexOf(logLevel) <= logLevels.indexOf("warn")) {
            console.warn(...messages);
        }
    }

    static error(...messages: any[]): void {
        const logLevel = Env.logLevel;
        if (logLevels.indexOf(logLevel) <= logLevels.indexOf("error")) {
            console.error(...messages);
        }
    }

    static logDev(...messages: any[]): void {
        if (Env.isDevEnv) {
            this.log(...messages);
        }
    }

    static warnDev(...messages: any[]): void {
        if (Env.isDevEnv) {
            this.warn(...messages);
        }
    }

    static errorDev(...messages: any[]): void {
        if (Env.isDevEnv) {
            this.error(...messages);
        }
    }
}
