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

"use strict";

export class FillStyle2D {
    constructor(color) {
        this.color = color;
    }

    static fromJSON(json) {
        return new FillStyle2D(json.color);
    }
}

export class StrokeStyle2D {
    constructor(color, line_length, line_gab) {
        this.color = color;
        this.line_length = line_length;
        this.line_gab = line_gab;
    }

    static fromJSON(json) {
        return new StrokeStyle2D(json.color, json.line_length, json.line_gab);
    }
}

export class FontStyle2D {
    constructor(is_bold, is_italic, is_underline) {
        this.is_bold = is_bold;
        this.is_italic = is_italic;
        this.is_underline = is_underline;
    }
    
    getFontStyle() {
        let style = "";
        if (this.is_bold) {
            style += (style.length > 0 ? " " : "") + "bold";
        }
        if (this.is_italic) {
            style += (style.length > 0 ? " " : "") + "italic";
        }
        return style;
    }

    getTextDecoration() {
        let decoration = "";
        if (this.is_underline) {
            decoration += (decoration.length > 0 ? " " : "") + "underline";
        }
        return decoration;
    }

    static fromJSON(json) {
        return new FontStyle2D(json.is_bold, json.is_italic, json.is_underline);
    }
}

export class FontStrokeStyle2D {
    constructor(outline_color) {
        this.outline_color = outline_color;
    }
    
    getStrokeStyle() {
        return this.outline_color;
    }

    static fromJSON(json) {
        return new FontStrokeStyle2D(json.outline_color);
    }
}

export class FontFillStyle2D {
    constructor(fill_color) {
        this.fill_color = fill_color;
    }
    
    getFillStyle() {
        return this.fill_color;
    }

    static fromJSON(json) {
        return new FontFillStyle2D(json.fill_color);
    }
}

export class Resizable2D {
    constructor(width, height, left, right, top, bottom) {
        this.width = width;
        this.height = height;
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
    }

    static fromJSON(json) {
        return new Resizable2D(json.width, json.height, json.left, json.right, json.top, json.bottom);
    }
}