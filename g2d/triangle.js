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
import { Shape } from './shape.js'
import { Point } from './point.js'
import { Edge, EdgeType } from './edge.js'
import { Vector2D } from '../math/linear_algebra.js'

export class Triangle extends Shape {
    
    constructor(configuration, id, name, rotation_angle, stroke_style, fill_style, a_point, b_point, c_point, text, control_width) {
        super("Triangle", configuration, id, name, rotation_angle, stroke_style, fill_style,
            {a_point: a_point, b_point: b_point, c_point: c_point, 
                center_point: new Point((a_point.x + b_point.x + c_point.x) / 3, (a_point.y + b_point.y + c_point.y) / 3)
            },
            text,
            control_width);
    }

    generatePathPoints() {
        this.shape_path_points = [];
        this.shape_path_edges = [];
        
        this.shape_path_points[0] = this.a_point;
        this.shape_path_points[1] = this.b_point;
        this.shape_path_points[2] = this.c_point;
        
        this.shape_path_edges = Edge.doEdges(this.shape_path_points, EdgeType.line_connector, true);

        this.area = this.calcTriangleArea(this.a_point, this.b_point, this.c_point);
    }

    isPointInside(point) {
        let areaA = this.calcTriangleArea(point, this.b_point, this.c_point);
        let areaB = this.calcTriangleArea(point, this.a_point, this.c_point);
        let areaC = this.calcTriangleArea(point, this.a_point, this.b_point);

        if (Math.round(this.area * 100) / 100 == Math.round((areaA + areaB + areaC) * 100) / 100) {
            return true;
        }

        return false;
    }

    /*Parent Class
    dragPoints(old_point, new_point) {
        let vector = new Vector2D(new_point, old_point);        
        this.a_point.x = this.a_point.x + vector.scale_x;
        this.a_point.y = this.a_point.y + vector.scale_y;
        this.b_point.x = this.b_point.x + vector.scale_x;
        this.b_point.y = this.b_point.y + vector.scale_y;
        this.c_point.x = this.c_point.x + vector.scale_x;
        this.c_point.y = this.c_point.y + vector.scale_y;
        this.center_point = new Point((this.a_point.x + this.b_point.x + this.c_point.x) / 3, (this.a_point.y + this.b_point.y + this.c_point.y) / 3)
        this.generatePath();
    }*/

    transformPoints(old_point, new_point) {
        let vector = new Vector2D(new_point, old_point);        
        this.a_point.x = this.a_point.x + vector.scale_x;
        this.a_point.y = this.a_point.y + vector.scale_y;
        this.b_point.x = this.b_point.x + vector.scale_x;
        this.b_point.y = this.b_point.y + vector.scale_y;
        this.c_point.x = this.c_point.x + vector.scale_x;
        this.c_point.y = this.c_point.y + vector.scale_y;
        this.generatePath();
    }

    preDraw(context) {

    }

    postDraw(context) {
        if (Log.is(Log.TRACE_DATA)) {
            let radius_a = this.shape_path_points_radius[0];
            let radius_b = this.shape_path_points_radius[1];
            let radius_c = this.shape_path_points_radius[2];
            context.strokeStyle = "white";
            context.beginPath();
            context.arc(this.center_point.x, this.center_point.y, radius_a, 0, 2 * Math.PI);
            context.stroke();
            context.beginPath();
            context.arc(this.center_point.x, this.center_point.y, radius_b, 0, 2 * Math.PI);
            context.stroke();
            context.beginPath();
            context.arc(this.center_point.x, this.center_point.y, radius_c, 0, 2 * Math.PI);
            context.stroke();
        }
    }

    scalePoints(old_point, new_point) {
    }

    rotateAngle(rotation_angle) {
        super.rotateAngle(rotation_angle);
        this.shape_path_points = [];
        this.shape_path_edges = [];

        let angle_a = this.shape_path_points_angles[0];
        let angle_b = this.shape_path_points_angles[1];
        let angle_c = this.shape_path_points_angles[2];

        let radius_a = this.shape_path_points_radius[0];
        let radius_b = this.shape_path_points_radius[1];
        let radius_c = this.shape_path_points_radius[2];
        
        this.a_point.x = this.center_point.x + (radius_a * Math.cos(Geometry.radian.radians[angle + angle_a >= 360 ? (angle + angle_a) % 360 : (angle + angle_a)]));
        this.a_point.y = this.center_point.y - (radius_a * Math.sin(Geometry.radian.radians[angle + angle_a >= 360 ? (angle + angle_a) % 360 : (angle + angle_a)]));
        this.b_point.x = this.center_point.x + (radius_b * Math.cos(Geometry.radian.radians[angle + angle_b >= 360 ? (angle + angle_b) % 360 : (angle + angle_b)]));
        this.b_point.y = this.center_point.y - (radius_b * Math.sin(Geometry.radian.radians[angle + angle_b >= 360 ? (angle + angle_b) % 360 : (angle + angle_b)]));
        this.c_point.x = this.center_point.x + (radius_c * Math.cos(Geometry.radian.radians[angle + angle_c >= 360 ? (angle + angle_c) % 360 : (angle + angle_c)]));
        this.c_point.y = this.center_point.y - (radius_c * Math.sin(Geometry.radian.radians[angle + angle_c >= 360 ? (angle + angle_c) % 360 : (angle + angle_c)]));
        
        this.rotation_angle = angle;
        this.area = this.calcTriangleArea(this.a_point, this.b_point, this.c_point);

        this.shape_path_points = [this.a_point, this.b_point, this.c_point];
        this.shape_path_edges = Edge.doEdges(this.shape_path_points, EdgeType.line_connector, true);
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
