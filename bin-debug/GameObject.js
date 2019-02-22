// Liberapp 2019 Tahiti Katagai
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
// UnityのGameObjectライクなタスク管理クラス
//  update()に毎フレームの処理を書く
//  オブジェクトを破棄するときはdestroy()を呼ぶ
//  破棄のときに後処理が必要なら、onDestroy()に記述
//  生成時の初期化はUnityと違い、constructor()を使う（引数を渡せる）
//  シーンを切り替えたい場合は transitにシーンロード関数を設定（全オブジェクトを破棄してからtransitを実行）
var GameObject = (function () {
    function GameObject() {
        this.shape = null;
        GameObject.objects.push(this);
    }
    GameObject.prototype.destroy = function () { this.deleteFlag = true; };
    GameObject.prototype.onDestroy = function () { };
    GameObject.initial = function (displayObjectContainer) {
        GameObject.display = displayObjectContainer;
    };
    GameObject.process = function () {
        GameObject.objects.forEach(function (obj) { return obj.update(); });
        GameObject.objects = GameObject.objects.filter(function (obj) {
            if (obj.deleteFlag)
                obj.delete();
            return (!obj.deleteFlag);
        });
        if (GameObject.transit) {
            GameObject.dispose();
            GameObject.transit();
            GameObject.transit = null;
        }
    };
    GameObject.dispose = function () {
        GameObject.objects = GameObject.objects.filter(function (obj) { obj.destroy(); obj.delete(); return false; });
    };
    GameObject.prototype.delete = function () {
        this.onDestroy();
        if (this.shape) {
            GameObject.display.removeChild(this.shape);
            this.shape = null;
        }
    };
    // system
    GameObject.objects = [];
    return GameObject;
}());
__reflect(GameObject.prototype, "GameObject");
//# sourceMappingURL=GameObject.js.map