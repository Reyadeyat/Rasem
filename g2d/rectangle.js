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

import { Log } from '../util/log.js'
import { Shape } from './shape.js'
import { Point } from './point.js'
import { Edge } from './edge.js'
import { Radian } from '../math/geometry.js'
import { ShapeControl, ShapeControlGroup } from './control.js'
import { Vector2D } from '../math/linear_algebra.js'

export class Rectangle extends Shape {
    
    constructor(id, stroke_style, fill_style, left_x, top_y, width, height, text, control_width) {
        super("Rectangle", id, stroke_style, fill_style,
            {center: new Point(left_x + (width / 2), top_y + (height / 2)), 
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

        this.x = this.center.x - this.half_width;
        this.y = this.center.y - this.half_height;

        this.shape_path_points = [
            //point_x_y
            new Point(this.center.x - this.half_width, this.center.y - this.half_height),
            //point_xw_y
            new Point(this.center.x + this.half_width, this.center.y - this.half_height),
            //point_xw_yh
            new Point(this.center.x + this.half_width, this.center.y + this.half_height),
            //point_x_yh
            new Point(this.center.x - this.half_width, this.center.y + this.half_height)
        ];
        this.shape_path_edges = Edge.doEdges(this.shape_path_points, Edge.line, true);
    }

    isPointInside(point) {
        if (point.x >= (this.center.x - this.half_width)
        && point.x <= (this.center.x + this.half_width)
        && point.y >= (this.center.y - this.half_height)
        && point.y <=  (this.center.y + this.half_height)) {
            return true;
        }
        return false;
    }

    dragPoints(old_point, new_point) {
        this.center = new Point(this.center.x + new_point.x - old_point.x, this.center.y + new_point.y - old_point.y);
        this.generatePath();
    }

    transformPoints(old_point, new_point) {
        this.center = new Point(this.center.x + new_point.x - old_point.x, this.center.y + new_point.y - old_point.y);
        this.generatePath();
    }

    preDraw(context) {

    }

    postDraw(context) {

    }

    scalePoints(old_point, new_point) {
    }

    rotatePoints(old_point, new_point) {
        let angle = this.getRotationAngleAroundCenter(old_point, new_point);
        //Log.info("angle = " + angle + " NP(" + new_point.x + ", " + new_point.y + ") OP(" + old_point.x + ", " + old_point.y + ") CP(" + this.center.x + ", " + this.center.y + ")" );

        this.shape_path_points_old = this.shape_path_points;
        this.shape_path_points = [];
        this.shape_path_edges = [];

		this.rad = new Radian();
        for (let i = 0; i < this.shape_path_points_old.length; i++) {
            let t_angle = this.shape_path_points_angles[i];
            let t_radius = this.shape_path_points_radius[i];
            let point = new Point(
                this.center.x + (t_radius * Math.cos(this.rad.radians[angle + t_angle >= 360 ? (angle + t_angle) % 360 : (angle + t_angle)])),
                this.center.y - (t_radius * Math.sin(this.rad.radians[angle + t_angle >= 360 ? (angle + t_angle) % 360 : (angle + t_angle)]))
            );
            this.shape_path_points[i] = point;
        }
        
        this.rotation_angle = angle;

        this.shape_path_edges = Edge.doEdges(this.shape_path_points, Edge.line, true);
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
