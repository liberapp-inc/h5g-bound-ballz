// Liberapp 2019 - Tahiti Katagai
// ゲームシーン

const BALL_SIZE_PER_WIDTH = 1/16;
const BALL_RADIUS_PER_WIDTH = BALL_SIZE_PER_WIDTH * 0.5;
const TARGET_SIZE_PER_WIDTH = 1/6;
const TARGET_RADIUS_PER_WIDTH = TARGET_SIZE_PER_WIDTH * 0.5;

class Game {

    static loadSceneGamePlay() {
        new Background();
        new Score();
        new Aiming();
    }
}
