// Liberapp 2019 Tahiti Katagai
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
var GameOver = (function (_super) {
    __extends(GameOver, _super);
    function GameOver() {
        var _this = _super.call(this) || this;
        _this.texts = [];
        _this.texts[0] = Util.newTextField("GAME OVER", Util.width / 10, 0x0080ff, 0.5, 0.45, true);
        GameObject.display.addChild(_this.texts[0]);
        _this.texts[1] = Util.newTextField("SCORE : " + Score.I.point.toFixed(), Util.width / 12, 0x0080ff, 0.5, 0.55, true);
        GameObject.display.addChild(_this.texts[1]);
        if (SDK) {
            if (Score.bestScore < Score.I.point) {
                Score.bestScore = Score.I.point;
                Social.setScore(Score.I.point);
                _this.texts[3] = Util.newTextField("NEW RECORD!", Util.width / 13, 0x0080ff, 0.5, 0.4, true);
                egret.Tween.get(_this.texts[3], { loop: true })
                    .to({ alpha: 0 }, 500)
                    .to({ alpha: 1 }, 500);
                GameObject.display.addChild(_this.texts[3]);
            }
        }
        _this.texts.forEach(function (text) {
            GameObject.display.addChild(text);
        });
        GameObject.display.once(egret.TouchEvent.TOUCH_TAP, function (e) { return _this.tap(e); }, _this);
        return _this;
    }
    GameOver.prototype.onDestroy = function () {
        this.texts.forEach(function (text) {
            GameObject.display.removeChild(text);
        });
    };
    GameOver.prototype.update = function () { };
    GameOver.prototype.tap = function (e) {
        GameObject.transit = Game.loadSceneGamePlay;
        this.destroy();
    };
    return GameOver;
}(GameObject));
__reflect(GameOver.prototype, "GameOver");
//# sourceMappingURL=GameOver.js.map