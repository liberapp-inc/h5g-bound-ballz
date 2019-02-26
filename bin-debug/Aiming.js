// Liberapp 2019 - Tahiti Katagai
// 狙って撃つ方向表示
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var Aiming = (function (_super) {
    __extends(Aiming, _super);
    function Aiming() {
        var _this = _super.call(this) || this;
        _this.dir = 0; // 真下方向(0,1)を０度とするラジアン
        _this.ballCount = 4;
        _this.interval = 0;
        _this.rowCount = 0;
        _this.state = _this.stateWave;
        _this.x = Util.width * 0.5;
        _this.y = Util.height * 0.1;
        GameObject.display.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function (e) { return _this.touchBegin(e); }, _this);
        GameObject.display.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, function (e) { return _this.touchMove(e); }, _this);
        GameObject.display.stage.addEventListener(egret.TouchEvent.TOUCH_END, function (e) { return _this.touchEnd(e); }, _this);
        return _this;
    }
    Aiming.prototype.onDestroy = function () {
        var _this = this;
        GameObject.display.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, function (e) { return _this.touchBegin(e); }, this);
        GameObject.display.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, function (e) { return _this.touchMove(e); }, this);
        GameObject.display.stage.removeEventListener(egret.TouchEvent.TOUCH_END, function (e) { return _this.touchEnd(e); }, this);
    };
    Aiming.prototype.setShape = function (x, y) {
        if (this.shape) {
            GameObject.display.removeChild(this.shape);
            this.shape = null;
        }
        // ボールを撃つ方向　ライン表示
        var px = this.x;
        var py = this.y;
        var vx = x - px;
        var vy = y - py;
        if (vy < 0) {
            vy = 0;
        }
        this.dir = Util.clamp(Math.atan2(vx, vy), -Math.PI * 0.45, +Math.PI * 0.45);
        //console.log( this.dir );
        vx = Math.sin(this.dir);
        vy = Math.cos(this.dir);
        this.shape = new egret.Shape();
        this.shape.graphics.lineStyle(5, 0x800000);
        this.shape.graphics.moveTo(px, py);
        var lineLength = Util.height * 0.3;
        this.shape.graphics.lineTo(px + vx * lineLength, py + vy * lineLength);
        GameObject.display.addChild(this.shape);
    };
    Aiming.prototype.update = function () {
        this.state();
    };
    Aiming.prototype.stateWave = function () {
        Score.I.combo = 0;
        // scroll up
        Target.targets.forEach(function (target) {
            target.shape.y -= TARGET_SIZE_PER_WIDTH * Util.width;
        });
        // Generate new targets
        this.rowCount++;
        var ratio = 0;
        var delta = Util.clamp(1 - this.rowCount / 20, 0.25, 1.0);
        var y = Util.height * (1 - TARGET_RADIUS_PER_WIDTH);
        var maxHp = Math.min(this.rowCount, Target.maxHp);
        ratio += delta * Util.random(0, 1);
        while (true) {
            if (ratio > 1)
                break;
            var x = Util.width * (TARGET_RADIUS_PER_WIDTH + ratio * (1 - TARGET_SIZE_PER_WIDTH));
            new Target(x, y, Util.randomInt(maxHp * 0.33, maxHp));
            ratio += delta * (1 + Util.random(-0.5, 0.5));
        }
        this.state = this.stateAim;
    };
    Aiming.prototype.stateAim = function () {
    };
    Aiming.prototype.stateBound = function () {
        this.interval++;
        // ボールを撃つ（弾数分を連射）
        if (this.interval / 10 <= this.ballCount) {
            if ((this.interval % 10) == 0) {
                var speed = BALL_RADIUS_PER_WIDTH * Util.width;
                new Ball(this.x, this.y, Math.sin(this.dir) * speed, Math.cos(this.dir) * speed);
            }
        }
        else {
            // すべてのボールが消えたら次へ
            if (Ball.balls.length == 0) {
                this.state = this.stateWave;
            }
        }
    };
    Aiming.prototype.touchBegin = function (e) {
        if (this.state != this.stateAim)
            return;
        this.setShape(e.localX, e.localY);
    };
    Aiming.prototype.touchMove = function (e) {
        if (this.state != this.stateAim)
            return;
        this.setShape(e.localX, e.localY);
    };
    Aiming.prototype.touchEnd = function (e) {
        if (this.state != this.stateAim)
            return;
        // shoot( this.dir );
        this.state = this.stateBound;
        this.interval = 0;
    };
    return Aiming;
}(GameObject));
__reflect(Aiming.prototype, "Aiming");
//# sourceMappingURL=Aiming.js.map