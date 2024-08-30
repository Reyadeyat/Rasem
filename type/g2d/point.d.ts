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

export class Point {
    constructor(x: any, y: any);
    x: any;
    y: any;
    moveTo(context: any): void;
    lineTo(context: any): void;
    pathMoveTo(path2d: any): void;
    pathLineTo(path2d: any): void;
    toString(): string;
}
