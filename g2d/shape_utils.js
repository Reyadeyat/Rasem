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
import { Line } from './line.js';
import { Circle } from './circle.js';
import { Rectangle } from './rectangle.js';
import { Triangle } from './triangle.js';
import { Text2D } from './text.js';

export class ShapeUtils {

    constructor() {
        Log.trace("ShapeUtils::constructor()::");
    }

    static creatShape(shape_configuration) {
        Log.trace_data("ShapeUtils::creatShape()::", "shape_configuration", shape_configuration);
        let type = shape_configuration.type.toLowerCase();
        let text_configuration = shape_configuration.text;
        let text = text_configuration == null ? null : Text2D.fromJSON(text_configuration);
        if (type === "l" || type === "line") {
            return new Line(configuration, shape_configuration, shape_configuration.id, shape_configuration.name, shape_configuration.rotation_angle, shape_configuration.stroke_style, shape_configuration.fill_style, shape_configuration.start_point, shape_configuration.end_point, text, shape_configuration.control_width);
        } else if (type === "c" || type === "circle") {
            return new Circle(shape_configuration, shape_configuration.id, shape_configuration.name, shape_configuration.rotation_angle, shape_configuration.stroke_style, shape_configuration.fill_style, shape_configuration.center_x, shape_configuration.center_y, shape_configuration.radius, text, shape_configuration.control_width);
        } else if (type === "e" || type === "ellipse") {
        } else if (type === "r" || type === "rect" || type === "rectangle") {
            return new Rectangle(shape_configuration, shape_configuration.id, shape_configuration.name, shape_configuration.rotation_angle, shape_configuration.stroke_style, shape_configuration.fill_style, shape_configuration.left_x, shape_configuration.top_y, shape_configuration.width, shape_configuration.height, text, shape_configuration.control_width);
        } else if (type === "a" || type === "arc") {
        } else if (type === "t" || type === "triangle") {
            return new Triangle(shape_configuration, shape_configuration.id, shape_configuration.name, shape_configuration.rotation_angle, shape_configuration.stroke_style, shape_configuration.fill_style, shape_configuration.a_point, shape_configuration.b_point, shape_configuration.c_point, text, shape_configuration.control_width);
        }
        throw new Error("Shape type is not defined: '"+type+"'");
    }
}
