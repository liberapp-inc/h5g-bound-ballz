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
var Target = (function (_super) {
    __extends(Target, _super);
    function Target(x, y, hp) {
        var _this = _super.call(this) || this;
        Target.targets.push(_this);
        _this.hp = hp;
        _this.radius = TARGET_RADIUS_PER_WIDTH * Util.width;
        _this.setShape(x, y, _this.radius);
        return _this;
    }
    Target.prototype.onDestroy = function () {
        var _this = this;
        Target.targets = Target.targets.filter(function (obj) { return obj != _this; });
    };
    Target.prototype.setShape = function (x, y, radius) {
        if (this.shape)
            GameObject.display.removeChild(this.shape);
        this.shape = new egret.Shape();
        this.shape.graphics.beginFill(Target.getColor(this.hp));
        this.shape.graphics.drawCircle(0, 0, radius);
        this.shape.graphics.endFill();
        GameObject.display.addChild(this.shape);
        this.shape.x = x;
        this.shape.y = y;
    };
    Target.getColor = function (hp) {
        var rate = Util.clamp((hp - 1) / (Target.maxHp - 1), 0, 1);
        return Util.colorLerp(0xf0d000, 0x800000, rate);
    };
    Target.prototype.update = function () {
    };
    // ダメージ
    Target.prototype.applyDamage = function (point) {
        if (point === void 0) { point = 1; }
        this.hp -= point;
        if (this.hp > 0) {
            this.setShape(this.shape.x, this.shape.y, this.radius);
        }
        else {
            Score.I.breakTarget();
            this.destroy();
        }
    };
    Target.targets = [];
    Target.maxHp = 10;
    return Target;
}(GameObject));
__reflect(Target.prototype, "Target");
//# sourceMappingURL=Target.js.map