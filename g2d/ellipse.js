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

export class Ellipse extends Shape {
    
    constructor(id, stroke_style, fill_style, center_x, center_y, radius_x, radius_y, text, control_width) {
        super("Ellipse", id, stroke_style, fill_style,
            {center: new Point(center_x, center_y), radius_x: radius_x, radius_y: radius_y},
            text,
            control_width);
    }

    generatePathPoints() {
        this.shape_path_points = [];
        this.shape_path_edges = [];
        let step = 1;
        
        let angle = 45;
        for (let degrees = 0; degrees <= 360; degrees += step) {
            let point = new Point(this.center.x + (this.radius_x * Math.cos(radians[degrees])), 
                this.center.y - (this.radius_y * Math.sin(radians[degrees])));
                
                let t_angle = (180/Math.PI) * ( 
                    Math.atan2(0, this.center.x + 10)
                    -
                    Math.atan2(point.y - this.center.y, point.x - this.center.x)
                    );
                t_angle = Math.round((angle < 0 ? (360 + angle + this.rotation_angle) : angle + this.rotation_angle) % 360);
                let t_radius = this.distance(this.center, point);
                point = new Point(
                    this.center.x + (t_radius * Math.cos(radians[angle + t_angle >= 360 ? (angle + t_angle) % 360 : (angle + t_angle)])),
                    this.center.y - (t_radius * Math.sin(radians[angle + t_angle >= 360 ? (angle + t_angle) % 360 : (angle + t_angle)]))
                );
            this.shape_path_points[this.shape_path_points.length] = point;
        }
        this.shape_path_edges = Edge.doEdges(this.shape_path_points, Edge.line, true);
    }

    isPointInside(point) {
        let angle = this.getRotationAngleAroundCenter(this.center, point);
        let t_angle = this.shape_path_points_angles[angle];
            let t_radius = this.shape_path_points_radius[angle];
            let t_point = new Point(
                this.center.x + (t_radius * Math.cos(radians[angle + t_angle >= 360 ? (angle + t_angle) % 360 : (angle + t_angle)])),
                this.center.y - (t_radius * Math.sin(radians[angle + t_angle >= 360 ? (angle + t_angle) % 360 : (angle + t_angle)]))
            );
            let distans = this.distance(this.center, t_point);
        if (distans <= t_radius) {
            Log.info("rotation_angle = " + this.rotation_angle + ", distans = " + distans + ", t_radius = " + t_radius);
        }
        let check = (Math.pow(t_point.x - this.center.x, 2) / Math.pow(this.radius_x, 2)) + (Math.pow(t_point.y - this.center.y, 2) / Math.pow(this.radius_y, 2));
        if (check <= 1) {
            Log.info("yes");
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

        for (let i = 0; i < this.shape_path_points_old.length; i++) {
            let t_angle = this.shape_path_points_angles[i];
            let t_radius = this.shape_path_points_radius[i];
            let point = new Point(
                this.center.x + (t_radius * Math.cos(radians[angle + t_angle >= 360 ? (angle + t_angle) % 360 : (angle + t_angle)])),
                this.center.y - (t_radius * Math.sin(radians[angle + t_angle >= 360 ? (angle + t_angle) % 360 : (angle + t_angle)]))
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
