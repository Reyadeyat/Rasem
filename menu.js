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

import { Log } from "./log";
import { Point } from "./point";

export class RasemMenu {

    constructor(rasem_scene) {
        const rasem_menu = this;
        // Create the menu and select list elements dynamically
        this.menu = document.createElement("div");
        this.menu.classList.add("rasem-canvas-menu");
        document.body.appendChild(this.menu);

        this.ul = document.createElement("ul");
        this.menu.appendChild(this.ul);

        // Add menu items
        this.menu_item_list = ["Menu Item 1", "Menu Item 2", "Menu Item 3", "Menu Item 4", "Menu Item 5"];
        for (const item of this.menu_item_list) {
            const li = document.createElement("li");
            li.textContent = item;
            this.ul.appendChild(li);
        }

        this.select_list = document.createElement("select");
        //this.select_list.classList.add("rasem-canvas-menu-select-list");
        //this.menu.appendChild(this.select_list);
        this.ul.appendChild(this.select_list);

        // CSS styles for the menu and select list
        this.menu_style = `
            .rasem-canvas-menu {
                position: absolute;
                display: none;
                background-color: #fff;
                border: 1px solid #ccc;
                padding: 10px;
            }

            /*.rasem-canvas-menu-select-list {
                position: absolute;
                display: none;
                background-color: #fff;
                border: 1px solid #ccc;
                padding: 10px;
                max-height: 150px;
                overflow-y: auto;
            }*/
        `;

        // Append the CSS styles to the head of the document
        this.menu_style_element = document.createElement("style");
        this.menu_style_element.textContent = this.menu_style;
        document.head.appendChild(this.menu_style_element);

        // Event listener for right-click on the rasem_canvas
        rasem_scene.front_canvas.addEventListener("contextmenu", function (event) {
            const x = event.clientX;
            const y = event.clientY;
            const point = new Point(event.pageX - rasem_scene.CanvasBoundingRect.left, event.pageY - rasem_scene.CanvasBoundingRect.top);
            let shape_list = rasem_scene.getShapesUnderPoint(point);
            rasem_menu.setOptionList(shape_list);
            event.preventDefault();
            rasem_menu.menu.style.left = x + "px";
            rasem_menu.menu.style.top = y + "px";
            rasem_menu.menu.style.display = "block";
            rasem_menu.select_list.style.display = "block";
        });

        // Event listener to hide the menu and select list when rasem_canvas is clicked
        rasem_scene.front_canvas.addEventListener("click", function (event) {
            const x = event.clientX;
            const y = event.clientY;
            const point = new Point(event.pageX - rasem_scene.CanvasBoundingRect.left, event.pageY - rasem_scene.CanvasBoundingRect.top);
            let shape_list = rasem_scene.getShapesUnderPoint(point);
            if (shape_list.length < 2) {
                rasem_menu.menu.style.display = "none";
                return;
            }
            rasem_menu.setOptionList(shape_list);
            event.preventDefault();
            rasem_menu.menu.style.left = x + "px";
            rasem_menu.menu.style.top = y + "px";
            rasem_menu.menu.style.display = "block";
            rasem_menu.select_list.style.display = "block";
        });

        // Event listener to show the select list when the rasem_canvas is clicked
        this.menu.addEventListener("click", function (event) {
            rasem_menu.select_list.style.left = rasem_menu.menu.style.left;
            rasem_menu.select_list.style.top = rasem_menu.menu.style.top;
            //rasem_menu.select_list.style.display = "block";
            rasem_menu.menu.style.display = "none";
            //rasem_menu.select_list.style.display = "none";
        });

        // Event listener to prevent select list from hiding when clicked
        this.select_list.addEventListener("click", function (event) {
            event.stopPropagation();
        });

        // Event listener to get the selected item on click
        this.select_list.addEventListener("change", function(event) {
            const selectedValue = event.target.value;
            Log.trace("Selected value: " + selectedValue);
            rasem_menu.menu.style.display = "none";
        });
    }

    setOptionList(select_option_list) {
        // Remove all options from the select list
        while (this.select_list.options.length > 0) {
            this.select_list.remove(0);
        }
        this.select_option_list = select_option_list;
        for (const option of this.select_option_list) {
            const opt = document.createElement("option");
            opt.value = option;
            opt.textContent = option;
            // Add select list options
            this.select_list.appendChild(opt);
        }
    }
}