// Liberapp 2019 - Tahiti Katagai
// 撃って跳ねるボール

class Ball extends GameObject{

    static balls:Ball[] = [];
    radius:number;
    vx:number;
    vy:number;

    constructor( x:number, y:number, vx:number, vy:number ) {
        super();

        Ball.balls.push(this);
        this.radius = BALL_SIZE_PER_WIDTH * Util.width * 0.5;
        this.setShape(x, y, this.radius);
        this.vx = vx;
        this.vy = vy;
    }

    onDestroy(){
        Ball.balls = Ball.balls.filter( obj => obj != this );
    }

    setShape(x:number, y:number, radius:number){
        if( this.shape )
            GameObject.display.removeChild(this.shape);
        
        this.shape = new egret.Shape();
        this.shape.graphics.beginFill(0x00c0ff);
        this.shape.graphics.drawCircle(0, 0, radius);
        this.shape.graphics.endFill();
        GameObject.display.addChild(this.shape);
        this.shape.x = x;
        this.shape.y = y;
    }
    
    update() {
        // 移動処理
        this.shape.x += this.vx;
        this.shape.y += this.vy;
        this.vx *= 0.99;
        this.vy *= 0.99;
        this.vy += this.radius * 0.01;

        // Targetとの接触判定（一番近いもの）
        let nearest = null;
        let ndd = 0;
        Target.targets.forEach( target => {
            let dx = target.shape.x - this.shape.x;
            let dy = target.shape.y - this.shape.y;
            let dd = dx**2 + dy**2;

            if( !nearest ){
                let rr = (target.radius + this.radius) ** 2;
                if( dd < rr ){
                    nearest = target;
                    ndd = dd;
                }
            }
            else{
                if( ndd > dd ){
                    nearest = target;
                    ndd = dd;
                }
            }
        });

        // 反射
        if( nearest ){
            let dx = this.shape.x - nearest.shape.x;
            let dy = this.shape.y - nearest.shape.y;
            let l = Math.sqrt(dx**2 + dy**2);
            let udx = dx / l;
            let udy = dy / l;

            let dot = udx * this.vx + udy * this.vy;
            if( dot < 0 ){
                this.vx += -2 * 0.90 * dot * udx;
                this.vy += -2 * 0.90 * dot * udy;
                let minSpeed = (this.radius * 0.2);
                l = this.vx**2 + this.vy**2;
                if( l < minSpeed**2 ) {
                    l = minSpeed / Math.sqrt( l );
                    this.vx *= l;
                    this.vy *= l;
                } 
                nearest.applyDamage( 1, -udx, -udy );
            }
        }

        this.boundWall();
    }

    // 壁で跳ね返り
    boundWall(){
        if( (this.shape.x - Util.width*0.5)**2 > (Util.width*0.5 - this.radius)**2 ) {
            this.vx *= -0.90;
            this.shape.x += this.vx;
        }
        if( this.vy < 0 && this.shape.y < this.radius ) {
            this.vy *= -0.90;
            this.shape.y += this.vy;
        }
        // 下に落ちたら消える
        if( this.shape.y > Util.height ) { // + this.radius ) {
            this.destroy();
        }
    }
}
