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

import { Shape } from './shape.js'
import { Point } from './point.js'
import { Edge, EdgeType } from './edge.js'

export class Circle extends Shape {
    
    constructor(configuration, id, name, rotation_angle, stroke_style, fill_style, center_x, center_y, radius, text, control_width) {
        super("Circle", configuration, id, name, rotation_angle, stroke_style, fill_style,
            {center_point: new Point(center_x, center_y), radius: radius, diameter: radius},
            text,
            control_width);
    }

    generatePathPoints() {
        this.shape_path_points = [];
        this.shape_path_edges = [];
        let step = 1;
        
        for (let degrees = 0; degrees <= 360; degrees += step) {
            let point = new Point(this.center_point.x + (this.radius * Math.cos(Geometry.radian.radians[degrees])), this.center_point.y - (this.radius * Math.sin(Geometry.radian.radians[degrees])));
            this.shape_path_points[this.shape_path_points.length] = point;
        }
        this.shape_path_edges = Edge.doEdges(this.shape_path_points, EdgeType.line_connector, true);
    }

    isPointInside(point) {
        let distance = Math.sqrt(Math.pow(this.center_point.x - point.x,2) + Math.pow(this.center_point.y - point.y, 2)); 
        if (distance <= this.radius) {
            return true;
        }
        return false;
    }

    transformPoints(old_point, new_point) {
        this.center_point = new Point(this.center_point.x + new_point.x - old_point.x, this.center_point.y + new_point.y - old_point.y);
        this.generatePath();
    }

    preDraw(context) {

    }

    postDraw(context) {

    }

    scalePoints(old_point, new_point) {
    }

    rotateAngle(rotation_angle) {
        super.rotateAngle(rotation_angle);

    }
    
    refreshShape(point) {

    }

    refreshControls(point) {

    }

    OnMouseClickControl(point) {
        //refresh shape
        //refreshControls
    }

    OnMouseDownControl(point) {
        //refresh shape
        //refresh controls
    }

    OnMouseMoveControl(point) {
        //refresh shape
        //refresh controls
    }
}
