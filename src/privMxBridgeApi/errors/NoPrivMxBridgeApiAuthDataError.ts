export class NoPrivMxBridgeApiAuthDataError extends Error {
    constructor() {
        super("No PrivMX Bridge API auth data provided");
    }
}
