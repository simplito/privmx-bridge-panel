import type * as types from "./types";

export class ApiCryptoUtils {
    static generateNonce(): string {
        const arr = new Uint8Array(10);
        window.crypto.getRandomValues(arr);
        return Buffer.from(arr).toString("base64");
    }

    static async sha256(data: string): Promise<Buffer> {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        const hashBuffer = await window.crypto.subtle.digest("SHA-256", dataBuffer);
        return Buffer.from(hashBuffer);
    }

    static async hmacSha256(key: types.ApiKeySecret, data: string): Promise<Buffer> {
        const keyBuffer = Buffer.from(key);
        const dataBuffer = Buffer.from(data);
        const hmacKey = await window.crypto.subtle.importKey("raw", keyBuffer, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
        const signature = await window.crypto.subtle.sign("HMAC", hmacKey, dataBuffer);
        return Buffer.from(signature);
    }

    static async sign(key: types.Ed25519PrivateKey, data: string): Promise<Buffer> {
        const dataBuffer = Buffer.from(data);
        const hmacKey = await this.importKeyFromPem(key);
        const signature = await window.crypto.subtle.sign("ED25519", hmacKey, dataBuffer);
        return Buffer.from(signature);
    }

    private static async importKeyFromPem(pem: string): Promise<CryptoKey> {
        const pemHeader = "-----BEGIN PUBLIC KEY-----";
        const pemFooter = "-----END PUBLIC KEY-----";
        const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length - 1);
        const binaryDerString = window.atob(pemContents);
        const binaryDer = this.str2ab(binaryDerString);
        return await window.crypto.subtle.importKey("spki", binaryDer, { name: "ED25519" }, false, ["sign"]);
    }

    private static str2ab(str: string): ArrayBuffer {
        const buf = new ArrayBuffer(str.length);
        const bufView = new Uint8Array(buf);
        for (let i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }
}
