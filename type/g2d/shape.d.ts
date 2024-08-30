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

export class Shape {
    constructor(shape_type: string, configuration: any, id: any, name: any, rotation_angle: number, stroke_style: StrokeStyle2D, fill_style: FillStyle2D, extras: any, text: Text2D, control_width: any);
    shape_type: string;
    id: any;
    name: any;
    stroke_style: StrokeStyle2D;
    fill_style: FillStyle2D;
    is_line: boolean;
    radius: number;
    area: number;
    extras: any;
    is_rotating: boolean;
    shape_control_shape_list: any[];
    enable_stroke: boolean;
    text: any;
    control_width: any;
    shape_control_group: ShapeControlGroup;
    center: Point;
    rotation_angle: number;
    shape_path_points_angles: number[];
    shape_path_points_radius: number;
    bound_width: number;
    bound_height: number;
    shape_path_bounding_rect: Rectangle_2D;
    shape_path_points: any[] | Point[];
    shape_path_edges: Edge[];
    shape_path_points_rotated: Point[];
    clip_rect_shape_id: number;
    shape_clip_bound_rect: Rectangle_2D;
    shape_clean_bound_rect: Rectangle_2D;
    shape_path_points_old: any[];
    insertable: boolean;
    selectable: boolean;
    draggable: boolean;
    dropable: boolean;
    expanded: boolean;
    hidden: boolean;
    resizable: Resizable2D;
    image_instance: any;
    image_src: string;
    image_width: number;
    image_height: number;
    image_name: string;
    image_type: string;
    level: number;
    order: number;
    x: number;
    y: number;
    
    generatePath(): void;
    generatePathPointsAngles(): void;
    simulatePathPointsAngles(simulation: any): any;
    distance(point_a: any, point_b: any): number;
    setPixle(point: any, color: any): void;
    switchStrokeOn(): void;
    switchStrokeOff(): void;
    draw(context: any): void;
    clipPath(context: any, shape_path_points: any): void;
    canClipInRect(vector: any): boolean;
    canClip(vector: any, scene_width: any, scene_height: any): boolean;
    calcTriangleArea(point_a: any, point_b: any, point_c: any): number;
    calcAngle(pointCenter: any, pointA: any, pointB: any): number;
    initialize(): void;
    preDraw(context: any): void;
    postDraw(context: any): void;
    generatePathPoints(): void;
    isPointInside(point: any): boolean;
    refreshShape(point: any): void;
    refreshControls(point: any): void;
    OnMouseClickControl(point: any): void;
    OnMouseDownControl(point: any): void;
    OnMouseMoveControl(point: any): void;
    isPointInsideResizeControl(point: any): any;
    isPointInsideRotateControl(point: any): any;
    dragPoints(vector: any): void;
    center_point: any;
    transformPoints(old_point: any, new_point: any): void;
    scalePoints(old_point: any, new_point: any): void;
    rotateAngle(delta_rotation_angle: any): void;
    activateControls(): void;
    controls_activated: boolean;
    deactivateControls(): void;
    isSelectable(): boolean;
    setClipImage(image_instance: any, image_name: any, image_type: any): void;
    toString(): string;
    clone(): any;
    toJSON(): {
        id: number,
        name: string,
        type: string,
        clip_rect_shape_id: number,
        is_line: boolean,
        is_rotating: boolean,
        radius: number,
        area: number;
        rotation_angle: number,
        shape_type: string,
        x: number,
        y: number,
        width: number,
        height: number,
        half_height: number,
        half_width: number,
        bound_height: number,
        bound_width: number,
        center_point: number,
        control_width: number,
        enable_stroke: boolean,
        image_instance: ImageInstance,
        //line
        start_point: Point,
        end_point: Point,
        //circle
        center_x: number,
        center_y: number,
        //rectangle
        left_x: number,
        top_y: number,
        //triangle
        a_point: Point,
        b_point: Point,
        c_point: Point,
        //style properties
        text: Text2D,
        stroke_style: StrokeStyle2D;
        fill_style: FillStyle2D;
        //menu properties
        insertable: boolean,
        selectable: boolean,
        draggable: boolean,
        dropable: boolean,
        expanded: boolean,
        hidden: boolean,
        resizable: Resizable2D,
        image_src: string,
        image_width: number,
        image_height: number,
        image_name: string,
        image_type: string,
        level: boolean,
        order: boolean
    };
}
import { FillStyle2D, Resizable2D, StrokeStyle2D } from '../data-structure/g2d-data-structure.js';
import { Rectangle_2D } from '../math/geometry.js';
import { ShapeControlGroup } from './control.js';import { Edge } from './edge.js';
import { ImageInstance } from './image_instance.js';
import { Point } from './point.js';
import { Text2D } from './text.js';

