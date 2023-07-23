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

export class Line extends Shape {
    /*
    x;
    y;
    width;
    height;*/
    constructor(id, stroke_style, clip_x, clip_y, pointA, pointB) {
        super(id, stroke_style, stroke_style, clip_x, clip_y, true, false, 
            {pointA: pointA, pointB: pointB
            });
    }

    generatePathPoints() {
        this.shape_path_points = [];
        this.shape_path_edges = [];
        
        this.shape_path_points[0] = this.pointA;
        this.shape_path_points[1] = this.pointB;
        
        this.shape_path_edges = Edge.doEdges(this.shape_path_points, Edge.line, true);
    }

    isPointInside(point) {
        /*let red = new Color(255,0,0);
        this.setPixle(point, red);*/
        return false;
    }

    transformPoints(oldPoint, newPoint) {
        this.generatePathPoints();
    }

    draw(context) {
        let red = new Color(255,0,0);
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
        */
        
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
        }
    }

    scalePoints(oldPoint, newPoint) {
    }

    rotatePoints(oldPoint, newPoint) {
        
    }

    canClip(oldPoint, newPoint) {
        let xv = newPoint.x - oldPoint.x;
        let yv = newPoint.y - oldPoint.y;
        let min_point = new Point(Math.min(this.pointA.x + xv, this.pointB.x + xv), Math.min(this.pointA.y + yv, this.pointB.y + yv));
        let max_point = new Point(Math.max(this.pointA.x + xv, this.pointB.x + xv), Math.max(this.pointA.y + yv, this.pointB.y + yv));

        return this.clipController(min_point, max_point, newPoint);
    }
}
