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

import { Log } from '@reyadeyat/haseb'
import { Algorithms } from '../math/algorithms.js';
import { RasemMenu } from './menu.js';
import { Point } from '../g2d/point.js'
import { Tooltip } from '../g2d/tooltip.js';
import { Geometry, Rectangle_2D } from '../math/geometry.js';
import { UIToolbar } from '../ui/ui-toolbar.js';
import { Rectangle } from '../g2d/rectangle.js';
import { ShapeUtils } from '../g2d/shape_utils.js';
import { Vector2D } from '../math/linear_algebra.js';
import { UITree } from '../ui/ui-tree.js';

export class Scene {

    static NONE = 0;
    static START = 100;
    static DRAG = 200;
    static RESIZE = 300;
    static ROTATE = 40;
    static END = 500;

    constructor(configuration, scene_container_id, status_bar_id, height_reduction, fore_color, back_color, control_width, dpi, ppi, width, height, handle_control_event) {
        Log.trace("Scene::constructor()");
        this.language = configuration.language;
        this.dpi = dpi;
        this.ppi = ppi;
        this.width = width;
        this.height = height;
        this.portrait_page = new Rectangle_2D(0, 0, this.width, this.height * this.ppi);
        this.landescape_page = new Rectangle_2D(0, 0, this.height, this.width * this.ppi);
        this.scene_width = this.width;
        this.scene_height = this.height;
        this.shape_list = [];
        this.shape_map = new Map();
        this.scene_container_id = scene_container_id;
        this.status_bar_id = status_bar_id;
        this.height_reduction = height_reduction;
        this.canvas_container_element = document.getElementById(this.scene_container_id);
        this.control_width = control_width;
        this.rasem_side_toolbar = new UIToolbar(configuration.language, configuration.direction, configuration.rasem_side_toolbar, this.canvas_container_element);

        this.scene_container_board = document.createElement('div');
        this.scene_container_board.id = scene_container_id + '_scene_board_' + Math.random();
        this.scene_container_board.innerHTML = ``;
        this.scene_container_board.classList.add("rasem_scene_board");
        this.canvas_container_element.appendChild(this.scene_container_board);

        this.front_canvas = document.createElement('canvas');
        this.rasem_menu = new RasemMenu(this);
        this.front_canvas.id = scene_container_id + '_canvas';
        this.front_canvas.classList.add("rasem_canvas");
        this.front_canvas.tabIndex = 100;
        this.front_canvas.style.width = this.width + "px";
        this.front_canvas.style.min_width = this.width + "px";
        this.scene_container_board.appendChild(this.front_canvas);

        this.ui_tree = new UITree(configuration.language, configuration.direction, configuration.tree, configuration.tree_map, configuration.tree_inlisted, configuration.tree_toolbar, this.canvas_container_element, this.height);
        this.is_full_screen_mode = false;
        window.addEventListener('resize', (event) => {
            this.fixHeight();
        });

        this.front_canvas_context = this.front_canvas.getContext('2d');
        this.front_canvas_context_pixels = this.front_canvas_context.createImageData(this.width, this.height);
        this.front_canvas.width = this.width;
        this.front_canvas.height = this.height;

        this.selected_shape_list = [];

        this.front_canvas.addEventListener('mousedown', (event) => {
            this.front_canvas.focus();
            let point = this.getPoint(event);
            Log.trace("Scene::constructor::front_canvas::mouse_down()::motion_mode['" + Scene.getMotionModeName(this.motion_mode) + "'] - Pre Init");
            this.cancelHovering();
            if (this.isInShape(event, point) == false) {
                Log.trace("Scene::constructor::front_canvas::mousedown::motion_mode[" + Scene.getMotionModeName(this.motion_mode) + "] - click on board");
                this.click_on_board = true;
            }
            if (this.isMotionMode(Scene.NONE) == true) {
                return;
            }
            Log.trace("Scene::constructor::front_canvas::mouse_down()::motion_mode['" + Scene.getMotionModeName(this.motion_mode) + "'] - Post Init");
            this.OnMouseDown(event, point);
            Log.trace("Scene::constructor::front_canvas::mouse_down()::motion_mode['" + Scene.getMotionModeName(this.motion_mode) + "'] - Done");
        }, false);

        this.front_canvas.addEventListener('mousemove', (event) => {
            let point = this.getPoint(event);
            if (this.isMotionMode(Scene.NONE) == true || this.isMotionMode(Scene.HOVER) == true) {
                let hovered_shape = this.isHoveringShape(event, point)
                if (hovered_shape != null) {
                    if (this.isMotionMode(Scene.NONE) == true) {
                        Log.trace("Scene::OnMouseMove()::motion_mode[" + Scene.getMotionModeName(this.motion_mode) + "] - hovered_shape != null -> In-HOVER mode");
                        this.activateHovering(hovered_shape);
                    } else if (this.isMotionMode(Scene.HOVE) == true) {
                        Log.trace("Scene::OnMouseMove()::motion_mode[" + Scene.getMotionModeName(this.motion_mode) + "] - hovered_shape != null -> Re-HOVER mode");
                        this.activateHovering(hovered_shape);
                    }
                } else {
                    this.cancelHovering();
                }
            }
            if (this.isMotionMode(Scene.NONE) == true) {
                return;
            }
            Log.trace("Scene::constructor::front_canvas::mouse_move()::motion_mode['" + Scene.getMotionModeName(this.motion_mode) + "']");
            this.OnMouseMove(event, point);
        }, false);

        this.front_canvas.addEventListener('mouseup', (event) => {
            Log.trace("Scene::constructor::front_canvas::mouse_up::motion_mode['" + Scene.getMotionModeName(this.motion_mode) + "']");
            let point = this.getPoint(event);
            if (this.click_on_board == true || this.isInShapeOrControl(event, point) == false) {
                Log.trace("Scene::constructor::front_canvas::mouse_up::motion_mode[" + Scene.getMotionModeName(this.motion_mode) + "] - selected_shape_list.length == 0 -> save return");
                this.click_on_board = false;
                this.deselectAllShapes();
                return;
            } else if (this.selectShape(event, point) == true) {
                this.drawUnselectedShapesToBackBuffer();
            }
            if (this.isMotionMode(Scene.NONE) == true) {
                return;
            }
            this.OnMouseUp(event, point);
        }, false);

        this.front_canvas.addEventListener('mouseenter', (event) => {
            let point = this.getPoint(event);
            Log.trace("Scene::constructor::front_canvas::mouse_enter::", "motion_mode, point", Scene.getMotionModeName(this.motion_mode), point);
        });

        this.front_canvas.addEventListener('mouseleave', (event) => {
            let point = this.getPoint(event);
            Log.trace("Scene::constructor::front_canvas::mouse_leave::", "motion_mode, point", Scene.getMotionModeName(this.motion_mode), point);
            if (this.isMotionMode(Scene.NONE) == true) {
                return;
            }
            if (this.selected_shape_list.length > 0) {
                this.OnMouseUp(event, point);
            }
        });

        this.front_canvas.addEventListener('keydown', (event) => {
            if (event.key === 'a' && (event.ctrlKey || event.metaKey)) {
                event.preventDefault();
                this.selected_shape_list = this.shape_list.filter(shape => shape.selectable == true);
                this.setSelectedShapes(this.selected_shape_list);
            }
        });

        this.front_canvas.addEventListener('dragover', (event) => {
            event.preventDefault();
        });

        this.front_canvas.addEventListener('drop', (event) => {
            event.preventDefault();
            let point = this.getPoint(event);
            let source_node_id = parseInt(event.dataTransfer.getData('node.node_id'));
            let shape_list = this.getShapesUnderPoint(point);
            if (shape_list.length > 0) {
                this.handle_control_event(event, 'scene', 'node_drop', { point: point, node_id: source_node_id, dropped_on_shape_id: shape_list[0].id });
            }
            debugger;
        });

        this.back_canvas = document.createElement('canvas');
        this.back_canvas.width = this.front_canvas.width;
        this.back_canvas.height = this.front_canvas.height;
        this.back_canvas_context = this.back_canvas.getContext('2d');

        this.fore_color = fore_color;
        this.back_color = back_color;

        this.switchMotionMode(Scene.NONE);

        this.fixHeight();
    }

    changeLanguage(language, direction) {
        this.language = language;
        this.direction = direction;
        this.ui_tree.changeLanguage(this.language, this.direction);
        this.rasem_menu.changeLanguage(this.language, this.direction);
        this.rasem_side_toolbar.changeLanguage(this.language, this.direction);
    }

    fixHeight() {
        this.updateFrontCanvasBoundingRect();
        let new_height = 0;
        if (new_height == null || document.fullscreenElement != null) {
            let rasem_container_toolbar = document.getElementById("rasem_container_toolbar");
            let rasem_container_status_bar = this.status_bar_id == null ? null : document.getElementById(this.status_bar_id);
            new_height = window.innerHeight - ((rasem_container_status_bar == null ? 0 : rasem_container_status_bar.offsetHeight) + rasem_container_toolbar.clientHeight + rasem_container_toolbar.offsetTop);
        } else {
            new_height = window.innerHeight - this.height_reduction;
        }
        let scene_container_element = document.getElementById(this.scene_container_id);
        if (scene_container_element != null) {
            scene_container_element.style.maxHeight = "" + new_height + "px";
            this.scene_container_board.style.maxHeight = "" + new_height + "px";
            this.ui_tree.setHeight(new_height);
            this.rasem_side_toolbar.setHeight(new_height);
        }
    }

    getUITree() {
        return this.shape_list;
    }

    setOnRasemChangeCallBack(on_rasem_change_callback) {
        this.on_rasem_change_callback = on_rasem_change_callback;
    }

    updateFrontCanvasBoundingRect() {
        this.front_canvas_bounding_rect = this.front_canvas.getBoundingClientRect();
    }

    getFrontCanvasBoundingRect() {
        this.front_canvas_bounding_rect = this.front_canvas.getBoundingClientRect();
        return this.front_canvas_bounding_rect;
    }

    getPoint(event) {
        const rect = this.front_canvas.getBoundingClientRect();

        const canvasScrollX = this.front_canvas.scrollLeft;
        const canvasScrollY = this.front_canvas.scrollTop;
        const documentScrollX = window.scrollX;
        const documentScrollY = window.scrollY;

        const x = event.clientX - rect.left - documentScrollX + canvasScrollX;
        const y = event.clientY - rect.top - canvasScrollY;

        if (this.front_canvas.style.transform) {
            const matrix = this.front_canvas.transform.baseVal.getItem(0);
            const scaleX = matrix.matrix.a;
            const scaleY = matrix.matrix.d;
            x /= scaleX;
            y /= scaleY;
        }
        return new Point(x, y);
    }

    switchMotionMode(new_motion_mode) {
        Log.trace("Scene::switchMotionMode()::[" + Scene.getMotionModeName(this.motion_mode) + ", " + Scene.getMotionModeName(new_motion_mode) + "]");
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

    addShape(shape, draw_shape) {
        Log.trace("Scene::addShape()::["+ shape.shape_type + ", " + draw_shape+"]");
        this.shape_list.push(shape);
        if (draw_shape == true) {
            shape.draw(this.language, this.front_canvas_context);
        }
        this.shape_map.set(shape.id, shape);
        this.shape_list.sort((a, b) => a.order > b.order ? 1 : a.order < b.order ? -1 : 0);
    }

    draw() {
        Log.trace("Scene::draw()");
        for (let i = 0; i < this.shape_list.length; i++) {
            this.shape_list[i].draw(this.language, this.front_canvas_context);
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
        let portion = 1;
        let rect = shape.shape_clean_bound_rect;
        this.front_canvas_context.drawImage(this.back_canvas, rect.left_top_point.x - portion, rect.left_top_point.y - portion, rect.width + (portion * 2), rect.height + (portion * 2), rect.left_top_point.x - portion, rect.left_top_point.y - portion, rect.width + (portion * 2), rect.height + (portion * 2));
    }

    redrawOnBackBuffer() {
        Log.trace("Scene::redrawOnBackBuffer()");
        this.clean(this.back_canvas_context);
        for (let i = 0; i < this.shape_list.length; i++) {
            this.shape_list[i].draw(this.language, this.back_canvas_context);
        };
    }

    drawUnselectedShapesToBackBuffer() {
        Log.trace("Scene::drawUnselectedShapesToBackBuffer()");
        this.clean(this.back_canvas_context);
        let unselected_shape_list = Algorithms.list_difference(this.selected_shape_list, this.shape_list);
        for (let i = 0; i < unselected_shape_list.length; i++) {
            let shape = unselected_shape_list[i];
            Log.trace_data("selected shape {type, index, id} = {'" + shape.shape_type + "', " + i + ", " + shape.id + "}");
            shape.draw(this.language, this.back_canvas_context);
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
        Log.trace("Scene::isHoveringShape(" + point.x + ", " + point.y + ")");
        for (let i = 0; i < this.shape_list.length; i++) {
            if (this.shape_list[i].isPointInside(point)
                && this.shape_list[i].text != null) {
                Log.trace_data("Hovering Over Shape [" + this.shape_list[i].id + "] (" + point.x + ", " + point.y + ")");
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
        Log.trace("Scene::cancelHovering()::motion_mode[" + Scene.getMotionModeName(this.motion_mode) + "]");
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
            if (shape.isSelectable() && shape.isPointInside(point)) {
                Log.trace_data("Scene::isInShape[" + shape.id + "] (" + point.x + ", " + point.y + ")");
                return true;
            }
        }
        return false;
    }

    isInShapeOrControl(event, point) {
        for (let i = this.shape_list.length - 1; i >= 0; i--) {
            let shape = this.shape_list[i];
            if (shape.isSelectable() && shape.isPointInside(point) == true || shape.isPointInsideResizeControl(point) == true) {
                Log.trace_data("Scene::isInShapeOrControl[" + shape.id + "] (" + point.x + ", " + point.y + ")");
                return true;
            }
        }
        return false;
    }

    isInSelectedShapeOrControl(event, point) {
        for (let i = this.selected_shape_list.length - 1; i >= 0; i--) {
            let shape = this.shape_list[i];
            if (shape.isSelectable() && shape.isPointInside(point) == true || shape.isPointInsideResizeControl(point) == true) {
                Log.trace_data("Scene::isInSelectedShapeOrControl[" + shape.id + "] (" + point.x + ", " + point.y + ")");
                return true;
            }
        }
        return false;
    }

    selectShape(event, point) {
        for (let i = this.shape_list.length - 1; i >= 0; i--) {
            let shape = this.shape_list[i];
            if (this.selected_shape_list.find(selected_shape => selected_shape.id == shape.id) == null
                && shape.isSelectable() && shape.isPointInside(point)) {
                this.switchMotionMode(Scene.START);
                shape.switchStrokeOn();
                shape.activateControls();
                shape.draw(this.language, this.front_canvas_context);
                Log.trace_data("Select Shape[" + shape.id + "] (" + point.x + ", " + point.y + ")");
                this.selected_shape_list.push(shape);
                if (this.selected_shape_list.length == 1) {
                    this.clipRectangle = shape.shape_clean_bound_rect.clone();
                } else {
                    this.clipRectangle.add(shape.shape_clean_bound_rect);
                }
                this.clipRectangle.min_fit(this.scene_width, this.scene_height);
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
            shape.draw(this.language, this.front_canvas_context);
        }
        this.switchMotionMode(Scene.NONE);
    }

    setSelectedShapes(selected_shape_list) {
        if (selected_shape_list.length > 0) {
            this.clipRectangle = selected_shape_list[0].shape_clean_bound_rect.clone();
            selected_shape_list.forEach((shape) => {
                this.clipRectangle.add(shape.shape_clean_bound_rect);
            });
            this.clipRectangle.min_fit(this.scene_width, this.scene_height);
        }
        this.drawUnselectedShapesToBackBuffer();
        this.OnMouseUpDrag(null, null);
    }

    setSelectedShapesByID(selected_shape_id_list) {
        if (selected_shape_id_list.length > 0) {
            this.selected_shape_list = this.shape_list.filter(shape => selected_shape_id_list.includes(shape.id));
            this.clipRectangle = this.selected_shape_list[0].shape_clean_bound_rect.clone();
            this.selected_shape_list.forEach((shape) => {
                this.clipRectangle.add(shape.shape_clean_bound_rect);
            });
            this.clipRectangle.min_fit(this.scene_width, this.scene_height);
        }
        this.drawUnselectedShapesToBackBuffer();
        this.OnMouseUpDrag(null, null);
    }

    OnMouseDown(event, point) {
        Log.trace("Scene::OnMouseDown()::motion_mode::begin::[" + Scene.getMotionModeName(this.motion_mode) + "]");
        if (this.isMotionMode(Scene.START) == true) {
            for (let i = 0; this.isMotionMode(Scene.START) == true && i < this.selected_shape_list.length; i++) {
                let shape = this.selected_shape_list[i];
                if (shape.isSelectable() == false) {
                    continue;
                }
                if (shape.isPointInsideResizeControl(point)) {
                    this.click_on_board = false;
                    this.switchMotionMode(Scene.RESIZE);
                    Log.trace("Scene::OnMouseDown()::motion_mode::switched::[" + Scene.getMotionModeName(this.motion_mode) + "]");
                } else if (shape.isPointInsideRotateControl(point)) {
                    this.switchMotionMode(Scene.ROTATE);
                    Log.trace("Scene::OnMouseDown()::motion_mode::switched::[" + Scene.getMotionModeName(this.motion_mode) + "]");
                } else if (shape.isPointInside(point)) {
                    this.switchMotionMode(Scene.DRAG);
                    Log.trace("Scene::OnMouseDown()::motion_mode::switched::[" + Scene.getMotionModeName(this.motion_mode) + "]");
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
        Log.trace("Scene::OnMouseMove()::motion_mode[" + Scene.getMotionModeName(this.motion_mode) + "]");
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
        Log.trace("Scene::OnMouseUp()::motion_mode[" + Scene.getMotionModeName(this.motion_mode) + "]");
        if (this.motion_mode == Scene.DRAG) {
            this.OnMouseUpDrag(event);
            this.handle_control_event(event, "scene", "mouse-drag-up", {point: point});
        } else if (this.motion_mode == Scene.RESIZE) {
            this.OnMouseUpResize(event);
            this.handle_control_event(event, "scene", "mouse-resize-up", {point: point});
        } else if (this.motion_mode == Scene.ROTATE) {
            this.OnMouseUpRotate(event);
            this.handle_control_event(event, "scene", "mouse-rotate-up", {point: point});
        }
    }

    OnMouseMoveHover(event, point) {
        Log.trace("Scene::OnMouseMoveHover()");
        if (this.hovered_shape != null
            && this.tooltip_timer == null
            && this.hide_tooltip_timer == null) {
            this.tooltip_timer = setTimeout(() => {
                this.tooltip_timer = null;
                Log.trace("Scene::constructor::front_canvas::mouse_move()::motion_mode['" + Scene.getMotionModeName(this.motion_mode) + "'] 2000 timer -> tooltip show");
                if (this.hovered_shape.text != null) {
                    this.tooltip = new Tooltip(this.hovered_shape.text, this.hovered_shape, "12px sans-serif", "black", "white");
                    this.tooltip.draw(this.language, this.front_canvas_context, point);
                    this.hide_tooltip_timer = setTimeout(() => {
                        Log.trace("Scene::constructor::front_canvas::mouse_move()::motion_mode['" + Scene.getMotionModeName(this.motion_mode) + "'] 5000 timer -> tooltip hide");
                        this.cancelHovering();
                    }, 5000);
                }
            }, 1250);
        }
    }

    OnMouseDownDrag(event, point) {
        Log.trace("Scene::OnMouseDownDrag()::selected_shape_list::[" + this.selected_shape_list.length + "]");
        this.old_point = this.new_point = point;
        this.selected_shape_list.forEach(shape => {
            shape.deactivateControls();
        });
    }

    OnMouseMoveDrag(event, point) {
        Log.trace("Scene::OnMouseMoveDrag()");
        this.new_point = point;
        let vector = new Vector2D(this.new_point, this.old_point);
        let clip = true;
        this.selected_shape_list.forEach(shape => {
            clip &&= shape.canClipInRect(vector);
        });
        if (clip == true) {
            this.selected_shape_list.forEach(shape => {
                this.restoreFrontBufferRectangleFromBackBuffer(shape);
            });
            this.selected_shape_list.forEach(shape => {
                shape.dragPoints(vector);
                shape.draw(this.language, this.front_canvas_context);
            });
            this.clipRectangle.transform(vector);
        }
        this.old_point = this.new_point;
    }

    OnMouseUpDrag(event, point) {
        Log.trace("Scene::OnMouseUpDrag()");
        this.selected_shape_list.forEach(shape => {
            this.restoreFrontBufferRectangleFromBackBuffer(shape);
        });
        this.selected_shape_list.forEach(shape => {
            shape.activateControls();
            shape.draw(this.language, this.front_canvas_context);
        });
        this.switchMotionMode(Scene.START);
    }

    OnMouseDownResize(event, point) {
        Log.trace("Scene::OnMouseDownResize()::selected_shape_list::[" + this.selected_shape_list.length + "]");
        this.selected_shape_list.forEach(shape => {
            shape.deactivateControls();
        });
        this.old_point = this.new_point = point;
    }

    OnMouseMoveResize(event, point) {
        Log.trace("Scene::OnMouseMoveResize()");
        this.new_point = point;
        let vector = new Vector2D(this.new_point, this.old_point);
        if (this.clipRectangle.canClip(vector, this.scene_width, this.scene_height) == true) {
            this.selected_shape_list.forEach(shape => {
                this.restoreFrontBufferRectangleFromBackBuffer(shape);
            });
            this.selected_shape_list.forEach(shape => {
                shape.dragPoints(vector);
                shape.draw(this.language, this.front_canvas_context);
            });
            this.clipRectangle.transform(vector);
        }
        this.old_point = this.new_point;
    }

    OnMouseUpResize(event, point) {
        Log.trace("Scene::OnMouseUpResize()");
        this.selected_shape_list.forEach(shape => {
            this.restoreFrontBufferRectangleFromBackBuffer(shape);
        });
        this.selected_shape_list.forEach(shape => {
            shape.activateControls();
            shape.draw(this.language, this.front_canvas_context);
        });
        this.switchMotionMode(Scene.START);
    }

    OnMouseDownRotate(event, point) {
        Log.trace("Scene::OnMouseDownRotate()::selected_shape_list::[" + this.selected_shape_list.length + "]");
        this.delta_rotation_angle = 0;
        this.old_rotation_angle = 0;
        this.selected_shape_list.forEach(shape => {
            shape.deactivateControls();
        });
        this.rotation_center_point = this.old_point = this.new_point = point;
    }

    OnMouseMoveRotate(event, point) {
        Log.trace("Scene::OnMouseMoveRotate()");
        if (this.rotation_center_point == null) {
            Log.trace("Scene::OnMouseMoveRotate()::rotation_center_point == null!!");
        }
        this.new_point = point;
        this.new_rotation_angle = Geometry.getAngle(this.rotation_center_point, this.new_point);
        this.delta_rotation_angle = this.old_rotation_angle <= this.new_rotation_angle ? this.new_rotation_angle - this.old_rotation_angle : 360 - this.old_rotation_angle + this.new_rotation_angle;
        Log.trace("Scene::OnMouseMoveRotate::Angle", "rotation_center_point, new_point, new_rotation_angle, old_rotation_angle, delta_rotation_angle", this.rotation_center_point, this.new_point, this.new_rotation_angle, this.old_rotation_angle, this.delta_rotation_angle);
        this.old_rotation_angle = this.new_rotation_angle;
        this.selected_shape_list.forEach((shape) => {
            this.restoreFrontBufferRectangleFromBackBuffer(shape);
            shape.rotateAngle(this.delta_rotation_angle);
        });
        this.selected_shape_list.forEach(shape => {
            shape.draw(this.language, this.front_canvas_context);
        });
        this.old_point = this.new_point;
    }

    OnMouseUpRotate(event, point) {
        Log.trace("Scene::OnMouseUpRotate()");
        this.selected_shape_list.forEach(shape => {
            this.restoreFrontBufferRectangleFromBackBuffer(shape);
        });
        this.selected_shape_list.forEach(shape => {
            shape.activateControls();
            shape.draw(this.language, this.front_canvas_context);
        });
        this.switchMotionMode(Scene.START);
        this.rotation_center_point = null;
        this.delta_rotation_angle = 0;
        this.old_rotation_angle = 0;
    }

    clipImage(image_instance) {
        Log.trace("Scene::clipImage()::selected_shape_list::[" + this.selected_shape_list.length + "]");
        this.selected_shape_list.forEach(shape => {
            shape.setClipImage(image_instance);
            shape.draw(this.language, this.front_canvas_context);
        });
    }
    
    deleteSelectedShapes() {
        Log.trace("Scene::deleteSelectedShapes()::selected_shape_list::[" + this.selected_shape_list.length + "]");
        let deleted_shape_id_list = [];
        this.selected_shape_list.forEach(selected_shape => {
            let shaped_index = this.shape_list.findIndex(shape => shape.id == selected_shape.id);
            this.shape_list.splice(shaped_index, 1);
            deleted_shape_id_list.push(selected_shape.id);
        });
        this.selected_shape_list = [];
        this.draw();
        return deleted_shape_id_list;
    }
}
