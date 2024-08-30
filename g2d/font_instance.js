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

export class FontInstance {
    constructor(font_uuid, font_name, font_type, font_src, font_hash) {
        this.font_uuid = font_uuid;
        this.font_name = font_name;
        this.font_type = font_type;
        this.font_src = font_src;
        this.font_hash = font_hash;
    }

    static createFontFace(family, source, descriptors) {
        return new FontFace(family, source, descriptors).load();
    }

    static fromJSON(font_instance_json) {
        return new FontInstance(font_instance_json.font_uuid, font_instance_json.font_name, font_instance_json.font_type, font_instance_json.font_src, font_instance_json.font_hash);
    }

    static fromJSONList(font_instance_list_json) {
        let font_instance_list = [];
        font_instance_list_json.forEach(font_instance_json => font_instance_list.push(FontInstance.fromJSON(font_instance_json)));
        return font_instance_list;
    }

    toJSON() {
        return {
            font_uuid: this.font_uuid,
            font_name: this.font_name,
            font_type: this.font_type,
            font_src: this.font_src,
            font_hash: this.font_hash
        }
    }
}