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
import { Geometry } from '../math/geometry.js'
import { Vector2D } from '../math/linear_algebra.js'

export class Rectangle extends Shape {
    
    constructor(configuration, id, name, rotation_angle, stroke_style, fill_style, left_x, top_y, width, height, text, control_width) {
        super("Rectangle", configuration, id, name, rotation_angle, stroke_style, fill_style,
            {center_point: new Point(left_x + (width / 2), top_y + (height / 2)), 
                width: width, height: height,
                half_width: width/2,
                half_height: height/2,
                radius: Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2,
                //radius_x: Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2,
                //radius_y: Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2,
                rotation_angle: 0},
            text,
            control_width);
    }

    generatePathPoints() {
        this.shape_path_points = [];
        this.shape_path_edges = [];

        this.x = this.center_point.x - this.half_width;
        this.y = this.center_point.y - this.half_height;

        this.shape_path_points = [
            //point_x_y
            new Point(this.center_point.x - this.half_width, this.center_point.y - this.half_height),
            //point_xw_y
            new Point(this.center_point.x + this.half_width, this.center_point.y - this.half_height),
            //point_xw_yh
            new Point(this.center_point.x + this.half_width, this.center_point.y + this.half_height),
            //point_x_yh
            new Point(this.center_point.x - this.half_width, this.center_point.y + this.half_height)
        ];
        this.shape_path_edges = Edge.doEdges(this.shape_path_points, EdgeType.line_connector, true);
    }

    isPointInside(point) {
        return Geometry.isPointInsidePolygon(point, this.shape_path_points_rotated);
    }

    transformPoints(old_point, new_point) {
        let vector = new Vector2D(new_point, old_point);
        let scaled_point_top_left = vector.scale_point(this.shape_clip_bound_rect.left_top_point);
        let scaled_point_bottom_right = vector.scale_point(this.shape_clip_bound_rect.right_bottom_point);
        Log.trace("Shape::transformPoints()::", "shape_type, id, vector, scaled_point_top_left, scaled_point_bottom_right", this.shape_type, this.id, vector, scaled_point_top_left, scaled_point_bottom_right);

        //vector show direction
        //get nearst shape_pint
        //get shape point edges
        //transform the point to the new point
        //regenerate the shape

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

        /*this.shape_path_points_old = this.shape_path_points;
        this.shape_path_points = [];
        this.shape_path_edges = [];

        for (let i = 0; i < this.shape_path_points_old.length; i++) {
            let t_angle = this.shape_path_points_angles[i];
            let t_radius = this.shape_path_points_radius[i];
            let point = new Point(
                this.center_point.x + (t_radius * Math.cos(Geometry.radian.radians[rotation_angle + t_angle >= 360 ? (rotation_angle + t_angle) % 360 : (rotation_angle + t_angle)])),
                this.center_point.y - (t_radius * Math.sin(Geometry.radian.radians[rotation_angle + t_angle >= 360 ? (rotation_angle + t_angle) % 360 : (angrotation_anglele + t_angle)]))
            );
            this.shape_path_points[i] = point;
        }

        this.shape_path_edges = Edge.doEdges(this.shape_path_points, EdgeType.line_connector, true);*/
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
