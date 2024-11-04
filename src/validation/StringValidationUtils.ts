export class StringValidationUtils {
    static isStringBase58(str: string): boolean {
        return StringValidationUtils.isStringX(str, StringValidationUtils.isCharCodeBase58.bind(StringValidationUtils));
    }

    static isStringX(str: string, checker: (charCode: number) => boolean): boolean {
        for (let i = 0; i < str.length; i++) {
            if (!checker(str.charCodeAt(i))) {
                return false;
            }
        }
        return true;
    }

    static isCharCodeBase58(code: number): boolean {
        return StringValidationUtils.isCharCodeLatinOrDigit(code) && code !== 48 && code !== 73 && code !== 79 && code !== 108;
    }

    static isCharCodeLatinOrDigit(code: number): boolean {
        return StringValidationUtils.isCharCodeLatin(code) || StringValidationUtils.isCharCodeDigit(code);
    }

    static isCharCodeDigit(code: number): boolean {
        return code >= 48 && code <= 57;
    }

    static isCharCodeLatin(code: number): boolean {
        return StringValidationUtils.isCharCodeHighLatin(code) || StringValidationUtils.isCharCodeLowLatin(code);
    }

    static isCharCodeHighLatin(code: number): boolean {
        return code >= 65 && code <= 90;
    }

    static isCharCodeLowLatin(code: number): boolean {
        return code >= 97 && code <= 122;
    }
}
