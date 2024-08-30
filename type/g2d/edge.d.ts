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

export declare class EdgeType {
    static line_connector: number;
    static circular_curve_connector: number;
    static eleptic_curve_connector: number;
    static bezier_curve_connector: number;
}
export class Edge {
    static doEdges(path_points: any, edge_type: any, is_line: any): Edge[];
    constructor(type: any, start_point: any, end_point: any);
    type: any;
    start_point: any;
    end_point: any;
    preDraw(context: any): void;
    postDraw(context: any): void;
}
