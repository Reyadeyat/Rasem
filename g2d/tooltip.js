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

import { Log } from '@reyadeyat/haseb'

export class Tooltip {
    constructor(text, hovered_shape, font, text_style, background_style) {
        this.text = text;
        this.hovered_shape = hovered_shape;
        this.font = font;
        this.text_style = text_style;
        this.background_style = background_style;
    }

    draw(language, context, mouse_point) {
        Log.trace("Tooltip::draw()::point("+mouse_point.x+", "+mouse_point.y+")");
        let saved_font = context.font;
        let saved_style = context.fillStyle;
        let new_text = this.text.text[language];
        context.font = this.font;
        context.text_style = this.text_style;
        let text_metrics = context.measureText(new_text);
        let text_width = text_metrics.width;
        let text_height = text_metrics.fontBoundingBoxAscent + text_metrics.fontBoundingBoxDescent;

        // Draw the adjusted text on the canvas
        context.fillStyle = this.background_style;
        context.fillRect(mouse_point.x, mouse_point.y - text_height, text_width, text_height);
        context.fillStyle = this.text_style;
        context.fillText(new_text, mouse_point.x, mouse_point.y - text_height + text_metrics.fontBoundingBoxAscent);
        //context.font = saved_font;
        context.fillStyle = saved_style;
        context.font = saved_font;
        this.visible = true;
    }
}