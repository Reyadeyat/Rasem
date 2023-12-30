/*
 * Copyright (C) 2023 Reyadeyat
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

import { Log } from './log.js'
import { Paint } from './paint.js';
import { Line } from './line.js';
import { Scene } from './scene.js';
import { Shape } from './shape.js';
import { Point } from './point.js';
import { Rectangle } from './rectangle.js';
import { Circle } from './circle.js';
import { Triangle } from './triangle.js';
import { Ellipse } from './ellipse.js';

export class Rasem extends Paint {

    constructor(rasem_json) {
        super(rasem_json.log_level);
        
        var posX = rasem_json.posX;//50;
        var TWO_PI = Math.PI * 2;

        //var canvas_width = rasem_json.canvas_width//400;
        //var canvas_height = rasem_json.canvas_height;//400;

        this.scene = new Scene(rasem_json.canvas_container_id, rasem_json.canvas_fore_color, rasem_json.canvas_back_color, rasem_json.canvas_width, rasem_json.canvas_height);
        let shap00 = new Line(0, {color: "green", line_length: 8, line_gab: 4}, {color: "yellow"}, 400, 400, new Point(200, 200), new Point(217, 305));
        let shap01 = new Rectangle(1, {color: "white", line_length: 8, line_gab: 4}, {color: "red"}, 400, 400, 20, 20, 50, 50);
        let shap02 = new Rectangle(2, {color: "red", line_length: 8, line_gab: 4}, {color: "white"}, 400, 400, 90, 20, 50, 50);
        let shap03 = new Rectangle(3, {color: "orange", line_length: 8, line_gab: 4}, {color: "blue"}, 400, 400, 100, 20, 50, 30);
        let shap04 = new Circle(4, {color: "yellow", line_length: 8, line_gab: 4}, {color: "green"}, 400, 400, 255, 45, 25);
        let shap05 = new Triangle(5, {color: "red", line_length: 8, line_gab: 4}, {color: "grey"}, 400, 400, new Point(300, 70), new Point(320, 20), new Point(360, 90));
        //let shap06 = new Ellipse(6, "white", "yellow", 400, 400, 100, 115, 50, 25);
        //let shap07 = new Ellipse(7, "green", "orange", 400, 400, 100, 230, 25, 50);

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

    getRassamContainer() {
        return this.scene.canvas_container_element;
    }

    getRassamCanvas() {
        return this.scene.front_canvas;
    }

    getRassamFrontCanvasContext() {
        return this.scene.front_canvas_context;
    }

    getRassamFrontCanvasContextPixels() {
        return this.scene.front_canvas_context_pixels;
    }

    getRassamBackCanvasContext() {
        return this.scene.back_canvas_context;
    }

    getRassamBackCanvasContextPixels() {
        return this.scene.back_canvas_context_pixels;
    }

    /* process.*/

    draw() {
        this.scene.draw();
    }

}
