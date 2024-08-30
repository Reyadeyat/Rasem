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

export class UIToolbar {
    constructor(language: string, direction: string, configuration: any, container_element: any);
    language: string;
    direction: string;
    configuration: any;
    width: any;
    height: any;
    container_element: any;
    container_element_id: any;
    vertical_toolbar_div: HTMLDivElement;
    setWidth(new_width: any): void;
    setHeight(new_height: any): void;
    createControls(control_list: any, language: string, direction: string): void;
    button_list: any;
    language_direction: string;
    changeLanguage(language: string, direction: string): void;
    remove(): void;
}
