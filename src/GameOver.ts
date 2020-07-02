// Liberapp 2019 Tahiti Katagai

class GameOver extends GameObject{

    texts:egret.TextField[] = [];

    constructor() {
        super();

        this.texts[0] = Util.newTextField("GAME OVER", Util.width / 10, 0x0080ff, 0.5, 0.45, true);
        GameObject.display.addChild( this.texts[0] );
        
        this.texts[1] = Util.newTextField("SCORE : " + Score.I.point.toFixed(), Util.width / 12, 0x0080ff, 0.5, 0.55, true);
        GameObject.display.addChild( this.texts[1] );

        if( SDK ){
            if( Score.bestScore < Score.I.point ){
                Score.bestScore = Score.I.point;
                Social.setScore( Score.I.point );
                this.texts[3] = Util.newTextField("NEW RECORD!", Util.width / 13, 0x0080ff, 0.5, 0.4, true);
                egret.Tween.get(this.texts[3],{loop:true})
                    .to({alpha:0}, 500)
                    .to({alpha:1}, 500)
                GameObject.display.addChild( this.texts[3] );
            }
        }
        this.texts.forEach( text => {
            GameObject.display.addChild( text );
        });
        GameObject.display.once(egret.TouchEvent.TOUCH_TAP, (e: egret.TouchEvent) => this.tap(e), this);
    }

    onDestroy() {
        this.texts.forEach( text => {
            GameObject.display.removeChild( text );
        });
    }
    
    update() { }

    tap(e:egret.TouchEvent){
        GameObject.transit = Game.loadSceneGamePlay;
        this.destroy();
    }
}
