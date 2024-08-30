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

export class Tooltip {
    constructor(text: any, hovered_shape: any, font: any, text_style: any, background_style: any);
    text: any;
    hovered_shape: any;
    font: any;
    text_style: any;
    background_style: any;
    draw(context: any, mouse_point: any): void;
    visible: boolean;
}
