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

export default Rasem;
export declare class Rasem {
    constructor(rassam_json: any);
    html_element: any;
    article_json: any;
    draw(): void;
    getRassamContainer() : HTMLDivElement;
    getRassamCanvas() : HTMLCanvasElement;
    getRassamFrontCanvasContext() : any;
    getRassamFrontCanvasContextPixels() : any;
    getRassamBackCanvasContext() : any;
    getRassamBackCanvasContextPixels() : any;
}
