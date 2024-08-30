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

export class ShapeControlAnchor {
    static CENTER: number;
    static LEFT_TOP: number;
    static CENTER_TOP: number;
    static RIGHT_TOP: number;
    static RIGHT_CENTER: number;
    static RIGHT_BOTTOM: number;
    static CENTER_BOTTOM: number;
    static LEFT_BOTTOM: number;
    static LEFT_CENTER: number;
}
export class ShapeControl {
    static RESIZE: number;
    static ROTATE: number;
    static SKEWING: number;
    static getShapeControl(shape_control_name: any): number;
    constructor(anchor: any, control_type: any, rotation_angle: any, center_point: any, control_point: any, line_color: any, fill_color: any);
    anchor: any;
    control_type: any;
    rotation_angle: any;
    center_point: any;
    control_point: any;
    line_color: any;
    fill_color: any;
    compute(): void;
    angle: number;
    radius: number;
    rotated_point: import("./point.js").Point;
    is(control_type: any): boolean;
    transform(new_center_point: any, new_control_point: any): void;
    rotateAngle(rotation_angle: any): void;
}
export class ShapeControlResize extends ShapeControl {
    constructor(anchor: any, rotation_angle: any, center_point: any, control_point: any, line_color: any, fill_color: any);
}
export class ShapeControlRotate extends ShapeControl {
    constructor(anchor: any, rotation_angle: any, center_point: any, control_point: any, line_color: any, fill_color: any);
}
export class ShapeControlGroup {
    constructor(shape: any, control_width: any);
    shape: any;
    control_width: number;
    mouse_click: boolean;
    mouse_down: boolean;
    control_point_shape_list: any[];
    control_point_shape_map: any;
    addShapeControl(anchor: any, control_type: any, control_point: any, line_color: any, fill_color: any): void;
    getControlOnPoint(point: any): any;
    transform(): void;
    rotateAngle(rotation_angle: any): void;
    drawControls(context: any): void;
    OnMouseClick(point: any): void;
    OnMouseDown(point: any): void;
    OnMouseMove(point: any): void;
    OnMouseUp(point: any): void;
}
