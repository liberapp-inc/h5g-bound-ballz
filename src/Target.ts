// Liberapp 2019 - Tahiti Katagai
// ターゲットのマト

class Target extends GameObject{

    static targets:Target[] = [];
    static readonly maxHp:number = 25;
    hp:number;
    radius:number;
    readonly animFrameMax = 8;
    animFrame:number = 0;
    text:egret.TextField = null;

    constructor( x:number, y:number, hp:number ) {
        super();

        Target.targets.push(this);
        this.hp = hp;
        this.radius = TARGET_RADIUS_PER_WIDTH * Util.width;
        this.setShape(x, y, this.radius);
        this.text = Util.newTextField(""+this.hp, Util.width / 18, 0xffffff, x/Util.width, y/Util.height, true);
        GameObject.display.addChild( this.text );
    }

    onDestroy(){
        Target.targets = Target.targets.filter( obj => obj != this );
        GameObject.display.removeChild( this.text );
        this.text = null;
    }

    setShape(x:number, y:number, radius:number){
        if( this.shape )
            GameObject.display.removeChild(this.shape);
        
        this.shape = new egret.Shape();
        this.shape.graphics.beginFill(Target.getColor(this.hp));
        this.shape.graphics.drawCircle(0, 0, radius );
        this.shape.graphics.endFill();
        GameObject.display.addChild(this.shape);
        GameObject.display.setChildIndex(this.shape, 2);
        this.shape.x = x;
        this.shape.y = y;
    }
    static getColor( hp:number ): number {
        let rate = Util.clamp( (hp-1) / (Target.maxHp-1), 0, 1);
        if( rate <= 0.5 ){
            rate = Util.colorLerp( 0xf00040, 0xf0f000, rate * 2 );
        }else{
            rate = Util.colorLerp( 0xf0f000, 0x0080ff, rate * 2 - 1);
        }
        return rate;
    }

    update() {
        this.text.text = "" + this.hp.toFixed();
        this.text.x = this.shape.x - this.text.width  * 0.5;
        this.text.y = this.shape.y - this.text.height * 0.5;

        if( this.animFrame > 0 ) {
            this.animFrame--;
            let scale = 1 + 0.3 * this.animFrame / this.animFrameMax;
            this.shape.scaleX = this.shape.scaleY = scale;
        }
    }

    // ダメージ
    applyDamage( point:number ){
        this.hp -= point;
        if( this.hp > 0 ){
            this.animFrame = this.animFrameMax;
            this.setShape( this.shape.x, this.shape.y, this.radius );
        }else{
            Score.I.breakTarget();
            this.destroy();
            new EffectCircle( this.shape.x, this.shape.y, this.radius );
        }
    }

    static scrollUp( dy:number ):boolean {
        let isOver = false;
        Target.targets.forEach( target => {
            target.shape.y += dy;
            if( target.shape.y <= Aiming.I.y ) isOver = true;
        });
        return isOver;
    }
}
