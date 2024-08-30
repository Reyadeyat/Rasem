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

import { Log } from '@reyadeyat/haseb'
import { Point } from "../g2d/point.js";

export class Vector2D {
	constructor(point_a, point_b) {
		this.scale_x = point_a.x - point_b.x;
		this.scale_y = point_a.y - point_b.y;
		this.scale_distance = Math.sqrt(((point_b.x - point_a.x)^2) + ((point_b.y - point_a.y)^2));
		if (this.scale_distance == null) {
			debugger;
		}
		this.angle_radians = Math.atan2(point_b.y - point_a.y, point_b.x - point_a.x);
		this.angle_degrees = (this.angle_radians * 180) / Math.PI;
		this.scale_angle = Math.sqrt(((point_b.x - point_a.x)^2) + ((point_b.y - point_a.y)^2));
		Log.trace("Vector2D::constructor()::", "point_a, point_b, scale_x, scale_y, scale_distance, angle_radians, angle_degrees", point_a, point_b, this.scale_x, this.scale_y, this.scale_distance, this.angle_radians, this.angle_degrees);
	}

	scale_point(point) {
		let scaled_point = new Point(this.scale_x + point.x, this.scale_y + point.y);
		return scaled_point;
	}

	toString() {
		return `Vector2D scale (${this.scale_x}, ${this.scale_y}), Distance ${this.scale_distance}`;
	}
}

