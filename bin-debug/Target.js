// Liberapp 2019 - Tahiti Katagai
// ターゲットのマト
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
        _this.animFrameMax = 8;
        _this.animFrame = 0;
        _this.text = null;
        Target.targets.push(_this);
        _this.hp = hp;
        _this.radius = TARGET_RADIUS_PER_WIDTH * Util.width;
        _this.setShape(x, y, _this.radius);
        _this.text = Util.newTextField("" + _this.hp, Util.width / 18, 0xffffff, x / Util.width, y / Util.height, true);
        GameObject.display.addChild(_this.text);
        return _this;
    }
    Target.prototype.onDestroy = function () {
        var _this = this;
        Target.targets = Target.targets.filter(function (obj) { return obj != _this; });
        GameObject.display.removeChild(this.text);
        this.text = null;
    };
    Target.prototype.setShape = function (x, y, radius) {
        if (this.shape)
            GameObject.display.removeChild(this.shape);
        this.shape = new egret.Shape();
        this.shape.graphics.beginFill(Target.getColor(this.hp));
        this.shape.graphics.drawCircle(0, 0, radius * (1 + 0.3 * this.animFrame / this.animFrameMax));
        this.shape.graphics.endFill();
        GameObject.display.addChild(this.shape);
        GameObject.display.setChildIndex(this.shape, 2);
        this.shape.x = x;
        this.shape.y = y;
    };
    Target.getColor = function (hp) {
        var rate = Util.clamp((hp - 1) / (Target.maxHp - 1), 0, 1);
        if (rate <= 0.5)
            rate = Util.colorLerp(0xf00040, 0x00f000, rate * 2);
        else
            rate = Util.colorLerp(0x00f000, 0x4000ff, rate * 2 - 1);
        return rate;
    };
    Target.prototype.update = function () {
        this.text.text = "" + this.hp.toFixed();
        this.text.x = this.shape.x - this.text.width * 0.5;
        this.text.y = this.shape.y - this.text.height * 0.5;
        if (this.animFrame > 0) {
            this.animFrame--;
            this.setShape(this.shape.x, this.shape.y, this.radius);
        }
    };
    // ダメージ
    Target.prototype.applyDamage = function (point) {
        this.hp -= point;
        if (this.hp > 0) {
            this.animFrame = this.animFrameMax;
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