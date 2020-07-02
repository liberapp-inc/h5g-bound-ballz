// Liberapp 2019 - Tahiti Katagai

class Score extends GameObject{

    static I:Score = null;   // singleton instance

    static bestScore:number = 0;
    static bestRank:number = 0;
    
    point:number = 0;
    combo:number = 0;   // １ターンで壊したBOX数だけコンボになる（高得点）

    text:egret.TextField = null;
    textBest:egret.TextField = null;

    constructor() {
        super();

        Score.I = this;
        this.point = 0;
        this.text = Util.newTextField("SCORE : 0", Util.width / 22, 0x0080ff, 0.5, 0.0, true);
        GameObject.display.addChild( this.text );

        this.textBest = Util.newTextField("BEST : " + Score.bestScore, Util.width / 22, 0x0080ff, 0.0, 0.0, true);
        GameObject.display.addChild( this.textBest );
    }
    
    onDestroy() {
        GameObject.display.removeChild( this.text );
        this.text = null;
        GameObject.display.removeChild( this.textBest );
        this.textBest = null;
    }

    update() {
    }

    addPoint( pt:number ){
        this.point += pt;
        this.text.text = "SCORE : " + this.point.toFixed();
        if( Score.bestScore < this.point ){
            this.textBest.text = "BEST : " + this.point.toFixed();
        }
    }
    breakTarget(){
        this.addPoint( 1+this.combo );
        this.combo++;
    }
}
