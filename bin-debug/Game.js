// Liberapp 2019 - Tahiti Katagai
// ゲームシーン
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var BALL_SIZE_PER_WIDTH = 1 / 16;
var BALL_RADIUS_PER_WIDTH = BALL_SIZE_PER_WIDTH * 0.5;
var TARGET_SIZE_PER_WIDTH = 1 / 6;
var TARGET_RADIUS_PER_WIDTH = TARGET_SIZE_PER_WIDTH * 0.5;
var Game = (function () {
    function Game() {
    }
    Game.loadSceneGamePlay = function () {
        new Background();
        new Score();
        new Aiming();
    };
    return Game;
}());
__reflect(Game.prototype, "Game");
//# sourceMappingURL=Game.js.map