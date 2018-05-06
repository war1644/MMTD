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
 * 机枪
 */
class MGShot extends Shot
{
    constructor() {
        super(MGShot.speed, 25, MGShot.damage, MGShot.impactRadius);
        this.createVisual(MGShot.sprite, MGShot.frames);
        this.playSound('mg');
    }
}
MGShot.nickName = '机枪类型';
MGShot.description = '';
MGShot.sprite = 'mgShot';
MGShot.frames = [1];
MGShot.speed = 6.0;
MGShot.damage = 3;
MGShot.impactRadius = 0.5;
MGShot.rating = Math.log(MGShot.speed + 1) * MGShot.damage * Math.log(MGShot.impactRadius + 1);
types.shots['MGShot'] = MGShot;

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
CannonShot.nickName = '主炮类型';
CannonShot.description = '战斗中核心输出';
CannonShot.sprite = 'cannonShot';
CannonShot.frames = [1];
CannonShot.speed = 10;
CannonShot.damage = 15;
CannonShot.impactRadius = 0.5;
CannonShot.rating = Math.log(CannonShot.speed + 1) * CannonShot.damage * Math.log(CannonShot.impactRadius + 1);
types.shots['CannonShot'] = CannonShot;

/**
 * 激光
 */
class LaserShot extends Shot
{
    constructor() {
        super(LaserShot.speed, 25, LaserShot.damage, LaserShot.impactRadius);
        this.createVisual(LaserShot.sprite, LaserShot.frames);
        this.playSound('laser');
    }
}
LaserShot.nickName = '激光类型';
LaserShot.description = '';
LaserShot.sprite = 'laserShot';
LaserShot.frames = [24];
LaserShot.speed = 10;
LaserShot.damage = 7;
LaserShot.impactRadius = 0.5;
LaserShot.rating = Math.log(LaserShot.speed + 1) * LaserShot.damage * Math.log(LaserShot.impactRadius + 1);
types.shots['LaserShot'] = LaserShot;


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
SeShot.nickName = 'S-E类型';
SeShot.description = '威力巨大';
SeShot.sprite = 'seShot';
SeShot.frames = [20];
SeShot.speed = 2;
SeShot.damage = 500;
SeShot.impactRadius = 0.5;
SeShot.rating = Math.log(SeShot.speed + 1) * SeShot.damage * Math.log(SeShot.impactRadius + 1);
types.shots['SeShot'] = SeShot;

/**
 *
 */
class HellShot extends Shot
{
    constructor() {
        super(HellShot.speed, 75, HellShot.damage, HellShot.impactRadius);
        this.createVisual(HellShot.sprite, HellShot.frames);
        this.playSound('seAttack');
    }
}
HellShot.nickName = '暗能量类型';
HellShot.description = '高暗能量密度是由地狱门射出的，一发入魂。';
HellShot.sprite = 'hellShot';
HellShot.frames = [12];
HellShot.speed = 2.5;
HellShot.damage = 300;
HellShot.impactRadius = 0.5;
HellShot.rating = Math.log(HellShot.speed + 1) * HellShot.damage * Math.log(HellShot.impactRadius + 1);
types.shots['HellShot'] = HellShot;

/**
 * 该攻击类型只针对空中单位
 */
class AirShot extends Shot
{
    constructor() {
        super(AirShot.speed, 10, AirShot.damage, AirShot.impactRadius);
        this.createVisual(AirShot.sprite, AirShot.frames);
        this.playSound('laser');
    }
}
AirShot.nickName = '对空导弹类型';
AirShot.description = '对空导弹';
AirShot.sprite = 'laserShot';
AirShot.frames = [24];
AirShot.speed = 2;
AirShot.damage = 10;
AirShot.impactRadius = 0.5;
AirShot.rating = Math.log(AirShot.speed + 1) * AirShot.damage * Math.log(AirShot.impactRadius + 1);
types.shots['AirShot'] = AirShot;

class IceShot extends Shot
{
    constructor() {
        super(IceShot.speed, 200, IceShot.damage, IceShot.impactRadius);
        this.createVisual(IceShot.sprite, IceShot.frames);
        this.playSound('ice');
    }
}
IceShot.nickName = '冷冻能量体类型';
IceShot.description = '';
IceShot.sprite = 'iceShot';
IceShot.frames = [4];
IceShot.speed = 3.5;
IceShot.damage = 15;
IceShot.impactRadius = 0.5;
IceShot.rating = Math.log(IceShot.speed + 1) * IceShot.damage * Math.log(IceShot.impactRadius + 1);
types.shots['IceShot'] = IceShot;

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