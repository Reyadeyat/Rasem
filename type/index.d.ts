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

import { Paint } from './ui2d/paint.js';
import { RasemContainer } from './ui/rasem_container.js';
import { ShapeUtils } from './g2d/shape_utils.js';
import { Text2D } from './g2d/text.js';
import { FillStyle2D, StrokeStyle2D, FontStyle2D, FontStrokeStyle2D, FontFillStyle2D, Resizable2D } from './data-structure/g2d-data-structure.js';
import { Shape } from './g2d/shape.js';
import { ImageInstance } from './g2d/image_instance.js';
import { FontInstance } from './g2d/font_instance.js';
export declare class Rasem extends Paint {
    constructor(json_configuration_file: any, language: string, direction: string);
    getRasemContainer(): any;
    getRasemCanvas(): HTMLCanvasElement;
    getRasemFrontCanvasContext(): CanvasRenderingContext2D;
    getRasemFrontCanvasContextPixels(): ImageData;
    getRasemBackCanvasContext(): CanvasRenderingContext2D;
    getRasemBackCanvasContextPixels(): CanvasRenderingContext2D;
    changeLanguage(language: string, direction: string): CanvasRenderingContext2D;
    loadConfiguration(configuration: any, language: string, direction: string): void;
    configuration: any;
    creator_container: RasemContainer;
    creatShape(new_shape: any): any;
    deleteSelectedShapes(): number[];
    clone(source_node: any, transient_list: string[]): any;
    setTree(): void;
    addShape(new_shape: Shape, draw_shape: boolean): void;
    setSelectedShapesByID(selecte_shape_id_list: any[]): void;
    getRuntimeConfiguration(): any;
    toggleFullScreen(): void;
    draw(): void;
}

export {ShapeUtils, FillStyle2D, StrokeStyle2D, FontStyle2D, FontStrokeStyle2D, FontFillStyle2D, Text2D, Resizable2D, ImageInstance, FontInstance};
