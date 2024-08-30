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

export class RasemReportEngine {
    constructor(language: any);
    language: any;
    configuration: {
        language: any;
        container_id: string;
        status_bar_id: string;
        height_reduction: number;
        canvas_fore_color: string;
        canvas_back_color: string;
        dpi: number;
        ppi: number;
        page_width: number;
        page_height: number;
        scene_width: number;
        scene_height: number;
        control_width: number;
        log_level_name: string;
        sequence: number;
        margin_x: number;
        margin_y: number;
        width: number;
        height: number;
        width_gap: number;
        height_gap: number;
        tree_inlisted: any[];
        tree: any[];
        tree_map: any;
        handle_button_click: any;
        handle_select_change: any;
        handle_node_drop: any;
        handle_node_click: any;
        on_rasem_change_callback: any;
    };
    rasem: Rasem;
    changeLanguage(language: any, direction: any): void;
    direction: any;
    generateConfiguration(): {
        language: any;
        container_id: string;
        status_bar_id: string;
        height_reduction: number;
        canvas_fore_color: string;
        canvas_back_color: string;
        dpi: number;
        ppi: number;
        page_width: number;
        page_height: number;
        scene_width: number;
        scene_height: number;
        control_width: number;
        log_level_name: string;
        sequence: number;
        margin_x: number;
        margin_y: number;
        width: number;
        height: number;
        width_gap: number;
        height_gap: number;
        tree_inlisted: any[];
        tree: any[];
        tree_map: any;
        handle_button_click: any;
        handle_select_change: any;
        handle_node_drop: any;
        handle_node_click: any;
        on_rasem_change_callback: any;
    };
    addSection(configuration: any, id: any, type: any, title: any, parent_id: any, parent_section: any, order: any, y: any, height: any): {
        user_data: {
            shape: {
                type: string;
                id: any;
                name: {
                    ar: string;
                    en: string;
                };
                insertable: boolean;
                selectable: boolean;
                draggable: boolean;
                expanded: boolean;
                hidden: boolean;
                resizable: {
                    width: boolean;
                    height: boolean;
                };
                rotation_angle: number;
                stroke_style: {
                    color: string;
                    line_length: number;
                    line_gab: number;
                };
                fill_style: {
                    color: string;
                };
                left_x: any;
                top_y: any;
                width: number;
                height: any;
                text: {
                    text: string;
                    font_name: string;
                    font_size: number;
                    font_style: string;
                    fill_style: string;
                };
                icon: string;
                level: any;
                order: any;
            };
        };
        category: string;
        type: any;
        node_id: any;
        node_parent_id: any;
        node_parent: any;
        name: {
            ar: string;
            en: string;
        };
        node_level: any;
        node_order: any;
        expanded: boolean;
        draggable: boolean;
        selected: boolean;
        visible: boolean;
        icon: string;
        children: any[];
    };
    addGroup(configuration: any, id: any, type: any, title: any, parent_id: any, parent_group: any, order: any, y: any, height: any): {
        user_data: {
            shape: {
                type: string;
                id: any;
                name: {
                    ar: string;
                    en: string;
                };
                insertable: boolean;
                selectable: boolean;
                draggable: boolean;
                expanded: boolean;
                hidden: boolean;
                resizable: {
                    width: boolean;
                    height: boolean;
                };
                rotation_angle: number;
                stroke_style: {
                    color: string;
                    line_length: number;
                    line_gab: number;
                };
                fill_style: {
                    color: string;
                };
                left_x: any;
                top_y: any;
                width: number;
                height: any;
                text: {
                    text: string;
                    font_name: string;
                    font_size: number;
                    font_style: string;
                    fill_style: string;
                };
                icon: string;
                level: any;
                order: any;
            };
        };
        category: string;
        type: any;
        node_id: any;
        node_parent_id: any;
        node_parent: any;
        name: {
            ar: string;
            en: string;
        };
        node_level: any;
        node_order: any;
        expanded: boolean;
        draggable: boolean;
        selected: boolean;
        visible: boolean;
        icon: string;
        children: any[];
    };
    createGrouping(configuration: any): {
        user_data: {
            shape: {
                type: string;
                id: any;
                name: {
                    ar: string;
                    en: string;
                };
                insertable: boolean;
                selectable: boolean;
                draggable: boolean;
                expanded: boolean;
                hidden: boolean;
                resizable: {
                    width: boolean;
                    height: boolean;
                };
                rotation_angle: number;
                stroke_style: {
                    color: string;
                    line_length: number;
                    line_gab: number;
                };
                fill_style: {
                    color: string;
                };
                left_x: any;
                top_y: any;
                width: number;
                height: any;
                text: {
                    text: string;
                    font_name: string;
                    font_size: number;
                    font_style: string;
                    fill_style: string;
                };
                icon: string;
                level: any;
                order: any;
            };
        };
        category: string;
        type: any;
        node_id: any;
        node_parent_id: any;
        node_parent: any;
        name: {
            ar: string;
            en: string;
        };
        node_level: any;
        node_order: any;
        expanded: boolean;
        draggable: boolean;
        selected: boolean;
        visible: boolean;
        icon: string;
        children: any[];
    };
    handle_button_click(event: any, module: any, action: any, user_data: any): void;
    handle_select_change(event: any, module: any, action: any, user_data: any): void;
    handle_node_drop(event: any, module: any, action: any, user_data: any): void;
    handle_node_click(event: any, module: any, action: any, user_data: any): void;
    on_rasem_change_callback(event: any): void;
    createVerticalFloatingToolbarConfiguration(configuration: any): void;
}
import { Rasem } from '../index.js';
