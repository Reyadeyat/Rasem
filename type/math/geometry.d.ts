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

export class Radian {
    radians: number[];
}
export class Rectangle_2D {
    constructor(x1: any, y1: any, x2: any, y2: any);
    construct(x1: any, y1: any, x2: any, y2: any): void;
    x: any;
    y: any;
    x1: any;
    y1: any;
    x2: any;
    y2: any;
    width: number;
    height: number;
    left_top_point: Point;
    center_top_point: Point;
    right_top_point: Point;
    right_center_point: Point;
    right_bottom_point: Point;
    center_bottom_point: Point;
    left_bottom_point: Point;
    left_center_point: Point;
    radius: number;
    center_point: Point;
    getBoundCircleRadius(): number;
    getBoundCircleBoundRect(): Rectangle_2D;
    clone(): Rectangle_2D;
    vector_scaling(vector2d: any): void;
    add(rect: any): this;
    min_fit(width: any, height: any): this;
    canClip(vector: any, scene_width: any, scene_height: any): boolean;
    transform(vector: any): this;
    zoom(x: any, y: any): this;
    contains(smaller_rectangle: any): boolean;
}
export class Geometry {
    static radian: Radian;
    static point_distance(point_1: any, point_2: any): number;
    static nearest_point(point_n: any, point_list: any): any;
    static getAngle(center_point: any, point_n: any): number;
    static rotatePathAroundCenter(rotation_angle: any, center_point: any, shape_path_points_angle_list: any, shape_path_points_radius_list: any): Point[];
    static rotatePointAroundCenter(rotation_angle: any, center_point: any, angle: any, radius: any): Point;
    static isPointInsidePolygon(point: any, polygon_point_list: any): boolean;
}
import { Point } from "../g2d/point.js";
