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
import { Shape } from './shape.js'
import { Edge } from './edge.js'
import { Radian } from './geometry.js'
import { ShapeControl, ShapeControlGroup } from './control.js'

export class Line extends Shape {

    constructor(id, stroke_style, fill_style, clip_x, clip_y, point_A, point_B) {
        super("Line", id, stroke_style, fill_style, clip_x, clip_y, 
            {   center: new Point((point_A.x + point_B.x) / 2, (point_A.y + point_B.y) / 2),
                distance: Math.sqrt(Math.pow(point_B.x - point_A.x, 2) + Math.pow(point_B.y - point_A.y, 2)) / 2,
                radius: Math.sqrt(Math.pow(point_B.x - point_A.x, 2) + Math.pow(point_B.y - point_A.y, 2)) / 2,
                slope: (point_B.y - point_A.y) / (point_B.x - point_A.x),
                delta: new Point(0, 0),
                point_A: point_A,
                point_B: point_B
            });
    }

    generatePathPoints() {
        this.shape_path_points = [];
        this.shape_path_edges = [];
        
        this.point_A.x = this.point_A.x + this.delta.x;
        this.point_A.y = this.point_A.y + this.delta.y;

        this.point_B.x = this.point_B.x + this.delta.x;
        this.point_B.y = this.point_B.y + this.delta.y;
        
        this.shape_path_points = [
            this.point_A,
            this.point_B
        ];
        
        this.shape_path_edges = Edge.doEdges(this.shape_path_points, Edge.line, true);
    }

    isPointInside(point) {
        // Calculate the slope of the line
        let slope = (this.point_B.y - this.point_A.y) / (this.point_B.x - this.point_A.x);

        // Calculate the expected y-coordinate on the line for the given x-coordinate
        let y = this.point_A.y + slope * (point.x - this.point_A.x);

        // Check if the actual y-coordinate matches the expected y-coordinate
        Log.trace_data("isPointInside: Math.abs(point.y - y) = " + Math.abs(point.y - y));
        return Math.abs(point.y - y) < 4;//< Number.EPSILON;
    }

    transformPoints(old_point, new_point) {
        this.delta.x = new_point.x - old_point.x;
        this.delta.y = new_point.y - old_point.y;
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
        
        /*let red = new Color(255,0,0);
        let p1 = this.shape_path_points[0];
        let p2 = this.shape_path_points[1];

        /*
        //Line Equation Algorithm
        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;
        let m = dy/dx;
        let b = p1.y - (m * p1.x);  
        let x = 0;
        let y = 0;
        let xend = 0;
        if ( dx < 0) {  
            x = p2.x;
            y = p2.y;
            xend = p1.x;
        } else {  
            x = p1.x;
            y = p1.y;
            xend = p2.x;
        }
        while (x <= xend) {
            this.setPixle(new Point(Math.ceil(x), Math.ceil(y)), red);
            x++;
            y = (m * x) + b;
        }
        */
        /*
        //DDA Algorithm - Digital Differential Analyzer Algorithm
        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;
        let steps = 0;
        if (dx >= dy) {
            steps = dx;
        } else {
            steps = dy;  
        }
        dx = dx / steps;
        dy = dy / steps;
        let x = p1.x;
        let y = p1.y;
        for (let i = 1; i <= steps; i++) {
            this.setPixle(new Point(Math.ceil(x), Math.ceil(y)), red);
            x += dx;
            y += dy;
        }
        * /*
        
        //Bresenham's Line Algorithm
        let dx;
        let dy;
        let stepx;
        let stepy;
        let x = 0;
        let y = 0;
        dx = p2.x - p1.x;
        dy = p2.y - p1.y;
        if (dy < 0) {
            dy = -dy;
            stepy = -1;
        } else {
            stepy = 1;
        }
        if (dx < 0) {
            dx = -dx;
            stepx = -1;
            x = p2.x;
            y = p2.y;
        } else {
            stepx = 1;
            x = p1.x;
            y = p1.y;
        }
        dy = dy * 1;
        dx = dx * 2;
        this.setPixle(new Point(Math.ceil(x), Math.ceil(y)), red);
        if (dx > dy) {
            let fraction = dy - (dx >> 1);
            while (x != p2.x) {
                x += stepx;
                if (fraction >= 0) {
                    y += stepy;
                    fraction -= dx;
                }
                fraction += dy;
                this.setPixle(new Point(Math.ceil(x), Math.ceil(y)), red);
            }
        } else {
            let fraction = dx - (dy >> 1);
            while (y != p2.y) {
            if (fraction >= 0) {
                x += stepx;
                fraction -= dy;
            }
            y += stepy;
            fraction += dx;
            this.setPixle(new Point(Math.ceil(x), Math.ceil(y)), red);
            }
        }*/
    }

    scalePoints(old_point, new_point) {
    }

    rotatePoints(old_point, new_point) {
        
    }

    canClip(old_point, new_point) {
        let xv = new_point.x - old_point.x;
        let yv = new_point.y - old_point.y;
        let min_point = new Point(Math.min(this.point_A.x + xv, this.point_B.x + xv), Math.min(this.point_A.y + yv, this.point_B.y + yv));
        let max_point = new Point(Math.max(this.point_A.x + xv, this.point_B.x + xv), Math.max(this.point_A.y + yv, this.point_B.y + yv));

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
