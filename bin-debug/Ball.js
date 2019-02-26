// Liberapp 2019 - Tahiti Katagai
// 撃って跳ねるボール
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
var Ball = (function (_super) {
    __extends(Ball, _super);
    function Ball(x, y, vx, vy) {
        var _this = _super.call(this) || this;
        Ball.balls.push(_this);
        _this.radius = BALL_SIZE_PER_WIDTH * Util.width * 0.5;
        _this.setShape(x, y, _this.radius);
        _this.vx = vx;
        _this.vy = vy;
        return _this;
    }
    Ball.prototype.onDestroy = function () {
        var _this = this;
        Ball.balls = Ball.balls.filter(function (obj) { return obj != _this; });
    };
    Ball.prototype.setShape = function (x, y, radius) {
        if (this.shape)
            GameObject.display.removeChild(this.shape);
        this.shape = new egret.Shape();
        this.shape.graphics.beginFill(0xffc000);
        this.shape.graphics.drawCircle(0, 0, radius);
        this.shape.graphics.endFill();
        GameObject.display.addChild(this.shape);
        this.shape.x = x;
        this.shape.y = y;
    };
    Ball.prototype.update = function () {
        var _this = this;
        // 移動処理
        this.shape.x += this.vx;
        this.shape.y += this.vy;
        this.vx *= 0.99;
        this.vy *= 0.99;
        this.vy += this.radius * 0.01;
        // Targetとの接触判定（一番近いもの）
        var nearest = null;
        var ndd = 0;
        Target.targets.forEach(function (target) {
            var dx = target.shape.x - _this.shape.x;
            var dy = target.shape.y - _this.shape.y;
            var dd = Math.pow(dx, 2) + Math.pow(dy, 2);
            if (!nearest) {
                var rr = Math.pow((target.radius + _this.radius), 2);
                if (dd < rr) {
                    nearest = target;
                    ndd = dd;
                }
            }
            else {
                if (ndd > dd) {
                    nearest = target;
                    ndd = dd;
                }
            }
        });
        // 反射
        if (nearest) {
            var dx = this.shape.x - nearest.shape.x;
            var dy = this.shape.y - nearest.shape.y;
            // 単位ベクトル
            var l = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
            var udx = dx / l;
            var udy = dy / l;
            // 内積　反射方向か
            var dot = udx * this.vx + udy * this.vy;
            if (dot < 0) {
                // 反射
                this.vx += -2 * 0.90 * dot * udx;
                this.vy += -2 * 0.90 * dot * udy;
                // ダメージ〜破壊
                nearest.applyDamage(1);
            }
        }
        this.boundWall();
    };
    // 壁で跳ね返り
    Ball.prototype.boundWall = function () {
        if (Math.pow((this.shape.x - Util.width * 0.5), 2) > Math.pow((Util.width * 0.5 - this.radius), 2)) {
            this.vx *= -0.90;
            this.shape.x += this.vx;
        }
        if (this.vy < 0 && this.shape.y < this.radius) {
            this.vy *= -0.90;
            this.shape.y += this.vy;
        }
        // 下に落ちたら消える
        if (this.shape.y > Util.height) {
            this.destroy();
        }
    };
    Ball.balls = [];
    return Ball;
}(GameObject));
__reflect(Ball.prototype, "Ball");
//# sourceMappingURL=Ball.js.map