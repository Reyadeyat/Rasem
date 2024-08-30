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

export class EdgeType {
    static get line_connector() {return 1};
    static get circular_curve_connector() {return 2};
    static get eleptic_curve_connector() {return 3};
    static get bezier_curve_connector() {return 4};
}

export class Edge {
    /*type;
    start_point;
    end_point;
    center_point;*/
    constructor(type, start_point, end_point) {
        this.type = type;
        this.start_point = start_point;
        this.end_point = end_point;
    }

    static doEdges(path_points, edge_type, is_line) {
        let edges_array = [];
        for (let i = 1; i < path_points.length; i++) {
            let start_point = path_points[i - 1];
            let end_point = path_points[i];
            let edge = new Edge(edge_type, start_point, end_point);
            edges_array.push(edge);
        }
        if (is_line == false) {
            let start_point = path_points[path_points.length - 1];
            let end_point = path_points[0];
            let edge = new Edge(edge_type, start_point, end_point);
            edges_array.push(edge);
        }
        return edges_array;
    }

    preDraw(context) {

    }

    postDraw(context) {
        
    }
}