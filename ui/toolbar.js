/*
 * Copyright (C) 2023 - 2024 Reyadeyat
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

"use strict";

export class UI_Toolbar {
    constructor(container_element, handle_button_click, handle_select_change) {
        this.container_element = container_element;
        this.container_element_id = container_element.id;
        if (this.container_element_id == null) {
            throw new Error('Element ID is null !!!');
        }
        this.handle_button_click = handle_button_click;
        this.handle_select_change = handle_select_change;
        // Apply the CSS rule string
        var style = document.createElement('style');
        style.innerHTML = this.getCss();
        document.head.appendChild(style);

        // Insert the HTML block
        this.toolbar_div = document.createElement('div');
        this.toolbar_div.id = this.container_id + '_toolbar';
        this.toolbar_div.innerHTML = this.getHtml();
        this.container_element.appendChild(this.toolbar_div);

        document.getElementById(this.container_id + '_toolbar_save').addEventListener('click', (event) => { this.handle_button_click(event, 'save'); });
        document.getElementById(this.container_id + '_toolbar_insert').addEventListener('click', (event) => { this.handle_button_click(event, 'insert'); });
        document.getElementById(this.container_id + '_toolbar_cut').addEventListener('click', (event) => { this.handle_button_click(event, 'cut'); });
        document.getElementById(this.container_id + '_toolbar_copy').addEventListener('click', (event) => { this.handle_button_click(event, 'copy'); });
        document.getElementById(this.container_id + '_toolbar_paste').addEventListener('click', (event) => { this.handle_button_click(event, 'paste'); });
        document.getElementById(this.container_id + '_toolbar_run').addEventListener('click', (event) => { this.handle_button_click(event, 'run'); });
        document.getElementById(this.container_id + '_toolbar_interrupt').addEventListener('click', (event) => { this.handle_button_click(event, 'interrupt'); });
        document.getElementById(this.container_id + '_toolbar_restart').addEventListener('click', (event) => { this.handle_button_click(event, 'restart'); });
        document.getElementById(this.container_id + '_toolbar_restart_all').addEventListener('click', (event) => { this.handle_button_click(event, 'restart_all'); });
        document.getElementById(this.container_id + '_toolbar_select_image').addEventListener('click', (event) => { this.handle_button_click(event, 'select_image'); });
        document.getElementById(this.container_id + '_toolbar_select_font').addEventListener('click', (event) => { this.handle_button_click(event, 'select_font'); });


        document.getElementById(this.container_id + '_toolbar_font_list').addEventListener('change', (event) => { this.handle_select_change(event, 'font_type'); });
    }
    
    getHtml() {
        return `
<div class="rasem_toolbar">
    <button class="" aria-disabled="false" data-command="docmanager:save" title="Save and create checkpoint (Ctrl+S)"
        id="${this.container_id + '_toolbar_save'}">
        <span class="">
            <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"
                data-icon="ui-components:save">
                <g xmlns="http://www.w3.org/2000/svg" class="jp-icon3" fill="#616161">
                    <path
                        d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z">
                    </path>
                </g>
            </svg>
        </span>
    </button>
    <button class="" aria-disabled="false" data-command="notebook:insert-cell-below" title="Insert a cell below (B)"
        id="${this.container_id + '_toolbar_insert'}">
        <span class="">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" viewBox="0 0 24 24" data-icon="ui-components:add">
                <g xmlns="http://www.w3.org/2000/svg" class="jp-icon3" fill="#616161">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
                </g>
            </svg>
        </span>
    </button>
    <button class="" aria-disabled="false" data-command="notebook:cut-cell" title="Cut this cell (X)"
        id="${this.container_id + '_toolbar_cut'}">
        <span class="">
            <svg viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" data-icon="ui-components:cut">
                <g xmlns="http://www.w3.org/2000/svg" class="jp-icon3" fill="#616161">
                    <path
                        d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3z">
                    </path>
                </g>
            </svg>
        </span>
    </button>
    <button class="" aria-disabled="false" data-command="notebook:copy-cell" title="Copy this cell (C)"
        id="${this.container_id + '_toolbar_copy'}">
        <span class="">
            <svg viewBox="0 0 18 18" width="16" xmlns="http://www.w3.org/2000/svg" data-icon="ui-components:copy">
                <g xmlns="http://www.w3.org/2000/svg" class="jp-icon3" fill="#616161">
                    <path
                        d="M11.9,1H3.2C2.4,1,1.7,1.7,1.7,2.5v10.2h1.5V2.5h8.7V1z M14.1,3.9h-8c-0.8,0-1.5,0.7-1.5,1.5v10.2c0,0.8,0.7,1.5,1.5,1.5h8 c0.8,0,1.5-0.7,1.5-1.5V5.4C15.5,4.6,14.9,3.9,14.1,3.9z M14.1,15.5h-8V5.4h8V15.5z">
                    </path>
                </g>
            </svg>
        </span>
    </button>
    <button class="" aria-disabled="false" data-command="notebook:paste-cell-below"
        title="Paste this cell from the clipboard (V)" id="${this.container_id + '_toolbar_paste'}">
        <span class="">
            <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"
                data-icon="ui-components:paste">
                <g xmlns="http://www.w3.org/2000/svg" class="jp-icon3" fill="#616161">
                    <path
                        d="M19 2h-4.18C14.4.84 13.3 0 12 0c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z">
                    </path>
                </g>
            </svg>
        </span>
    </button>
    <button class="" aria-disabled="false" data-command="notebook:run-cell-and-select-next"
        title="Run this cell and advance (Shift+Enter)" id="${this.container_id + '_toolbar_run'}">
        <span class="">
            <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"
                data-icon="ui-components:run">
                <g xmlns="http://www.w3.org/2000/svg" class="jp-icon3" fill="#616161">
                    <path d="M8 5v14l11-7z"></path>
                </g>
            </svg>
        </span>
    </button>
    <button class="" aria-disabled="false" data-command="notebook:interrupt-kernel" title="Interrupt the kernel"
        id="${this.container_id + '_toolbar_interrupt'}">
        <span class="">
            <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"
                data-icon="ui-components:stop">
                <g xmlns="http://www.w3.org/2000/svg" class="jp-icon3" fill="#616161">
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M6 6h12v12H6z"></path>
                </g>
            </svg>
        </span>
    </button>
    <button class="" aria-disabled="false" data-command="notebook:restart-kernel" title="Restart the kernel"
        id="${this.container_id + '_toolbar_restart'}">
        <span class="">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" viewBox="0 0 18 18" data-icon="ui-components:refresh">
                <g xmlns="http://www.w3.org/2000/svg" class="jp-icon3" fill="#616161">
                    <path
                        d="M9 13.5c-2.49 0-4.5-2.01-4.5-4.5S6.51 4.5 9 4.5c1.24 0 2.36.52 3.17 1.33L10 8h5V3l-1.76 1.76C12.15 3.68 10.66 3 9 3 5.69 3 3.01 5.69 3.01 9S5.69 15 9 15c2.97 0 5.43-2.16 5.9-5h-1.52c-.46 2-2.24 3.5-4.38 3.5z">
                    </path>
                </g>
            </svg>
        </span>
    </button>
    <button class="" aria-disabled="false" data-command="notebook:restart-run-all"
        title="Restart the kernel and run all cells" id="${this.container_id + '_toolbar_restart_all'}">
        <span class="">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                data-icon="ui-components:fast-forward">
                <g xmlns="http://www.w3.org/2000/svg" class="jp-icon3" fill="#616161">
                    <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"></path>
                </g>
            </svg>
        </span>
    </button>
    <button class="" aria-disabled="false" data-command="notebook:select-image" title="Select Image"
        id="${this.container_id + '_toolbar_select_image'}">
        <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <g class="jp-icon3" fill="#616161">
                <rect style="fill:#eeeeee;stroke:#444444;stroke-width:0.48" width="23.52" height="23.52" x="0.23999999"
                    y="0.23999999" id="rect1" />
                <path style="fill:#888888;stroke-width:0.24"
                    d="m 22.319998,1.8719983 v 1.248 c -1.2,-0.48 -3.6,-0.96 -4.56,0.24 -0.48,0.72 -0.72,1.44 -0.72,2.64 0,0.96 0.24,1.92 0.72,2.4 1.44,1.2 3.36,0.72 4.56,0 v 1.44 c -0.72,0.2399997 -1.68,0.4799997 -2.4,0.4799997 -2.88,-0.24 -4.32,-1.9199997 -4.32,-4.3199997 0.24,-2.88 1.92,-4.656 4.56,-4.68 0.72,-0.024 1.44,0.264 2.16,0.552"
                    id="path1" />
                <path style="fill:#555555;stroke-width:0.24"
                    d="m 7.1999983,7.1999983 c -1.92,0 -3.6,0.48 -3.6,2.64 0,1.1999997 0.96,1.6799997 2.16,1.6799997 2.16,-0.24 3.12,-1.6799997 3.12,-3.8399997 v -0.48 h -1.68 m 3.8399997,-0.48 V 12.959998 H 8.8799983 v -1.92 c -0.96,1.68 -1.92,2.16 -3.6,2.16 -1.44,0 -1.92,-0.24 -2.88,-0.96 -0.48,-0.72 -0.792,-1.44 -0.792,-2.3999997 0,-1.44 0.312,-2.16 1.032,-2.88 0.72,-0.72 2.16,-0.96 4.08,-0.96 h 2.16 c 0,-0.72 -0.24,-1.68 -0.96,-2.16 -1.44,-0.96 -4.08,-0.24 -5.52,0.24 v -1.44 c 1.2,-0.6 2.4,-0.864 3.84,-0.864 1.2,0 2.4,0.456 3.6,1.584 0.7199997,0.72 1.1999997,1.68 1.1999997,3.36"
                    id="path2" />
                <path style="fill:#000000;stroke-width:0.24"
                    d="m 21.119998,17.759998 c 0,1.2 -0.24,2.16 -0.96,3.12 -0.72,0.96 -1.68,1.2 -2.88,1.2 -0.96,0 -1.92,-0.48 -2.88,-1.2 -0.72,-0.72 -0.96,-1.44 -0.96,-2.64 v -7.68 c 0,-0.48 -0.48,-0.9599997 -0.96,-0.9599997 h -0.48 v -0.48 c 1.2,0 1.92,0 3.12,0 v 5.5199997 c 0.48,-0.48 1.2,-0.96 2.16,-0.96 1.2,0 2.4,0.48 2.88,1.2 0.72,0.96 0.96,1.92 0.96,2.88 v 0 m -1.44,0 c 0,-1.92 -1.44,-3.12 -2.4,-3.12 -0.96,0 -1.68,0.24 -2.16,0.48 v 4.8 c 0.48,0.72 1.2,0.96 2.16,0.96 0.72,0 2.4,-0.96 2.4,-3.12"
                    id="path3" />
            </g>
        </svg>
    </button>
    <button class="" aria-disabled="false" data-command="notebook:select-font" title="Select Font"
        id="${this.container_id + '_toolbar_select_font'}">
        <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <g class="jp-icon3" fill="#616161">
                <rect style="fill:#eeeeee;stroke:#444444;stroke-width:0.48" width="23.52" height="23.52" x="0.23999999"
                    y="0.23999999" id="rect1" />
                <path style="fill:#888888;stroke-width:0.24"
                    d="m 22.319998,1.8719983 v 1.248 c -1.2,-0.48 -3.6,-0.96 -4.56,0.24 -0.48,0.72 -0.72,1.44 -0.72,2.64 0,0.96 0.24,1.92 0.72,2.4 1.44,1.2 3.36,0.72 4.56,0 v 1.44 c -0.72,0.2399997 -1.68,0.4799997 -2.4,0.4799997 -2.88,-0.24 -4.32,-1.9199997 -4.32,-4.3199997 0.24,-2.88 1.92,-4.656 4.56,-4.68 0.72,-0.024 1.44,0.264 2.16,0.552"
                    id="path1" />
                <path style="fill:#555555;stroke-width:0.24"
                    d="m 7.1999983,7.1999983 c -1.92,0 -3.6,0.48 -3.6,2.64 0,1.1999997 0.96,1.6799997 2.16,1.6799997 2.16,-0.24 3.12,-1.6799997 3.12,-3.8399997 v -0.48 h -1.68 m 3.8399997,-0.48 V 12.959998 H 8.8799983 v -1.92 c -0.96,1.68 -1.92,2.16 -3.6,2.16 -1.44,0 -1.92,-0.24 -2.88,-0.96 -0.48,-0.72 -0.792,-1.44 -0.792,-2.3999997 0,-1.44 0.312,-2.16 1.032,-2.88 0.72,-0.72 2.16,-0.96 4.08,-0.96 h 2.16 c 0,-0.72 -0.24,-1.68 -0.96,-2.16 -1.44,-0.96 -4.08,-0.24 -5.52,0.24 v -1.44 c 1.2,-0.6 2.4,-0.864 3.84,-0.864 1.2,0 2.4,0.456 3.6,1.584 0.7199997,0.72 1.1999997,1.68 1.1999997,3.36"
                    id="path2" />
                <path style="fill:#000000;stroke-width:0.24"
                    d="m 21.119998,17.759998 c 0,1.2 -0.24,2.16 -0.96,3.12 -0.72,0.96 -1.68,1.2 -2.88,1.2 -0.96,0 -1.92,-0.48 -2.88,-1.2 -0.72,-0.72 -0.96,-1.44 -0.96,-2.64 v -7.68 c 0,-0.48 -0.48,-0.9599997 -0.96,-0.9599997 h -0.48 v -0.48 c 1.2,0 1.92,0 3.12,0 v 5.5199997 c 0.48,-0.48 1.2,-0.96 2.16,-0.96 1.2,0 2.4,0.48 2.88,1.2 0.72,0.96 0.96,1.92 0.96,2.88 v 0 m -1.44,0 c 0,-1.92 -1.44,-3.12 -2.4,-3.12 -0.96,0 -1.68,0.24 -2.16,0.48 v 4.8 c 0.48,0.72 1.2,0.96 2.16,0.96 0.72,0 2.4,-0.96 2.4,-3.12"
                    id="path3" />
            </g>
        </svg>
    </button>
    <div class="">
        <select aria-label="font list" title="Select the font list"
            id="${this.container_id + '_toolbar_font_list'}">
        </select>
    </div>
</div>

<div class="rasem_toolbar">
    <button class="" aria-disabled="false" data-command="notebook:bold-text" title="Bold Text"
        id="${this.container_id + '_toolbar_bold'}">
        <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <g xmlns="http://www.w3.org/2000/svg" class="jp-icon3" fill="#616161">
                <path
                    d="M 10.48376,7.58496 C 11.95032,6.93488 12.77744,5.716 12.77744,4.1648 c 0,-1.38088 -0.55632,-2.49648 -1.6088,-3.22624 C 10.29568,0.33328 9.07848,0 7.74112,0 H 0 V 2.72 H 1.36 V 13.44 H 0 v 2.72 h 7.2724 c 1.18552,0 2.87936,-0.1796 4.2164,-1.0352 1.29928,-0.83144 1.95808,-2.09288 1.95808,-3.74944 0,-1.908 -1.11888,-3.31432 -2.96312,-3.7904 z M 6.89304,6.4 H 4.56 V 2.72 h 2.08768 c 2.07688,0 2.92408,0.5072 2.92408,1.75072 C 9.57176,6.06528 8.11512,6.4 6.89304,6.4 Z M 4.56,9.2 h 2.46704 c 2.28296,0 3.21416,0.59488 3.21416,2.05304 0,1.4512 -1.11896,2.18696 -3.32576,2.18696 H 4.56 Z"
                    id="path1" style="stroke-width:0.08" />
            </g>
        </svg>
    </button>

    <button class="" aria-disabled="false" data-command="notebook:italic-text" title="Italic Text"
        id="${this.container_id + '_toolbar_italic'}">
        <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="12"
                font-style="italic">I</text>
        </svg>
    </button>

    <button class="" aria-disabled="false" data-command="notebook:underline-text" title="Underline Text"
        id="${this.container_id + '_toolbar_underline'}">
        <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="12"
                text-decoration="underline">U</text>
        </svg>
    </button>

    <button class="" aria-disabled="false" data-command="notebook:show-text" title="Show Text"
        id="${this.container_id + '_toolbar_show'}">
        <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M12 3C6.48 3 2 7.48 2 12s4.48 9 10 9 10-4.48 10-9-4.48-9-10-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm0-12c-2.21 0-4 1.79-4 4 0 .78.23 1.5.62 2.11l6.27-6.27C13.5 5.23 12.78 5 12 5zm6.37 2.37l-1.27 1.27C17.5 9.23 18 10.5 18 12h2c0-1.86-1.28-3.41-3-3.83z" />
        </svg>
    </button>

    <button class="" aria-disabled="false" data-command="hide:show-text" title="Show Text"
        id="${this.container_id + '_toolbar_hide'}">
        <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M12 3C6.48 3 2 7.48 2 12s4.48 9 10 9 10-4.48 10-9-4.48-9-10-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm-1-11h2v2h-2v-2zm0 4h2v6h-2v-6z" />
        </svg>
    </button>

    <button><sub>Subscript</sub></button>
    <button><sup>Superscript</sup></button>
    <button>+</button>
    <button>-</button>
    <button>Rename</button>
</div>
`;
    }

    getCss() {
        return `
.rasem_toolbar {
display: flex;
background-color: #f2f2f2;
padding: 10px;
}

.rasem_toolbar button {
border: none;
background-color: transparent;
margin-right: 10px;
cursor: pointer;
}

.rasem_toolbar button:hover {
opacity: 0.8;
}

.rasem_toolbar button svg {
width: 24px;
height: 24px;
}

.rasem_text-section {
margin-top: 20px;
}

.rasem_text-section select {
margin-right: 10px;
}

.rasem_text-section button {
margin-right: 10px;
}
    `;
    }
}