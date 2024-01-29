/*
 * Copyright (C) 2023 - 2024 Reyadeyat
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

import { Algorithms } from '../math/algorithms.js';
import { Log } from '../util/log.js'
import { RasemMenu } from './menu.js';
import { Point } from '../g2d/point.js'
import { Tooltip } from '../g2d/tooltip.js';
import { Rectangle_2D } from '../math/geometry.js';

export class Scene {

    static NONE = 0;
    static START = 100;
    static DRAG = 200;
    static RESIZE = 300;
    static ROTATE = 40;
    static END = 500;

    constructor(canvas_container_id, fore_color, back_color, width, height) {
        Log.trace("Scene::constructor()");
        const el = document.createElement('div');
        el.style = 'width: 1in;'
        document.body.appendChild(el);
        this.dpi = el.offsetWidth;
        document.body.removeChild(el);
        this.ppir = window.devicePixelRatio;
        this.ppi = this.ppir * 96;
        const page_width = 8.27;
        const page_height = 11.69;
        this.portrait_page = new Rectangle_2D(0, 0, Math.round(page_width*this.ppi), Math.round(page_height*this.ppi));
        this.landescape_page = new Rectangle_2D(0, 0, Math.round(page_height*this.ppi), Math.round(page_width*this.ppi));
        this.width = width != null && width != 0 ? Math.round(width*this.ppi) : this.portrait_page.width;
        this.height = height != null && height != 0 ? Math.round(height*this.ppi) : this.portrait_page.height;
        this.scene_width = this.width;
        this.scene_height = this.height;
        let scene = this
        this.shape_list = [];
        this.canvas_container_id = canvas_container_id;
        this.canvas_container_element = document.getElementById(this.canvas_container_id);
        this.front_canvas = document.createElement('canvas');
        this.rasem_menu = new RasemMenu(this);
        this.front_canvas.id = canvas_container_id+'_canvas';
        this.canvas_container_element.appendChild(this.front_canvas);
        //canvas.style.zIndex = 8;
        //canvas.style.position = "absolute";
        //canvas.style.border = "1px solid";
        this.front_canvas_context = this.front_canvas.getContext('2d');
        this.front_canvas_context_pixels = this.front_canvas_context.createImageData(this.width, this.height);
        this.front_canvas.width = this.width;
        this.front_canvas.height = this.height;

        this.selected_shape_list = [];

        this.front_canvas.addEventListener('mousedown', function (event) {
            let point = scene.getPoint(event);
            Log.trace("Scene::constructor::front_canvas::mouse_down()::motion_mode['"+Scene.getMotionModeName(scene.motion_mode)+"'] - Pre Init");
            scene.cancelHovering();
            if (scene.isMotionMode(Scene.NONE) == true) {
                return;
            }
            Log.trace("Scene::constructor::front_canvas::mouse_down()::motion_mode['"+Scene.getMotionModeName(scene.motion_mode)+"'] - Post Init");
            scene.OnMouseDown(event, point);
            Log.trace("Scene::constructor::front_canvas::mouse_down()::motion_mode['"+Scene.getMotionModeName(scene.motion_mode)+"'] - Done");
        }, false);

        this.front_canvas.addEventListener('mousemove', function (event) {
            let point = scene.getPoint(event);
            if (scene.isMotionMode(Scene.NONE) == true || scene.isMotionMode(Scene.HOVER) == true) {
                let hovered_shape = scene.isHoveringShape(event, point)
                if (hovered_shape != null) {
                    if (scene.isMotionMode(Scene.NONE) == true) {
                        Log.trace("Scene::OnMouseMove()::motion_mode["+Scene.getMotionModeName(scene.motion_mode)+"] - hovered_shape != null -> In-HOVER mode");
                        scene.activateHovering(hovered_shape);
                    } else if (scene.isMotionMode(Scene.HOVE) == true) {
                        Log.trace("Scene::OnMouseMove()::motion_mode["+Scene.getMotionModeName(scene.motion_mode)+"] - hovered_shape != null -> Re-HOVER mode");
                        scene.activateHovering(hovered_shape);
                    }
                } else {
                    scene.cancelHovering();
                }
            }
            if (scene.isMotionMode(Scene.NONE) == true) {
                return;
            }
            Log.trace("Scene::constructor::front_canvas::mouse_move()::motion_mode['"+Scene.getMotionModeName(scene.motion_mode)+"']");
            scene.OnMouseMove(event, point);
        }, false);
        
        this.front_canvas.addEventListener('mouseup', function (event) {
            Log.trace("Scene::constructor::front_canvas::mouse_up::motion_mode['"+Scene.getMotionModeName(scene.motion_mode)+"']");
            let point = scene.getPoint(event);
            if (scene.isInShape(event, point) == false) {
                Log.trace("Scene::constructor::front_canvas::mouse_up::motion_mode["+Scene.getMotionModeName(scene.motion_mode)+"] - selected_shape_list.length == 0 -> save return");
                scene.deselectAllShapes();
                return;
            } else if (scene.selectShape(event, point) == true) {
                scene.drawUnselectedShapesToBackBuffer();
            }
            if (scene.isMotionMode(Scene.NONE) == true) {
                return;
            }
            scene.OnMouseUp(event, point);
        }, false);

        this.front_canvas.addEventListener('mouseenter', function(event) {
            let point = scene.getPoint(event);
            Log.trace("Scene::constructor::front_canvas::mouse_enter::", "motion_mode, point", Scene.getMotionModeName(scene.motion_mode), point);
        });

        this.front_canvas.addEventListener('mouseleave', function(event) {
            let point = scene.getPoint(event);
            Log.trace("Scene::constructor::front_canvas::mouse_leave::", "motion_mode, point", Scene.getMotionModeName(scene.motion_mode), point);
            if (scene.isMotionMode(Scene.NONE) == true) {
                return;
            }
            if (scene.selected_shape_list.length > 0) {
                scene.OnMouseUp(event, point);
            }
        });

        this.back_canvas = document.createElement('canvas');
        this.back_canvas.width = this.front_canvas.width;
        this.back_canvas.height = this.front_canvas.height;
        this.back_canvas_context = this.back_canvas.getContext('2d');

        this.fore_color = fore_color;
        this.back_color = back_color;

        this.switchMotionMode(Scene.NONE);
    }

    setOnRasemChangeCallBack(on_rasem_change_call_back) {
        this.on_rasem_change_call_back = on_rasem_change_call_back;
    }

    updateFrontCanvasBoundingRect() {
        this.front_canvas_bounding_rect = this.front_canvas.getBoundingClientRect();
    }

    getFrontCanvasBoundingRect() {
        this.front_canvas_bounding_rect = this.front_canvas.getBoundingClientRect();
        return this.front_canvas_bounding_rect;
    }

    getPoint(event) {
        let point = new Point();
        this.front_canvas_bounding_rect = this.getFrontCanvasBoundingRect();
        point.x = event.pageX - this.front_canvas_bounding_rect.left;
        point.y = event.pageY - this.front_canvas_bounding_rect.top;
        return point;
    }

    switchMotionMode(new_motion_mode) {
        Log.trace("Scene::switchMotionMode()::["+Scene.getMotionModeName(this.motion_mode) + ", " + Scene.getMotionModeName(new_motion_mode)+"]");
        this.motion_mode = new_motion_mode;
    }

    isMotionMode(motion_mode) {
        return this.motion_mode == motion_mode;
    }

    static getMotionMode(motion_mode_name) {
        switch (motion_mode_name.toUpperCase()) {
            case 'NONE': return Scene.NONE;
            case 'START': return Scene.START;
            case 'HOVER': return Scene.HOVER;
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
            case Scene.HOVER: return 'HOVER';
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
        for (let i = this.shape_list.length-1; i >= 0; i--) {
            this.shape_list[i].draw(this.front_canvas_context);
        };
    }

    saveFrontBufferToBackBuffer() {
        Log.trace("Scene::saveFrontBufferToBackBuffer()");
        this.back_canvas_context.drawImage(this.front_canvas, 0, 0);
    }

    restoreFrontBufferFromBackBuffer() {
        Log.trace("Scene::restoreFrontBufferFromBackBuffer()");
        this.front_canvas_context.drawImage(this.back_canvas, 0, 0);
    }

    restoreFrontBufferRectangleFromBackBuffer(shape) {
        Log.trace("Scene::restoreFrontBufferRectangleFromBackBuffer()::shape::" + shape.toString());
        //this.front_canvas_context.drawImage(this.back_canvas, 0, 0);
        let portion = 1;
        let rect = shape.shape_max_bound_rect;
        this.front_canvas_context.drawImage(this.back_canvas, rect.x - portion, rect.y - portion, rect.width + (portion * 2), rect.height + (portion * 2), rect.x - portion, rect.y - portion, rect.width + (portion * 2), rect.height + (portion * 2));
    }

    redrawOnBackBuffer() {
        Log.trace("Scene::redrawOnBackBuffer()");
        this.clean(this.back_canvas_context);
        for (let i = 0; i < this.shape_list.length; i++) {
            this.shape_list[i].draw(this.back_canvas_context);
        };
    }

    drawUnselectedShapesToBackBuffer() {
        Log.trace("Scene::drawUnselectedShapesToBackBuffer()");
        this.clean(this.back_canvas_context);
        let unselected_shape_list = Algorithms.list_difference(this.selected_shape_list, this.shape_list);
        for (let i = unselected_shape_list.length-1; i >=0 ; i--) {
            let shape = unselected_shape_list[i];
            Log.info("selected shape {type, index, id} = {'" + shape.shape_type + "', " + i + ", " + shape.id + "}");
            shape.draw(this.back_canvas_context);
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

    isHoveringShape(event, point) {
        Log.info("Scene::isHoveringShape(" + point.x + ", " + point.y + ")");
        for (let i = this.shape_list.length - 1; i >= 0; i--) {
            if (this.shape_list[i].isPointInside(point)
            && this.shape_list[i].text != null) {
                Log.info("Hovering Over Shape [" + this.shape_list[i].id + "] (" + point.x + ", " + point.y + ")");
                return this.shape_list[i];
            }
        }
        return null;
    }

    activateHovering(hovered_shape) {
        this.cancelHovering();
        this.hovering_canceled = false;
        this.switchMotionMode(Scene.HOVER);
        this.hovered_shape = hovered_shape;
        this.saveFrontBufferToBackBuffer();
    }

    cancelHovering() {
        if (this.hovering_canceled == true) {
            return;
        }
        Log.trace("Scene::cancelHovering()::motion_mode["+Scene.getMotionModeName(this.motion_mode)+"]");
        if (this.tooltip_timer == null
            && this.hide_tooltip_timer == null
            && this.hovered_shape == null) {
            return;
        }
        if (this.tooltip_timer != null) {
            clearTimeout(this.tooltip_timer);
        }
        if (this.hide_tooltip_timer != null) {
            clearTimeout(this.hide_tooltip_timer);
        }
        this.tooltip_timer = null;
        this.hide_tooltip_timer = null;
        this.hovered_shape = null;
        this.restoreFrontBufferFromBackBuffer();
        this.hovering_canceled = true;
    }

    isInShape(event, point) {
        for (let i = this.shape_list.length - 1; i >= 0; i--) {
            let shape = this.shape_list[i];
            if (shape.isPointInside(point)) {
                Log.info("Scene::isInShape[" + shape.id + "] (" + point.x + ", " + point.y + ")");
                return true;
            }
        }
        return false;
    }

    selectShape(event, point) {
        for (let i = this.shape_list.length - 1; i >= 0; i--) {
            let shape = this.shape_list[i];
            if (this.selected_shape_list.find(selected_shape => selected_shape.id == shape.id) == null
                && shape.isPointInside(point)) {
                this.switchMotionMode(Scene.START);
                shape.switchStrokeOn();
                shape.activateControls();
                shape.draw(this.front_canvas_context);
                Log.info("Select Shape[" + shape.id + "] (" + point.x + ", " + point.y + ")");
                this.selected_shape_list.push(shape);
            }
        }
        return this.selected_shape_list.length > 0;
    }

    deselectAllShapes() {
        if (this.selected_shape_list.length == 0) {
            return;
        }
        this.selected_shape_list.forEach(shape => {
            shape.deactivateControls();
            shape.switchStrokeOff();
            this.restoreFrontBufferRectangleFromBackBuffer(shape);
        });
        while (this.selected_shape_list.length > 0) {
            let shape = this.selected_shape_list.shift();
            shape.draw(this.front_canvas_context);
        }
        this.switchMotionMode(Scene.NONE);
    }

    OnMouseDown(event, point) {
        Log.trace("Scene::OnMouseDown()::motion_mode::begin::["+Scene.getMotionModeName(this.motion_mode)+"]");
        if (this.isMotionMode(Scene.START) == true) {
            for (let i = 0; this.isMotionMode(Scene.START) == true && i < this.selected_shape_list.length; i++) {
                let shape = this.selected_shape_list[i];
                if (shape.isPointInsideResizeControl(point)) {
                    this.switchMotionMode(Scene.RESIZE);
                    Log.trace("Scene::OnMouseDown()::motion_mode::switched::["+Scene.getMotionModeName(this.motion_mode)+"]");
                } else if (shape.isPointInsideRotateControl(point)) {
                    this.switchMotionMode(Scene.ROTATE);
                    Log.trace("Scene::OnMouseDown()::motion_mode::switched::["+Scene.getMotionModeName(this.motion_mode)+"]");
                } else if (shape.isPointInside(point)) {
                    this.switchMotionMode(Scene.DRAG);
                    Log.trace("Scene::OnMouseDown()::motion_mode::switched::["+Scene.getMotionModeName(this.motion_mode)+"]");
                }
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
        if (this.motion_mode == Scene.HOVER) {
            this.OnMouseMoveHover(event, point);
        } else if (this.motion_mode == Scene.DRAG) {
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
            this.on_rasem_change_call_back();
        } else if (this.motion_mode == Scene.RESIZE) {
            this.OnMouseUpResize(event);
            this.on_rasem_change_call_back();
        } else if (this.motion_mode == Scene.ROTATE) {
            this.OnMouseUpRotate(event);
            this.on_rasem_change_call_back();
        }
    }

    OnMouseMoveHover(event, point) {
        Log.trace("Scene::OnMouseMoveHover()");
        if (this.hovered_shape != null
            && this.tooltip_timer == null
            && this.hide_tooltip_timer == null) {
            this.tooltip_timer = setTimeout(() => {
                this.tooltip_timer = null;
                Log.trace("Scene::constructor::front_canvas::mouse_move()::motion_mode['"+Scene.getMotionModeName(this.motion_mode)+"'] 2000 timer -> tooltip show");
                if (this.hovered_shape.text != null) {
                    this.tooltip = new Tooltip(this.hovered_shape.text, this.hovered_shape, "12px sans-serif", "black", "white");
                    this.tooltip.draw(this.front_canvas_context, point);
                    this.hide_tooltip_timer = setTimeout(() => {
                        Log.trace("Scene::constructor::front_canvas::mouse_move()::motion_mode['"+Scene.getMotionModeName(this.motion_mode)+"'] 5000 timer -> tooltip hide");
                        this.cancelHovering();
                    }, 5000);
                }
            }, 1250);
        }
    }

    OnMouseDownDrag(event, point) {
        Log.trace("Scene::OnMouseDownDrag()::selected_shape_list::["+this.selected_shape_list.length+"]");
        this.old_point = this.new_point = point;
        this.selected_shape_list.forEach(shape => {
            shape.deactivateControls();
        });
    }

    OnMouseMoveDrag(event, point) {
        Log.trace("Scene::OnMouseMoveDrag()");
        this.new_point = point;
        let can_clip = true;
        this.selected_shape_list.forEach(shape => {
            can_clip &&= shape.canClip(this.old_point, this.new_point, this.scene_width, this.scene_height);
        });
        if (can_clip == true) {
            this.selected_shape_list.forEach(shape => {
                //Draw Back Canvas
                this.restoreFrontBufferRectangleFromBackBuffer(shape);
            });
            this.selected_shape_list.forEach(shape => {
                shape.dragPoints(this.old_point, this.new_point);
                shape.draw(this.front_canvas_context);
            });
        }
        this.old_point = this.new_point;
    }

    OnMouseUpDrag(event, point) {
        Log.trace("Scene::OnMouseUpDrag()");
        this.selected_shape_list.forEach(shape => {
            //Draw Back Canvas
            this.restoreFrontBufferRectangleFromBackBuffer(shape);
        });
        this.selected_shape_list.forEach(shape => {
            //Activate
            shape.activateControls();
            //Draw Shape
            shape.draw(this.front_canvas_context);
        });
        this.switchMotionMode(Scene.START);
    }

    OnMouseDownResize(event, point) {
        Log.trace("Scene::OnMouseDownResize()::selected_shape_list::["+this.selected_shape_list.length+"]");
        this.selected_shape_list.forEach(shape => {
            shape.deactivateControls();
        });
        this.old_point = this.new_point = point;
    }

    OnMouseMoveResize(event, point) {
        Log.trace("Scene::OnMouseMoveResize()");
        this.new_point = point;
        this.selected_shape_list.forEach(shape => {
            if (shape.canClip(this.old_point, this.new_point, this.scene_width, this.scene_height) == true) {
                Log.trace("Scene::canClip(true)::", "shape_type, id, old_point, new_point, scene_width, scene_height", shape.shape_type, shape.id, this.old_point, this.new_point, this.scene_width, this.scene_height);
                //Draw Back Canvas
                this.restoreFrontBufferRectangleFromBackBuffer(shape);
                //Save Shape Path New Points
                shape.transformPoints(this.old_point, this.new_point);
            }
        });
        this.selected_shape_list.forEach(shape => {
            shape.draw(this.front_canvas_context);
        });
        this.old_point = this.new_point;
    }

    OnMouseUpResize(event, point) {
        Log.trace("Scene::OnMouseUpResize()");
        this.selected_shape_list.forEach(shape => {
            //Draw Back Canvas
            this.restoreFrontBufferRectangleFromBackBuffer(shape);
        });
        this.selected_shape_list.forEach(shape => {
            //Activate
            shape.activateControls();
            //Draw Shape
            shape.draw(this.front_canvas_context);
        });
        this.switchMotionMode(Scene.START);
    }
    
    OnMouseDownRotate(event, point) {
        Log.trace("Scene::OnMouseDownRotate()::selected_shape_list::["+this.selected_shape_list.length+"]");
        this.selected_shape_list.forEach(shape => {
            shape.deactivateControls();
        });
        this.old_point = this.new_point = point;
    }

    OnMouseMoveRotate(event, point) {
        Log.trace("Scene::OnMouseMoveRotate()");
        this.new_point = point;
        this.selected_shape_list.forEach(shape => {
            if (shape.canClip(this.old_point, this.new_point, this.scene_width, this.scene_height) == true) {
                Log.trace("Scene::canClip(true)::", "shape_type, id, old_point, new_point, scene_width, scene_height", shape.shape_type, shape.id, this.old_point, this.new_point, this.scene_width, this.scene_height);
                //Draw Back Canvas
                this.restoreFrontBufferRectangleFromBackBuffer(shape);
                //Save Shape Path New Points
                shape.rotatePoints(this.old_point, this.new_point);
            }
        });
        this.selected_shape_list.forEach(shape => {
            shape.draw(this.front_canvas_context);
        });
        this.old_point = this.new_point;
    }

    OnMouseUpRotate(event, point) {
        Log.trace("Scene::OnMouseUpRotate()");
        this.selected_shape_list.forEach(shape => {
            //Draw Back Canvas
            this.restoreFrontBufferRectangleFromBackBuffer(shape);
        });
        this.selected_shape_list.forEach(shape => {
            //Activate
            shape.activateControls();
            //Draw Shape
            shape.draw(this.front_canvas_context);
        });
        this.switchMotionMode(Scene.START);
    }

    clipImage(image, image_name, image_type) {
        Log.trace("Scene::clipImage()::selected_shape_list::["+this.selected_shape_list.length+"]");
        this.selected_shape_list.forEach(shape => {
            shape.setClipImage(image, image_name, image_type);
            shape.draw(this.front_canvas_context);
        });
    }
}