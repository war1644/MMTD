/**
 *         ▂▃╬▄▄▃▂▁▁
 *  ●●●█〓██████████████▇▇▇▅▅▅▅▅▅▅▅▅▇▅▅          BUG
 *  ▄▅████☆RED █ WOLF☆██▄▄▃▂
 *  ████████████████████████████
 *  ◥⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙▲⊙◤
 *
 * 资源载入控制类
 * @author 路漫漫
 * @link ahmerry@qq.com
 * @version
 * v2017/11/3 12:41 初版
 */
"use strict";
/**
 * 接收一个资源列表，而加载任务的进度、错误、完成事件、则可通过设置回调函数来取得
 */
class ResourceLoader
{
    constructor(target) {
        this.keys = target || {};
        this.loaded = 0;
        this.loading = 0;
        this.errors = 0;
        this.finished = false;
        this.oncompleted = undefined;
        this.onprogress = undefined;
        this.onerror = undefined;
    }
    completed() {
        this.finished = true;
        if (this.oncompleted && typeof (this.oncompleted) === 'function') {
            this.oncompleted.apply(this, [{
                loaded: this.loaded,
            }]);
        }
    }
    progress(name) {
        this.loading--;
        this.loaded++;
        let total = this.loaded + this.loading + this.errors;
        if (this.onprogress && typeof (this.onprogress) === 'function') {
            this.onprogress.apply(this, [{
                recent: name,
                total: total,
                progress: this.loaded / total,
            }]);
        }
        if (this.loading === 0)
            this.completed();
    }
    error(name) {
        this.loading--;
        this.errors++;
        let total = this.loaded + this.loading + this.errors;
        if (this.onerror && typeof (this.onerror) === 'function') {
            this.onerror.apply(this, [{
                error: name,
                total: total,
                progress: this.loaded / total,
            }]);
        }
    }
    load(keys, completed, progress, error) {
        this.loading += keys.length;
        if (completed && typeof (completed) === 'function')
            this.oncompleted = completed;
        if (progress && typeof (progress) === 'function')
            this.onprogress = progress;
        if (error && typeof (error) === 'function')
            this.onerror = error;
        for (let i = keys.length; i--; ) {
            let key = keys[i];
            this.loadResource(key.name, key.value);
        }
    }
    loadResource(name, value) {
        this.keys[name] = value;
    }
}

class ImageLoader extends ResourceLoader
{
    constructor(target) {
        super(target);
    }
    loadResource(name, value) {
        let me = this;
        let img = document.createElement('img');
        img.addEventListener('error', function() {
            me.error(name);
        }, false);
        img.addEventListener('load', function() {
            me.progress(name);
        }, false);
        img.src = value;
        super.loadResource(name, img);
    }
}
/**
 * 检测浏览器支持何种声音格式(如果有支持的话)、并选择被检测到的格式
 * @type {void|*}
 */
class SoundLoader extends ResourceLoader
{
    constructor(target) {
        super(target);
    }
    loadResource(name, value) {
        let me = this;
        let element = document.createElement('audio');
        element.addEventListener('loadedmetadata', function() {
            me.progress(name);
        }, false);
        element.addEventListener('error', function() {
            me.error(name);
        }, false);
        /*if (element.canPlayType('audio/ogg').replace(/^no$/, ''))
            element.src = value.ogg;
        else */
        if (element.canPlayType('audio/mpeg').replace(/^no$/, '')){
            element.src = value.mp3;
        } else {
            return me.progress(name);
        }
        super.loadResource(name, element);
    }
}
class Loader
{
    constructor(completed, progress, error) {
        this.completed = completed || function() {}
        ;
        this.progress = progress || function() {}
        ;
        this.error = error || function() {}
        ;
        this.sets = [];
    }
    /**
     * 设置要载入的资源数据
     * @param name
     * @param loader
     * @param target
     * @param keys
     */
    set(name, loader, target, keys) {
        this.sets.push({
            name: name,
            resources: keys,
            loader: new loader(target),
        });
    }
    start() {
        this.next();
    }
    //执行载入
    next() {
        let me = this;
        let set = me.sets.pop();
        let completed = function(e) {
            me.next();
        };
        let progress = function(e) {
            e.name = set.name;
            me.progress(e);
        };
        let error = function(e) {
            e.name = set.name;
            me.error(e);
        };
        if (set) {
            me.progress({
                name: set.name,
                recent: '',
                total: set.resources.length,
                progress: 0,
            });
            set.loader.load(set.resources, completed, progress, error);
            return;
        }
        me.completed();
    }
}
