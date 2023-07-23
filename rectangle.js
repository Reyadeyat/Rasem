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

export class Rectangle extends Shape {
    /*
    x;
    y;
    width;
    height;*/
    constructor(id, stroke_style, fill_style, clip_x, clip_y, left_x, top_y, width, height) {
        super(id, stroke_style, fill_style, clip_x, clip_y, true, true,
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

    transformPoints(oldPoint, newPoint) {
        this.center = new Point(this.center.x + newPoint.x - oldPoint.x, this.center.y + newPoint.y - oldPoint.y);
        this.generatePathPoints();
    }

    draw(context) {
        super.draw(context);
        if (this.debug == true) {
            let radius_a = this.radius;
            context.strokeStyle = "white";
            context.beginPath();
            context.arc(this.center.x, this.center.y, radius_a, 0, 2 * Math.PI);
            context.stroke();
        }
    }

    scalePoints(oldPoint, newPoint) {
    }

    rotatePoints(oldPoint, newPoint) {
        let angle = this.getRotationAngleAroundCenter(oldPoint, newPoint);
        //Log.info("angle = " + angle + " NP(" + newPoint.x + ", " + newPoint.y + ") OP(" + oldPoint.x + ", " + oldPoint.y + ") CP(" + this.center.x + ", " + this.center.y + ")" );

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

    canClip(oldPoint, newPoint) {
        let point_x_y = this.shape_path_points[0];
        let min_point = new Point(point_x_y.x + newPoint.x - oldPoint.x, point_x_y.y + newPoint.y - oldPoint.y);
        let max_point = new Point(min_point.x+this.width, min_point.y+this.height);
        
        return this.clipController(min_point, max_point, newPoint);
    }
}
