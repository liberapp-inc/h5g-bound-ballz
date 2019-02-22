// Liberapp 2019 - Tahiti Katagai
// ゲームシーン
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var BOXES_IN_WIDTH = 6;
var BOX_SIZE_PER_WIDTH = 1 / BOXES_IN_WIDTH;
var PADDLE_SIZE_PER_WIDTH = 1 / 4;
var BALL_SIZE_PER_WIDTH = PADDLE_SIZE_PER_WIDTH / 4;
var Game = (function () {
    function Game() {
    }
    Game.loadSceneGamePlay = function () {
        new Background();
        new Score();
    };
    return Game;
}());
__reflect(Game.prototype, "Game");
//# sourceMappingURL=Game.js.map