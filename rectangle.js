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

import { Log } from './log.js'
import { Shape } from './shape.js'
import { Point } from './point.js'
import { Edge } from './edge.js'
import { Radian } from './geometry.js'
import { ShapeControl, ShapeControlGroup } from './control.js'

export class Rectangle extends Shape {
    
    constructor(id, stroke_style, fill_style, clip_x, clip_y, left_x, top_y, width, height) {
        super("Rectangle", id, stroke_style, fill_style, clip_x, clip_y,
            {center: new Point(left_x + (width / 2), top_y + (height / 2)), 
                width: width, height: height,
                half_width: width/2,
                half_height: height/2,
                radius: Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2,
                //radius_x: Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2,
                //radius_y: Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2,
                rotation_angle: 0});
    }

    generatePathPoints() {
        this.shape_path_points = [];
        this.shape_path_edges = [];

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

    isPointInsideResizeControl(point) {
        let control = this.shape_control_group.getControlOnPoint(point);
        return control != null && control.is(ShapeControl.RESIZE);
    }

    isPointInsideRotateControl(point) {
        let control = this.shape_control_group.getControlOnPoint(point);
        return control != null && control.is(ShapeControl.ROTATE);
    }

    transformPoints(old_point, new_point) {
        this.center = new Point(this.center.x + new_point.x - old_point.x, this.center.y + new_point.y - old_point.y);
        this.generatePathPoints();
    }

    draw(context) {
        super.draw(context);
        if (Log.is(Log.TRACE_DATA)) {
            let radius_a = this.radius;
            context.strokeStyle = this.stroke_style.color;
            context.beginPath();
            context.arc(this.center.x, this.center.y, radius_a, 0, 2 * Math.PI);
            context.stroke();
        }
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

    canClip(old_point, new_point) {
        let point_x_y = this.shape_path_points[0];
        let min_point = new Point(point_x_y.x + new_point.x - old_point.x, point_x_y.y + new_point.y - old_point.y);
        let max_point = new Point(min_point.x+this.width, min_point.y+this.height);
        
        return this.clipController(min_point, max_point, new_point);
    }

    activateControls(context) {
        this.shape_control_group = new ShapeControlGroup(this);
        this.shape_path_points.forEach(point => {
            this.shape_control_group.addShapeControl(ShapeControl.RESIZE, point, "grey", "white");
        });
        this.shape_control_group.addShapeControl(ShapeControl.ROTATE, this.center, "yellow", "green");
        this.shape_control_group.drawControls(context);
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
