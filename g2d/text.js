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

export class Text {
    constructor(text, font_name, font_size, font_style, fill_style) {
        this.text = text;
        this.font_name = font_name;
        this.font_size = font_size;
        this.font_style = font_style;
        this.fill_style = fill_style;
    }

    draw(context, x, y, rectangle_width, rectangle_height) {
        this.draw_line(context, x, y, rectangle_width, rectangle_height);
    }

    draw_line(context, x, y, rectangle_width, rectangle_height) {
        this.font = this.font != null ? this.font : `${this.font_style} ${this.font_size}px ${this.font_name}`;
        let saved_font = context.font;
        context.font = this.font;
        let new_text = this.text;
        let text_metrics = context.measureText(new_text);
        let text_width = text_metrics.width;
        let text_height = text_metrics.actualBoundingBoxAscent + text_metrics.actualBoundingBoxDescent;

        if (text_width > rectangle_width/* || text_height > rectangle_height*/) {
            new_text += "...";
            let count = 1;
            // Text exceeds the rectangle width or height, adjust font size accordingly
            while (text_width > rectangle_width/* || text_height > rectangle_height*/
            && this.text.length - 3 - count > 0) {
                //this.font = `${this.font_style} ${this.font_size - 1}px ${this.font_name}`; // Reduce the font size by 1 pixel
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
        context.fillStyle = this.fill_style;
        context.fillText(new_text, x, y + (rectangle_height / 2 ) + (text_metrics.fontBoundingBoxDescent / 2));
        context.strokeText(new_text, x, y + (rectangle_height / 2 ) + (text_metrics.fontBoundingBoxDescent / 2));
        context.font = saved_font;
    }

    draw_paragraph(context, x, y, rectangle_width, rectangle_height) {
        this.font = this.font != null ? this.font : `${this.font_style} ${this.font_size}px ${this.font_name}`;
        let saved_font = context.font;
        context.font = this.font;
        let text_metrics = context.measureText(this.text);
        let text_width = text_metrics.width;
        let text_height = text_metrics.actualBoundingBoxAscent + text_metrics.actualBoundingBoxDescent;

        /*if (text_width > rectangle_width || text_height > rectangle_height) {
            // Text exceeds the rectangle width or height, adjust font size accordingly
            while (text_width > rectangle_width || text_height > rectangle_height) {
                this.font = `${this.font_style} ${this.font_size - 1}px ${this.font_name}`; // Reduce the font size by 1 pixel
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
        context.fillStyle = this.fill_style;
        context.fillText(this.text, x, y + (rectangle_height / 2 ) + (text_metrics.fontBoundingBoxDescent / 2));
        context.font = saved_font;
    }
}