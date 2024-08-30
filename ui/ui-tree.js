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

import { UIToolbar } from "./ui-toolbar.js";

export class UITree {
  constructor(language, direction, tree, tree_map, tree_inlisted, tree_toolbar, container_element, height) {
    this.language = language;
    this.direction = direction;
    this.height = height;
    this.container_element = container_element;
    this.container_element_id = container_element.id;
    if (this.container_element_id == null) {
      throw new Error('Element ID is null !!!');
    }
    this.tree = tree;
    this.tree_map = tree_map;
    this.tree_inlisted = tree_inlisted;
    this.tree_toolbar = tree_toolbar;
    this.uuid = crypto.randomUUID();
    this.creatUITree();
    this.setTree();
  }

  changeLanguage(language, direction) {
    this.language = language;
    this.direction = direction;
    this.updateInterfaceLanguage();
    this.ui_toolbar.changeLanguage(this.language, this.direction);
  }

  updateInterfaceLanguage() {
    this.tree_inlisted.forEach((node) => {
      node.element.innerHTML = this.tree_node_template(node);
    });
  }

  tree_node_template(node) {
    return `
      <div 
        id="${this.uuid}_${node.node_id}"
        draggable="${node.draggable}" data-node_id="${node.node_id}"
        class="shape-tree-node"
        style="${this.language_direction == 'rtl' ? 'margin-right: ' + ((node.node_level - 1) * 20) + 'px;' : 'margin-left: ' + ((node.node_level - 1) * 20) + 'px'}">
        <span
          id="${this.uuid}_${node.node_id}_box"
          class="shape-node disable-select">
          <span class="shape-toggle-icon">${(node.children == null || node.children.length == 0 ? '' : (node.expanded ? '-' : '+'))}</span>
          <span class="shape-node-icon">
            ${node.icon.startsWith("data:image/svg+xml") == true || node.icon.includes("<svg") == true ? node.icon : '<img src="' + node.icon + '" width="24px" height="24px"/>'}
          </span>
          <span class="shape-node-text">${node.name[this.language]}</span>
        </span>
      </div>`;
  }

  setTree() {
    let tree_div_element = document.getElementById("container_tree");
    tree_div_element.innerHTML = Array.from(
      this.tree_inlisted,
      node => {
        return this.tree_node_template(node);
      }).join('\n');

    this.tree_inlisted.forEach((node) => {
      this.createTreeNode(node);
    });

    this.tree_inlisted.forEach((node) => {
      this.switchNode(node);
    });

  }

  updateHTMLElementTemplate(node) {
    node.element.innerHTML = this.tree_node_template(node);
  }

  toggleHTMLElement(node, visible) {
    let node_element = node.element;
    if (visible == true) {
      node_element.innerHTML = this.tree_node_template(node);
      node_element.style.display = "";
      node_element.style.visibility = "visible";
    } else {
      node_element.style.display = "none";
      node_element.style.visibility = "hidden";
    }
  }

  toggleNode(tree_node) {
    tree_node.expanded = !tree_node.expanded;
    this.updateHTMLElementTemplate(tree_node);
    this.switchNodeChildren(tree_node, tree_node.expanded);
  }

  switchNode(tree_node) {
    this.toggleHTMLElement(tree_node, tree_node.node_parent == null || tree_node.node_parent.expanded);
  }

  switchNodeChildren(tree_node, expanded) {
    if (tree_node.children == null || tree_node.children.length == 0) {
      return;
    }
    let stack = [];
    for (let i = 0; i < tree_node.children.length; i++) {
      stack.push(tree_node.children[i]);
    }
    do {
      let node = stack.shift();
      this.toggleHTMLElement(node, expanded == false ? false : this.isVisible(tree_node, node));
      if (node.children != null && node.children.length > 0) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          let child_node = node.children[i];
          child_node.node_parent = node;
          stack.unshift(child_node);
        }
      }
    } while (stack.length > 0);
  }

  isVisible(tree_node, node) {
    let visible = true;
    do {
      visible = visible && node.node_parent.expanded;
      node = node.node_parent;
    } while (tree_node.node_id != node.node_id);
    return tree_node.expanded && visible;
  }

  unselectNodeChildren(node) {
    if (node.children == null || node.children.length == 0) {
      return;
    }
    node.children.forEach((node) => {
      node.selected = false;
      this.unselectNodeChildren(node);
    });
    node.selected = false;
  }

  doubleClickedNode(event, node) {
    let element = document.getElementById(this.uuid + "_" + node.node_id.toString() + "_box");
    if (element == null) {
      return;
    }
    node.selected = !node.selected;
    if (node.selected == true) {
      element.classList.add("shape-node-selected");
    } else {
      element.classList.remove("shape-node-selected");
    }
  }

  dragStart(event, draggable, node) {
    event.dataTransfer.setData('node.node_id', node.node_id.toString());
  }

  dragOver(event, draggable, target_node) {
    /*console.log("dragOver: " + event.dataTransfer.getData('node.node_id'));
    let source_node_id =  parseInt(event.dataTransfer.getData('node.node_id'));
    let source_node = this.tree_map.get(source_node_id);
    console.log(source_node_id + ' - ' + source_node.name.en + " dragged over " + target_node.node_id + " - " + this.tree_map.get(target_node.node_id).name.en);
    */
  }

  dragDrop(event, draggable, target_node) {
    let source_node_id = parseInt(event.dataTransfer.getData('node.node_id'));
    let source_node = this.tree_map.get(source_node_id);
    console.log(source_node_id + ' - ' + source_node.name.en + " dropped over " + target_node.node_id + " - " + target_node.name.en + " - user_date: " + JSON.stringify(target_node.user_data, null, 4));
    if (target_node.drop != null) {
      target_node.drop(event, target_node.module, "drop", { source_node: source_node, target_node: target_node });
    }
  }

  dragEnd(event, draggable, node) {
    console.log('drag ended');
  }

  setHeight(new_height) {
    this.height = new_height;
    this.tree_div.style.maxHeight = "" + new_height + "px";
  }

  creatUITree() {

    if (this.tree_div != null) {
      return;
    }
    var style = document.createElement('style');
    style.textContent = this.getCss();
    document.head.appendChild(style);

    this.tree_div = document.createElement('div');
    this.tree_div.node_id = this.container_element_id + '_tree';
    this.tree_div.innerHTML = this.getHtml();
    this.tree_div.style.flexGrow = "1";
    this.tree_div.style.overflow = "auto";
    this.container_element.appendChild(this.tree_div);

    this.ui_toolbar = new UIToolbar(this.language, this.direction, this.tree_toolbar, this.tree_div, this.height);
  }

  createTreeNode(node) {
    let id = `${this.uuid}_${node.node_id}`;
    let element = document.getElementById(id);
    node.element = element;
    if (element == null) {
      debugger;
    }
    if (element.evented) {
      return;
    }
    element.evented = true;
    element.addEventListener('click', (event) => {
      this.toggleNode(node)
      if (node.click != null) {
        node.click(event, node.module, "click", node);
      }
    });
    element.addEventListener('dblclick', (event) => {
      this.doubleClickedNode(event, node);
      if (node.dbclick != null) {
        node.dbclick(event, node.module, "dblclick", node);
      }
    });
    element.addEventListener('dragstart', (event) => {
      this.dragStart(event, element, node);
    });
    element.addEventListener('dragover', (event) => {
      event.preventDefault();
      this.dragOver(event, element, node);
    });
    element.addEventListener('drop', (event) => {
      event.preventDefault();
      this.dragDrop(event, element, node);
    });
    element.addEventListener('dragend', (event) => {
      this.dragEnd(event, element, node);
    });
  }

  getHtml() {
    let tree_element =
      `<div id="container_tree" class="tree disable-select">`

      + `</div>`;
    return tree_element;
  }

  getCss() {
    return `
          .tree {
            font-family: Arial, sans-serif;
            font-family: Arial, sans-serif;
            font-size: 14px;
            margin-top: 20px;
          }
          
          .tree-node {
            display: flex;
            padding: 5px 5px;
            cursor: pointer;
            height: 36px;
            min-height: 36px;
            max-height: 36px;
            border: 5px 0px solid inherit;
          }

          .tree-node-text {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .tree-node-icon {
            margin: 0px 5px;
          }
          
          .tree-node:hover {
            border: 0px solid #2580e7;
            padding: 5px 0px;
            border-left-width: 5px;
            border-right-width: 5px;
            border-radius: 3px;
            background-color: lightgray;
          }
          
          [dir="ltr"] .tree-node:hover {
            margin-right: 5px;
            box-shadow: -2px 2px 5px #888;
          }
          
          [dir="rtl"] .tree-node:hover {
            margin-left: 5px;
            box-shadow: 2px 2px 5px #888888;
          }
          
          .tree-node-selected {
            display: flex;
            padding: 5px 0px;
            cursor: pointer;
            min-height: 24px;
            border: 5px 0px solid inherit;
            border: 0px solid #2580e7;
            border-left-width: 5px;
            border-right-width: 5px;
            border-radius: 3px;
            background-color: lightgray;
          }
          
          [dir="ltr"] .tree-node-selected {
            margin-right: 5px;
          }
          
          [dir="rtl"] .tree-node-selected {
            margin-left: 5px;
          }

          .tree-tree-node {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex-wrap: nowrap;
          }
          
          .tree-toggle-icon {
            display: inline-block;
            margin: 0 5px auto;
            width: 24px;
            max-width: 24px;
            text-align: center;
          }
          
          
          [dir="ltr"] .tree-children {
            margin-left: 20px;
          }
          
          [dir="rtl"] .tree-children {
            margin-right: 20px;
          }          
    `;
  }
}
