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

export class Ellipse extends Shape {
    shape_path_points: any[];
    shape_path_edges: any[] | Edge[];
    isPointInside(point: any): boolean;
    shape_path_points_old: any[];
    refreshShape(point: any): void;
    refreshControls(point: any): void;
    OnMouseClickControl(point: any): void;
    OnMouseDownControl(point: any): void;
    OnMouseMoveControl(point: any): void;
}
import { Shape } from './shape.js';
import { Edge } from './edge.js';
