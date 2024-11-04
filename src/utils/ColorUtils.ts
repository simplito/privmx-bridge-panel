import colorConvert from "color-convert";

export interface HslColor {
    h: number;
    s: number;
    l: number;
}

export interface RgbColor {
    r: number;
    g: number;
    b: number;
}

const colorsMap = {
    default: "primary",
    error: "red",
    warning: "orange.7",
    success: "green.7",
    info: "blue.7",
    primary: "primary",
};

export type ColorName = keyof typeof colorsMap;

export class ColorUtils {
    static hexToRgb(hex: string): RgbColor {
        const res = colorConvert.hex.rgb(hex);
        return {
            r: res[0],
            g: res[1],
            b: res[2],
        };
    }

    static rgbToHex(rgb: RgbColor): string {
        return `#${colorConvert.rgb.hex([rgb.r, rgb.g, rgb.b])}`;
    }

    static rgbToHsl(rgb: RgbColor): HslColor {
        const res = colorConvert.rgb.hsl([rgb.r, rgb.g, rgb.b]);
        return {
            h: res[0],
            s: res[1],
            l: res[2],
        };
    }

    static hslToRgb(hsl: HslColor): RgbColor {
        const res = colorConvert.hsl.rgb([hsl.h, hsl.s, hsl.l]);
        return {
            r: res[0],
            g: res[1],
            b: res[2],
        };
    }

    static lightenHsl(hsl: HslColor, amount: number): HslColor {
        return {
            h: hsl.h,
            s: hsl.s,
            l: Math.min(100, Math.max(0, hsl.l + amount)),
        };
    }

    static convertColorName(color: ColorName): string {
        return colorsMap[color];
    }
}
