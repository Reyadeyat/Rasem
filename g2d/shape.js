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

import { Log } from '../util/log.js'
import { Color } from '../util/color.js'
import { Point } from './point.js'
import { Edge } from './edge.js'
import { Rectangle_2D } from '../math/geometry.js';
import { ShapeControl, ShapeControlGroup } from './control.js';
import { Vector2D } from '../math/linear_algebra.js';

export class Shape {

    constructor(shape_type, id, stroke_style, fill_style, extras, text, control_width) {
        Log.trace("Shape::constructor()::", "shape_type, id, stroke_style, fill_style, extras, text", shape_type, id, stroke_style, fill_style, extras, text);
        this.shape_type = shape_type;
        this.id = id;
        this.stroke_style = stroke_style;
        this.fill_style = fill_style;
        this.is_line = shape_type.toLowerCase() === "line" ? true : false;
        this.extras = extras;
        let keys = Object.keys(this.extras);
        for (let i = 0; i < keys.length; i++) {
            this[keys[i]] = extras[keys[i]];
        }
        this.is_rotating = false;
        this.rotation_angle = 0;
        this.shape_control_shape_list = [];
        this.enable_stroke = false;
        this.text = text;
        this.control_width = control_width;
        this.initialize()
        this.generatePath();
    }

    generatePath() {
        this.generatePathPoints();
        if (this.is_line == false) {
            this.generatePathPointsAngles();
        }
    }

    generatePathPointsAngles() {
        this.simulatePathPointsAngles(this);
    }

    simulatePathPointsAngles(simulation) {
        simulation = simulation != null ? simulation 
        : {
            center: this.center,
            rotation_angle: this.rotation_angle
        };
        simulation.shape_path_points_angles = [];
        simulation.shape_path_points_radius = [];
        
        let min_x = Number.POSITIVE_INFINITY;
        let min_y = Number.POSITIVE_INFINITY;
        let max_x = Number.NEGATIVE_INFINITY;
        let max_y = Number.NEGATIVE_INFINITY;

        for (let i = 0; i < simulation.shape_path_points.length; i++) {
            let point = simulation.shape_path_points[i];
            let angle = (180/Math.PI) * ( 
                Math.atan2(0, simulation.center.x + 10)
                -
                Math.atan2(point.y - simulation.center.y, point.x - simulation.center.x)
                );
            angle = Math.round((angle < 0 ? (360 + angle + simulation.rotation_angle) : angle + simulation.rotation_angle) % 360);
        
            simulation.shape_path_points_angles[simulation.shape_path_points_angles.length] = angle;
            simulation.shape_path_points_radius[simulation.shape_path_points_radius.length] = simulation.distance(simulation.center, point);

            //Bounding Rectangle
            min_x = Math.min(min_x, point.x);
            min_y = Math.min(min_y, point.y);
            max_x = Math.max(max_x, point.x);
            max_y = Math.max(max_y, point.y);
        }

        simulation.bound_width = max_x - min_x;
        simulation.bound_height = max_y - min_y;

        simulation.shape_path_points_bounding_rect = new Rectangle_2D(min_x, min_y, max_x, max_y);
        simulation.shape_path_edges = Edge.doEdges(simulation.shape_path_points, Edge.line, true);

        let outer_bound_rect_side = Math.sqrt(Math.pow(simulation.bound_width + simulation.control_width, 2)+Math.pow(simulation.bound_height + simulation.control_width, 2)) / 2;
        /** max rectangle with rotate from center - the outer circle bounding rectangle*/
        simulation.shape_max_bound_rect = new Rectangle_2D(simulation.center.x - outer_bound_rect_side, simulation.center.y - outer_bound_rect_side, simulation.center.x + outer_bound_rect_side, simulation.center.y + outer_bound_rect_side);
        return simulation;
    }

    setFrontDevice(context, frontContextPixels) {
        this.frontContext = context;
        this.frontContextPixels = frontContextPixels;
    }

    distance(point_a, point_b) {
        return Math.sqrt(Math.pow(point_a.x - point_b.x, 2) + Math.pow(point_a.y - point_b.y, 2)); 
    }

    setPixle(point, color) {
        let i = (Math.ceil((point.y * this.frontContextPixels.width)) + point.x) * 4;
        this.frontContextPixels.data[i + 0] = color.red;
        this.frontContextPixels.data[i + 1] = color.green;
        this.frontContextPixels.data[i + 2] = color.blue;
        this.frontContextPixels.data[i + 3] = color.alfa;
        this.frontContext.putImageData(this.frontContextPixels, 0, 0, point.x, point.y, 1, 1);
    }

    switchStrokeOn() {
        this.enable_stroke = true;
    }

    switchStrokeOff() {
        this.enable_stroke = false;
    }

    draw(context) {
        Log.trace("Shape::draw()::", "shape_type, id, stroke_style, text", this.shape_type, this.id, this.stroke_style, this.text == null ? null : this.text.text);
        context.save();
        this.preDraw(context);
        //this.clipShapeControls(context);
        context.beginPath();
        /*for (let i = 0; i < this.shape_path_edges.length; i++) {
            let edge = this.shape_path_edges[i];
            edge.draw(context);
        }*/
        let point = this.shape_path_points[0];
        point.moveTo(context);
        for (let i = 1; i < this.shape_path_points.length; i++) {
            let point = this.shape_path_points[i];
            point.lineTo(context);
        }
        context.closePath();
        if (this.enable_stroke == true && this.stroke_style != null) {
            const dash_pattern = [this.stroke_style.line_length, this.stroke_style.line_gab];
            context.setLineDash(dash_pattern);
            context.strokeStyle = this.stroke_style.color
            context.lineWidth = 1;
            //context.strokeRect(this.shape_path_points_bounding_rect.x, this.shape_path_points_bounding_rect.y, this.shape_path_points_bounding_rect.width, this.shape_path_points_bounding_rect.height);
            context.stroke();
            // Reset the line dash back to solid after drawing
            context.setLineDash([]);
        }
        if (this.is_line == false) {
            context.fillStyle = this.fill_style.color;
            context.fill();
        } else {
            context.strokeStyle = this.fill_style.color;
            context.stroke();
        }
        
        if (this.image != null) {
            context.save();
            this.clipPath(context);
            context.drawImage(this.image, 0, 0, this.image.width, this.image.height, 
                this.shape_path_points_bounding_rect.x, this.shape_path_points_bounding_rect.y, 
                this.bound_width, this.bound_height);
                context.restore();
        }
        if (this.text != null) {
            this.text.draw(context, this.x, this.y, this.width, this.height);
        }
        if (this.controls_activated == true) {
            this.shape_control_group.drawControls(context);
        }

        if (Log.is(Log.TRACE_DATA)) {
            let radius_a = this.radius;
            context.strokeStyle = this.stroke_style.color;
            context.beginPath();
            context.arc(this.center.x, this.center.y, radius_a, 0, 2 * Math.PI);
            context.stroke();
        }
        this.postDraw(context);
        context.restore();
    }

    clipPath(context) {
        const clip_path = new Path2D();
        let point = this.shape_path_points[0];
        point.pathMoveTo(clip_path);
        for (let i = 1; i < this.shape_path_points.length; i++) {
            let point = this.shape_path_points[i];
            point.pathLineTo(clip_path);
        }
        clip_path.closePath();
        context.clip(clip_path);
    }

    canClip(old_point, new_point, scene_width, scene_height) {
        let vector = new Vector2D(new_point, old_point);
        //let simulation = this.simulatePathPointsAngles(null);
        let scaled_point_top_left = vector.add_point(this.shape_max_bound_rect.top_left_point);
        let scaled_point_bottom_right = vector.add_point(this.shape_max_bound_rect.bottom_right_point);
        Log.trace("Shape::canClip()::", "shape_type, id, vector, scaled_point_top_left, scaled_point_bottom_right", this.shape_type, this.id, vector, scaled_point_top_left, scaled_point_bottom_right);
        let result = scaled_point_top_left.x > 0 && scaled_point_bottom_right.x < scene_width && scaled_point_top_left.y > 0 && scaled_point_bottom_right.y < scene_height;
        return result;
    }

    calcTriangleArea(point_a, point_b, point_c) { 
        return Math.abs((point_a.x*(point_b.y-point_c.y) + point_b.x*(point_c.y-point_a.y)+ point_c.x*(point_a.y-point_b.y))/2.0);
    }

    calcAngle(pointCenter, pointA, pointB) {
        let angle = (180/Math.PI) * ( 
        Math.atan2(pointA.y - pointCenter.y, pointA.x - pointCenter.x)
        -
        Math.atan2(pointB.y - pointCenter.y, pointB.x - pointCenter.x)
        );
        angle = (angle < 0 ? (360 + angle) : angle) % 360;
        return angle;
    }

    getRotationAngleAroundCenter(pointA, pointB) {
        let angle = (180/Math.PI) * ( 
        Math.atan2(pointA.y - this.center.y, pointA.x - this.center.x)
        -
        Math.atan2(pointB.y - this.center.y, pointB.x - this.center.x)
        );
        angle = Math.round((angle < 0 ? (360 + angle + this.rotation_angle) : angle + this.rotation_angle) % 360);
        return angle;
    }

    initialize() {
        //throw new Error('You have to implement "initialize()" in Shape subclass!');
    }

    preDraw(context) {
        throw new Error('You have to implement "preDraw" in Shape subclass!');
    }

    postDraw(context) {
        throw new Error('You have to implement "postDraw" in Shape subclass!');
    }

    generatePathPoints() {
        throw new Error('You have to implement "generatePathPoints" in Shape subclass!');
    }

    isPointInside(point) {
        throw new Error('You have to implement "isPointInside" in Shape subclass!');
    }

    isPointInsideResizeControl(point) {
        let control = this.shape_control_group.getControlOnPoint(point);
        return control != null && control.is(ShapeControl.RESIZE);
    }

    isPointInsideRotateControl(point) {
        let control = this.shape_control_group.getControlOnPoint(point);
        return control != null && control.is(ShapeControl.ROTATE);
    }

    dragPoints(old_point, new_point) {
        throw new Error('You have to implement "dragPoints" method in Shape subclass!');
    }

    transformPoints(old_point, new_point) {
        throw new Error('You have to implement "transformPoints" method in Shape subclass!');
    }

    scalePoints(old_point, new_point) {
        throw new Error('You have to implement "scalePoints" method in Shape subclass!');
    }

    rotatePoints(old_point, new_point) {
        throw new Error('You have to implement "rotatePoints" method in Shape subclass!');
    }

    activateControls() {
        this.shape_control_group = new ShapeControlGroup(this, this.control_width);
        this.shape_path_points.forEach(point => {
            this.shape_control_group.addShapeControl(ShapeControl.RESIZE, point, "grey", "white");
        });
        this.shape_control_group.addShapeControl(ShapeControl.ROTATE, this.center, "yellow", "green");
        this.controls_activated = true;
    }

    deactivateControls() {
        this.controls_activated = false;
    }
    
    toString() {
        return Log.dump("shape_type, id, stroke_style, fill_style, extras, text", this.shape_type, this.id, this.stroke_style, this.fill_style, this.extras, this.text);
    }

    setClipImage(image, image_name, image_type) {
        this.image = image;
        this.image_name = image_name;
        this.image_type = image_type;
    }
}