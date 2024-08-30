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

import { Scene } from '../ui2d/scene.js';
import { UIToolbar } from './ui-toolbar.js';

export class RasemContainer {
    
    constructor(configuration, container_id, language) {
        this.clean();
        this.configuration = configuration;
        this.container_id = container_id;
        this.container_element = document.getElementById(this.container_id);
        this.language = language;
        this.width = configuration.page_width;
        this.height = configuration.page_height, 
        this.dpi = window.devicePixelRatio;
        this.ppi = this.dpi * 96;
        this.width = Math.round((this.width != null && this.width != 0 ? parseFloat(this.width) : 8.27)*this.ppi);
        this.height = Math.round((this.height != null && this.height != 0 ? parseFloat(this.height) : 11.69)*this.ppi);
        this.rasem_top_toolbar = new UIToolbar(configuration.language, configuration.direction, configuration.rasem_top_toolbar, this.container_element);

        let rasem_board_css =
        `
        .rasem_board {
            direction: ltr;
            resize: none;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            /*align-items: flex-start;*/
            background-color: darkgrey;
            margin: auto;
            width: 100% !important;
            /*height: 100% !important;*/
            overflow: hidden;
        }

        .rasem_board_ltr {
            /*align-items: flex-start;*/
            flex-direction: row;
        }

        .rasem_board_rtl {
            /*align-items: flex-end;*/
            flex-direction: row-reverse;
        }

        .rasem_board:fullscreen {
            align-items: center;
        }

        .rasem_canvas {
            outline: none;
            border: 0px dashed rgba(0, 255, 0, 0.0 ) !important;
        }

        .rasem_canvas:focus {
            outline: none;
            border: 0px dashed rgba(0, 255, 0, 1) !important;
        }

        .rasem_scene_board {
            overflow: auto;
        }
        `;

        var style = document.createElement('style');
        style.innerHTML = rasem_board_css;
        document.head.appendChild(style);

        // Insert the HTML block
        
        this.scene_container = document.createElement('div');
        this.scene_container.id = this.container_id + '_scene_'+Math.random();
        this.scene_container.innerHTML = ``;
        this.scene_container.classList.add("rasem_board");
        this.container_element.appendChild(this.scene_container);
        this.on_rasem_change_callback = this.configuration.on_rasem_change_callback;
        this.scene = new Scene(configuration, this.scene_container.id, configuration.status_bar_id, configuration.height_reduction, configuration.canvas_fore_color, configuration.canvas_back_color, configuration.control_width, this.dpi, this.ppi, this.width, this.height, this.handle_button_click.bind(this), this.handle_select_change.bind(this), this.configuration.handle_node_drop, this.configuration.handle_node_click, this.configuration.handle_add_image, this.configuration.handle_add_font, this.on_rasem_change_callback, language);
        
        this.changeLanguage(this.language);
    }
    
    getContainerID() {
        return this.scene_container.id;
    }

    getContainer() {
        return this.scene_container;
    }

    clean() {
        if (this.scene_container != null) {
            this.scene_container.remove();
            this.scene_container = null;
        }
        if (this.rasem_top_toolbar != null) {
            this.rasem_top_toolbar.remove();
            this.rasem_top_toolbar = null;
        }
    }

    changeLanguage(language, direction) {
        this.language = language;
        this.direction = direction;
        this.setDirection();
        this.scene.changeLanguage(this.language, this.direction);
    }

    setDirection() {
        this.direction = window.getComputedStyle(this.container_element).getPropertyValue('direction');
        if (this.direction == "ltr") {
            this.scene_container.classList.add("rasem_board_ltr");
            this.scene_container.classList.remove("rasem_board_rtl");
        } else {
            this.scene_container.classList.remove("rasem_board_ltr");
            this.scene_container.classList.add("rasem_board_rtl");
        }
    }

    handleFullScreen() {
        if (document.fullscreenElement == null) {
            if (this.container_element.requestFullscreen) {
                this.container_element.requestFullscreen();
            } else if (this.container_element.mozRequestFullScreen) {
                this.container_element.mozRequestFullScreen();
            } else if (this.container_element.webkitRequestFullscreen) {
                this.container_element.webkitRequestFullscreen();
            } else if (this.container_element.msRequestFullscreen) {
                this.container_element.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }
}