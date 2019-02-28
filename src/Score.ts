// Liberapp 2019 - Tahiti Katagai

class Score extends GameObject{

    static I:Score = null;   // singleton instance

    point:number = 0;
    combo:number = 0;   // １ターンで壊したBOX数だけコンボになる（高得点）
    text:egret.TextField = null;

    constructor() {
        super();

        Score.I = this;
        this.point = 0;
        this.text = Util.newTextField("SCORE : 0", Util.width / 18, 0x0080ff, 0.5, 0.0, true);
        GameObject.display.addChild( this.text );
    }
    
    onDestroy() {
        GameObject.display.removeChild( this.text );
        this.text = null;
    }

    update() {
        this.text.text = "SCORE : " + this.point.toFixed();
    }

    breakTarget(){
        this.point += 1 + this.combo;
        this.combo++;
    }
}
