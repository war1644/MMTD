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
class Rock extends Tower
{
    constructor() {
        super(Rock.speed, 200, Rock.range);
        this.typeName = 'Rock';
        this.createVisual(Rock.sprite, Rock.frames);
    }
}
Rock.description = "路障，阻碍敌人路线";
Rock.nickName = '路障';
Rock.sprite = 'rockTower';
Rock.frames = [1];
Rock.shotType = {};
Rock.speed = 0;
Rock.range = 0;
Rock.rating = 0;
Rock.cost = 1.0;
types.towers['Rock'] = Rock;

class MG extends Tower
{
    constructor() {
        super(MG.speed, 25, MG.range, MG.shotType);
        this.typeName = 'MG';
        this.createVisual(MG.sprite, MG.frames);
    }
}
MG.description = '威力小，射速快';
MG.nickName = '机枪';
MG.sprite = 'mgTank';
MG.frames = [4,4,4,4];
MG.shotType = MGShot;
MG.speed = 4.0;
MG.range = 4.0;
MG.rating = MG.speed * Math.log(MG.range + 1.0) * MG.shotType.rating;
MG.cost = Math.round(MG.rating / 6.0 + 1.0);
types.towers['MG'] = MG;

/**
 * 高射炮
 */
class Flak extends Tower
{
    constructor() {
        super(Flak.speed, 200, Flak.range, Flak.shotType);
        this.typeName = 'Flak';
        this.createVisual(Flak.sprite, Flak.frames);
    }

    targetFilter(target) {
        return target.strategy === MazeStrategy.air;
    }
}
Flak.description = '只防空，不攻击地面';
Flak.nickName = '高射炮';
Flak.sprite = 'gmsUnit';
Flak.frames = [4, 4, 4, 4];
Flak.shotType = AirShot;
Flak.speed = 5.0;
Flak.range = 5.0;
Flak.rating = Flak.speed * Math.log(Flak.range + 1.0) * Flak.shotType.rating;
Flak.cost = 4;
types.towers['Flak'] = Flak;

/**
 * 激光塔
 */
class LaserTower extends Tower
{
    constructor() {
        super(LaserTower.speed, 25, LaserTower.range, LaserTower.shotType);
        this.typeName = 'LaserTower';
        this.createVisual(LaserTower.sprite, LaserTower.frames);
    }
}
LaserTower.description = "聚能武器，中等伤害";
LaserTower.nickName = '激光';
LaserTower.sprite = 'laserTank';
LaserTower.frames = [4, 4, 4, 4];
LaserTower.shotType = LaserShot;
LaserTower.speed = 4.0;
LaserTower.range = 5.0;
LaserTower.rating = LaserTower.speed * Math.log(LaserTower.range + 1.0) * LaserTower.shotType.rating;
LaserTower.cost = 11;
types.towers['LaserTower'] = LaserTower;

/**
 * 冷冻塔
 */
class IceTower extends Tower
{
    constructor() {
        super(IceTower.speed, 200, IceTower.range, IceTower.shotType);
        this.typeName = 'IceTower';
        this.createVisual(IceTower.sprite, IceTower.frames);
    }
}
IceTower.description = '减速敌人（哈哈，还没实现）';
IceTower.nickName = '冷冻';
IceTower.sprite = 'iceTank';
IceTower.frames = [4, 4, 4, 4];
IceTower.shotType = IceShot;
IceTower.speed = 2.0;
IceTower.range = 6.0;
IceTower.rating = IceTower.speed * Math.log(IceTower.range + 1.0) * IceTower.shotType.rating;
IceTower.cost = 9;
types.towers['IceTower'] = IceTower;

/**
 * 地狱门
 */
class HellGate extends Tower
{
    constructor() {
        super(HellGate.speed, 200, HellGate.range, HellGate.shotType);
        this.typeName = 'HellGate';
        this.createVisual(HellGate.sprite, HellGate.frames);
    }
}
HellGate.description = '超聚能武器，攻击贼高，穿透攻击，速度贼慢';
HellGate.nickName = '核能';
HellGate.sprite = 'hellTower';
HellGate.frames = [4,4,4,4];
HellGate.shotType = HellShot;
HellGate.speed = 1.0;
HellGate.range = 2.0;
HellGate.rating = HellGate.speed * Math.log(HellGate.range + 1.0) * HellGate.shotType.rating;
HellGate.cost = 30;
types.towers['HellGate'] = HellGate;

class RLA extends Tower
{
    constructor() {
        super(RLA.speed, 200, RLA.range, RLA.shotType);
        this.typeName = 'RLA';
        this.createVisual(RLA.sprite, RLA.frames);
    }
}
RLA.description = "红色是因为被敌人鲜血染红的";
RLA.nickName = 'waf';
RLA.sprite = 'redTank';
RLA.frames = [4,4,4,4];
RLA.shotType = SeShot;
RLA.speed = 1.0;
RLA.range = 2.0;
RLA.rating = ~~(RLA.speed * Math.log(RLA.range + 1.0) * RLA.shotType.rating);
RLA.cost = ~~(RLA.rating / 6.0 + 1.0);
types.towers['RLA'] = RLA;

/*
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








*/