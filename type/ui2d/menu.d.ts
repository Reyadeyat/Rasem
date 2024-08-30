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

export class RasemMenu {
    constructor(rasem_scene: any);
    menu: HTMLDivElement;
    ul: HTMLUListElement;
    menu_item_list: string[];
    select_list: HTMLSelectElement;
    menu_style: string;
    menu_style_element: HTMLStyleElement;
    changeLanguage(language: any, direction: any): void;
    language: any;
    setOptionList(select_option_list: any): void;
    select_option_list: any;
}
