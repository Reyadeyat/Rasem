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

export class ImageInstance {
    image_uuid: string;
    image_name: string;
    image_type: string;
    image_src: string;
    readonly width: number;
    readonly height: number;
    constructor(image_html_element: HTMLImageElement, image_uuid: string, image_name: string, image_type: string, image_src: string, image_hash: string);
    getImage(): HTMLImageElement;
    static fromJSON(image_instance_json: any): ImageInstance;
    static fromJSONList(image_instance_list_json: any): ImageInstance[];
    toJSON(): {
        image_uuid: string,
        image_name: string,
        image_type: string,
        image_src: string,
        image_hash: string
    }
}