// Liberapp 2019 - Tahiti Katagai
// エフェクト　- 線　破壊した時に表示

class EffectLine extends GameObject{

    x:number;
    y:number; 
    vx:number;
    vy:number; 
    color:number;
    static readonly maxFrame:number = 30;
    frame:number = 0;

    constructor( x:number, y:number, vx:number, vy:number, color:number=0xffc000 ) {
        super();

        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.setShape( 0 );
    }

    setShape( rate:number ){
        if( this.shape == null ){
            this.shape = new egret.Shape();
            GameObject.display.addChild(this.shape);
        }else{
            this.shape.graphics.clear();
        }
        rate = rate * Math.PI * 0.5;
        let rateS = Math.sin(rate);
        let rateD = 1 - Math.cos(rate);
        this.shape.graphics.lineStyle(10, this.color);
        this.shape.graphics.moveTo(this.x+this.vx*rateS, this.y+this.vy*rateS);
        this.shape.graphics.lineTo(this.x+this.vx*rateD, this.y+this.vy*rateD);
    }

    update() {
        if( (++this.frame) >= EffectLine.maxFrame ){
            this.destroy();
            return;
        }

        let rate = this.frame / EffectLine.maxFrame;    // 0.0~1.0
        this.setShape( rate );
    }
}
