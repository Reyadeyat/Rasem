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

export class Triangle extends Shape {
    /*
    x;
    y;
    width;
    height;*/
    constructor(id, stroke_style, fill_style, clip_x, clip_y, pointA, pointB, pointC) {
        super(id, stroke_style, fill_style, clip_x, clip_y, true, true,
            {pointA: pointA, pointB: pointB, pointC: pointC, 
                center: new Point((pointA.x + pointB.x + pointC.x) / 3, (pointA.y + pointB.y + pointC.y) / 3)
            });
    }

    generatePathPoints() {
        this.shape_path_points = [];
        this.shape_path_edges = [];
        
        this.shape_path_points[0] = this.pointA;
        this.shape_path_points[1] = this.pointB;
        this.shape_path_points[2] = this.pointC;
        
        this.shape_path_edges = Edge.doEdges(this.shape_path_points, Edge.line, true);

        this.area = this.calcTriangleArea(this.pointA, this.pointB, this.pointC);
    }

    isPointInside(point) {
        let areaA = this.calcTriangleArea(point, this.pointB, this.pointC);
        let areaB = this.calcTriangleArea(point, this.pointA, this.pointC);
        let areaC = this.calcTriangleArea(point, this.pointA, this.pointB);

        if (Math.round(this.area * 100) / 100 == Math.round((areaA + areaB + areaC) * 100) / 100) {
            return true;
        }

        return false;
    }

    transformPoints(oldPoint, newPoint) {
        this.pointA.x = this.pointA.x + newPoint.x - oldPoint.x;
        this.pointA.y = this.pointA.y + newPoint.y - oldPoint.y;
        this.pointB.x = this.pointB.x + newPoint.x - oldPoint.x;
        this.pointB.y = this.pointB.y + newPoint.y - oldPoint.y;
        this.pointC.x = this.pointC.x + newPoint.x - oldPoint.x;
        this.pointC.y = this.pointC.y + newPoint.y - oldPoint.y;
        this.generatePathPoints();
    }

    draw(context) {
        super.draw(context);
        if (this.debug == true) {
            let radius_a = this.shape_path_points_radius[0];
            let radius_b = this.shape_path_points_radius[1];
            let radius_c = this.shape_path_points_radius[2];
            context.strokeStyle = "white";
            context.beginPath();
            context.arc(this.center.x, this.center.y, radius_a, 0, 2 * Math.PI);
            context.stroke();
            context.beginPath();
            context.arc(this.center.x, this.center.y, radius_b, 0, 2 * Math.PI);
            context.stroke();
            context.beginPath();
            context.arc(this.center.x, this.center.y, radius_c, 0, 2 * Math.PI);
            context.stroke(); 
        }
    }

    scalePoints(oldPoint, newPoint) {
    }

    rotatePoints(oldPoint, newPoint) {
        let angle = this.getRotationAngleAroundCenter(oldPoint, newPoint);
        Log.info("angle = " + angle + " NP(" + newPoint.x + ", " + newPoint.y + ") OP(" + oldPoint.x + ", " + oldPoint.y + ") CP(" + this.center.x + ", " + this.center.y + ")" );

        this.shape_path_points = [];
        this.shape_path_edges = [];

        let angle_a = this.shape_path_points_angles[0];
        let angle_b = this.shape_path_points_angles[1];
        let angle_c = this.shape_path_points_angles[2];

        let radius_a = this.shape_path_points_radius[0];
        let radius_b = this.shape_path_points_radius[1];
        let radius_c = this.shape_path_points_radius[2];
        
        this.rad = new Radian();
        this.pointA.x = this.center.x + (radius_a * Math.cos(this.rad.radians[angle + angle_a >= 360 ? (angle + angle_a) % 360 : (angle + angle_a)]));
        this.pointA.y = this.center.y - (radius_a * Math.sin(this.rad.radians[angle + angle_a >= 360 ? (angle + angle_a) % 360 : (angle + angle_a)]));
        this.pointB.x = this.center.x + (radius_b * Math.cos(this.rad.radians[angle + angle_b >= 360 ? (angle + angle_b) % 360 : (angle + angle_b)]));
        this.pointB.y = this.center.y - (radius_b * Math.sin(this.rad.radians[angle + angle_b >= 360 ? (angle + angle_b) % 360 : (angle + angle_b)]));
        this.pointC.x = this.center.x + (radius_c * Math.cos(this.rad.radians[angle + angle_c >= 360 ? (angle + angle_c) % 360 : (angle + angle_c)]));
        this.pointC.y = this.center.y - (radius_c * Math.sin(this.rad.radians[angle + angle_c >= 360 ? (angle + angle_c) % 360 : (angle + angle_c)]));
        
        this.rotation_angle = angle;
        this.area = this.calcTriangleArea(this.pointA, this.pointB, this.pointC);

        this.shape_path_points = [this.pointA, this.pointB, this.pointC];
        this.shape_path_edges = Edge.doEdges(this.shape_path_points, Edge.line, true);
    }

    canClip(oldPoint, newPoint) {
        let xv = newPoint.x - oldPoint.x;
        let yv = newPoint.y - oldPoint.y;
        let min_point = new Point(Math.min(this.pointA.x + xv, this.pointB.x + xv, this.pointC.x + xv), Math.min(this.pointA.y + yv, this.pointB.y + yv, this.pointC.y + yv));
        let max_point = new Point(Math.max(this.pointA.x + xv, this.pointB.x + xv, this.pointC.x + xv), Math.max(this.pointA.y + yv, this.pointB.y + yv, this.pointC.y + yv));

        return this.clipController(min_point, max_point, newPoint);
    }
}
