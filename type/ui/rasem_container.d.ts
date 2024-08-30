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

export class RasemContainer {
    constructor(configuration: any, container_id: string, language: string, direction: string);
    configuration: any;
    container_id: string;
    container_element: HTMLElement;
    language: string;
    direction: string;
    width: number;
    height: number;
    dpi: number;
    ppi: number;
    ui_toolbar: UIToolbar;
    scene_container: HTMLDivElement;
    on_rasem_external_callback: any;
    scene: Scene;
    getContainerID(): string;
    getContainer(): HTMLDivElement;
    clean(): void;
    changeLanguage(language: string, direction: string): void;
    setDirection(): void;
    toggleFullScreen(): void;
}
import { UIToolbar } from './ui-toolbar.js';
import { Scene } from '../ui2d/scene.js';
