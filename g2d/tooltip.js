/*
 * Copyright (C) 2023 - 2024 Reyadeyat
 *
 * Reyadeyat/Rasem is licensed under the
 * BSD 3-Clause "New" or "Revised" License
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://reyadeyat.net/LICENSE/RASEM.LICENSE
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Log } from "../util/log";

export class Tooltip {
    constructor(text, hovered_shape, font, text_style, background_style) {
        this.text = text;
        this.hovered_shape = hovered_shape;
        this.font = font;
        this.text_style = text_style;
        this.background_style = background_style;
    }

    draw(context, mouse_point) {
        Log.trace("Tooltip::draw()::point("+mouse_point.x+", "+mouse_point.y+")");
        let saved_font = context.font;
        let saved_style = context.fillStyle;
        let new_text = this.text.text;
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