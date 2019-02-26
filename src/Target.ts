// Liberapp 2019 - Tahiti Katagai
// 撃って跳ねるボール

class Target extends GameObject{

    static targets:Target[] = [];
    static readonly maxHp:number = 10;
    hp:number;
    radius:number;

    constructor( x:number, y:number, hp:number ) {
        super();

        Target.targets.push(this);
        this.hp = hp;
        this.radius = TARGET_RADIUS_PER_WIDTH * Util.width;
        this.setShape(x, y, this.radius);
    }

    onDestroy(){
        Target.targets = Target.targets.filter( obj => obj != this );
    }

    setShape(x:number, y:number, radius:number){
        if( this.shape )
            GameObject.display.removeChild(this.shape);
        
        this.shape = new egret.Shape();
        this.shape.graphics.beginFill(Target.getColor(this.hp));
        this.shape.graphics.drawCircle(0, 0, radius);
        this.shape.graphics.endFill();
        GameObject.display.addChild(this.shape);
        this.shape.x = x;
        this.shape.y = y;
    }
    static getColor( hp:number ): number{
        let rate = Util.clamp((hp-1) / (Target.maxHp-1), 0, 1);
        return Util.colorLerp( 0xf0d000, 0x800000, rate );
    }
    
    update() {
    }

    // ダメージ
    applyDamage( point:number = 1 ){
        this.hp -= point;
        if( this.hp > 0 ){
            this.setShape( this.shape.x, this.shape.y, this.radius );
        }else{
            Score.I.breakTarget();
            this.destroy();
        }
    }
}
