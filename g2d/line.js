/*
 * Copyright (C) 2023-2024 Reyadeyat
 * All Rights Reserved.
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * https://reyadeyat.net/LICENSE/REYADEYAT.LICENSE
 * 
 * This License permits the use, modification, and distribution of the code
 * under the terms specified in the License document.
 */

"use strict";

import { Log } from '@reyadeyat/haseb'
import { Point } from './point.js'
import { Shape } from './shape.js'
import { Edge, EdgeType } from './edge.js'

export class Line extends Shape {

    constructor(configuration, id, name, rotation_angle, stroke_style, fill_style, start_point, end_point, text, control_width) {
        super("Line", configuration, id, name, rotation_angle, stroke_style, fill_style,
            {   center_point: new Point((start_point.x + end_point.x) / 2, (start_point.y + end_point.y) / 2),
                distance: Math.sqrt(Math.pow(end_point.x - start_point.x, 2) + Math.pow(end_point.y - start_point.y, 2)) / 2,
                radius: Math.sqrt(Math.pow(end_point.x - start_point.x, 2) + Math.pow(end_point.y - start_point.y, 2)) / 2,
                slope: (end_point.y - start_point.y) / (end_point.x - start_point.x),
                delta: new Point(0, 0),
                start_point: start_point,
                end_point: end_point
            },
            text,
            control_width);
    }

    generatePathPoints() {
        this.shape_path_points = [];
        this.shape_path_edges = [];
        
        this.start_point.x = this.start_point.x + this.delta.x;
        this.start_point.y = this.start_point.y + this.delta.y;

        this.end_point.x = this.end_point.x + this.delta.x;
        this.end_point.y = this.end_point.y + this.delta.y;
        
        this.shape_path_points = [
            this.start_point,
            this.end_point
        ];
        
        this.shape_path_edges = Edge.doEdges(this.shape_path_points, EdgeType.line_connector, true);
    }

    isPointInside(point) {
        // Calculate the slope of the line
        let slope = (this.end_point.y - this.start_point.y) / (this.end_point.x - this.start_point.x);

        // Calculate the expected y-coordinate on the line for the given x-coordinate
        let y = this.start_point.y + slope * (point.x - this.start_point.x);

        // Check if the actual y-coordinate matches the expected y-coordinate
        Log.trace_data("isPointInside: Math.abs(point.y - y) = " + Math.abs(point.y - y));
        return Math.abs(point.y - y) < 4;//< Number.EPSILON;
    }

    transformPoints(old_point, new_point) {
        this.delta.x = new_point.x - old_point.x;
        this.delta.y = new_point.y - old_point.y;
        this.center_point = new Point(this.center_point.x + new_point.x - old_point.x, this.center_point.y + new_point.y - old_point.y);
        this.generatePath();
    }

    preDraw(context) {

    }

    postDraw(context) {
    
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

    rotateAngle(rotation_angle) {
        super.rotateAngle(rotation_angle);
        
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
