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

import { Rasem } from '../index.js';
import { Assets } from '../assets.js';
import { TreeDataStructure } from '@reyadeyat/haseb';
import { ShapeUtils } from '../g2d/shape_utils.js';

export class RasemReportEngine {
    constructor(language) {
        this.language = language;
        this.configuration = this.generateConfiguration();
        this.rasem = new Rasem(this.configuration, this.language);
        let x;
        x = this.rasem.getRasemContainer();
        x = this.rasem.getRasemCanvas();
        x = this.rasem.getRasemFrontCanvasContext();
        x = this.rasem.getRasemFrontCanvasContextPixels();
        x = this.rasem.getRasemBackCanvasContext();
        x = this.rasem.getRasemBackCanvasContextPixels();
        x = x;
    }

    changeLanguage(language, direction) {
        this.language = language;
        this.direction = direction;
        this.rasem.changeLanguage(this.language, this.direction);
    }

    generateConfiguration() {
        let dpi = window.devicePixelRatio;
        let ppi = window.devicePixelRatio * 96;
        let page_width = 8.27;
        let page_height = 11.69;
        let scene_width = Math.round((page_width != null && page_width != 0 ? parseFloat(page_width) : 8.27)*ppi);
        let scene_height = Math.round((page_height != null && page_height != 0 ? parseFloat(page_height) : 11.69)*ppi);
        let configuration = {
            language: this.language,
            container_id: "rasem_container",
            status_bar_id: "rasem_container_status_bar",
            height_reduction: 0,
            //height_reduction: 128,
            canvas_fore_color: "white",
            canvas_back_color: "black",
            dpi: dpi,
            ppi: ppi,
            page_width: page_width,
            page_height: page_height,
            scene_width: scene_width,
            scene_height: scene_height,
            control_width: 10,
            log_level_name: 'INFO',
            //log_level_name: 'TRACE_DATA',
            sequence: 100000000,
            margin_x: 10,
            margin_y: 10,
            width: 60,
            height: 30,
            width_gap: 10,
            height_gap: 10,
            tree_inlisted: [],
            tree: [],
            tree_map: new Map(),
            handle_button_click: this.handle_button_click.bind(this),
            handle_select_change: this.handle_select_change.bind(this),
            handle_node_drop: this.handle_node_drop.bind(this),
            handle_node_click: this.handle_node_click.bind(this),
            on_rasem_change_callback: this.on_rasem_change_callback.bind(this)
        };

        let data_section = this.createGrouping(configuration);
        //for (let i = 0; i < 80; i++) {
        for (let i = 0; i < 8; i++) {
            let tree_node = {
                user_data: {
                    shape: {
                        type: "rectangle",
                        id: i + 1,
                        name: {ar: "مربع "+i, en: "Rectangle " + i},
                        insertable: false,
                        selectable: false,
                        draggable: false,
                        hidden: true,
                        resizable: {width: false, height: false},
                        rotation_angle: 0,//i * 4,
                        stroke_style: { color: "orange", line_length: 8, line_gab: 4 }, fill_style: { color: "white" },
                        left_x: configuration.margin_x + (i % 8 * (configuration.width + configuration.width_gap)), top_y: configuration.margin_y + (Math.floor(i / 8) * (configuration.height + configuration.height_gap)), width: configuration.width, height: configuration.height,
                        text: { text: "field_" + (i + 1), font_name: "Arial", font_size: 14, font_style: "bold italic underline", fill_style: "green" },
                        icon: Assets.INSER_FIELD,
                        level: data_section.level+1,
                        order: i
                    }
                },
                id: i+1,
                parent_id: data_section.id,
                parent: data_section,
                name: {ar: "مربع "+i, en: "Rectangle " + i},
                level: data_section.level+1,
                order: i,
                expanded: false,
                draggable: true,
                selected: false,
                visible: true,
                icon: Assets.INSER_FIELD,
                children: []
            };
            data_section.children.push(tree_node);
        }
        
        TreeDataStructure.tree_inlist(configuration.tree, configuration.tree_map, configuration.tree_inlisted);

        this.createVerticalFloatingToolbarConfiguration(configuration);
        
        return configuration;
    }

    addSection(configuration, id, type, title, parent_id, parent_section, order, y, height) {
        let tree_node = {
            user_data: {
                shape: {
                    type: "rectangle",
                    id: id,
                    name: {ar: title + " " + id, en: title + " " + id},
                    insertable: false,
                    selectable: false,
                    draggable: false,
                    expanded: true,
                    hidden: false,
                    resizable: {width: false, height: true},
                    rotation_angle: 0,
                    stroke_style: { color: "green", line_length: 8, line_gab: 4 }, fill_style: { color: "black" },
                    left_x: configuration.margin_x, top_y: configuration.margin_y + y, width: configuration.scene_width - 2 - (configuration.margin_x * 2), height: height,
                    text: { text: "Section " + title + " " +  id, font_name: "Arial", font_size: 14, font_style: "bold italic underline", fill_style: "#FFF4A3" },
                    icon: Assets.INSER_FIELD,
                    level: parent_section == null ? 1 : parent_section.level+1,
                    order: order
                }
            },
            category: "SECTION",
            type: type,
            id: id,
            parent_id: parent_id,
            parent: parent_section,
            name: {ar: title + " " + id, en: title + " " + id},
            level: parent_section == null ? 1 : parent_section.level+1,
            order: order,
            expanded: true,
            draggable: false,
            selected: false,
            visible: true,
            icon: Assets.INSER_FIELD,
            children: []
        };
        if (parent_section != null) {
            parent_section.children = parent_section.children == null ? [] : parent_section.children;
            parent_section.children.push(tree_node);
            parent_section.children.sort((a, b) => {return a.order - b.order;});
        } else {
            configuration.tree.push(tree_node);
        }
        return tree_node;
    }

    addGroup(configuration, id, type, title, parent_id, parent_group, order, y, height) {
        let tree_node = {
            user_data: {
                shape: {
                    type: "rectangle",
                    id: id,
                    name: {ar: title + " " + id, en: title + " " + id},
                    insertable: false,
                    selectable: false,
                    draggable: false,
                    expanded: false,
                    hidden: false,
                    resizable: {width: false, height: true},
                    rotation_angle: 0,
                    stroke_style: { color: "orange", line_length: 8, line_gab: 4 }, fill_style: { color: "white" },
                    left_x: configuration.margin_x, top_y: configuration.margin_y + y, width: configuration.scene_width - 2 - (configuration.margin_x * 2), height: height,
                    text: { text: "Group " + title + " " +  id, font_name: "Arial", font_size: 14, font_style: "bold italic underline", fill_style: "green" },
                    icon: Assets.INSER_FIELD,
                    level: parent_group == null ? 1 : parent_group.level+1,
                    order: order
                }
            },
            category: "GROUP",
            type: type,
            id: id,
            parent_id: parent_id,
            parent: parent_group,
            name: {ar: title + " " + id, en: title + " " + id},
            level: parent_group == null ? 1 : parent_group.level+1,
            order: order,
            expanded: false,
            draggable: false,
            selected: false,
            visible: false,
            icon: Assets.INSER_FIELD,
            children: []
        };
        if (parent_group != null) {
            parent_group.children = parent_group.children == null ? [] : parent_group.children;
            parent_group.children.push(tree_node);
            parent_group.children.sort((a, b) => {return a.order - b.order;});
        } else {
            configuration.tree.push(tree_node);
        }
        return tree_node;
    }

    createGrouping(configuration) {
        let id, type, title, parent_id = -1, parent = null;
        let order = 0, group_y = 1, group_height = 48;
        id = 1000000;
        type = "PAGE_HEADER";
        title = "page_header";
        let page_header_section = this.addSection(configuration, id, type, title, parent_id, parent, id /*++order*/, group_y, group_height);
        id = 1000100;
        type = "REPORT_HEADER";
        title = "report_header";
        group_y += group_height;
        group_height = 48;
        let report_header_section = this.addSection(configuration, id, type, title, parent_id, parent, id /*++order*/, group_y, group_height);
        id = 5000100;
        type = "REPORT_FOOTER";
        title = "report_footer";
        group_y += group_height;
        group_height = 48;
        let report_footer_section = this.addSection(configuration, id, type, title, parent_id, parent, id /*++order*/, group_y, group_height);
        id = 5000200;
        type = "PAGE_FOOTER";
        title = "page_footer";
        group_y += group_height;
        group_height = 48;
        let page_footer_section = this.addSection(configuration, id, type, title, parent_id, parent, id /*++order*/, group_y, group_height);
        id = 3000000;
        type = "RECORD";
        title = "record";
        group_y += group_height;
        group_height = 48;
        let record_section = this.addSection(configuration, id, type, title, parent_id, parent, id /*++order*/, group_y, group_height);
        id = -3000000;
        type = "DATA";
        title = "data";
        //group_y += group_height;
        //group_height = 48;
        let data_section = this.addSection(configuration, id, type, title, parent_id, parent, id /*++order*/, 0, 0);

        id = 2000000;
        type = "GROUP-NODE";
        title = "group a";
        //group_y += group_height;
        //group_height = 48;
        let group_section_2000000 = this.addGroup(configuration, id, type, title, parent_id, parent, id /*++order*/, group_y, group_height);
        id = 2000001;
        type = "GROUP_HEADER";
        title = "group a header";
        group_y += group_height;
        group_height = 48;
        let group_section_2000000_header = this.addSection(configuration, id, type, title, group_section_2000000.id, group_section_2000000, id /*++order*/, group_y, group_height);
        id = 2000002;
        type = "GROUP_FOOTER";
        title = "group a footer";
        group_y += group_height;
        group_height = 48;
        let group_section_2000000_footer = this.addSection(configuration, id, type, title, group_section_2000000.id, group_section_2000000, id /*++order*/, group_y, group_height);

        id = 2000100;
        type = "GROUP-NODE";
        title = "group b";
        //group_y += group_height;
        //group_height = 48;
        let group_section_2000100 = this.addGroup(configuration, id, type, title, group_section_2000000.id, group_section_2000000, id /*++order*/, group_y, group_height);
        id = 2000101;
        type = "GROUP_HEADER";
        title = "group b header";
        group_y += group_height;
        group_height = 48;
        let group_section_2000100_header = this.addSection(configuration, id, type, title, group_section_2000100.id, group_section_2000100, id /*++order*/, group_y, group_height);
        id = 2000102;
        type = "GROUP_FOOTER";
        title = "group b footer";
        group_y += group_height;
        group_height = 48;
        let group_section_2000100_footer = this.addSection(configuration, id, type, title, group_section_2000100.id, group_section_2000100, id /*++order*/, group_y, group_height);
        
        id = 2000200;
        type = "GROUP-NODE";
        title = "group c";
        //group_y += group_height;
        //group_height = 48;
        let group_section_2000200 = this.addGroup(configuration, id, type, title, group_section_2000100.id, group_section_2000100, id /*++order*/, group_y, group_height);
        id = 2000201;
        type = "GROUP_HEADER";
        title = "group c header";
        group_y += group_height;
        group_height = 48;
        let group_section_2000200_header = this.addSection(configuration, id, type, title, group_section_2000200.id, group_section_2000200, id /*++order*/, group_y, group_height);
        id = 2000202;
        type = "GROUP_FOOTER";
        title = "group c footer";
        group_y += group_height;
        group_height = 48;
        let group_section_2000200_footer = this.addSection(configuration, id, type, title, group_section_2000200.id, group_section_2000200, id /*++order*/, group_y, group_height);
        
        id = 2000300;
        type = "GROUP-NODE";
        title = "group d";
        //group_y += group_height;
        //group_height = 48;
        let group_section_2000300 = this.addGroup(configuration, id, type, title, group_section_2000200.id, group_section_2000200, id /*++order*/, group_y, group_height);
        id = 2000301;
        type = "GROUP_HEADER";
        title = "group d header";
        group_y += group_height;
        group_height = 48;
        let group_section_2000300_header = this.addSection(configuration, id, type, title, group_section_2000300.id, group_section_2000300, id /*++order*/, group_y, group_height);
        id = 2000302;
        type = "GROUP_FOOTER";
        title = "group d footer";
        group_y += group_height;
        group_height = 48;
        let group_section_2000300_footer = this.addSection(configuration, id, type, title, group_section_2000300.id, group_section_2000300, id /*++order*/, group_y, group_height);
        
        return data_section;
    }

    handle_button_click(event, module, action, user_data) {
        debugger;
        console.log("module '" + module + "', action '" + action + "', user_data: " + JSON.stringify(user_data, null, 4));
    }

    handle_select_change(event, module, action, user_data) {
        debugger;
        console.log("module '" + module + "', action '" + action + "', user_data: " + JSON.stringify(user_data, null, 4));
    }

    handle_node_drop(event, module, action, user_data) {
        debugger;
        //console.log("module '" + module + "', action '" + action + "', user_data: " + JSON.stringify(user_data, null, 4));
        //this.configuration.tree_inlisted;
        //this.configuration.tree;
        //this.configuration.tree_map;
        let source_node = null;
        let target_node = null;
        if (user_data.source_node != null && user_data.target_node != null) {
            source_node = user_data.source_node;
            target_node = user_data.target_node;
        } else {
            source_node = this.configuration.tree_map.get(user_data.node_id);
            target_node = this.configuration.tree_map.get(user_data.dropped_on_shape_id);
        }
        if (target_node.type == "GROUP-NODE" || target_node.type == "DATA" ||  (target_node.parent != null && target_node.parent.type == "DATA")) {
            return;
        }
        if (source_node != null && target_node != null) {
            let new_id = ++this.configuration.sequence;
            //let child_source_node = JsonUtil.toJSON(source_node, ["element", "parent_id", "parent", "children"]);
            let child_source_node = this.rasem.clone(source_node, ["element", "parent_id", "parent", "children"]);
            child_source_node.user_data = this.rasem.clone(child_source_node.user_data, []);
            child_source_node.user_data.shape = this.rasem.clone(child_source_node.user_data.shape, []);
            child_source_node.evented = false;
            child_source_node.element = null;
            child_source_node.inode_d = new_id;
            child_source_node.parent_id = target_node.inode_d;
            child_source_node.parent = target_node;
            child_source_node.hidden = false;
            child_source_node.expanded = false;
            child_source_node.draggable = false;
            child_source_node.selected = false;
            child_source_node.visible = true;
            child_source_node.level = child_source_node.parent.level + 1;
            child_source_node.order = child_source_node.parent.children.length;
            let parent = child_source_node;
            do {
                parent.expanded = true;
                parent = parent.parent;
            } while (parent != null);
            target_node.children.push(child_source_node);
            this.configuration.tree_inlisted.splice(0, this.configuration.tree_inlisted.length);
            this.configuration.tree_map.clear();
            TreeDataStructure.tree_inlist(this.configuration.tree, this.configuration.tree_map, this.configuration.tree_inlisted);
            //add shape
            let new_shape = child_source_node.user_data.shape;
            new_shape.id = new_id;
            new_shape.insertable = true,
            new_shape.selectable = true,
            new_shape.draggable = true,
            new_shape.hidden = false;
            new_shape.resizable = {width: true, height: true},
            new_shape.width = this.configuration.width;
            new_shape.height = this.configuration.height;
            let shape_point = user_data.point != null ? user_data.point : {x: target_node.user_data.shape.shape_path_bounding_rect.left_top_point.x, y: target_node.user_data.shape.shape_path_bounding_rect.left_top_point.y};
            let shape_rect = {x1: shape_point.x, y1: shape_point.y, x2: shape_point.x + new_shape.width, y2: shape_point.y + new_shape.height};
            if (target_node.user_data.shape.shape_path_bounding_rect.contains(shape_rect) == false) {
                shape_point.y -= (shape_point.y + new_shape.height - target_node.user_data.shape.shape_path_bounding_rect.left_bottom_point.y);
            }
            new_shape.left_x = shape_point.x;
            new_shape.top_y = shape_point.y;
            new_shape.control_width = this.configuration.control_width;
            new_shape.clip_rect = target_node.user_data.shape.shape_clip_bound_rect;
            new_shape = ShapeUtils.creatShape(new_shape);
            //this.rasem.rasem_container.scene.shape_tree_ui.createTreeNode(child_source_node);
            //this.rasem.rasem_container.scene.shape_tree_ui.setTree();
            this.rasem.setTree();
            //this.rasem.rasem_container.scene.addShape(new_shape, false);
            this.rasem.addShape(new_shape, false);            
            //add tree node to meny
            //rebuild menu changeLanguage with smae language
            //TreeDataStructure.tree_inlist(configuration.tree, configuration.tree_map, configuration.tree_inlisted);
        }
    }
    
    handle_node_click(event, module, action, user_data) {
        debugger;
        console.log("module '" + module + "', action '" + action + "', user_data: " + JSON.stringify(user_data, null, 4));
        if (user_data.shape.selectable == false) {
            return;
        }
        let selecte_shape_id = user_data.shape.id;
        //this.rasem.rasem_container.scene.setSelectedShapesByID([selecte_shape_id]);
        this.rasem.setSelectedShapesByID([selecte_shape_id]);
    }

    on_rasem_change_callback(event) {
        debugger;
        let configuration = this.rasem.getRuntimeConfiguration();
        console.log("Runtime configuration: " + JSON.stringify(configuration));
    }

    createVerticalFloatingToolbarConfiguration(configuration) {
        let button_list = [];
        let button = {
            id: "editor_tree_save",
            module: 'editor_tree',
            action: 'save',
            title: {ar: "حفظ", en: "Save"},
            icon: `<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" data-icon="ui-components:save">
                        <g id="g15" transform="translate(-231,-231)"> 
                        <g id="XMLID_34_" transform="matrix(0.05479452,0,0,0.04938272,229.68493,231)"> <g id="g1"> <rect x="68" y="7.5" style="fill:#f2f2f2" width="350" height="471" id="rect1" /> </g> <g id="g3"> <g id="g2"> <path d="M 425.5,486 H 60.5 V 0 h 365 z m -350,-15 h 335 V 15 h -335 z" id="path1" /> </g> </g> </g> <g id="g14" transform="matrix(0.05479452,0,0,0.04938272,229.68493,231)"> <g id="g4"> <rect x="108" y="56" width="270" height="15" id="rect3" /> </g> <g id="g5"> <rect x="108" y="116" width="270" height="15" id="rect4" /> </g> <g id="g6" style="fill:#0041ff;fill-opacity:1"> <rect x="243" y="176" width="135" height="15" id="rect5" style="fill:#0041ff;fill-opacity:1" /> </g> <g id="g7" style="fill:#00e1ff;fill-opacity:1"> <rect x="243" y="236" width="135" height="15" id="rect6" style="fill:#ff0000;fill-opacity:1" /> </g> <g id="g8" style="fill:#0041ff;fill-opacity:1"> <rect x="243" y="296" width="135" height="15" id="rect7" style="fill:#0041ff;fill-opacity:1" /> </g> <g id="g9"> <rect x="108" y="356" width="270" height="15" id="rect8" /> </g> <g id="g10"> <rect x="108" y="416" width="270" height="15" id="rect9" /> </g> <g id="XMLID_32_"> <g id="g11"> <polygon style="fill:#ff0000;fill-opacity:1" points="118,268.5 118,228.5 158,228.5 158,198.5 218,243.5 158,298.5 158,268.5 " id="polygon10" /> </g> <g id="g13" style="fill:#0041ff;fill-opacity:1;stroke:#000000;stroke-opacity:1"> <g id="g12" style="fill:#0041ff;fill-opacity:1;stroke:#000000;stroke-opacity:1"> <path d="M 150.5,315.549 V 276 h -40 v -55 h 40 v -37.5 l 79.229,59.422 z M 125.5,261 h 40 v 20.451 L 206.271,244.078 165.5,213.5 V 236 h -40 z" id="path11" style="fill:#0041ff;fill-opacity:1;stroke:#000000;stroke-opacity:1" /> </g> </g> </g> </g>
                        </g>
                    </svg>`,
            html: function(button, language) { return `
                <button aria-disabled="false" title="${button.title[language]}">
                    ${button.icon}
                </button>`},
            click: this.handle_button_click.bind(this)
        };
        button_list.push(button);

        button = {
            id: "editor_tree_cut",
            module: 'editor_tree',
            action: 'cut',
            title: {ar: "قص", en: "Cut"},
            icon: `<svg viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" data-icon="ui-components:cut">
                        <g xmlns="http://www.w3.org/2000/svg" class="jp-icon3" fill="#616161">
                            <path
                                d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3z">
                            </path>
                        </g>
                    </svg>`,
            html: function(button, language) { return `
                <button aria-disabled="false" title="${button.title[language]}">
                    ${button.icon}
                </button>`},
            click: this.handle_button_click.bind(this)
        };
        button_list.push(button);

        button = {
            id: "editor_tree_copy",
            module: 'editor_tree',
            action: 'copy',
            title: {ar: "نسخ", en: "Copy"},
            icon: `<svg viewBox="0 0 18 18" width="16" xmlns="http://www.w3.org/2000/svg" data-icon="ui-components:copy">
                        <g xmlns="http://www.w3.org/2000/svg" class="jp-icon3" fill="#616161">
                            <path
                                d="M11.9,1H3.2C2.4,1,1.7,1.7,1.7,2.5v10.2h1.5V2.5h8.7V1z M14.1,3.9h-8c-0.8,0-1.5,0.7-1.5,1.5v10.2c0,0.8,0.7,1.5,1.5,1.5h8 c0.8,0,1.5-0.7,1.5-1.5V5.4C15.5,4.6,14.9,3.9,14.1,3.9z M14.1,15.5h-8V5.4h8V15.5z">
                            </path>
                        </g>
                    </svg>`,
            html: function(button, language) { return `
                <button aria-disabled="false" title="${button.title[language]}">
                    ${button.icon}
                </button>`},
            click: this.handle_button_click.bind(this)
        };
        button_list.push(button);

        button = {
            id: "editor_tree_past",
            module: 'editor_tree',
            action: 'past',
            title: {ar: "لصق", en: "Paste"},
            icon: `<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"
                        data-icon="ui-components:paste">
                        <g xmlns="http://www.w3.org/2000/svg" class="jp-icon3" fill="#616161">
                            <path
                                d="M19 2h-4.18C14.4.84 13.3 0 12 0c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z">
                            </path>
                        </g>
                    </svg>`,
            html: function(button, language) { return `
                <button aria-disabled="false" title="${button.title[language]}">
                    ${button.icon}
                </button>`},
            click: this.handle_button_click.bind(this)
        };
        button_list.push(button);

        let vertical_floating_toobar = {
            id: `vertical_floating_toobar_01`,
            class_list: `rasem-vertical-floating-toolbar disable-select`,
            css:
            `
                .rasem-vertical-floating-toolbar {
                    position: absolute;
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    background-color: #f2f2f2;
                    padding: 5px;
                    /*top: calc(((((32px + 10px + 10px) * 6) + 20px) / 2));*/
                    top: 50%;
                    /*left: 5px;*/
                    height: calc(100% - 20%);
                    width: 32px;
                    max-width: 32px;
                    height: calc(((32px + 10px + 10px) * 6) + 20px);
                    transform: translateY(-50%);
                    padding: 10px;
                    border-radius: 5px;
                    z-index: 1000;
                    /*box-shadow: 2px 2px 5px #888888;*/
                    opacity: 0.2;
                    transition: opacity 0.3s; 
                }
                    
                [dir="ltr"] .rasem-vertical-floating-toolbar {
                    right: 5px;
                    box-shadow: -2px 2px 5px #888;
                }
                    
                [dir="rtl"] .rasem-vertical-floating-toolbar {
                    left: 5px;
                    box-shadow: 2px 2px 5px #888888;
                }
                
                .rasem-vertical-floating-toolbar > span {
                    display: flex;
                    align-items: center;
                    width: 32px;
                    max-width: 32px;
                    height: 32px;
                    max-height: 32px;
                    cursor: pointer;
                    border: 0px;
                    padding: 0px;
                    margin: 10px 0px;
                }

                .rasem-vertical-floating-toolbar > span > button {
                    display: flex;
                    width: 32px;
                    max-width: 32px;
                    height: 32px;
                    max-height: 32px;
                    cursor: pointer;
                    border: 0px;
                    padding: 0px;
                    margin: 10px 0px;
                }
                    
                .rasem-vertical-floating-toolbar > span > button > svg {
                    border: dashed 1px darkgrey;
                    background: none;
                    width: 28px;
                    max-width: 28px;
                    height: 28px;
                    max-height: 28px;
                    cursor: pointer;
                    padding: 0;
                    margin: 0 auto;
                }

                [dir="ltr"] .rasem-vertical-floating-toolbar > span > button > svg {
                    transform: scaleX(-1);
                }

                [dir="rtl"] .rasem-vertical-floating-toolbar > span > button > svg {
                    transform: scaleX(1);
                }
                    
                .rasem-vertical-floating-toolbar:hover {
                    opacity: 1; /* Set opacity to 100% on hover */
                }        
            `,
            button_list: button_list
        };
        configuration.vertical_floating_toobar = vertical_floating_toobar;
    }
}