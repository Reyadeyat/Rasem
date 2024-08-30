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

export class Vector2D {
    constructor(point_a: any, point_b: any);
    scale_x: number;
    scale_y: number;
    scale_distance: number;
    angle_radians: number;
    angle_degrees: number;
    scale_angle: number;
    scale_point(point: any): Point;
    toString(): string;
}
import { Point } from "../g2d/point.js";
