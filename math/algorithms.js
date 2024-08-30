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

export class Algorithms {
    static list_difference(minor_list, major_list) {
        if (major_list == null || major_list.length == 0
            || minor_list == null || minor_list.length == 0) {
            return [];
        }
        let list = [];
        major_list.forEach(major_element => {
            let found = minor_list.some(minor_element => major_element.id == minor_element.id);
            if (found == false) {
                list.push(major_element);
            }
        });
        return list;
    }
}
