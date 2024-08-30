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

export class Radian {
	constructor() {
		this.radians = [];
        for (let angle_in_degrees = 0; angle_in_degrees <= 360; angle_in_degrees++) {
			this.radians[angle_in_degrees] = angle_in_degrees * Math.PI / 180;
		}
    }
}

export class Rectangle_2D {
	constructor(x1, y1, x2, y2) {
		this.construct(x1, y1, x2, y2);
	}

	construct(x1, y1, x2, y2) {
		this.x = x1;
		this.y = y1;
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.width = x2 - x1;
		this.height = y2 - y1;
		this.left_top_point = new Point(x1, y1);
		this.center_top_point = new Point((x1 + x2) / 2, y1);
		this.right_top_point = new Point(x2, y1);
		this.right_center_point = new Point(x2, (y1 + y2) / 2);
		this.right_bottom_point = new Point(x2, y2);
		this.center_bottom_point = new Point((x1 + x2) / 2, y2);
		this.left_bottom_point = new Point(x1, y2);
		this.left_center_point = new Point(x1, (y1 + y2) / 2);
		this.radius = Math.sqrt(Math.pow(this.width, 2) + Math.pow(this.height, 2)) / 2;
		this.center_point = new Point(this.left_top_point.x + (this.width / 2), this.left_top_point.y + (this.height / 2));
	}

	getBoundCircleRadius() {
		return this.radius;
	}

	getBoundCircleBoundRect() {
		const x = this.center_point.x - this.radius;
		const y = this.center_point.y - this.radius;
		const width = this.radius * 2;
		const height = this.radius * 2;
		return new Rectangle_2D(x, y, x+width, y+height);
	}

	clone() {
		return new Rectangle_2D(this.left_top_point.x, this.left_top_point.y, this.right_bottom_point.x, this.right_bottom_point.y);
	}

	vector_scaling(vector2d) {
		
	}

	add(rect) {
		let x1 = Math.min(rect.left_top_point.x, this.left_top_point.x);
		let y1 = Math.min(rect.left_top_point.y, this.left_top_point.y);
		let x2 = Math.max(rect.right_bottom_point.x, this.right_bottom_point.x);
		let y2 = Math.max(rect.right_bottom_point.y, this.right_bottom_point.y);
		this.construct(x1, y1, x2, y2);
		return this;
	}

	min_fit (width, height) {
		//let x1 = Math.max(x, this.left_top_point.x);
		//let y1 = Math.max(y, this.left_top_point.y);
		let x1 = this.left_top_point.x;
		let y1 = this.left_top_point.y;
		let x2 = Math.min(x1+width, this.right_bottom_point.x);
		let y2 = Math.min(y1+height, this.right_bottom_point.y);
		this.construct(x1, y1, x2, y2);
		return this;
	}

	canClip(vector, scene_width, scene_height) {
        let scaled_point_top_left = vector.scale_point(this.left_top_point);
        let scaled_point_bottom_right = vector.scale_point(this.right_bottom_point);
        Log.trace("Rectangle_2D::canClip()::", "shape_type, id, vector, scaled_point_top_left, scaled_point_bottom_right", this.shape_type, this.id, vector, scaled_point_top_left, scaled_point_bottom_right);
        let result = scaled_point_top_left.x > 0 && scaled_point_bottom_right.x < scene_width && scaled_point_top_left.y > 0 && scaled_point_bottom_right.y < scene_height;
        return result;
    }

	transform(vector) {
		let scaled_point_top_left = vector.scale_point(this.left_top_point);
        let scaled_point_bottom_right = vector.scale_point(this.right_bottom_point);
        Log.trace("Rectangle_2D::transform()::", "shape_type, id, vector, scaled_point_top_left, scaled_point_bottom_right", this.shape_type, this.id, vector, scaled_point_top_left, scaled_point_bottom_right);
        this.construct(scaled_point_top_left.x, scaled_point_top_left.y, scaled_point_bottom_right.x, scaled_point_bottom_right.y);
		return this;
	}

	zoom(x, y) {
		this.construct(this.left_top_point.x + x, this.left_top_point.y + y, this.right_bottom_point.x + (x*-1), this.right_bottom_point.y + (y*-1));
		return this;
	}

	contains(smaller_rectangle) {
		return smaller_rectangle.x1 >= this.x1 && smaller_rectangle.x1 <= this.x2 && smaller_rectangle.y1 >= this.y1 && smaller_rectangle.y1 <= this.y2 && smaller_rectangle.x2 >= this.x1 && smaller_rectangle.x2 <= this.x2 && smaller_rectangle.y2 >= this.y1 && smaller_rectangle.y2 <= this.y2;
	}
}

export class Geometry {
	
	static radian = new Radian();

	static point_distance(point_1, point_2) {
		const dx = point_2.x - point_1.x;
		const dy = point_2.y - point_1.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	static nearest_point(point_n, point_list) {
		let min_distance = Infinity;
		let nearest_point = null;
		for (let i = 0; i < point_list.length; i++) {
		  const distance = point_distance(point_n, point_list[i]);
		  if (distance < min_distance) {
			min_distance = distance;
			nearest_point = point_list[i];
		  }
		}
		return nearest_point;
	}

	static getAngle(center_point, point_n) {
		let quarter = 0;
		let angle = 0;
		if (point_n.x == center_point.x) {
			if (point_n.y < center_point.y) {
				quarter = 2;
				angle = 90;
			} else{
				quarter = 3;
				angle = 270;
			}
		} else if (point_n.y == center_point.y) {
			if (point_n.x > center_point.x) {
				quarter = 1;
				angle = 0;
			} else{
				quarter = 2;
				angle = 180;
			}
		} else {
			angle = Math.round(Math.abs((180/Math.PI) * Math.atan((point_n.y - center_point.y) / (point_n.x - center_point.x))));
			if (point_n.y <= center_point.y && point_n.x > center_point.x) {
				//1st - top right - y1 < y0, x1 > x0
				quarter = 1;
				angle = angle;
			} else if (point_n.y <= center_point.y && point_n.x < center_point.x) {
				//2nd- top left - y1 < y 0, x1 < x0
				quarter = 2;
				angle = 180 - (angle % 90);
			} else if (point_n.y > center_point.y && point_n.x < center_point.x) {
				//3rd- bottom left - y1 > y 0, x1 < x0
				quarter = 3;
				angle = 180 + (angle % 90);
			} else if (point_n.y > center_point.y && point_n.x > center_point.x) {
				//4th - bottom right - y1 > y0, x1 > x0
				quarter = 4;
				angle = 360 - (angle % 90);
			}
		}
		Log.trace("Geometry::getAngle()::", "quarter, angle, center_point, point_n", quarter, angle, center_point, point_n);
        return angle;
    }

	static rotatePathAroundCenter(rotation_angle, center_point, shape_path_points_angle_list, shape_path_points_radius_list) {
		const rotated_point_list = [];
		for (let i = 0; i < shape_path_points_angle_list.length; i++) {
			//let point = shape_path_point_list[i];
			let radius = shape_path_points_radius_list[i];//Geometry.point_distance(center_point, point);
			let angle = shape_path_points_angle_list[i];//Geometry.getAngle(center_point, point);
			let x = Math.round(center_point.x + (radius * Math.cos(Geometry.radian.radians[(rotation_angle + angle) % 360])));
        	let y = Math.round(center_point.y - (radius * Math.sin(Geometry.radian.radians[(rotation_angle + angle) % 360])));
		  	let rotated_point = new Point(x, y);
		  	rotated_point_list.push(rotated_point);
		}
		//Log.trace("Geometry::rotatePathAroundCenter()::", "rotation_angle, center_point, point, r_point, angle", rotation_angle, center_point, /*shape_path_point_list,*/ rotated_point_list, shape_path_points_angle_list);
		Log.trace("Geometry::rotatePathAroundCenter()::", "rotation_angle, center_point, r_point, angle", rotation_angle, center_point, rotated_point_list, shape_path_points_angle_list);
		return rotated_point_list;
	}

	static rotatePointAroundCenter(rotation_angle, center_point, angle, radius) {
		let x = Math.round(center_point.x + (radius * Math.cos(Geometry.radian.radians[(rotation_angle + angle) % 360])));
		let y = Math.round(center_point.y - (radius * Math.sin(Geometry.radian.radians[(rotation_angle + angle) % 360])));
		let rotated_point = new Point(x, y);
		return rotated_point;
	}

	static isPointInsidePolygon(point, polygon_point_list) {
		let x = point.x, y = point.y;
		let inside = false;
	  
		for (var i = 0, j = polygon_point_list.length - 1; i < polygon_point_list.length; j = i++) {
			let point_i = polygon_point_list[i];
			let point_j = polygon_point_list[j];
		  	let xi = point_i.x, yi = point_i.y;
		  	let xj = point_j.x, yj = point_j.y;
			let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
			if (intersect) {
				inside = !inside;
			}
		}
		return inside;
	}
}
