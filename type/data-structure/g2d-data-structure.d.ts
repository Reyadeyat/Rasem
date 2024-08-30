/*
 * Copyright (C) 2023-2024 Reyadeyat
 * All Rights Reserved.
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * https://reyadeyat.net/LICENSE/REYADEYAT.LICENSE
 * 
 * This License permits the use, modification, and distribution of the code
 * under the terms specified in the License document.
 */

export class FillStyle2D {
    constructor(color: string);
    color: string;
    public static fromJSON(json: any): FillStyle2D;
}

export class StrokeStyle2D {
    constructor(color: string, line_length: number, line_gab: number);
    color: string;
    line_length: number;
    line_gab: number;
    public static fromJSON(json: any): StrokeStyle2D;
}

export class FontStyle2D {
    constructor(is_bold: boolean, is_italic: boolean, is_underline: boolean);
    getFontStyle(): string;
    getTextDecoration(): string;
    public static fromJSON(json: any): FontStyle2D;
}

export class FontStrokeStyle2D {
    constructor(outline_color: string);
    outline_color: string;
    getStrokeStyle(): string;
    public static fromJSON(json: any): FontStrokeStyle2D;
}

export class FontFillStyle2D {
    constructor(fill_color: string);
    fill_color: string;
    getFillStyle(): string;
    public static fromJSON(json: any): FontFillStyle2D;
}

export class Resizable2D {
    constructor(width: boolean, height: boolean, left: boolean, right: boolean, top: boolean, bottom: boolean);
    width: boolean;
    height: boolean;
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
    public static fromJSON(json: any): Resizable2D;
}