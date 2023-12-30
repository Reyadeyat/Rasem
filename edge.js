/*
 * Copyright (C) 2023 Reyadeyat
 *
 * Reyadeyat/Rasem is licensed under the
 * BSD 3-Clause "New" or "Revised" License
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://reyadeyat.net/LICENSE/RASEM.LICENSE
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Log } from './log.js'

export const line = 1;
export const circular_curve = 1;
export const eleptic_curve = 1;
export const bezier_curve = 1;

export class Edge {
    /*static line = 1;
    static circular_curve = 1;
    static eleptic_curve = 1;
    static bezier_curve = 1;*/
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

    draw(context) {
        if (this.type == Edge.line) {
            context.moveTo(this.start_point.x, this.start_point.y);
            context.lineTo(this.end_point.x, this.end_point.y);
            Log.info("(" + this.start_point.x + ", " + this.start_point.y + ") - (" + this.end_point.x + ", " + this.end_point.y + ")");
        }
    }
}