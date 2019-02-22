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
        // 移動処理
        this.shape.x += this.vx;
        this.shape.y += this.vy;
        // BOXとの接触判定（一番近いもの）
        var nearest = null;
        var nd2 = 0;
        /*
                Box.boxes.forEach( box => {
                    let dx = box.shape.x - this.shape.x;
                    let dy = box.shape.y - this.shape.y;
                    let dx2 = dx**2;
                    let dy2 = dy**2;
        
                    if( !nearest ){
                        let xr = box.sizeW * 0.5 + this.radius;
                        let yr = box.sizeH * 0.5 + this.radius;
                        if( dx2 < xr**2 && dy2 < yr**2 ){
                            nearest = box;
                            nd2 = dx2 + dy2;
                        }
                    }
                    else{
                        if( nd2 > dx2 + dy2 ){
                            nearest = box;
                            nd2 = dx2 + dy2;
                        }
                    }
                });
        
                if( nearest ){
                    let dx = nearest.shape.x - this.shape.x;
                    let dy = nearest.shape.y - this.shape.y;
        
                    if( Math.abs(dy/dx) >= Box.sizeRateH ) {
                        this.vy *= -1;
                    }else{
                        this.vx *= -1;
                    }
                    // ダメージ〜破壊
                    nearest.applyDamage( 1 );
                }
        */
        this.boundWall();
    };
    // 壁で跳ね返り
    Ball.prototype.boundWall = function () {
        if (Math.pow((this.shape.x - Util.width * 0.5), 2) > Math.pow((Util.width * 0.5 - this.radius), 2)) {
            this.vx *= -1;
            this.vy += this.radius * 0.05; //やや落下させて無限ループ防止
            this.shape.x += this.vx;
        }
        if (this.vy < 0 && this.shape.y < this.radius) {
            this.vy *= -1;
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