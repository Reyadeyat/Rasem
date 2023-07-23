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
import { Point } from './point.js'

export class Scene {
    /*canvas_name;
    front_canvas;
    front_canvas_context;
    back_canvas;
    back_canvas_context;
    shapes;
    
    */
    constructor(canvas_container_id, fore_color, back_color, width, height) {
        let thisis = this
        this.width = width;
        this.height = height;
        this.shapes = [];
        this.canvas_container_id = canvas_container_id;

        this.canvas_container_element = document.getElementById(this.canvas_container_id);
        this.front_canvas = document.createElement('canvas');
        this.front_canvas.id = canvas_container_id+'_canvas';
        this.canvas_container_element.appendChild(this.front_canvas);
        this.front_canvas.width = width;
        this.front_canvas.height = height;
        //canvas.style.zIndex = 8;
        //canvas.style.position = "absolute";
        //canvas.style.border = "1px solid";
        this.front_canvas_context = this.front_canvas.getContext('2d');
        this.front_canvas_context_pixels = this.front_canvas_context.createImageData(this.width, this.height);
        this.front_canvas.addEventListener('mousedown', function (event) {
                thisis.OnMouseDown(event, thisis);
        }, false);

        this.front_canvas.addEventListener('mousedown', function (event) {
            thisis.OnMouseDown(event, thisis);
        }, false);

        this.front_canvas.addEventListener('mousemove', function (event) {
            thisis.OnMouseMove(event, thisis);
        }, false);
        
        this.front_canvas.addEventListener('mouseup', function (event) {
            thisis.OnMouseUp(event, thisis);
        }, false);

        this.back_canvas = document.createElement('canvas');
        this.back_canvas.width = width;
        this.back_canvas.height = height;
        this.back_canvas_context = this.back_canvas.getContext('2d');

        this.CanvasBoundingRect = this.front_canvas.getBoundingClientRect();

        this.fore_color = fore_color;
        this.back_color = back_color;
        this.isTransforming = false;
    }

    clean() {
        this.front_canvas_context.fillStyle = this.back_color;
        this.front_canvas_context.fillRect(0, 0, this.width, this.height);
    }

    addShape(shape) {
        shape.setFrontDevice(this.front_canvas_context, this.front_canvas_context_pixels);
        this.shapes.push(shape);
        //this.shapes.splice(0, 0, shape);
    }

    draw() {
        this.clean();
        for (let i = 0; i < this.shapes.length; i++) {
            //if (this.execludedShape.id != this.shapes[i].id) {
                this.shapes[i].draw(this.front_canvas_context);
            //}
        };
        this.back_canvas_context.drawImage(this.front_canvas, 0, 0);
    }

    drawShape(shape) {
        shape.draw(this.front_canvas_context);
    }

    drawExecludeShape() {
        this.clean();
        let idx = 0;
        for (let i = 0; i < this.shapes.length; i++) {
            if (this.execludedShape.id != this.shapes[i].id) {
                this.drawShape(this.shapes[i]);
                if (idx != 0) {
                    this.shapes[i - idx] = this.shapes[i];
                }
            } else {
                idx++;
                Log.info("idx = " + idx);
            }
        };

        this.back_canvas_context.drawImage(this.front_canvas, 0, 0);

        if (idx != -1) {
            this.drawShape(this.execludedShape);
            this.shapes[this.shapes.length - idx] = this.execludedShape;
        }
    }

    drawLine(context, x1, y1, x2, y2) {
        context.beginPath();
        context.strokeStyle = 'green';
        context.lineWidth = 1;
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
        context.closePath();
    }

    OnMouseDownTransform(event, thisis) {
        Log.info("isTransforming = " + thisis.isTransforming);
        if (thisis.isTransforming == true) {
            return;
        }
        let point = new Point();
        point.x = event.pageX - thisis.CanvasBoundingRect.left;
        point.y = event.pageY - thisis.CanvasBoundingRect.top;
        thisis.oldPoint = thisis.newPoint = point;
        for (let i = thisis.shapes.length - 1; i >= 0; i--) {
            if (thisis.shapes[i].isPointInside(point)) {
                thisis.execludedShape = thisis.shapes[i];
                Log.info("[" + thisis.shapes[i].id + "] (" + point.x + ", " + point.y + ")");
                break;
            }
        }
        //Draw Back Canvas Without selected shape;
        if (thisis.execludedShape != null) {
            thisis.isTransforming = true;
            thisis.drawExecludeShape();
        }
    }

    OnMouseMoveTransform(event, thisis) {
        if (thisis.isTransforming === true) {
            //Save New Point
            let point = new Point();
            point.x = event.pageX - thisis.CanvasBoundingRect.left;
            point.y = event.pageY - thisis.CanvasBoundingRect.top;
            if (thisis.execludedShape.canClip(thisis.oldPoint, point) == true) {
                thisis.newPoint = point;
                //Draw Back Canvas
                thisis.front_canvas_context.drawImage(thisis.back_canvas, 0, 0);
                //Move Shape Path Points
                //Draw Dragged Shape
                thisis.execludedShape.transformPoints(thisis.oldPoint, thisis.newPoint);
                thisis.drawShape(thisis.execludedShape);
                thisis.oldPoint = point;
            }
        }
    }

    OnMouseUpTransform(event, thisis) {
        if (thisis.isTransforming === true) {
            //Save Shape Path New Points
            thisis.execludedShape.transformPoints(thisis.oldPoint, thisis.newPoint);
            //Draw Scene
            thisis.draw();
            thisis.execludedShape = null;
        }

        thisis.isTransforming = false;
    }
    
    OnMouseDownRotate(event, thisis) {
        Log.info("isRotating = " + thisis.isRotating);
        if (thisis.isRotating == true) {
            return;
        }
        let point = new Point();
        point.x = event.pageX - thisis.CanvasBoundingRect.left;
        point.y = event.pageY - thisis.CanvasBoundingRect.top;
        thisis.oldPoint = thisis.newPoint = point;
        for (let i = thisis.shapes.length - 1; i >= 0; i--) {
            if (thisis.shapes[i].isPointInside(point)) {
                thisis.execludedShape = thisis.shapes[i];
                Log.info("In Shape [" + thisis.shapes[i].id + "] (" + point.x + ", " + point.y + ")");
                break;
            }
        }
        //Draw Back Canvas Without selected shape;
        if (thisis.execludedShape != null) {
            thisis.isRotating = true;
            thisis.drawExecludeShape();
        }
    }

    OnMouseMoveRotate(event, thisis) {
        if (thisis.isRotating === true) {
            //Save New Point
            let point = new Point();
            point.x = event.pageX - thisis.CanvasBoundingRect.left;
            point.y = event.pageY - thisis.CanvasBoundingRect.top;
            if (thisis.execludedShape.canClip(thisis.oldPoint, point) == true) {
                thisis.newPoint = point;
                //Draw Back Canvas
                thisis.front_canvas_context.drawImage(thisis.back_canvas, 0, 0);
                //Move Shape Path Points
                //Draw Dragged Shape
                thisis.execludedShape.rotatePoints(thisis.oldPoint, thisis.newPoint);
                thisis.drawShape(thisis.execludedShape);
                thisis.oldPoint = point;
            }
        }
    }

    OnMouseUpRotate(event, thisis) {
        if (thisis.isRotating === true) {
            //Save Shape Path New Points
            thisis.execludedShape.rotatePoints(thisis.oldPoint, thisis.newPoint);
            //Draw Scene
            thisis.draw();
            thisis.execludedShape = null;
        }

        thisis.isRotating = false;
    }

    OnMouseDown(event, thisis) {
        //this.OnMouseDownTransform(event, thisis);
        this.OnMouseDownRotate(event, thisis);
    }

    OnMouseMove(event, thisis) {
        //this.OnMouseMoveTransform(event, thisis);
        this.OnMouseMoveRotate(event, thisis);
    }

    OnMouseUp(event, thisis) {
        //this.OnMouseUpTransform(event, thisis);
        this.OnMouseUpRotate(event, thisis);
    }
}