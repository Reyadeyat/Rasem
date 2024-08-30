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

import { Paint } from './ui2d/paint.js';
import { ShapeUtils } from './g2d/shape_utils.js';
import { Text2D } from './g2d/text.js';
import { FillStyle2D, StrokeStyle2D, FontStyle2D, FontStrokeStyle2D, FontFillStyle2D, Resizable2D } from './data-structure/g2d-data-structure.js';
import { ImageInstance } from './g2d/image_instance.js';
import { FontInstance } from './g2d/font_instance.js';

export class Rasem extends Paint {

    constructor(json_configuration_file, rutime_language) {
        super(json_configuration_file);
        this.loadConfiguration(this.json_configuration_file, rutime_language);
    }

    getRasemContainer() {
        return this.rasem_container.scene.container_element;
    }

    getRasemCanvas() {
        return this.rasem_container.scene.front_canvas;
    }

    getRasemFrontCanvasContext() {
        return this.rasem_container.scene.front_canvas_context;
    }

    getRasemFrontCanvasContextPixels() {
        return this.rasem_container.scene.front_canvas_context_pixels;
    }

    getRasemBackCanvasContext() {
        return this.rasem_container.scene.back_canvas_context;
    }

    getRasemBackCanvasContextPixels() {
        return this.rasem_container.scene.back_canvas_context;
    }

    changeLanguage(language, direction) {
        this.language = language;
        this.direction = direction;
        this.rasem_container.changeLanguage(this.language, this.direction);
        return this.rasem_container.scene.back_canvas_context;
    }

    /* process.*/
    loadConfiguration(configuration, language, direction) {
        this.language = language;
        this.direction = direction;
        this.configuration = configuration;
        if (this.rasem_container != null) {
            this.rasem_container.clean();
        }
        let tree_inlisted = this.configuration.tree_inlisted;
        let scene_shape_list = [];//this.configuration.tree_inlisted;
        for (let i = 0; i < this.configuration.tree_inlisted.length; i++) {
            let tree_node = tree_inlisted[i];
            /*if (tree_node.type == "GROUP" || tree_node.type == "DATA" || tree_node.category == "ASSETS" || tree_node.type == "FONTS" || tree_node.type == "IMAGES"
            || (tree_node.node_parent != null && (tree_node.node_parent.type == "DATA" || tree_node.node_parent.category == "ASSETS" || tree_node.node_parent.type == "FONTS" || tree_node.type == "IMAGES"))
            )*/
            /*if (shape_configuration.type == true) {
                continue;
            }*/
            if (tree_node.node_id <= 0 || tree_node.type == "GROUP") {
                continue;
            }
            let shape_configuration = tree_inlisted[i].user_data.shape;
            shape_configuration.control_width = this.configuration.control_width;
            tree_inlisted[i].user_data.shape = ShapeUtils.creatShape(shape_configuration);
            let shape = tree_inlisted[i].user_data.shape;
            if (shape.clip_rect_shape_id != null) {
                let clipping_shape = scene_shape_list.find(t_shape => t_shape.id == shape.clip_rect_shape_id);
                shape.clip_rect = clipping_shape.shape_clip_bound_rect;
            }
            scene_shape_list.push(shape);
        }
        
        this.rasem_container = new RasemContainer(this.configuration, this.container_id, language, direction);
        this.rasem_container.scene.setOnRasemChangeCallBack(this.configuration.on_rasem_external_callback);
        this.rasem_container.scene.clean(this.rasem_container.scene.front_canvas_context);

        for (let i = 0; i < scene_shape_list.length; i++) {
            let shape = scene_shape_list[i];
            this.rasem_container.scene.addShape(shape);
        }
        this.rasem_container.scene.draw();
    }

    creatShape(new_shape) {
        return ShapeUtils.creatShape(new_shape);
    }

    setTree() {
        this.rasem_container.scene.ui_tree.setTree();
    }
    
    addShape(new_shape, draw_shape) {
        this.rasem_container.scene.deselectAllShapes();
        this.rasem_container.scene.addShape(new_shape, draw_shape);
    }
    
    setSelectedShapesByID(selecte_shape_id_list) {
        this.rasem_container.scene.deselectAllShapes();
        this.rasem_container.scene.setSelectedShapesByID(selecte_shape_id_list);
    }

    getRuntimeConfiguration() {
        return this.json_configuration_file;
    }

    toggleFullScreen() {
        this.rasem_container.handleFullScreen();
    }

    draw() {
        this.creator_container.scene.draw();
    }
}

export {ShapeUtils, FillStyle2D, StrokeStyle2D, FontStyle2D, FontStrokeStyle2D, FontFillStyle2D, Text2D, Resizable2D, ImageInstance, FontInstance};


