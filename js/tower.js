/**
 *         ▂▃╬▄▄▃▂▁▁
 *  ●●●█〓██████████████▇▇▇▅▅▅▅▅▅▅▅▅▇▅▅          BUG
 *  ▄▅████☆RED █ WOLF☆██▄▄▃▂
 *  ████████████████████████████
 *  ◥⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙◤
 *
 * 防御塔单位类
 * @author 路漫漫
 * @link ahmerry@qq.com
 * @version
 * v2017/11/3 12:22 初版
 */

"use strict";
class RLA extends Tower
{
    constructor() {
        super(RLA.speed, 200, RLA.range, RLA.shotType);
        this.typeName = 'RLA';
        this.createVisual(RLA.sprite, RLA.frames);
    }
}
RLA.description = "红色战车塔";
RLA.nickName = '红色战车';
RLA.sprite = 'RLA';
RLA.frames = [4,4,4,4];
RLA.shotType = SeShot;
RLA.speed = 1;
RLA.range = 6;
RLA.rating = ~~(RLA.speed * Math.log(RLA.range + 1.0) * RLA.shotType.rating);
RLA.cost = ~~(RLA.rating / 6.0 + 1.0);
types.towers['RLA'] = RLA;

class Rock extends Tower
{
    constructor() {
        super(Rock.speed, 200, Rock.range);
        this.typeName = 'Rock';
        this.createVisual(Rock.sprite, );
    }
}
Rock.description = "路障，阻碍敌人路线";
Rock.nickName = '路障';
Rock.sprite = 'rock';
Rock.frames = [1];
Rock.shotType = {};
Rock.speed = 0;
Rock.range = 0;
Rock.rating = 0;
Rock.cost = 1.0;
types.towers['Rock'] = Rock;


/*
class MGNest extends Tower
{
    constructor() {
        super(MGNest.speed, 25, MGNest.range, MGNest.shotType);
        this.typeName = 'MGNest';
        this.createVisual(MGNest.sprite, [1]);
    }
}
MGNest.description = '物美价廉，它可以帮助你抵御很多低装甲部队。';
MGNest.nickName = '机枪塔';
MGNest.sprite = 'mgnest';
MGNest.frames = 1;
MGNest.shotType = MGShot;
MGNest.speed = 4.0;
MGNest.range = 4.0;
MGNest.rating = MGNest.speed * Math.log(MGNest.range + 1.0) * MGNest.shotType.rating;
MGNest.cost = Math.round(MGNest.rating / 6.0 + 1.0);
// types.towers['MGNest'] = MGNest;

class CanonTower extends Tower
{
    constructor() {
        super(CanonTower.speed, 50, CanonTower.range, CanonTower.shotType);
        this.typeName = 'CanonTower';
        this.createVisual(CanonTower.sprite, [1, 1, 1, 1]);
    }
}
CanonTower.description = '战争的中坚力量！范围攻击, 但射速是硬伤。';
CanonTower.nickName = '大炮';
CanonTower.sprite = 'canontower';
CanonTower.frames = 4;
CanonTower.shotType = ShellShot;
CanonTower.speed = 1.0;
CanonTower.range = 8.0;
CanonTower.rating = CanonTower.speed * Math.log(CanonTower.range + 1.0) * CanonTower.shotType.rating;
CanonTower.cost = Math.round(CanonTower.rating / 6.0 + 1.0);
// types.towers['CanonTower'] = CanonTower;

class FlameTower extends Tower
{
    constructor() {
        super(FlameTower.speed, 200, FlameTower.range, FlameTower.shotType);
        this.typeName = 'FlameTower';
        this.createVisual(FlameTower.sprite, [4]);
    }
}
FlameTower.description = '持续伤害输出，行动迟缓敌人的噩梦。';
FlameTower.nickName = '喷火塔';
FlameTower.sprite = 'flametower';
FlameTower.frames = 4;
FlameTower.shotType = FlameShot;
FlameTower.speed = 6.0;
FlameTower.range = 2.0;
FlameTower.rating = FlameTower.speed * Math.log(FlameTower.range + 1.0) * FlameTower.shotType.rating;
FlameTower.cost = 5;
// types.towers['FlameTower'] = FlameTower;

class Flak extends Tower
{
    constructor() {
        super(Flak.speed, 200, Flak.range, Flak.shotType);
        this.typeName = 'Flak';
        this.createVisual(Flak.sprite, [1, 1, 1, 1]);
    }

    targetFilter(target) {
        return target.strategy === MazeStrategy.air;
    }
}
Flak.description = '唯一的防空武器, 相信我，游戏里很多时候你会迫切需求这玩意。';
Flak.nickName = '防空塔';
Flak.sprite = 'flak';
Flak.frames = 4;
Flak.shotType = AirShot;
Flak.speed = 5.0;
Flak.range = 5.0;
Flak.rating = Flak.speed * Math.log(Flak.range + 1.0) * Flak.shotType.rating;
Flak.cost = 4;
// types.towers['Flak'] = Flak;

class IceTower extends Tower
{
    constructor() {
        super(IceTower.speed, 200, IceTower.range, IceTower.shotType);
        this.typeName = 'IceTower';
        this.createVisual(IceTower.sprite, [1, 1, 1, 1]);
    }
}
IceTower.description = '攻速慢，记得选择反应缓慢装甲部队攻击';
IceTower.nickName = '冷冻塔';
IceTower.sprite = 'icetower';
IceTower.frames = 4;
IceTower.shotType = IceShot;
IceTower.speed = 2.0;
IceTower.range = 6.0;
IceTower.rating = IceTower.speed * Math.log(IceTower.range + 1.0) * IceTower.shotType.rating;
IceTower.cost = 9;
// types.towers['IceTower'] = IceTower;

class LaserTower extends Tower
{
    constructor() {
        super(LaserTower.speed, 25, LaserTower.range, LaserTower.shotType);
        this.typeName = 'LaserTower';
        this.createVisual(LaserTower.sprite, [1, 1, 1, 1]);
    }
}
LaserTower.description = "射速非常快，但低伤。";
LaserTower.nickName = '加特林';
LaserTower.sprite = 'lasertower';
LaserTower.frames = 4;
LaserTower.shotType = LaserShot;
LaserTower.speed = 4.0;
LaserTower.range = 5.0;
LaserTower.rating = LaserTower.speed * Math.log(LaserTower.range + 1.0) * LaserTower.shotType.rating;
LaserTower.cost = 11;
// types.towers['LaserTower'] = LaserTower;

class GateToHell extends Tower
{
    constructor() {
        super(GateToHell.speed, 200, GateToHell.range, GateToHell.shotType);
        this.typeName = 'GateToHell';
        this.createVisual(GateToHell.sprite, [6]);
    }
}
GateToHell.description = '终极武器，注意该建筑基本打不中高速单位。';
GateToHell.nickName = '地狱之门';
GateToHell.sprite = 'gatetohell';
GateToHell.frames = 6;
GateToHell.shotType = HellShot;
GateToHell.speed = 1.0;
GateToHell.range = 2.0;
GateToHell.rating = GateToHell.speed * Math.log(GateToHell.range + 1.0) * GateToHell.shotType.rating;
GateToHell.cost = 30;
// types.towers['GateToHell'] = GateToHell;
*/