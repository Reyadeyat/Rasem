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

export class Ellipse extends Shape {
    
    constructor(id, rotation_angle, stroke_style, fill_style, center_x, center_y, radius_x, radius_y, text, control_width) {
        super("Ellipse", id, rotation_angle, stroke_style, fill_style,
            {center_point: new Point(center_x, center_y), radius_x: radius_x, radius_y: radius_y},
            text,
            control_width);
    }

    generatePathPoints() {
        this.shape_path_points = [];
        this.shape_path_edges = [];
        let step = 1;
        
        let angle = 45;
        for (let degrees = 0; degrees <= 360; degrees += step) {
            let point = new Point(this.center_point.x + (this.radius_x * Math.cos(radians[degrees])), 
                this.center_point.y - (this.radius_y * Math.sin(radians[degrees])));
                
                let t_angle = (180/Math.PI) * ( 
                    Math.atan2(0, this.center_point.x + 10)
                    -
                    Math.atan2(point.y - this.center_point.y, point.x - this.center_point.x)
                    );
                t_angle = Math.round((angle < 0 ? (360 + angle + this.rotation_angle) : angle + this.rotation_angle) % 360);
                let t_radius = this.distance(this.center_point, point);
                point = new Point(
                    this.center_point.x + (t_radius * Math.cos(radians[angle + t_angle >= 360 ? (angle + t_angle) % 360 : (angle + t_angle)])),
                    this.center_point.y - (t_radius * Math.sin(radians[angle + t_angle >= 360 ? (angle + t_angle) % 360 : (angle + t_angle)]))
                );
            this.shape_path_points[this.shape_path_points.length] = point;
        }
        this.shape_path_edges = Edge.doEdges(this.shape_path_points, EdgeType.line_connector, true);
    }

    isPointInside(point) {
        let angle = this.getRotationAngleAroundCenter(this.center_point, point);
        let t_angle = this.shape_path_points_angles[angle];
            let t_radius = this.shape_path_points_radius[angle];
            let t_point = new Point(
                this.center_point.x + (t_radius * Math.cos(radians[angle + t_angle >= 360 ? (angle + t_angle) % 360 : (angle + t_angle)])),
                this.center_point.y - (t_radius * Math.sin(radians[angle + t_angle >= 360 ? (angle + t_angle) % 360 : (angle + t_angle)]))
            );
            let distans = this.distance(this.center_point, t_point);
        if (distans <= t_radius) {
            Log.trace_data("rotation_angle = " + this.rotation_angle + ", distans = " + distans + ", t_radius = " + t_radius);
        }
        let is_inside_ellipse = (Math.pow(t_point.x - this.center_point.x, 2) / Math.pow(this.radius_x, 2)) + (Math.pow(t_point.y - this.center_point.y, 2) / Math.pow(this.radius_y, 2));
        if (is_inside_ellipse <= 1) {
            Log.trace_logic("Point is inside Ellipse");
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
        
        let angle = this.getRotationAngleAroundCenter(old_point, new_point);
        Log.trace_data("angle = " + angle + " NP(" + new_point.x + ", " + new_point.y + ") OP(" + old_point.x + ", " + old_point.y + ") CP(" + this.center_point.x + ", " + this.center_point.y + ")" );

        this.shape_path_points_old = this.shape_path_points;
        this.shape_path_points = [];
        this.shape_path_edges = [];

        for (let i = 0; i < this.shape_path_points_old.length; i++) {
            let t_angle = this.shape_path_points_angles[i];
            let t_radius = this.shape_path_points_radius[i];
            let point = new Point(
                this.center_point.x + (t_radius * Math.cos(radians[angle + t_angle >= 360 ? (angle + t_angle) % 360 : (angle + t_angle)])),
                this.center_point.y - (t_radius * Math.sin(radians[angle + t_angle >= 360 ? (angle + t_angle) % 360 : (angle + t_angle)]))
            );
            this.shape_path_points[i] = point;
        }
        
        this.rotation_angle = angle;

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
