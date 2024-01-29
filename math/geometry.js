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

import { Point } from "../g2d/point";

export class Radian {
	constructor() {
		this.radians = [];
        for (let degrees = 0; degrees <= 360; degrees++) {
			this.radians[degrees] = degrees * Math.PI / 180;
		}
    }
}

export class Rectangle_2D {
	constructor(x1, y1, x2, y2) {
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;

		this.x = x1;
		this.y = y1;
		this.top_left_point = new Point(this.x1, this.y1);
		this.bottom_right_point = new Point(this.x2, this.y2);
		this.width = x2 - x1;
		this.height = y2 - y1;
	}

	vector_scaling(vector2d) {
		
	}
}

