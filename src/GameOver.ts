// Liberapp 2019 Tahiti Katagai

class GameOver extends GameObject{

    textGameOver:egret.TextField = null;
    textScore:egret.TextField = null;

    constructor() {
        super();

        this.textGameOver = Util.newTextField("GAME OVER", Util.width / 10, 0xffffff, 0.5, 0.45, true);
        GameObject.display.addChild( this.textGameOver );
        
        this.textScore = Util.newTextField("SCORE : " + Score.I.point.toFixed(), Util.width / 12, 0xffffff, 0.5, 0.55, true);
        GameObject.display.addChild( this.textScore );

        GameObject.display.once(egret.TouchEvent.TOUCH_TAP, (e: egret.TouchEvent) => this.tap(e), this);
    }

    onDestroy() {
        GameObject.display.removeChild( this.textGameOver );
        this.textGameOver = null;
        GameObject.display.removeChild( this.textScore );
        this.textScore = null;
    }
    
    update() { }

    tap(e:egret.TouchEvent){
        GameObject.transit = Game.loadSceneGamePlay;
        this.destroy();
    }
}
