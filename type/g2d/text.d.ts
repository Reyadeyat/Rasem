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

import { StringI18n } from '@reyadeyat/haseb';
import { FontFillStyle2D, FontStrokeStyle2D, FontStyle2D } from "../data-structure/g2d-data-structure.js";
import { FontInstance } from './font_instance.js';

export class Text2D {
    constructor(text: StringI18n, font_instance: FontInstance, font_size: number, font_style: FontStyle2D, font_stroke_style: FontStrokeStyle2D, font_fill_style: FontFillStyle2D);
    text: StringI18n;
    font_instance: FontInstance;
    font_size: number;
    font_style: FontStyle2D;
    font_stroke_style: FontStrokeStyle2D;
    font_fill_style: FontFillStyle2D;
    draw(context: any, x: any, y: any, rectangle_width: any, rectangle_height: any): void;
    draw_line(context: any, x: any, y: any, rectangle_width: any, rectangle_height: any): void;
    font: any;
    draw_paragraph(context: any, x: any, y: any, rectangle_width: any, rectangle_height: any): void;
    public static fromJSON(json: any): Text2D;
    toJSON(): {
        text: StringI18n,
        font_instance: FontInstance,
        font_size: number,
        font_style: FontStyle2D,
        font_stroke_style: FontStrokeStyle2D,
        font_fill_style: FontFillStyle2D
    }
}
