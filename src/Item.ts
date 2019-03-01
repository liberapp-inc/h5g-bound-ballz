// Liberapp 2019 - Tahiti Katagai
// アイテム

class Item extends GameObject{

    static items:Item[] = [];
    readonly radius:number;

    constructor( x:number, y:number ) {
        super();

        Item.items.push(this);
        this.radius = BALL_RADIUS_PER_WIDTH * Util.width * 0.8;
        this.setShape(x, y, this.radius);
    }

    onDestroy(){
        Item.items = Item.items.filter( obj => obj != this );
    }

    setShape(x:number, y:number, radius:number){
        if( this.shape )
            GameObject.display.removeChild(this.shape);
        
        this.shape = new egret.Shape();
        this.shape.graphics.beginFill(0x00c0ff);
        this.shape.graphics.drawCircle(0, 0, radius);
        this.shape.graphics.endFill();
        GameObject.display.addChild(this.shape);
        GameObject.display.setChildIndex(this.shape, 2);
        this.shape.x = x;
        this.shape.y = y;
    }

    update() {
        // Ballとの接触判定
        Ball.balls.some( (ball,index)=>{
            let dx = ball.shape.x - this.shape.x;
            let dy = ball.shape.y - this.shape.y;
            if( dx**2 + dy**2 <= (ball.radius + this.radius) ** 2 ){
                Aiming.I.addBall();
                new EffectCircle( this.shape.x, this.shape.y, this.radius, 0x00c0ff );
                this.destroy();
                return true;
            }
            return false;
        });
    }

    static scrollUp( dy:number ) {
        Item.items.forEach( item => {
            item.shape.y += dy;
            if( item.shape.y <= 0 )
                item.destroy();
        });
    }
}
