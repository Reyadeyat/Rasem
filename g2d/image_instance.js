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

export class ImageInstance {
    constructor(image_html_element, image_uuid, image_name, image_type, image_src, image_hash) {
        this.image_uuid = image_uuid;
        this.image_name = image_name;
        this.image_type = image_type;
        this.image_src = image_src;
        this.image_hash = image_hash;
        if (image_html_element == null) {
            this.image = new Image();
            this.image.src = this.image_src;
        } else {
            this.image = image_html_element;
            this.image.src = image_html_element.src;
        }
        this.image_width = this.image.width;
        this.image_height = this.image.height;
    }

    getImage() {
        return this.image;
    }

    get width() {
        return this.image.width;
    }

    get height() {
        return this.image.height;
    }

    static fromJSON(image_instance_json) {
        return new ImageInstance(image_instance_json.image_html_element, image_instance_json.image_uuid, image_instance_json.image_name, image_instance_json.image_type, image_instance_json.image_src, image_instance_json.image_hash);
    }

    static fromJSONList(image_instance_list_json) {
        let image_instance_list = [];
        image_instance_list_json.forEach(image_instance_json => image_instance_list.push(ImageInstance.fromJSON(image_instance_json)));
        return image_instance_list;
    }

    toJSON() {
        return {
            image_uuid: this.image_uuid,
            image_name: this.image_name,
            image_type: this.image_type,
            image_src: this.image_src,
            image_hash: this.image_hash
        }
    }
}