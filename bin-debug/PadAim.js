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
    function Aiming(padx, pady) {
        var _this = _super.call(this) || this;
        // aim direction (unit vector)
        _this.dir = 0; // まっすぐ上方向(0,-1)を０度とするラジアン
        _this.padx = padx;
        _this.pady = pady;
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
        if (this.shape)
            GameObject.display.removeChild(this.shape);
        /*
                // ボールを撃つ方向　ライン表示
                const lineLength = Util.height*0.5;
                let px = Paddle.I.shape.x;
                let py = Paddle.I.shape.y - Paddle.I.sizeH*0.5 - (BALL_SIZE_PER_WIDTH*Util.width*0.5);
                let vx = x - px;
                let vy = y - py;
                // 下の方をタッチすると反対方向を狙うように
                if( vy > 0 ){
                    vy *= -1;
                    vx *= -1;
                }
                this.dir = Util.clamp( Math.atan2( -vx, -vy ), -Math.PI*0.45, +Math.PI*0.45 );
                //console.log( this.dir );
                vx = -Math.sin( this.dir );
                vy = -Math.cos( this.dir );
        
                this.shape = new egret.Shape();
                this.shape.graphics.lineStyle(5, 0xc0c000);
                this.shape.graphics.moveTo(px, py);
                this.shape.graphics.lineTo(px + vx*lineLength, py + vy*lineLength);
                GameObject.display.addChild(this.shape);
        */
    };
    Aiming.prototype.update = function () {
    };
    Aiming.prototype.touchBegin = function (e) {
        if (this.deleteFlag)
            return;
        this.setShape(e.localX, e.localY);
    };
    Aiming.prototype.touchMove = function (e) {
        if (this.deleteFlag)
            return;
        this.setShape(e.localX, e.localY);
    };
    Aiming.prototype.touchEnd = function (e) {
        if (this.deleteFlag)
            return;
        // shoot( this.dir );
        this.destroy();
    };
    return Aiming;
}(GameObject));
__reflect(Aiming.prototype, "Aiming");
//# sourceMappingURL=PadAim.js.map