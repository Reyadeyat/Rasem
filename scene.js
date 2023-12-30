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
import { RasemMenu } from './menu.js';
import { Point } from './point.js'

export class Scene {

    static NONE = 0;
    static START = 100;
    static DRAG = 200;
    static RESIZE = 300;
    static ROTATE = 40;
    static END = 500;

    constructor(canvas_container_id, fore_color, back_color, width, height) {
        Log.trace("Scene::constructor()");
        let scene = this
        this.width = width;
        this.height = height;
        this.shape_list = [];
        this.canvas_container_id = canvas_container_id;

        this.canvas_container_element = document.getElementById(this.canvas_container_id);
        this.front_canvas = document.createElement('canvas');
        this.rasem_menu = new RasemMenu(this);
        this.front_canvas.id = canvas_container_id+'_canvas';
        this.canvas_container_element.appendChild(this.front_canvas);
        this.front_canvas.width = width;
        this.front_canvas.height = height;
        //canvas.style.zIndex = 8;
        //canvas.style.position = "absolute";
        //canvas.style.border = "1px solid";
        this.front_canvas_context = this.front_canvas.getContext('2d');
        this.front_canvas_context_pixels = this.front_canvas_context.createImageData(this.width, this.height);
        
        /*this.front_canvas.addEventListener('mousedown', function (event) {
            Log.trace("Scene::constructor::front_canvas::mousedown()");
            let point = scene.getPoint(event);
            scene.OnMouseDown(event, scene);
        }, false);*/

        this.front_canvas.addEventListener('click', function (event) {
            Log.trace("Scene::constructor::front_canvas::mousedown()::motion_mode['"+Scene.getMotionModeName(scene.motion_mode)+"']");
            let point = scene.getPoint(event);
            scene.OnMouseClick(event, point);
        }, false);

        this.front_canvas.addEventListener('mousemove', function (event) {
            if (scene.isMotionMode(Scene.NONE) == true) {
                return;
            }
            Log.trace("Scene::constructor::front_canvas::mousemove()::motion_mode['"+Scene.getMotionModeName(scene.motion_mode)+"']");
            let point = scene.getPoint(event);
            scene.OnMouseMove(event, point);
        }, false);
        
        this.front_canvas.addEventListener('mouseup', function (event) {
            if (scene.isMotionMode(Scene.NONE) == true) {
                return;
            }
            Log.trace("Scene::constructor::front_canvas::mouseup()::motion_mode['"+Scene.getMotionModeName(scene.motion_mode)+"']");
            let point = scene.getPoint(event);
            scene.OnMouseUp(event, point);
        }, false);

        this.front_canvas.addEventListener('mousedown', function (event) {
            if (scene.isMotionMode(Scene.NONE) == true) {
                return;
            }
            Log.trace("Scene::constructor::front_canvas::mousedown()::motion_mode['"+Scene.getMotionModeName(scene.motion_mode)+"']");
            let point = scene.getPoint(event);
            scene.OnMouseDown(event, point);
        }, false);

        this.front_canvas.addEventListener('mousemove', function (event) {
            if (scene.isMotionMode(Scene.NONE) == true) {
                return;
            }
            Log.trace("Scene::constructor::front_canvas::mousemove()::motion_mode['"+Scene.getMotionModeName(scene.motion_mode)+"']");
            let point = scene.getPoint(event);
            scene.OnMouseMove(event, point);
        }, false);
        
        this.front_canvas.addEventListener('mouseup', function (event) {
            if (scene.isMotionMode(Scene.NONE) == true) {
                return;
            }
            Log.trace("Scene::constructor::front_canvas::mouseup::motion_mode['"+Scene.getMotionModeName(scene.motion_mode)+"']");
            let point = scene.getPoint(event);
            scene.OnMouseUp(event, point);
        }, false);

        this.back_canvas = document.createElement('canvas');
        this.back_canvas.width = width;
        this.back_canvas.height = height;
        this.back_canvas_context = this.back_canvas.getContext('2d');

        this.CanvasBoundingRect = this.front_canvas.getBoundingClientRect();

        this.fore_color = fore_color;
        this.back_color = back_color;

        this.motion_mode = Scene.NONE;
    }

    getPoint(event) {
        let point = new Point();
        point.x = event.pageX - this.CanvasBoundingRect.left;
        point.y = event.pageY - this.CanvasBoundingRect.top;
        return point;
    }

    isMotionMode(motion_mode) {
        return this.motion_mode == motion_mode;
    }

    static getMotionMode(motion_mode_name) {
        switch (motion_mode_name.toUpperCase()) {
            case 'NONE': return Scene.NONE;
            case 'START': return Scene.START;
            case 'DRAG': return Scene.DRAG;
            case 'RESIZE': return Scene.RESIZE;
            case 'ROTATE': return Scene.ROTATE;
            case 'END': return Scene.END;
        }
        throw new Error("Undefined Modtion Mode '" + motion_mode_name.toUpperCase() + "'");
    }

    static getMotionModeName(motion_mode) {
        switch (motion_mode) {
            case Scene.NONE: return 'NONE';
            case Scene.START: return 'START';
            case Scene.DRAG: return 'DRAG';
            case Scene.RESIZE: return 'RESIZE';
            case Scene.ROTATE: return 'ROTATE';
            case Scene.END: return 'END';
        }
        throw new Error("Undefined Modtion Mode '" + motion_mode + "'");
    }

    cleanFrontBuffer() {
        this.clean(this.front_canvas_context);
    }

    clean(context) {
        Log.trace("Scene::clean()");
        context.fillStyle = this.back_color;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }

    addShape(shape) {
        Log.trace("Scene::addShape()");
        shape.setFrontDevice(this.front_canvas_context, this.front_canvas_context_pixels);
        this.shape_list.push(shape);
    }

    draw() {
        Log.trace("Scene::draw()");
        for (let i = 0; i < this.shape_list.length; i++) {
            this.shape_list[i].draw(this.front_canvas_context);
        };
    }

    drawShape(context, shape) {
        Log.trace("Scene::drawShape()");
        shape.draw(context);
    }

    drawFrontBuffer() {
        Log.trace("Scene::drawFrontBuffer()");
        this.back_canvas_context.drawImage(this.front_canvas, 0, 0);
        this.drawShape(this.front_canvas_context, this.selected_shape);
    }

    restoreFrontBuffer() {
        this.front_canvas_context.drawImage(this.back_canvas, 0, 0);
    }

    drawBackBuffer() {
        Log.trace("Scene::drawBackBuffer()");
        this.clean(this.back_canvas_context);
        for (let i = 0; i < this.shape_list.length; i++) {
            //execlude selected shape from back buffer
            if (this.selected_shape != null && this.selected_shape.id == this.shape_list[i].id) {
                Log.info("selected_shape {type, index, id} = {'" + this.selected_shape.shape_type + "', " + i + ", " + this.selected_shape.id + "}");
                continue;
            }
            this.drawShape(this.back_canvas_context, this.shape_list[i]);
        };
    }

    getShapesUnderPoint(point) {
        let shape_list = [];
        for (let i = this.shape_list.length - 1; i >= 0; i--) {
            if (this.shape_list[i].isPointInside(point)) {
                shape_list.push(this.shape_list[i]);
            }
        }
        return shape_list;
    }

    OnMouseClick(event, point) {
        
        //if select another shape deselect the first then th second
        if (this.selected_shape != null) {
            if (this.selected_shape.isPointInside(point) == false) {
                this.restoreFrontBuffer();
                this.selected_shape.switchStrokeOff();
                this.selected_shape.draw(this.front_canvas_context);
                this.selected_shape = null;
                return;
            }
        }

        for (let i = this.shape_list.length - 1; i >= 0; i--) {
            if (this.shape_list[i].isPointInside(point)) {
                this.drawBackBuffer();
                this.motion_mode = Scene.START;
                this.selected_shape = this.shape_list[i];
                this.selected_shape.switchStrokeOn();
                this.selected_shape.activateControls(this.front_canvas_context);
                Log.info("[" + this.shape_list[i].id + "] (" + point.x + ", " + point.y + ")");
                break;
            }
        }
    }

    OnMouseDown(event, point) {
        Log.trace("Scene::OnMouseDown()::motion_mode["+Scene.getMotionModeName(this.motion_mode)+"]");
        if (this.motion_mode == Scene.START) {
            if (this.selected_shape.isPointInsideResizeControl(point)) {
                this.motion_mode = Scene.RESIZE;
            } else if (this.selected_shape.isPointInsideRotateControl(point)) {
                this.motion_mode = Scene.ROTATE;
            } else if (this.selected_shape.isPointInside(point)) {
                this.motion_mode = Scene.DRAG;
            }
        }
        if (this.motion_mode == Scene.DRAG) {
            this.OnMouseDownDrag(event, point);
        } else if (this.motion_mode == Scene.RESIZE) {
            this.OnMouseDownResize(event, point);
        } else if (this.motion_mode == Scene.ROTATE) {
            this.OnMouseDownRotate(event, point);
        }
    }

    OnMouseMove(event, point) {
        Log.trace("Scene::OnMouseMove()::motion_mode["+Scene.getMotionModeName(this.motion_mode)+"]");
        if (this.motion_mode == Scene.DRAG) {
            this.OnMouseMoveDrag(event, point);
        } else if (this.motion_mode == Scene.RESIZE) {
            this.OnMouseMoveResize(event, point);
        } else if (this.motion_mode == Scene.ROTATE) {
            this.OnMouseMoveRotate(event, point);
        }
    }

    OnMouseUp(event, point) {
        Log.trace("Scene::OnMouseUp()::motion_mode["+Scene.getMotionModeName(this.motion_mode)+"]");
        if (this.motion_mode == Scene.DRAG) {
            this.OnMouseUpDrag(event);
        } else if (this.motion_mode == Scene.RESIZE) {
            this.OnMouseUpResize(event);
        } else if (this.motion_mode == Scene.ROTATE) {
            this.OnMouseUpRotate(event);
        }
    }

    OnMouseDownDrag(event, point) {
        Log.trace("Scene::OnMouseDownDrag()");
        if (this.isMotionMode(Scene.DRAG) == false) {
            return;
        }
        this.old_point = this.new_point = point;
        //Draw Back Canvas Without selected shape;
        if (this.selected_shape != null && this.selected_shape.isPointInside(point)) {
            this.drawBackBuffer();
        }
    }

    OnMouseMoveDrag(event, point) {
        Log.trace("Scene::OnMouseMoveDrag()");
        if (this.selected_shape.canClip(this.old_point, point) == true) {
            this.new_point = point;
            //Draw Back Canvas
            this.front_canvas_context.drawImage(this.back_canvas, 0, 0);
            //Move Shape Path Points
            //Draw Dragged Shape
            this.selected_shape.transformPoints(this.old_point, this.new_point);
            this.drawShape(this.front_canvas_context, this.selected_shape);
            this.old_point = point;
        }
    }

    OnMouseUpDrag(event, point) {
        Log.trace("Scene::OnMouseUpDrag()");
        //Save Shape Path New Points
        this.selected_shape.transformPoints(this.old_point, this.new_point);
        this.selected_shape.switchStrokeOff();
        //Draw Scene
        this.draw();
        this.selected_shape = null;
    }

    OnMouseDownResize(event, point) {
        Log.trace("Scene::OnMouseDownResize()");
        if (this.isMotionMode(Scene.RESIZE) == false) {
            return;
        }
        this.old_point = this.new_point = point;

        //Draw Back Canvas Without selected shape;
        if (this.selected_shape != null && this.selected_shape.isPointInside(point)) {
            this.drawBackBuffer();
        }
    }

    OnMouseMoveResize(event, point) {
        Log.trace("Scene::OnMouseMoveResize()");
        if (this.selected_shape.canClip(this.old_point, point) == true) {
            //Save New Point
            this.new_point = point;
            //Draw Back Canvas
            this.front_canvas_context.drawImage(this.back_canvas, 0, 0);
            //Move Shape Path Points
            //Draw Dragged Shape
            this.selected_shape.transformPoints(this.old_point, this.new_point);
            this.drawShape(this.front_canvas_context, this.selected_shape);
            this.old_point = point;
        }
    }

    OnMouseUpResize(event, point) {
        Log.trace("Scene::OnMouseUpResize()");
        //Save Shape Path New Points
        this.selected_shape.transformPoints(this.old_point, this.new_point);
        this.selected_shape.switchStrokeOff();
        //Draw Scene
        this.draw();
        this.selected_shape = null;
    }
    
    OnMouseDownRotate(event, point) {
        Log.trace("Scene::OnMouseDownRotate()");
        if (this.isMotionMode(Scene.ROTATE) == false) {
            return;
        }
        this.old_point = this.new_point = point;

        //Draw Back Canvas Without selected shape;
        if (this.selected_shape != null && this.selected_shape.isPointInside(point)) {
            this.drawBackBuffer();
        }
    }

    OnMouseMoveRotate(event, point) {
        Log.trace("Scene::OnMouseMoveRotate()");
        if (this.selected_shape.canClip(this.old_point, point) == true) {
            //Save New Point
            this.new_point = point;
            //Draw Back Canvas
            this.front_canvas_context.drawImage(this.back_canvas, 0, 0);
            //Move Shape Path Points
            //Draw Dragged Shape
            this.selected_shape.rotatePoints(this.old_point, this.new_point);
            this.drawShape(this.front_canvas_context, this.selected_shape);
            this.old_point = point;
        }
    }

    OnMouseUpRotate(event, point) {
        Log.trace("Scene::OnMouseUpRotate()");
        //Save Shape Path New Points
        this.selected_shape.rotatePoints(this.old_point, this.new_point);
        //this.drawShape(this.front_canvas_context, this.selected_shape);
        //Draw Scene
        this.cleanFrontBuffer();
        this.draw();
        this.selected_shape = null;
    }

    
}