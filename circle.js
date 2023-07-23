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

export class Circle extends Shape {
    /*
    x;
    y;
    width;
    height;*/
    constructor(id, stroke_style, fill_style, clip_x, clip_y, center_x, center_y, radius) {
        super(id, stroke_style, fill_style, clip_x, clip_y, true, true,
            {center: new Point(center_x, center_y), radius: radius, diameter: radius});
    }

    generatePathPoints() {
		this.rad = new Radian();
        this.shape_path_points = [];
        this.shape_path_edges = [];
        let step = 1;
        
        for (let degrees = 0; degrees <= 360; degrees += step) {
            let point = new Point(this.center.x + (this.radius * Math.cos(this.rad.radians[degrees])), this.center.y - (this.radius * Math.sin(this.rad.radians[degrees])));
            this.shape_path_points[this.shape_path_points.length] = point;
        }
        this.shape_path_edges = Edge.doEdges(this.shape_path_points, Edge.line, true);
    }

    isPointInside(point) {
        let distance = Math.sqrt(Math.pow(this.center.x - point.x,2) + Math.pow(this.center.y - point.y, 2)); 
        if (distance <= this.radius) {
            return true;
        }
        return false;
    }

    transformPoints(oldPoint, newPoint) {
        this.center = new Point(this.center.x + newPoint.x - oldPoint.x, this.center.y + newPoint.y - oldPoint.y);
        this.generatePathPoints();
    }

    scalePoints(oldPoint, newPoint) {
    }

    rotatePoints(oldPoint, newPoint) {
    }

    canClip(oldPoint, newPoint) {
        let min_point = new Point(this.center.x - this.radius + newPoint.x - oldPoint.x, this.center.y - this.radius + newPoint.y - oldPoint.y);
        let max_point = new Point(min_point.x+this.diameter, min_point.y+this.diameter);

        return this.clipController(min_point, max_point, newPoint);
    }
}
