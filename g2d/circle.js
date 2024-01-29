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

export class Circle extends Shape {
    
    constructor(id, stroke_style, fill_style, center_x, center_y, radius, text, control_width) {
        super("Circle", id, stroke_style, fill_style,
            {center: new Point(center_x, center_y), radius: radius, diameter: radius},
            text,
            control_width);
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
