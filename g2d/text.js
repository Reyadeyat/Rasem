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

import { StringI18n } from "@reyadeyat/haseb";
import { FontFillStyle2D, FontStrokeStyle2D, FontStyle2D } from "../data-structure/g2d-data-structure.js";

export class Text2D {
    constructor(text, font_instance, font_size, font_style, font_stroke_style, font_fill_style) {
        this.text = text;
        this.font_instance = font_instance;
        this.font_size = font_size;
        this.font_style = font_style;
        this.font_stroke_style = font_stroke_style;
        this.font_fill_style = font_fill_style;
    }

    draw(language, context, x, y, rectangle_width, rectangle_height) {
        this.draw_line(language, context, x, y, rectangle_width, rectangle_height);
    }

    draw_line(language, context, x, y, rectangle_width, rectangle_height) {
        this.font = this.font != null ? this.font : `${this.font_style} ${this.font_size}px ${this.font_instance.font_name}`;
        let saved_font = context.font;
        context.font = this.font;
        let new_text = this.text[language];
        let text_metrics = context.measureText(new_text);
        let text_width = text_metrics.width;
        let text_height = text_metrics.actualBoundingBoxAscent + text_metrics.actualBoundingBoxDescent;

        if (text_width > rectangle_width/* || text_height > rectangle_height*/) {
            new_text += "...";
            let count = 1;
            // Text exceeds the rectangle width or height, adjust font size accordingly
            while (text_width > rectangle_width/* || text_height > rectangle_height*/
            && this.text.length - 3 - count > 0) {
                //this.font = `${this.font_style} ${this.font_size - 1}px ${this.font_instance.font_name}`; // Reduce the font size by 1 pixel
                //context.font = this.font;
                
                // Recalculate the text width and height with the new font size
                new_text = this.text.substring(0, this.text.length - 3 - count) + "...";
                let text_metrics = context.measureText(new_text);
                text_width = text_metrics.width;
                text_height = text_metrics.fontBoundingBoxDescent + text_metrics.fontBoundingBoxAscent
                
                if (text_width === rectangle_width && text_height === rectangle_height) {
                    // If the text size cannot be reduced further, break the loop
                    break;
                }
                count++;
            }
        }

        // Draw the adjusted text on the canvas
        //context.textAlign="right";
        //context.textBaseline="middle";
        context.strokeStyle = this.font_stroke_style.getStrokeStyle();
        context.fillStyle = this.font_fill_style.getFillStyle();
        context.fillText(new_text, x, 0);
        //context.fillText(new_text, x, y + (rectangle_height / 2 ) + (text_metrics.fontBoundingBoxDescent / 2));
        //context.strokeText(new_text, x, y + (rectangle_height / 2 ) + (text_metrics.fontBoundingBoxDescent / 2));
        context.font = saved_font;
    }

    draw_paragraph(context, x, y, rectangle_width, rectangle_height) {
        this.font = this.font != null ? this.font : `${this.font_style} ${this.font_size}px ${this.font_instance.font_name}`;
        let saved_font = context.font;
        context.font = this.font;
        let text_metrics = context.measureText(this.text);
        let text_width = text_metrics.width;
        let text_height = text_metrics.actualBoundingBoxAscent + text_metrics.actualBoundingBoxDescent;

        /*if (text_width > rectangle_width || text_height > rectangle_height) {
            // Text exceeds the rectangle width or height, adjust font size accordingly
            while (text_width > rectangle_width || text_height > rectangle_height) {
                this.font = `${this.font_style} ${this.font_size - 1}px ${this.font_instance.font_name}`; // Reduce the font size by 1 pixel
                context.font = this.font;
                
                // Recalculate the text width and height with the new font size
                let text_metrics = context.measureText(this.text)
                text_width = text_metrics.width;
                text_height = text_metrics.fontBoundingBoxDescent + text_metrics.fontBoundingBoxAscent
                
                if (text_width === rectangle_width && text_height === rectangle_height) {
                    // If the text size cannot be reduced further, break the loop
                    break;
                }
            }
        }*/

        // Draw the adjusted text on the canvas
        context.strokeStyle = this.font_stroke_style.getStrokeStyle();
        context.fillStyle = this.font_fill_style.getFillStyle();
        context.fillText(this.text, x, y + (rectangle_height / 2 ) + (text_metrics.fontBoundingBoxDescent / 2));
        context.font = saved_font;
    }

    static fromJSON(json) {
        return new Text2D(StringI18n.fromJSON(json.text), json.font_instance, json.font_size, FontStyle2D.fromJSON(json.font_style), FontStrokeStyle2D.fromJSON(json.font_stroke_style), FontFillStyle2D.fromJSON(json.font_fill_style));
    }

    toJSON() {
        return {
            text: this.text,
            font_instance: this.font_instance == null ? null : {font_uuid: this.font_instance.font_uuid},
            font_size: this.font_size,
            font_style: this.font_style = font_style,
            font_stroke_style: this.font_stroke_style,
            font_fill_style: this.font_fill_style
        }
    }
}