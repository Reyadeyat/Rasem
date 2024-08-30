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

export class Scene {
    static NONE: number;
    static START: number;
    static DRAG: number;
    static RESIZE: number;
    static ROTATE: number;
    static END: number;
    static getMotionMode(motion_mode_name: any): any;
    static getMotionModeName(motion_mode: any): "RESIZE" | "ROTATE" | "NONE" | "START" | "HOVER" | "DRAG" | "END";
    constructor(configuration: any, scene_container_id: any, status_bar_id: any, height_reduction: any, fore_color: any, back_color: any, control_width: any, dpi: any, ppi: any, width: any, height: any, handle_control_event: any);
    language: string;
    direction: string;
    dpi: any;
    ppi: any;
    width: any;
    height: any;
    portrait_page: Rectangle_2D;
    landescape_page: Rectangle_2D;
    scene_width: any;
    scene_height: any;
    shape_list: any[];
    shape_map: any;
    scene_container_id: any;
    status_bar_id: any;
    height_reduction: any;
    canvas_container_element: HTMLElement;
    control_width: any;
    ui_vertical_toolbar: UIToolbar;
    scene_container_board: HTMLDivElement;
    front_canvas: HTMLCanvasElement;
    rasem_menu: RasemMenu;
    handle_control_event: any;
    ui_tree: UITree;
    is_full_screen_mode: boolean;
    front_canvas_context: CanvasRenderingContext2D;
    front_canvas_context_pixels: ImageData;
    selected_shape_list: any[];
    click_on_board: boolean;
    back_canvas: HTMLCanvasElement;
    back_canvas_context: CanvasRenderingContext2D;
    fore_color: any;
    back_color: any;
    changeLanguage(language: string, direction: string): void;
    fixHeight(): void;
    getUITree(): any[];
    updateFrontCanvasBoundingRect(): void;
    front_canvas_bounding_rect: DOMRect;
    getFrontCanvasBoundingRect(): DOMRect;
    getPoint(event: any): Point;
    switchMotionMode(new_motion_mode: any): void;
    motion_mode: any;
    isMotionMode(motion_mode: any): boolean;
    cleanFrontBuffer(): void;
    clean(context: any): void;
    addShape(new_shape: Shape, draw_shape: boolean): void;
    draw(): void;
    saveFrontBufferToBackBuffer(): void;
    restoreFrontBufferFromBackBuffer(): void;
    restoreFrontBufferRectangleFromBackBuffer(shape: any): void;
    redrawOnBackBuffer(): void;
    drawUnselectedShapesToBackBuffer(): void;
    getShapesUnderPoint(point: any): any[];
    isHoveringShape(event: any, point: any): any;
    activateHovering(hovered_shape: any): void;
    hovering_canceled: boolean;
    hovered_shape: any;
    cancelHovering(): void;
    tooltip_timer: any;
    hide_tooltip_timer: number;
    isInShape(event: any, point: any): boolean;
    isInShapeOrControl(event: any, point: any): boolean;
    isInSelectedShapeOrControl(event: any, point: any): boolean;
    selectShape(event: any, point: any): boolean;
    clipRectangle: any;
    deselectAllShapes(): void;
    setSelectedShapes(selected_shape_list: any): void;
    setSelectedShapesByID(selected_shape_id_list: any): void;
    OnMouseDown(event: any, point: any): void;
    OnMouseMove(event: any, point: any): void;
    OnMouseUp(event: any, point: any): void;
    OnMouseMoveHover(event: any, point: any): void;
    tooltip: Tooltip;
    OnMouseDownDrag(event: any, point: any): void;
    old_point: any;
    new_point: any;
    OnMouseMoveDrag(event: any, point: any): void;
    OnMouseUpDrag(event: any, point: any): void;
    OnMouseDownResize(event: any, point: any): void;
    OnMouseMoveResize(event: any, point: any): void;
    OnMouseUpResize(event: any, point: any): void;
    OnMouseDownRotate(event: any, point: any): void;
    delta_rotation_angle: number;
    old_rotation_angle: number;
    rotation_center_point: any;
    OnMouseMoveRotate(event: any, point: any): void;
    new_rotation_angle: number;
    OnMouseUpRotate(event: any, point: any): void;
    clipImage(image_instance: ImageInstance, image_name: any, image_type: any): void;
    addImage(html_image_element: HTMLImageElement, image_src: string, image_name: string, image_type: string, image_src_blob: Blob): void;
    addFont(font_src: string, font_name: string, font_type: string, font_src_blob: Blob): void;
    deleteSelectedShapes(): number[];
}
import { Rectangle_2D } from '../math/geometry.js';
import { UIToolbar } from '../ui/ui-toolbar.js';
import { RasemMenu } from './menu.js';
import { UITree } from '../ui/ui-tree.js';
import { Point } from '../g2d/point.js';
import { Tooltip } from '../g2d/tooltip.js';
import { Shape } from '../g2d/shape.js';
import { ImageInstance } from '../g2d/image_instance.js';


