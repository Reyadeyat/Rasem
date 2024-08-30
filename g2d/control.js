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

import { Geometry } from "../math/geometry.js";

export class ShapeControlAnchor {
    static CENTER = 0;
    static LEFT_TOP = 10;
    static CENTER_TOP = 20;
    static RIGHT_TOP = 30;
    static RIGHT_CENTER = 40;
    static RIGHT_BOTTOM = 50;
    static CENTER_BOTTOM = 60;
    static LEFT_BOTTOM = 70;
    static LEFT_CENTER = 80;
}

export class ShapeControl {

    static RESIZE = 1;
    static ROTATE = 2;
    static SKEWING = 3;

    constructor(anchor, control_type, rotation_angle, center_point, control_point, line_color, fill_color) {
        this.anchor = anchor;
        this.control_type = control_type;
        this.rotation_angle = rotation_angle;
        this.center_point = center_point;
        this.control_point = control_point;
        this.center_point = center_point;
        this.line_color = line_color;
        this.fill_color = fill_color;
        this.compute();
    }

    compute() {
        this.angle = Geometry.getAngle(this.center_point, this.control_point);
        this.radius = Geometry.point_distance(this.center_point, this.control_point);
        this.rotated_point = Geometry.rotatePointAroundCenter(this.rotation_angle, this.center_point, this.angle, this.radius);
    }

    is(control_type) {
        return this.control_type == control_type;
    }

    transform(new_center_point, new_control_point) {
        this.center_point = new_center_point;
        this.control_point = new_control_point;
        this.compute();
    }

    rotateAngle(rotation_angle) {
        this.rotation_angle = rotation_angle;
        this.compute();
    }

    static getShapeControl(shape_control_name) {
        switch (shape_control_name.toUpperCase()) {
            case 'RESIZE': return ShapeControl.RESIZE;
            case 'ROTATE': return ShapeControl.ROTATE;
            case 'SKEWING': return ShapeControl.SKEWING;
        }
        throw new Error("Undefined Shape Control '" + shape_control_name.toUpperCase() + "'");
    }
}

export class ShapeControlResize extends ShapeControl {

    constructor(anchor, rotation_angle, center_point, control_point, line_color, fill_color) {
        super(anchor, ShapeControl.RESIZE, rotation_angle, center_point, control_point, line_color, fill_color);
    }
}

export class ShapeControlRotate extends ShapeControl {

    constructor(anchor, rotation_angle, center_point, control_point, line_color, fill_color) {
        super(anchor, ShapeControl.ROTATE, rotation_angle, center_point, control_point, line_color, fill_color);
    }
}

export class ShapeControlGroup {

    constructor(shape, control_width) {
        this.shape = shape;
        this.control_width = Math.floor(control_width / 2);
        this.mouse_click = false;
        this.mouse_down = false;
        this.control_point_shape_list = [];
        this.control_point_shape_map = new Map();

        let rect = this.shape.shape_path_bounding_rect;
        this.addShapeControl(ShapeControlAnchor.LEFT_TOP, ShapeControl.RESIZE, rect.left_top_point, "grey", "white");
        this.addShapeControl(ShapeControlAnchor.CENTER_TOP, ShapeControl.RESIZE, rect.center_top_point, "grey", "grey");
        this.addShapeControl(ShapeControlAnchor.RIGHT_TOP, ShapeControl.RESIZE, rect.right_top_point, "grey", "white");
        this.addShapeControl(ShapeControlAnchor.RIGHT_CENTER, ShapeControl.RESIZE, rect.right_center_point, "grey", "white");
        this.addShapeControl(ShapeControlAnchor.RIGHT_BOTTOM, ShapeControl.RESIZE, rect.right_bottom_point, "grey", "white");
        this.addShapeControl(ShapeControlAnchor.CENTER_BOTTOM, ShapeControl.RESIZE, rect.center_bottom_point, "grey", "white");
        this.addShapeControl(ShapeControlAnchor.LEFT_BOTTOM, ShapeControl.RESIZE, rect.left_bottom_point, "grey", "white");
        this.addShapeControl(ShapeControlAnchor.LEFT_CENTER, ShapeControl.RESIZE, rect.left_center_point, "grey", "white");

        this.addShapeControl(ShapeControlAnchor.CENTER, ShapeControl.ROTATE, rect.center_point, "red", "green");
    }

    addShapeControl(anchor, control_type, control_point, line_color, fill_color) {
        if (control_type == ShapeControl.RESIZE) {
            let control = new ShapeControlResize(anchor, this.shape.rotation_angle, this.shape.center_point, control_point, line_color, fill_color);
            this.control_point_shape_list.push(control);
            this.control_point_shape_map.set(anchor, control);
        } else if (control_type == ShapeControl.ROTATE) {
            let control = new ShapeControlRotate(anchor, this.shape.rotation_angle, this.shape.center_point, control_point, line_color, fill_color);
            this.control_point_shape_list.push(control);
            this.control_point_shape_map.set(anchor, control);
        }
    }

    getControlOnPoint(point) {
        return this.control_point_shape_list.find(control => {
            let distance = Math.sqrt(Math.pow(control.rotated_point.x - point.x,2) + Math.pow(control.rotated_point.y - point.y, 2)); 
            return distance <= this.control_width;
        });
    }

    transform() {
        this.control_point_shape_list.forEach((control) => {
            if (control.control_type == ShapeControl.RESIZE) {
                if (control.anchor == ShapeControlAnchor.LEFT_TOP) {
                    control.transform(this.shape.center_point, this.shape.shape_path_bounding_rect.left_top_point);
                } else if (control.anchor == ShapeControlAnchor.CENTER_TOP) {
                    control.transform(this.shape.center_point, this.shape.shape_path_bounding_rect.center_top_point);
                } else if (control.anchor == ShapeControlAnchor.RIGHT_TOP) {
                    control.transform(this.shape.center_point, this.shape.shape_path_bounding_rect.right_top_point);
                } else if (control.anchor == ShapeControlAnchor.RIGHT_CENTER) {
                    control.transform(this.shape.center_point, this.shape.shape_path_bounding_rect.right_center_point);
                } else if (control.anchor == ShapeControlAnchor.RIGHT_BOTTOM) {
                    control.transform(this.shape.center_point, this.shape.shape_path_bounding_rect.right_bottom_point);
                } else if (control.anchor == ShapeControlAnchor.CENTER_BOTTOM) {
                    control.transform(this.shape.center_point, this.shape.shape_path_bounding_rect.center_bottom_point);
                } else if (control.anchor == ShapeControlAnchor.LEFT_BOTTOM) {
                    control.transform(this.shape.center_point, this.shape.shape_path_bounding_rect.left_bottom_point);
                } else if (control.anchor == ShapeControlAnchor.LEFT_CENTER) {
                    control.transform(this.shape.center_point, this.shape.shape_path_bounding_rect.left_center_point);
                }
            } else if (control.control_type == ShapeControl.ROTATE) {
                control.transform(this.shape.center_point, this.shape.shape_path_bounding_rect.center_point);
            }
        });
    }

    rotateAngle(rotation_angle) {
        this.control_point_shape_list.forEach((control) => {
            control.rotateAngle(rotation_angle);
        });
    }

    drawControls(context) {
        context.save();
        this.control_point_shape_list.forEach((control) => {
            if (control.is(ShapeControl.RESIZE)
            || control.is(ShapeControl.ROTATE)) {
                context.beginPath();
                context.arc(control.rotated_point.x, control.rotated_point.y, this.control_width, 0, 2 * Math.PI);
                context.fillStyle = control.fill_color;
                context.fill();
                context.lineWidth = 1;
                context.strokeStyle = control.line_color;
                context.stroke();
            } else {
                throw new Error("Control of type '" + control.control_type + "' is unknown");
            }
        });
        context.restore();
    }

    OnMouseClick(point) {
        this.mouse_click = true;
        shape.OnMouseClickControl(point);
    }

    OnMouseDown(point) {
        this.mouse_down = true;
        shape.OnMouseDownControl(point);
    }

    OnMouseMove(point) {
        this.mouse_down = true;
        shape.OnMouseMoveControl(point);
    }

    OnMouseUp(point) {

    }
}
