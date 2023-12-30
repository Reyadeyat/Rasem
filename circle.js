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

export class Circle extends Shape {
    
    constructor(id, stroke_style, fill_style, clip_x, clip_y, center_x, center_y, radius) {
        super("Circle", id, stroke_style, fill_style, clip_x, clip_y,
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

    transformPoints(old_point, new_point) {
        this.center = new Point(this.center.x + new_point.x - old_point.x, this.center.y + new_point.y - old_point.y);
        this.generatePathPoints();
    }

    draw(context) {
        super.draw(context);
        if (Log.is(Log.TRACE_DATA)) {
            context.strokeStyle = this.stroke_style.color;
            context.beginPath();
            context.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
            context.stroke();
        }
    }

    scalePoints(old_point, new_point) {
    }

    rotatePoints(old_point, new_point) {
    }

    canClip(old_point, new_point) {
        let min_point = new Point(this.center.x - this.radius + new_point.x - old_point.x, this.center.y - this.radius + new_point.y - old_point.y);
        let max_point = new Point(min_point.x+this.diameter, min_point.y+this.diameter);

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
