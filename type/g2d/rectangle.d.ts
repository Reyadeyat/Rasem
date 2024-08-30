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

export class Rectangle extends Shape {
    constructor(configuration: any, id: any, name: any, rotation_angle: any, stroke_style: any, fill_style: any, left_x: any, top_y: any, width: any, height: any, text: any, control_width: any);
    shape_path_points: any[] | Point[];
    shape_path_edges: any[] | Edge[];
    x: number;
    y: number;
    isPointInside(point: any): boolean;
    refreshShape(point: any): void;
    refreshControls(point: any): void;
    OnMouseClickControl(point: any): void;
    OnMouseDownControl(point: any): void;
    OnMouseMoveControl(point: any): void;
}
import { Shape } from './shape.js';
import { Point } from './point.js';
import { Edge } from './edge.js';
