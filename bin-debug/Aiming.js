// Liberapp 2019 - Tahiti Katagai
// 狙って撃つ方向表示　ゲーム展開
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
        _this.lineColor = 0x0080ff;
        _this.dir = 0; // 真下方向(0,1)を０度とするラジアン
        _this.ballCount = 2;
        _this.interval = 0;
        _this.rowCount = 0;
        _this.state = _this.stateWave;
        _this.step = 0;
        _this.textGuide = null;
        _this.textBalls = null;
        Aiming.I = _this;
        _this.x = Util.width * 0.5;
        _this.y = Util.height * 0.1;
        _this.ballSpeed = BALL_RADIUS_PER_WIDTH * Util.width * 0.75;
        _this.textGuide = Util.newTextField("スワイプでねらって\nボールをおとせ！", Util.width / 18, 0x0080ff, 0.5, 0.3, true);
        _this.textBalls = Util.newTextField("x" + _this.ballCount, Util.width / 22, 0x0080ff, 0.55, 0.08, true);
        GameObject.display.addChild(_this.textGuide);
        GameObject.display.addChild(_this.textBalls);
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
        if (this.textGuide) {
            GameObject.display.removeChild(this.textGuide);
            this.textGuide = null;
        }
        if (this.textBalls) {
            GameObject.display.removeChild(this.textBalls);
            this.textBalls = null;
        }
        Aiming.I = null;
    };
    Aiming.prototype.setShape = function () {
        if (this.shape)
            GameObject.display.removeChild(this.shape);
        // 点線
        this.shape = new egret.Shape();
        var px = this.x;
        var py = this.y;
        var vx = Math.sin(this.dir) * this.ballSpeed;
        var vy = Math.cos(this.dir) * this.ballSpeed;
        var radius = BALL_RADIUS_PER_WIDTH * Util.width;
        var rate = (this.step & 15) / 16;
        px += vx * rate;
        py += vy * rate;
        vx *= 1 - 0.01 * rate;
        vy *= 1 - 0.01 * rate;
        vy += radius * 0.01 * rate;
        this.shape.graphics.lineStyle(5 * rate, this.lineColor);
        this.shape.graphics.drawCircle(px, py, radius * 0.02);
        this.shape.graphics.lineStyle(5, this.lineColor);
        for (var i = 0; i < 20; i++) {
            px += vx;
            py += vy;
            vx *= 0.99;
            vy *= 0.99;
            vy += radius * 0.01;
            this.shape.graphics.drawCircle(px, py, radius * 0.02);
        }
        px += vx;
        py += vy;
        vx *= 0.99;
        vy *= 0.99;
        vy += radius * 0.01;
        this.shape.graphics.lineStyle(5 * (1 - rate), this.lineColor);
        this.shape.graphics.drawCircle(px, py, radius * 0.02);
        GameObject.display.addChild(this.shape);
    };
    Aiming.prototype.setDir = function (x, y) {
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
    };
    Aiming.prototype.update = function () {
        this.state();
    };
    Aiming.prototype.stateWave = function () {
        Score.I.combo = 0;
        // Generate new targets
        this.rowCount++;
        var delta = Util.clamp(1 - this.rowCount / 30, 0.45, 1.0);
        var y = Util.height * (1 + TARGET_RADIUS_PER_WIDTH);
        var maxHp = Math.min(this.rowCount + 2, Target.maxHp);
        var ratio = delta * Util.random(0, 1);
        while (true) {
            if (ratio > 1)
                break;
            var x = Util.width * (TARGET_RADIUS_PER_WIDTH + ratio * (1 - TARGET_SIZE_PER_WIDTH));
            if (Util.randomInt(0, 5) != 0) {
                new Target(x, y, Util.randomInt(Math.max(1, maxHp * 0.33), maxHp));
            }
            else {
                new Item(x, y);
            }
            ratio += delta * Util.random(1 - 0.5, 1 + 0.5);
        }
        this.state = this.stateScroll;
        this.step = 0;
    };
    Aiming.prototype.stateScroll = function () {
        this.step++;
        var frames = 30;
        var scrollHeight = TARGET_SIZE_PER_WIDTH * Util.width * -1.25;
        var delta = scrollHeight / frames * Math.sin(Math.PI * this.step / 30) * Math.PI / 2;
        var isGameOver = Target.scrollUp(delta);
        Item.scrollUp(delta);
        if (this.step >= 30) {
            if (isGameOver) {
                new GameOver();
                this.state = this.stateGameOver;
                return;
            }
            if (this.rowCount < 3) {
                this.state = this.stateWave;
            }
            else {
                this.state = this.stateAim;
            }
        }
    };
    Aiming.prototype.stateAim = function () {
        this.step++;
        this.setShape();
    };
    Aiming.prototype.stateBound = function () {
        this.interval++;
        // ボールを撃つ（弾数分を連射）
        if (this.interval / 15 <= this.ballCount) {
            if ((this.interval % 15) == 0) {
                new Ball(this.x, this.y, Math.sin(this.dir) * this.ballSpeed, Math.cos(this.dir) * this.ballSpeed);
            }
        }
        else {
            // すべてのボールが消えたら次へ
            if (Ball.balls.length == 0) {
                this.state = this.stateWave;
            }
        }
    };
    Aiming.prototype.stateGameOver = function () { };
    Aiming.prototype.touchBegin = function (e) {
        if (this.state != this.stateAim)
            return;
        this.setDir(e.localX, e.localY);
        if (this.textGuide) {
            GameObject.display.removeChild(this.textGuide);
            this.textGuide = null;
        }
    };
    Aiming.prototype.touchMove = function (e) {
        if (this.state != this.stateAim)
            return;
        this.setDir(e.localX, e.localY);
    };
    Aiming.prototype.touchEnd = function (e) {
        if (this.state != this.stateAim)
            return;
        // shoot( this.dir );
        this.state = this.stateBound;
        this.interval = 0;
    };
    Aiming.prototype.addBall = function () {
        if (this.ballCount < 9) {
            this.ballCount++;
        }
        else {
            Score.I.point += 1;
        }
        this.textBalls.text = "x" + this.ballCount;
    };
    Aiming.I = null;
    return Aiming;
}(GameObject));
__reflect(Aiming.prototype, "Aiming");
//# sourceMappingURL=Aiming.js.map