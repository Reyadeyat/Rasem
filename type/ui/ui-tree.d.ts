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

export class UITree {
    constructor(language: string, direction: string, tree: any, tree_map: any, tree_inlisted: any, tree_toolbar: UIToolbar, container_element: any, height: any);
    language: any;
    direction: string;
    container_element: any;
    container_element_id: any;
    height: any;
    tree: any;
    tree_map: any;
    tree_inlisted: any;
    changeLanguage(language: string, direction: string): void;
    updateInterfaceLanguage(): void;
    tree_node_template(node: any): string;
    setTree(): void;
    updateHTMLElementTemplate(node: any): void;
    toggleHTMLElement(node: any, visible: any): void;
    toggleNode(tree_node: any): void;
    switchNode(tree_node: any): void;
    switchNodeChildren(tree_node: any, expanded: any): void;
    isVisible(tree_node: any, node: any): boolean;
    unselectNodeChildren(node: any): void;
    doubleClickedNode(event: any, node: any): void;
    dragStart(event: any, draggable: any, node: any): void;
    dragOver(event: any, draggable: any, target_node: any): void;
    dragDrop(event: any, draggable: any, target_node: any): void;
    dragEnd(event: any, draggable: any, node: any): void;
    setHeight(new_height: any): void;
    creatUITree(configuration: any): void;
    tree_div: HTMLDivElement;
    tree_toolbar: UIToolbar;
    createTreeNode(node: any): void;
    getHtml(): string;
    getCss(): string;
}
import { UIToolbar } from "./ui-toolbar.js";
