// Liberapp 2019 - Tahiti Katagai
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
var Background = (function (_super) {
    __extends(Background, _super);
    function Background() {
        var _this = _super.call(this) || this;
        _this.shape = new egret.Shape();
        _this.shape.graphics.beginFill(0xf0f2f8);
        _this.shape.graphics.drawRect(0, 0, Util.width, Util.height);
        _this.shape.graphics.endFill();
        GameObject.display.addChild(_this.shape);
        GameObject.display.setChildIndex(_this.shape, 1);
        return _this;
    }
    Background.prototype.update = function () { };
    return Background;
}(GameObject));
__reflect(Background.prototype, "Background");
//# sourceMappingURL=Background.js.map