import Point from '../modules/Point';
import Line from '../modules/Line';
import Circle from '../modules/Circle';
import SimplexNoise from 'simplex-noise';
import * as dat from 'dat.gui';
import _ from 'underscore';
import { TweenLite } from 'gsap';


class CircleInception {
    constructor(id, props, ctx) {
        _.bindAll(this, '_setupRotatingCircle');

        this._props = props;
        this._id = id;
        this._ctx = ctx;

        this._width = this._props.width;
        this._height = this._props.height;

        this._position = {
            x: this._props.x,
            y: this._props.y,
        }

        let radiusArray = [100/2, 100/3, 100/4, 100/5, 100/6, 100/7];
        let speedFactorArray = [1, 2, 3, 4, 5, 6];

        this._settings = {
            clearOpacity: 1,
            radius: (this._width / 2) - 60,
            speed: 0.8,
            //102 interessant
            rotationSpeedFactor: speedFactorArray[id],
            radiusProportion: radiusArray[id],
            dephasingFactor: 1
        }
        this._delta = 0;

        this._setup();
    }

    _setup() {
        this._setupCircleContainer();
        this._setupRotatingCircle();
        this._setupRotatingCircleCenter();
        this._setupRotatingCircleTangentPoint();
        this._setupRotatingCircleTangentOpositePoint();
    }

    //SETUP
    _setupCircleContainer() {
        this._circleContainer = new Circle({x: this._width/2, y: this._height/2}, this._settings.radius);
    }

    _setupRotatingCircle() {
        this._rotatingCircleRadius = this._settings.radius * (this._settings.radiusProportion/100) * this._settings.dephasingFactor;
        let center = {};
        center.x = this._width/2 + Math.cos(0) * (this._settings.radius - this._rotatingCircleRadius);
        center.y = this._height/2 + Math.sin(0) * (this._settings.radius - this._rotatingCircleRadius);
        this._rotatingCircle = new Circle(center, this._rotatingCircleRadius);
    }

    _setupRotatingCircleCenter() {
        let radius = this._rotatingCircleRadius;
        let center = {};
        center.x = this._width/2 + Math.cos(0) * (this._settings.radius - radius);
        center.y = this._height/2 + Math.sin(0) * (this._settings.radius - radius);
        this._rotatingCircleCenter = new Point(center);
    }

    _setupRotatingCircleTangentPoint() {
        let radius = this._rotatingCircleRadius;
        let center = {};
        center.x = this._rotatingCircleCenter.position.x + Math.cos(-this._delta * this._settings.rotationSpeedFactor) * radius;
        center.y = this._rotatingCircleCenter.position.y + Math.sin(-this._delta * this._settings.rotationSpeedFactor) * radius;
        this._rotatingCircleTangentPoint = new Point(center);
    }

    _setupRotatingCircleTangentOpositePoint() {
        let radius = this._rotatingCircleRadius;
        let center = {};
        center.x = this._rotatingCircleCenter.position.x + Math.cos((-this._delta * this._settings.rotationSpeedFactor) + Math.PI * 2 ) * radius;
        center.y = this._rotatingCircleCenter.position.y + Math.sin((-this._delta * this._settings.rotationSpeedFactor) + Math.PI * 2 ) * radius;
        this._rotatingCircleTangentOpositePoint = new Point(center);
    }

    //UPDATE
    _updateCircleContainer() {
        
    }

    _updateRotatingCircle() {
        let radius = this._rotatingCircleRadius;
        this._rotatingCircle.position.x = this._width/2 + Math.cos(-this._delta) * (this._settings.radius - radius);
        this._rotatingCircle.position.y = this._height/2 + Math.sin(-this._delta) * (this._settings.radius - radius);
    }

    _updateRotatingCircleCenter() {
        let radius = this._rotatingCircleRadius;
        this._rotatingCircleCenter.position.x = this._width/2 + Math.cos(- this._delta) * (this._settings.radius - radius);
        this._rotatingCircleCenter.position.y = this._height/2 + Math.sin(- this._delta) * (this._settings.radius - radius);
    }
    
    _updateRotatingCircleTangentPoint() {
        let radius = this._rotatingCircleRadius;
        this._rotatingCircleTangentPoint.position.x = this._rotatingCircleCenter.position.x + Math.cos(this._delta * this._settings.rotationSpeedFactor) * radius;
        this._rotatingCircleTangentPoint.position.y = this._rotatingCircleCenter.position.y + Math.sin(this._delta * this._settings.rotationSpeedFactor) * radius;
    }

    _updateRotatingCircleTangentOpositePoint() {
        let radius = this._rotatingCircleRadius;
        this._rotatingCircleTangentOpositePoint.x = this._rotatingCircleCenter.position.x + Math.cos((-this._delta * this._settings.rotationSpeedFactor) + Math.PI * 2 ) * radius;
        this._rotatingCircleTangentOpositePoint.y = this._rotatingCircleCenter.position.y + Math.sin((-this._delta * this._settings.rotationSpeedFactor) + Math.PI * 2 ) * radius;
    }

    //PUBLIC UPDATE
    updateSettings(props, value) {
        this._settings[props] = value;
        if (props == 'dephasingFactor') {
            // this._clear(1);
            this._setupRotatingCircle();
        }
    }

    animateIn() {
        let tweenValue = { opacity: 0 }
        TweenLite.to(tweenValue, .5, { opacity: 1, onUpdate: () => {
            this._circleContainer.animate(tweenValue.opacity)
        }});
    }

    //DRAW
    _drawCircleContainer() {
        this._circleContainer.draw(this._ctx, 'rgba(255, 255, 255, 0.2)');
    }

    _drawRotatingCircle() {
        this._rotatingCircle.draw(this._ctx);
    }

    _drawRotatingCircleCenter() {
        this._rotatingCircleCenter.draw(this._ctx, 'white');
    }

    _drawRotatingCircleTangentPoint() {
        this._rotatingCircleTangentPoint.draw(this._ctx, 'white');
    }
    
    _drawRotatingCircleTangentOpositePoint() {
        this._rotatingCircleTangentOpositePoint.draw(this._ctx, 'white');
    }

    _clear(opacity) {
        this._ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
        this._ctx.fillRect(this._position.x, this._position.y, this._width, this._height);
    }

    draw(deltaTime) {
        this._delta += this._settings.speed * 0.001 * deltaTime;

        this._clear(this._settings.clearOpacity);

        this._ctx.save();
        this._ctx.translate(this._position.x, this._position.y);

        //DRAW
        this._drawCircleContainer();
        // this._drawRotatingCircle();
        this._drawRotatingCircleCenter();
        this._drawRotatingCircleTangentPoint();
        // this._drawRotatingCircleTangentOpositePoint();

        this._updateCircleContainer();
        this._updateRotatingCircle();
        this._updateRotatingCircleCenter();
        this._updateRotatingCircleTangentPoint();
        this._updateRotatingCircleTangentOpositePoint();

        this._ctx.restore();
    }

}

export default CircleInception;