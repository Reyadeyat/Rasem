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
import { Color } from './color.js'
import { Point } from './point.js'
import { Edge } from './edge.js'

export class Shape {
    /*path_points;
    path_edges;
    strokeStyle;
    fillStyle;
    is_closed;*/
    //constructor() {}
    constructor(id, strokeStyle, fillStyle, clip_x, clip_y, is_closed, is_line, extras) {
        this.debug = true;
        //this.debug = false;
        this.id = id;
        this.strokeStyle = strokeStyle;
        this.fillStyle = fillStyle;
        this.clip_x = clip_x;
        this.clip_y = clip_y;
        this.is_closed = is_closed;
        this.is_line = is_line;
        this.extras = extras;
        let keys = Object.keys(this.extras);
        for (let i = 0; i < keys.length; i++) {
            this[keys[i]] = extras[keys[i]];
        }
        this.isRotating = false;
        this.rotation_angle = 0;
        this.initialize()
        this.generatePathPoints();
        if (this.is_line == true) {
            this.generatePathPointsAngles();
        }
    }

    generatePathPointsAngles() {
        this.shape_path_points_angles = [];
        this.shape_path_points_radius = [];

        for (let i = 0; i < this.shape_path_points.length; i++) {
            let point = this.shape_path_points[i];
            let angle = (180/Math.PI) * ( 
                Math.atan2(0, this.center.x + 10)
                -
                Math.atan2(point.y - this.center.y, point.x - this.center.x)
                );
            angle = Math.round((angle < 0 ? (360 + angle + this.rotation_angle) : angle + this.rotation_angle) % 360);
        
            this.shape_path_points_angles[this.shape_path_points_angles.length] = angle;
            this.shape_path_points_radius[this.shape_path_points_radius.length] = this.distance(this.center, point);
        }

        this.shape_path_edges = Edge.doEdges(this.shape_path_points, Edge.line, true);
    }

    setFrontDevice(context, frontContextPixels) {
        this.frontContext = context;
        this.frontContextPixels = frontContextPixels;
    }

    setBound(clip_x, clip_y) {
        this.clip_x = clip_x;
        this.clip_y = clip_y;
    }

    show_controls() {
        //Show Over Every Point
        //Show Over Edges Centers
    }

    distance(point_a, point_b) {
        return Math.sqrt(Math.pow(point_a.x - point_b.x, 2) + Math.pow(point_a.y - point_b.y, 2)); 
    }

    setPixle(point, color) {
        let i = (Math.ceil((point.y * this.frontContextPixels.width)) + point.x) * 4;
        this.frontContextPixels.data[i + 0] = color.red;
        this.frontContextPixels.data[i + 1] = color.green;
        this.frontContextPixels.data[i + 2] = color.blue;
        this.frontContextPixels.data[i + 3] = color.alfa;
        this.frontContext.putImageData(this.frontContextPixels, 0, 0, point.x, point.y, 1, 1);
    }

    draw(context) {
        context.beginPath();
        /*for (let i = 0; i < this.shape_path_edges.length; i++) {
            let edge = this.shape_path_edges[i];
            edge.draw(context);
        }*/
        let point = this.shape_path_points[0];
        point.moveTo(context);
        for (let i = 1; i < this.shape_path_points.length; i++) {
            let point = this.shape_path_points[i];
            point.lineTo(context);
        }
        if (this.is_closed == true) {
            context.closePath();
        }
        /*if (this.strokeStyle != null) {
            context.strokeStyle = this.strokeStyle;
            context.stroke();
        }*/
        if (this.fillStyle != null) {
            context.fillStyle = this.fillStyle;
            context.fill();
        }
    }

    clipController(min_point, max_point, newPoint) {
        let result = true;
        if (min_point.x < 0) {
            newPoint.x = this.center.x - 0 - min_point.x;//*-1
            result = false;
        }
         
         if (max_point.x > this.clip_x) {
            newPoint.x = this.center.x - this.clip_x - max_point.x;//*-1
            result = false;
        }
        
        if (min_point.y < 0) {
            newPoint.y = this.center.y - 0 - min_point.y;//*-1
            result = false;
        }
        
        if (max_point.y > this.clip_y) {
            newPoint.y = this.center.y - this.clip_y - max_point.y;//*-1
            result = false;
        }

        return result;
    }

    calcTriangleArea(point_a, point_b, point_c) { 
        return Math.abs((point_a.x*(point_b.y-point_c.y) + point_b.x*(point_c.y-point_a.y)+ point_c.x*(point_a.y-point_b.y))/2.0);
    }

    calcAngle(pointCenter, pointA, pointB) {
        let angle = (180/Math.PI) * ( 
        Math.atan2(pointA.y - pointCenter.y, pointA.x - pointCenter.x)
        -
        Math.atan2(pointB.y - pointCenter.y, pointB.x - pointCenter.x)
        );
        angle = (angle < 0 ? (360 + angle) : angle) % 360;
        return angle;
    }

    getRotationAngleAroundCenter(pointA, pointB) {
        let angle = (180/Math.PI) * ( 
        Math.atan2(pointA.y - this.center.y, pointA.x - this.center.x)
        -
        Math.atan2(pointB.y - this.center.y, pointB.x - this.center.x)
        );
        angle = Math.round((angle < 0 ? (360 + angle + this.rotation_angle) : angle + this.rotation_angle) % 360);
        return angle;
    }
    initialize() {
        //throw new Error('You have to implement "initialize()" in Shape subclass!');
    }

    generatePathPoints() {
        throw new Error('You have to implement "generatePathPoints" in Shape subclass!');
    }

    isPointInside(point) {
        throw new Error('You have to implement "isPointInside" in Shape subclass!');
    }

    transformPoints(oldPoint, newPoint) {
        throw new Error('You have to implement "transformPoints" method in Shape subclass!');
    }

    scalePoints(oldPoint, newPoint) {
        throw new Error('You have to implement "scalePoints" method in Shape subclass!');
    }

    rotatePoints(oldPoint, newPoint) {
        throw new Error('You have to implement "rotatePoints" method in Shape subclass!');
    }

    canClip(oldPoint, newPoint) {
        throw new Error('You have to implement "canClip" method in Shape subclass!');
    }
}