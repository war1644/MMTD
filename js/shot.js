/**
 *         ▂▃╬▄▄▃▂▁▁
 *  ●●●█〓██████████████▇▇▇▅▅▅▅▅▅▅▅▅▇▅▅          BUG
 *  ▄▅████☆RED █ WOLF☆██▄▄▃▂
 *  ████████████████████████████
 *  ◥⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙◤
 *
 * 防御塔攻击类型类
 * @author 路漫漫
 * @link ahmerry@qq.com
 * @version
 * v2017/11/3 12:44 初版
 */
"use strict";

/**
 * SE炮
 */
class SeShot extends Shot
{
    constructor() {
        super(SeShot.speed, 25, SeShot.damage, SeShot.impactRadius);
        this.createVisual(SeShot.sprite, SeShot.frames);
        this.playSound('seAttack');
    }
}
SeShot.nickName = 'S-E';
SeShot.description = '威力巨大';
SeShot.sprite = 'se';
SeShot.frames = [20];
SeShot.speed = 1.5;
SeShot.damage = 100;
SeShot.impactRadius = 0.5;
SeShot.rating = Math.log(SeShot.speed + 1) * SeShot.damage * Math.log(SeShot.impactRadius + 1);
types.shots['SeShot'] = SeShot;

/**
 * 主炮
 */
class CannonShot extends Shot
{
    constructor() {
        super(CannonShot.speed, 25, CannonShot.damage, CannonShot.impactRadius);
        this.createVisual(CannonShot.sprite, CannonShot.frames);
        this.playSound('cannonAttack');
    }
}
CannonShot.nickName = '主炮';
CannonShot.description = '战斗中核心输出';
CannonShot.sprite = 'cannon';
CannonShot.frames = [6, 6, 6, 6];
CannonShot.speed = 10;
CannonShot.damage = 15;
CannonShot.impactRadius = 0.5;
CannonShot.rating = Math.log(CannonShot.speed + 1) * CannonShot.damage * Math.log(CannonShot.impactRadius + 1);
types.shots['CannonShot'] = CannonShot;


/**
 * 该攻击类型只针对空中单位
 */
class AirShot extends Shot
{
    constructor() {
        super(AirShot.speed, 10, AirShot.damage, AirShot.impactRadius);
        this.createVisual(AirShot.sprite, [1, 1, 1, 1], 0.2);
        this.playSound('flak');
    }
}
AirShot.nickName = '对空导弹';
AirShot.description = '对空导弹';
AirShot.sprite = 'airshot';
AirShot.frames = 4;
AirShot.speed = 2.5;
AirShot.damage = 5;
AirShot.impactRadius = 0.5;
AirShot.rating = Math.log(AirShot.speed + 1) * AirShot.damage * Math.log(AirShot.impactRadius + 1);
// types.shots['AirShot'] = AirShot;

class MGShot extends Shot
{
    constructor() {
        super(MGShot.speed, 25, MGShot.damage, MGShot.impactRadius);
        this.createVisual(MGShot.sprite, [1, 1, 1, 1], 0.3);
        this.playSound('mgnest');
    }
}
MGShot.nickName = '机枪';
MGShot.description = '能处理掉大多数的家伙。';
MGShot.sprite = 'mgshot';
MGShot.frames = 4;
MGShot.speed = 8.0;
MGShot.damage = 2;
MGShot.impactRadius = 0.5;
MGShot.rating = Math.log(MGShot.speed + 1) * MGShot.damage * Math.log(MGShot.impactRadius + 1);
// types.shots['MGShot'] = MGShot;
/*
class StandardShot extends Shot
{
    constructor() {
        super(StandardShot.speed, 15, StandardShot.damage, StandardShot.impactRadius);
        this.createVisual(StandardShot.sprite, [1], 0.25);
        this.playSound('wowpulse');
    }
}
StandardShot.nickName = '普通';
StandardShot.description = '普通攻击类型.';
StandardShot.sprite = 'sunshot';
StandardShot.frames = 1;
StandardShot.speed = 10;
StandardShot.damage = 1;
StandardShot.impactRadius = 0.5;
StandardShot.rating = Math.log(StandardShot.speed + 1) * StandardShot.damage * Math.log(StandardShot.impactRadius + 1);

class FlameShot extends Shot
{
    constructor() {
        super(FlameShot.speed, 100, FlameShot.damage, FlameShot.impactRadius);
        this.createVisual(FlameShot.sprite, [8]);
        this.playSound('flames');
    }

}
FlameShot.nickName = '红色凝固汽油弹';
FlameShot.description = "凝固汽油弹的力量, 你不用怀疑。";
FlameShot.sprite = 'flameshot';
FlameShot.frames = 8;
FlameShot.speed = 1.5;
FlameShot.damage = 8;
FlameShot.impactRadius = 0.5;
FlameShot.rating = Math.log(FlameShot.speed + 1) * FlameShot.damage * Math.log(FlameShot.impactRadius + 1);
types.shots['FlameShot'] = FlameShot;

class HellShot extends Shot
{
    constructor() {
        super(HellShot.speed, 75, HellShot.damage, HellShot.impactRadius);
        this.createVisual(HellShot.sprite, [12]);
        this.playSound('hellshot');
    }
}
HellShot.nickName = '能量体';
HellShot.description = '高暗能量密度是由地狱之门射出的，它直接吸取敌人的灵魂。';
HellShot.sprite = 'hellshot';
HellShot.frames = 12;
HellShot.speed = 2.0;
HellShot.damage = 300;
HellShot.impactRadius = 0.5;
HellShot.rating = Math.log(HellShot.speed + 1) * HellShot.damage * Math.log(HellShot.impactRadius + 1);
types.shots['HellShot'] = HellShot;


class IceShot extends Shot
{
    constructor() {
        super(IceShot.speed, 200, IceShot.damage, IceShot.impactRadius);
        this.createVisual(IceShot.sprite, [4]);
        this.playSound('icy');
    }
}
IceShot.nickName = '能量体';
IceShot.description = '一个实验性的超冷等离子体 (冷是相对的)。';
IceShot.sprite = 'iceshot';
IceShot.frames = 4;
IceShot.speed = 3.5;
IceShot.damage = 15;
IceShot.impactRadius = 0.5;
IceShot.rating = Math.log(IceShot.speed + 1) * IceShot.damage * Math.log(IceShot.impactRadius + 1);
types.shots['IceShot'] = IceShot;

class MGShot extends Shot
{
    constructor() {
        super(MGShot.speed, 25, MGShot.damage, MGShot.impactRadius);
        this.createVisual(MGShot.sprite, [1, 1, 1, 1], 0.3);
        this.playSound('mgnest');
    }
}
MGShot.nickName = '机枪';
MGShot.description = '能处理掉大多数的家伙。';
MGShot.sprite = 'mgshot';
MGShot.frames = 4;
MGShot.speed = 8.0;
MGShot.damage = 2;
MGShot.impactRadius = 0.5;
MGShot.rating = Math.log(MGShot.speed + 1) * MGShot.damage * Math.log(MGShot.impactRadius + 1);
types.shots['MGShot'] = MGShot;

class LaserShot extends Shot
{
    constructor() {
        super(LaserShot.speed, 25, LaserShot.damage, LaserShot.impactRadius);
        this.createVisual(LaserShot.sprite, [6, 6, 6, 6]);
        this.playSound('laser');
    }
}
LaserShot.nickName = '激光';
LaserShot.description = '中微子射击: 命中在射击之前，因为太快。';
LaserShot.sprite = 'lasershot';
LaserShot.frames = 24;
LaserShot.speed = 10;
LaserShot.damage = 7;
LaserShot.impactRadius = 0.5;
LaserShot.rating = Math.log(LaserShot.speed + 1) * LaserShot.damage * Math.log(LaserShot.impactRadius + 1);
types.shots['LaserShot'] = LaserShot;

class ShellShot extends Shot
{
    constructor() {
        super(ShellShot.speed, 25, ShellShot.damage, ShellShot.impactRadius);
        this.createVisual(ShellShot.sprite, [1, 1, 1, 1], 0.3);
        this.playSound('artillery');
    }
}
ShellShot.nickName = '炮弹';
ShellShot.description = '炮弹可不是闹着玩的';
ShellShot.sprite = 'shellshot';
ShellShot.frames = 4;
ShellShot.speed = 40;
ShellShot.damage = 15;
ShellShot.impactRadius = 0.5;
ShellShot.rating = Math.log(ShellShot.speed + 1) * ShellShot.damage * Math.log(ShellShot.impactRadius + 1);
types.shots['ShellShot'] = ShellShot;
*/