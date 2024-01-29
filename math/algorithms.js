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
