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


export class FontInstance {
    font_uuid: string;
    font_name: string;
    font_type: string;
    font_src: string;
    constructor(font_uuid: string, font_name: string, font_type: string, font_src: string, font_hash: string);
    static createFontFace(family: string, source: string, descriptors?: object): Promise<any>;
    static fromJSON(font_instance_json: any): FontInstance;
    static fromJSONList(font_instance_list_json: any): FontInstance[];
    toJSON(): {
        font_uuid: string,
        font_name: string,
        font_type: string,
        font_src: string,
        font_hash: string
    };
}