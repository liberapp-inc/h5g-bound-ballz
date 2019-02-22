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
        this.shape.graphics.beginFill(0xffc000);
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

        // BOXとの接触判定（一番近いもの）
        let nearest = null;
        let nd2 = 0;
/*
        Box.boxes.forEach( box => {
            let dx = box.shape.x - this.shape.x;
            let dy = box.shape.y - this.shape.y;
            let dx2 = dx**2;
            let dy2 = dy**2;

            if( !nearest ){
                let xr = box.sizeW * 0.5 + this.radius;
                let yr = box.sizeH * 0.5 + this.radius;
                if( dx2 < xr**2 && dy2 < yr**2 ){
                    nearest = box;
                    nd2 = dx2 + dy2;
                }
            }
            else{
                if( nd2 > dx2 + dy2 ){
                    nearest = box;
                    nd2 = dx2 + dy2;
                }
            }
        });

        if( nearest ){
            let dx = nearest.shape.x - this.shape.x;
            let dy = nearest.shape.y - this.shape.y;

            if( Math.abs(dy/dx) >= Box.sizeRateH ) {
                this.vy *= -1;
            }else{
                this.vx *= -1;
            }
            // ダメージ〜破壊
            nearest.applyDamage( 1 );
        }
*/
        this.boundWall();
    }

    // 壁で跳ね返り
    boundWall(){
        if( (this.shape.x - Util.width*0.5)**2 > (Util.width*0.5 - this.radius)**2 ) {
            this.vx *= -1;
            this.vy += this.radius * 0.05;  //やや落下させて無限ループ防止
            this.shape.x += this.vx;
        }
        if( this.vy < 0 && this.shape.y < this.radius ) {
            this.vy *= -1;
            this.shape.y += this.vy;
        }
        // 下に落ちたら消える
        if( this.shape.y > Util.height ) { // + this.radius ) {
            this.destroy();
        }
    }
}
