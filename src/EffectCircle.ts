// Liberapp 2019 - Tahiti Katagai
// エフェクト　○

class EffectCircle extends GameObject{

    radius:number;
    color:number;

    static readonly maxFrame:number = 30;
    frame:number = EffectCircle.maxFrame;

    constructor( x:number, y:number, radius:number, color:number=0xffc000 ) {
        super();

        this.radius = radius;
        this.color = color;
        this.setShape(x, y, this.radius);
    }

    setShape(x:number, y:number, radius:number){
        if( this.shape )
            GameObject.display.removeChild(this.shape);
        
        this.shape = new egret.Shape();
        this.shape.graphics.lineStyle(3 + 7*(this.frame/EffectCircle.maxFrame), this.color);
        this.shape.graphics.drawCircle(0, 0, radius);
        GameObject.display.addChild(this.shape);
        this.shape.x = x;
        this.shape.y = y;
    }

    update() {
        if( (--this.frame) <= 0 ){
            this.destroy();
            return;
        }

        this.radius *= 1.03;
        this.setShape( this.shape.x, this.shape.y, this.radius );
    }
}
