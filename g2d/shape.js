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
import { Edge, EdgeType } from './edge.js'
import { Geometry, Rectangle_2D } from '../math/geometry.js';
import { ShapeControl, ShapeControlGroup } from './control.js';

export class Shape {

    constructor(shape_type, configuration, id, name, rotation_angle, stroke_style, fill_style, extras, text, control_width) {
        Log.trace("Shape::constructor()::", "shape_type, id, stroke_style, fill_style, extras, text", shape_type, id, stroke_style, fill_style, extras, text);
        this.shape_type = shape_type;
        this.id = id;
        this.name = name;
        this.stroke_style = stroke_style;
        this.fill_style = fill_style;
        this.is_line = shape_type.toLowerCase() === "line" ? true : false;
        let keys = Object.keys(extras);
        for (let i = 0; i < keys.length; i++) {
            this[keys[i]] = extras[keys[i]];
        }
        this.is_rotating = false;
        this.rotation_angle = rotation_angle;
        this.shape_control_shape_list = [];
        this.enable_stroke = false;
        this.text = text;
        this.control_width = control_width;
        this.initialize()
        this.generatePath();
        this.shape_control_group = new ShapeControlGroup(this, this.control_width);
        Object.keys(configuration).forEach((property) => {
            if (this[property] == null) {
                Object.defineProperty(this, property, {
                    value: configuration[property],
                    writable: true,
                    enumerable: true
                  });
            }
        });
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
            center: this.center_point,
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
                Math.atan2(0, simulation.center_point.x)
                -
                Math.atan2(point.y - simulation.center_point.y, point.x - simulation.center_point.x)
                );
            angle = Math.round((angle < 0 ? (360 + angle) : angle) % 360);
        
            simulation.shape_path_points_angles[simulation.shape_path_points_angles.length] = angle;
            simulation.shape_path_points_radius[simulation.shape_path_points_radius.length] = simulation.distance(simulation.center_point, point);

            //Bounding Rectangle
            min_x = Math.min(min_x, point.x);
            min_y = Math.min(min_y, point.y);
            max_x = Math.max(max_x, point.x);
            max_y = Math.max(max_y, point.y);
        }

        simulation.bound_width = max_x - min_x;
        simulation.bound_height = max_y - min_y;

        simulation.shape_path_bounding_rect = new Rectangle_2D(min_x, min_y, max_x, max_y);
        simulation.shape_path_edges = Edge.doEdges(simulation.shape_path_points, EdgeType.line_connector, true);

        simulation.shape_path_points_rotated = simulation.rotation_angle == 0 ? simulation.shape_path_points : Geometry.rotatePathAroundCenter(simulation.rotation_angle, simulation.center_point, simulation.shape_path_points_angles, simulation.shape_path_points_radius);

        /** max rectangle with rotate from center - the outer circle bounding rectangle*/
        /*let bound_rect_width = (simulation.bound_width) / 2;
        let bound_rect_height = (simulation.bound_height) / 2;
        simulation.shape_bound_rect = new Rectangle_2D(simulation.center_point.x - bound_rect_width, simulation.center_point.y - bound_rect_height, simulation.center_point.x + bound_rect_width, simulation.center_point.y + bound_rect_height);*/
        let outer_bound_rect_width = (simulation.bound_width + simulation.control_width) / 2;
        let outer_bound_rect_height = (simulation.bound_height + simulation.control_width) / 2;
        simulation.shape_clip_bound_rect = new Rectangle_2D(simulation.center_point.x - outer_bound_rect_width, simulation.center_point.y - outer_bound_rect_height, simulation.center_point.x + outer_bound_rect_width, simulation.center_point.y + outer_bound_rect_height);
        //let outer_bound_rect_side = Math.max(outer_bound_rect_width, outer_bound_rect_height);
        //simulation.shape_clean_bound_rect = new Rectangle_2D(simulation.center_point.x - outer_bound_rect_side, simulation.center_point.y - outer_bound_rect_side, simulation.center_point.x + outer_bound_rect_side, simulation.center_point.y + outer_bound_rect_side);
        simulation.shape_clean_bound_rect = simulation.shape_clip_bound_rect.getBoundCircleBoundRect();
        //simulation.shape_clean_bound_rect = simulation.shape_clip_bound_rect.clone().zoom(-2, 2);//simulation.shape_clip_bound_rect.getBoundCircleBoundRect();
        return simulation;
    }

    distance(point_a, point_b) {
        return Math.sqrt(Math.pow(point_a.x - point_b.x, 2) + Math.pow(point_a.y - point_b.y, 2)); 
    }

    setPixle(point, color) {
        context.fillStyle = color;
        context.fillRect(point.x, point.y, 1, 1);
    }

    switchStrokeOn() {
        this.enable_stroke = true;
    }

    switchStrokeOff() {
        this.enable_stroke = false;
    }

    draw(language, context) {
        Log.trace("Shape::draw()::", "shape_type, id, hidden, rotation_angle, stroke_style, text", this.shape_type, this.id, this.hidden, this.rotation_angle, this.stroke_style, this.text == null ? null : this.text.text);
        if (this.hidden == true) {
            return;
        }
        context.save();
        this.preDraw(context);
        //this.clipShapeControls(context);
        context.beginPath();
        /*for (let i = 0; i < this.shape_path_edges.length; i++) {
            let edge = this.shape_path_edges[i];
            edge.draw(context);
        }*/
        Log.trace("Shape::draw()::shape_path_points_angles", "shape_angles", this.shape_path_points_angles);
        let point = this.shape_path_points_rotated[0];
        if (point == null) {
            debugger;
        }
        point.moveTo(context);
        for (let i = 1; i < this.shape_path_points_rotated.length; i++) {
            let point = this.shape_path_points_rotated[i];
            point.lineTo(context);
        }
        context.closePath();
        if (this.enable_stroke == true && this.stroke_style != null) {
            const dash_pattern = [this.stroke_style.line_length, this.stroke_style.line_gab];
            context.setLineDash(dash_pattern);
            context.strokeStyle = this.stroke_style.color
            context.lineWidth = 1;
            //context.strokeRect(this.shape_path_bounding_rect.left_top_point.x, this.shape_path_bounding_rect.left_top_point.y, this.shape_path_bounding_rect.width, this.shape_path_bounding_rect.height);
            context.stroke();
            // Reset the line dash back to solid after drawing
            context.setLineDash([]);
        }
        if (this.is_line == false) {
            context.fillStyle = this.fill_style.color;
            context.fill();
            context.strokeStyle = this.stroke_style.color;
            context.stroke();
        } else {
            context.strokeStyle = this.fill_style.color;
            context.stroke();
        }
        
        if (this.image_instance != null || this.text != null) {
            context.save();
            this.clipPath(context, this.shape_path_points_rotated);
            context.translate(this.center_point.x, this.center_point.y);
            context.rotate(Geometry.radian.radians[360 - this.rotation_angle]);
            if (this.image_instance != null) {
                //context.save();
                let scale_x = this.shape_path_bounding_rect.width / this.image_instance.width;
                let scale_y = this.shape_path_bounding_rect.height / this.image_instance.height;
                context.scale(scale_x, scale_y);
                context.drawImage(this.image_instance, -this.image_instance.image_width / 2, -this.image_instance.height / 2);
                /*context.drawImage(this.image_instance, 0, 0, this.image_instance.width, this.image_instance.height, 
                    this.shape_path_bounding_rect.left_top_point.x, this.shape_path_bounding_rect.left_top_point.y, 
                    this.shape_path_bounding_rect.width, this.shape_path_bounding_rect.height);*/
                //context.restore();
            }
            if (this.text != null) {
                context.setTransform(1, 0, 0, 1, 0, 0);
                context.translate(this.center_point.x, this.center_point.y);
                context.rotate(Geometry.radian.radians[360 - this.rotation_angle]);
                context.translate(-this.center_point.x, 0);
                this.text.draw(language, context, this.x, this.y, this.width, this.height);
            }
            context.restore();
        }
        if (this.controls_activated == true) {
            this.shape_control_group.drawControls(context);
        }

        if (Log.is(Log.TRACE_DATA)) {
            let radius_a = this.radius;
            context.strokeStyle = this.stroke_style.color;
            context.beginPath();
            context.arc(this.center_point.x, this.center_point.y, radius_a, 0, 2 * Math.PI);
            context.stroke();
        }
        this.postDraw(context);
        context.restore();
    }

    clipPath(context, shape_path_points) {
        const clip_path = new Path2D();
        let point = shape_path_points[0];
        point.pathMoveTo(clip_path);
        for (let i = 1; i < shape_path_points.length; i++) {
            let point = shape_path_points[i];
            point.pathLineTo(clip_path);
        }
        clip_path.closePath();
        context.clip(clip_path);
    }

    canClipInRect(vector) {
        let scaled_left_top_point = vector.scale_point(this.shape_clip_bound_rect.left_top_point);
        let scaled_right_bottom_point = vector.scale_point(this.shape_clip_bound_rect.right_bottom_point);
        Log.trace("Shape::canClip()::", "shape_type, id, vector, scaled_left_top_point, scaled_right_bottom_point", this.shape_type, this.id, vector, scaled_left_top_point, scaled_right_bottom_point);
        let result = scaled_left_top_point.x > this.clip_rect.left_top_point.x && scaled_right_bottom_point.x < this.clip_rect.right_bottom_point.x && scaled_left_top_point.y > this.clip_rect.left_top_point.y && scaled_right_bottom_point.y < this.clip_rect.right_bottom_point.y;
        return result;
    }

    canClip(vector, scene_width, scene_height) {
        let scaled_left_top_point = vector.scale_point(this.shape_clip_bound_rect.left_top_point);
        let scaled_right_bottom_point = vector.scale_point(this.shape_clip_bound_rect.right_bottom_point);
        Log.trace("Shape::canClip()::", "shape_type, id, vector, scaled_left_top_point, scaled_right_bottom_point", this.shape_type, this.id, vector, scaled_left_top_point, scaled_right_bottom_point);
        let result = scaled_left_top_point.x > 0 && scaled_right_bottom_point.x < scene_width && scaled_left_top_point.y > 0 && scaled_right_bottom_point.y < scene_height;
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
        if (this.shape_control_group == null) {
            debugger;
        }
        let control = this.shape_control_group.getControlOnPoint(point);
        return control != null && control.is(ShapeControl.RESIZE);
    }

    isPointInsideRotateControl(point) {
        let control = this.shape_control_group.getControlOnPoint(point);
        return control != null && control.is(ShapeControl.ROTATE);
    }

    dragPoints(vector) {
        this.center_point = vector.scale_point(this.center_point);
        this.generatePath();
        this.shape_control_group.transform();
    }

    transformPoints(old_point, new_point) {
        throw new Error('You have to implement "transformPoints" method in Shape subclass!');
    }

    scalePoints(old_point, new_point) {
        throw new Error('You have to implement "scalePoints" method in Shape subclass!');
    }

    rotateAngle(delta_rotation_angle) {
        this.rotation_angle = this.rotation_angle + delta_rotation_angle < 360 ? (this.rotation_angle + delta_rotation_angle) : (this.rotation_angle + delta_rotation_angle) % 360;
        this.shape_control_group.rotateAngle(this.rotation_angle);
        this.generatePath();
        Log.trace("Shape::rotateAngle()::", "rotation_angle, delta_rotation_angle", this.rotation_angle, delta_rotation_angle);
    }

    activateControls() {
        this.controls_activated = true;
    }

    deactivateControls() {
        this.controls_activated = false;
    }

    isSelectable() {
        return this.selectable == true && this.draggable == true && this.resizable.width == true && this.resizable.height == true;
    }
    
    setClipImage(image_instance) {
        this.image_instance = image_instance;
    }

    toString() {
        return Log.dump("shape_type, id, stroke_style, fill_style, extras, text", this.shape_type, this.id, this.stroke_style, this.fill_style, this.extras, this.text);
    }

    clone() {
        //return ShapeUtils.creatShape(this.toJSON());
        return this.toJSON();
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            clip_rect_shape_id: this.clip_rect_shape_id,
            is_line: this.is_line,
            is_rotating: this.is_rotating,
            radius: this.radius,
            rotation_angle: this.rotation_angle,
            shape_type: this.shape_type,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            half_height: this.half_height,
            half_width: this.half_width,
            bound_height: this.bound_height,
            bound_width: this.bound_width,
            center_point: this.center_point,
            control_width: this.control_width,
            enable_stroke: this.enable_stroke,
            image_instance: this.image_instance == null ? null : {image_uuid: this.image_instance.image_uuid},
            //line
            start_point: this.start_point,
            end_point: this.end_point,
            //circle
            center_x: this.center_x,
            center_y: this.center_y,
            //rectangle
            left_x: this.left_x,
            top_y: this.top_y,
            //triangle
            a_point: this.a_point,
            b_point: this.b_point,
            c_point: this.c_point,
            //style properties
            fill_style: this.fill_style,
            stroke_style: this.stroke_style,
            text: this.text,
            //menu properties
            insertable: this.insertable,
            selectable: this.selectable,
            draggable: this.draggable,
            dropable: this.dropable,
            expanded: this.expanded,
            hidden: this.hidden,
            resizable: this.resizable,
            level: this.level,
            order: this.order
        };
    }
}
