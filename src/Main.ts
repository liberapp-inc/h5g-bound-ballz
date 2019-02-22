// Bound Ballz
// Liberapp 2019 - Tahiti Katagai

class Main extends eui.UILayer {

    public constructor() {
        super();
        this.once(egret.Event.ADDED_TO_STAGE, this.addToStage, this);
    }
 
    private addToStage() {
        GameObject.initial( this.stage );
        Util.init( this );
        Game.loadSceneGamePlay();
        // this.addEventListener(egret.Event.ENTER_FRAME,GameObject.process,this);
        egret.startTick(this.tickLoop, this);
    }

    tickLoop(timeStamp:number):boolean{
        GameObject.process();
        return false;
    }
}

