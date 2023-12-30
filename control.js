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

import { Point } from "./point";

export class ShapeControl {

    static RESIZE = 1;
    static ROTATE = 2;
    static SKEWING = 3;

    constructor(control_type, control_point, line_color, fill_color) {
        this.control_type = control_type;
        this.control_point = control_point;
        this.line_color = line_color;
        this.fill_color = fill_color;
    }

    is(control_type) {
        return this.control_type == control_type;
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

    constructor(control_point, line_color, fill_color) {
        super(ShapeControl.RESIZE, control_point, line_color, fill_color);
    }
}

export class ShapeControlRotate extends ShapeControl {

    constructor(control_point, line_color, fill_color) {
        super(ShapeControl.ROTATE, control_point, line_color, fill_color);
    }
}

export class ShapeControlGroup {

    constructor(shape) {
        this.shape = shape;
        this.mouse_click = false;
        this.mouse_down = false;
        this.control_point_shape_list = [];
    }

    addShapeControl(control_type, control_point, line_color, fill_color) {
        if (control_type == ShapeControl.RESIZE) {
            this.control_point_shape_list.push(new ShapeControlResize(control_point, line_color, fill_color));
        } else if (control_type == ShapeControl.ROTATE) {
            this.control_point_shape_list.push(new ShapeControlRotate(control_point, line_color, fill_color));
        }
    }

    getControlOnPoint(point) {
        return this.control_point_shape_list.find(control => {
            if (control.is(ShapeControl.RESIZE)) {
                if (point.x >= control.control_point.x
                    && point.x <= control.control_point.x
                    && point.y >= control.control_point.y
                    && point.y <= control.control_point.y
                ) {
                        return true;
                    }
                    return false;
            } else if (control.is(ShapeControl.ROTATE)) {
                let distance = Math.sqrt(Math.pow(control.control_point.x - point.x,2) + Math.pow(control.control_point.y - point.y, 2)); 
                if (distance <= 5) {
                    return true;
                }
                return false;
            }
        });
    }

    drawControls(context) {
        this.control_point_shape_list.forEach(control => {
            if (control.is(ShapeControl.RESIZE)) {
                let point_A = new Point(control.control_point.x - 5, control.control_point.y - 5);
                context.beginPath();
                context.rect(point_A.x, point_A.y, 10, 10);
                context.fillStyle = control.fill_color;
                context.fill();
                context.lineWidth = 1;
                context.strokeStyle = control.line_color;
                context.stroke();
            } else if (control.is(ShapeControl.ROTATE)) {
                context.beginPath();
                context.arc(control.control_point.x, control.control_point.y, 5, 0, 2 * Math.PI);
                context.fillStyle = control.fill_color;
                context.fill();
                context.lineWidth = 1;
                context.strokeStyle = control.line_color;
                context.stroke();
            } else {
                throw new Error("Control of type '" + control.control_type + "' is unknown");
            }
        })
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
