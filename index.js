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

"use strict";

import { Log } from './util/log.js'
import { Paint } from './ui2d/paint.js';
import { Line } from './g2d/line.js';
import { Scene } from './ui2d/scene.js';
import { Shape } from './g2d/shape.js';
import { Point } from './g2d/point.js';
import { Rectangle } from './g2d/rectangle.js';
import { Circle } from './g2d/circle.js';
import { Triangle } from './g2d/triangle.js';
import { Ellipse } from './g2d/ellipse.js';
import { Text } from './g2d/text.js';
import { UI_Toolbar } from './ui/toolbar.js';

export class Rasem extends Paint {

    constructor(loaded_json_file) {
        super(loaded_json_file.log_level);
        this.loaded_json_file = loaded_json_file;

        var posX = loaded_json_file.posX;//50;
        var TWO_PI = Math.PI * 2;

        this.container_id = loaded_json_file.container_id;
        this.container_element = document.getElementById(this.container_id);
        this.ui_toolbar = new UI_Toolbar(this.container_element, this.handle_button_click.bind(this), this.handle_select_change.bind(this));

        let rasem_container_css =`
        .rasem_container_css {
            display: block;
            height: calc(100% - 95px);
            overflow: auto;
        }
        `;

        /*Container id style must be 
        display: block;
        height: 100%;
        */
        /*
        display: flex;
        flex-wrap: nowrap;
        flex-direction: column;
        align-items: flex-start;
        */
        var style = document.createElement('style');
        style.innerHTML = rasem_container_css;
        document.head.appendChild(style);

        // Insert the HTML block
        this.scene_container = document.createElement('div');
        this.scene_container.id = this.container_id + '_scene_'+Math.random();
        this.scene_container.innerHTML = ``;
        this.scene_container.classList.add("rasem_container_css");
        this.container_element.appendChild(this.scene_container);

        this.scene = new Scene(this.scene_container.id, loaded_json_file.canvas_fore_color, loaded_json_file.canvas_back_color, loaded_json_file.canvas_width, loaded_json_file.canvas_height);
        let shap00 = new Line(0, { color: "green", line_length: 8, line_gab: 4 }, { color: "yellow" }, new Point(200, 200), new Point(217, 305), null, loaded_json_file.control_width);
        let text = new Text("user_id", "Arial", 12, "bold italic underline", "green");
        let shap01 = new Rectangle(1, { color: "white", line_length: 8, line_gab: 4 }, { color: "blue" }, 20, 20, 50, 50, text, loaded_json_file.control_width);
        text = new Text("user_name", "Arial", 12, "bold italic underline", "green");
        let shap02 = new Rectangle(2, { color: "red", line_length: 8, line_gab: 4 }, { color: "white" }, 90, 20, 50, 50, text, loaded_json_file.control_width);
        text = new Text("user_location", "Arial", 12, "bold italic underline", "green");
        let shap03 = new Rectangle(3, { color: "orange", line_length: 8, line_gab: 4 }, { color: "blue" }, 100, 20, 50, 30, text, loaded_json_file.control_width);
        text = new Text("user_email", "Arial", 12, "bold italic underline", "green");
        let shap04 = new Circle(4, { color: "yellow", line_length: 8, line_gab: 4 }, { color: "green" }, 255, 45, 25, text, loaded_json_file.control_width);
        text = new Text("user_mobile", "Arial", 12, "bold italic underline", "green");
        let shap05 = new Triangle(5, { color: "red", line_length: 8, line_gab: 4 }, { color: "grey" }, new Point(300, 70), new Point(320, 20), new Point(360, 90), text, loaded_json_file.control_width);
        //let shap06 = new Ellipse(6, "white", "yellow", 100, 115, 50, 25);
        //let shap07 = new Ellipse(7, "green", "orange", 100, 230, 25, 50);

        this.scene.setOnRasemChangeCallBack(this.loaded_json_file.on_rasem_change_call_back);
        this.scene.clean(this.scene.front_canvas_context);
        this.scene.addShape(shap00);
        this.scene.addShape(shap01);
        this.scene.addShape(shap02);
        this.scene.addShape(shap03);
        this.scene.addShape(shap04);
        this.scene.addShape(shap05);
        //this.scene.addShape(shap06);
        //this.scene.addShape(shap07);
    }

    getRasemContainer() {
        return this.scene.container_element;
    }

    getRasemCanvas() {
        return this.scene.front_canvas;
    }

    getRasemFrontCanvasContext() {
        return this.scene.front_canvas_context;
    }

    getRasemFrontCanvasContextPixels() {
        return this.scene.front_canvas_context_pixels;
    }

    getRasemBackCanvasContext() {
        return this.scene.back_canvas_context;
    }

    getRasemBackCanvasContextPixels() {
        return this.scene.back_canvas_context_pixels;
    }

    /* process.*/

    draw() {
        this.scene.draw();
    }

    handle_button_click(event, clicked_button) {
        console.log("clicked_button => " + clicked_button);
        if (clicked_button == "select_image") {
            this.handleImageFile(this.loaded_image_callback.bind(this));
        } else if (clicked_button == "select_font") {
            this.handleFontFile(this.loaded_font_callback.bind(this));
        }
    }

    handle_select_change(event, clicked_select) {
        console.log("selection => " + clicked_select + " - value => " + event.target.value);
    }

    handleImageFile(loaded_image_callback) {
        const fileInput = document.createElement('input');
        fileInput.id = Math.random().toString();
        fileInput.type = 'file';
        fileInput.multiple = true;
        fileInput.accept = 'image/*';
        fileInput.addEventListener('change', (event) => {
            const inputElement = event.target;
            if (inputElement.files == null || inputElement.files.length == 0) {
                console.log('No file selected');
                return;
            }
            const file_list = Array.from(inputElement.files);
            file_list.forEach(file => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const font_data = event.target.result; 
                    loaded_image_callback(file, font_data);
                };
                reader.onerror = (event) => {
                    loaded_image_callback(false, event.target?.error);
                };
                reader.readAsDataURL(file);
            });
        });
        fileInput.click();
    }

    loaded_image_callback(file, image_data) {
        const image_name = file.name.substring(0, file.name.lastIndexOf('.'))
        const image_type = file.name.split('.').pop();
        const image = new Image();
        image.src = image_data;
        this.scene.clipImage(image, image_name, image_type);
    }

    handleFontFile(loaded_font_callback) {
        const fileInput = document.createElement('input');
        fileInput.id = Math.random().toString();
        fileInput.type = 'file';
        fileInput.multiple = true;
        fileInput.accept = 'font/*';
        fileInput.addEventListener('change', (event) => {
            const inputElement = event.target;
            if (inputElement.files == null || inputElement.files.length == 0) {
                console.log('No file selected');
                return;
            }
            const file_list = Array.from(inputElement.files);
            file_list.forEach(file => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const font_data = event.target.result; 
                    loaded_font_callback(file, font_data);
                };
                reader.onerror = (event) => {
                    loaded_font_callback(false, event.target?.error);
                };
                reader.readAsDataURL(file);
            });
        });
        fileInput.click();
    }

    loaded_font_callback(file, font_data) {
        const font_name = file.name.substring(0, file.name.lastIndexOf('.'))
        const font_type = file.name.split('.').pop();
        const cssRule = `@font-face {
            font-family: '${font_name}';
            src: url(${font_data}) format('${font_type}');
            font-weight: normal;
            font-style: normal;
        }`;
        const styleElement = document.createElement('style');
        styleElement.textContent = cssRule;
        document.head.appendChild(styleElement);

        document.fonts.ready.then((fontFaceSet) => {
            const fontFaces = [...fontFaceSet];
            console.log(fontFaces);
            console.log(fontFaces.map((f) => f.status));
            console.log('Font loaded successfully');
            const font_list_select_lement = document.getElementById(this.canvas_container_id+'_toolbar_font_list');
            while (font_list_select_lement.options.length > 0) {
                font_list_select_lement.remove(0);
            }
            fontFaceSet.forEach((font) => {
                const option = document.createElement('option');
                option.text = font.family.trim();
                option.value = font.family.trim();
                font_list_select_lement.add(option);
            });
        }).catch((err) => {
            console.log("Font '"+font_name+"' failed to load: ' + err.message");
        });
    }

}
