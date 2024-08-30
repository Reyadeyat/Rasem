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

export class Point {
    /*x;
    y;*/
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    moveTo(context) {
        context.moveTo(this.x, this.y);
    }

    lineTo(context) {
        context.lineTo(this.x, this.y);
    }

    pathMoveTo(path2d) {
        path2d.moveTo(this.x, this.y);
    }

    pathLineTo(path2d) {
        path2d.lineTo(this.x, this.y);
    }

    toString() {
        return `(${this.x}, ${this.y})`;
    }
}
