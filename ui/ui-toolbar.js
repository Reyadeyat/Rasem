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

export class UIToolbar {
  constructor(language, direction, configuration, container_element) {
    this.language = language;
    this.direction = direction;
    this.configuration = configuration;
    this.width = configuration.width;
    this.height = configuration.height;
    this.container_element = container_element;
    this.container_element_id = container_element.id;
    if (this.container_element_id == null) {
      throw new Error('Element ID is null !!!');
    }
    var style = document.createElement('style');
    style.textContent = this.configuration.css;
    document.head.appendChild(style);

    this.ui_toolbar_div = document.createElement('div');
    this.ui_toolbar_div.id = this.configuration.id;
    this.ui_toolbar_div.className = this.configuration.class_list;
    this.container_element.appendChild(this.ui_toolbar_div);

    this.createControls(this.configuration.control_list, this.language, this.direction);
  }

  setWidth(new_width) {
    this.ui_toolbar_div.style.maxWidth = "" + new_width + "px";
  }

  setHeight(new_height) {
    this.ui_toolbar_div.style.maxHeight = "" + new_height + "px";
  }

  createControls(control_list, language, direction) {
    if (control_list == null) {
      return;
    }
    this.control_list = control_list;
    this.language = language;
    this.direction = direction;
    this.ui_toolbar_div.innerHTML = Array.from(
      this.control_list,
      control => {
        return `<span id="${control.id}_span">` + control.html(control, language, direction) + `</span>`;
      }).join('\n');

    control_list.forEach((control) => {
      let element = document.getElementById(control.id);
      control.element = element;
      if (element == null) {
        debugger;
      }
      if (control.click != null) {
        element.addEventListener('click', (event) => {
          control.click(event, control.module, control.action, control);
        });
      }
      if (control.change != null) {
        element.addEventListener('change', (event) => {
          control.change(event, control.module, control.action, control);
        });
      }
    });
  }

  changeLanguage(language, direction) {
    this.language = language;
    this.direction = direction;
    this.control_list.forEach((control) => {
      if (control.element == null) {
        debugger;
      }
      control.element.outerHTML = control.html(control, this.language, this.direction);
    });
  }

  remove() {
    this.ui_toolbar_div.remove();
  }
}
