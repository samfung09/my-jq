(function(){
    /**
     * 缓冲运动
     * @param {HTMLElement} el 元素
     * @param {String} dir 方向
     * @param {Number} target 目标
     */
    function move(el, dir, target){
        clearInterval(timer);
        var timer = setInterval(function(){
            var start = parseInt(getStyle(el, dir));
            var speed = (target - start)/10;    //缓冲即速度与位移差成正比
            if(speed == 0){
                clearInterval(timer);
            }
            speed = (target-start)>0 ? Math.ceil(speed) : Math.floor(speed);//速度为小数时带来的问题
            // console.log(speed);
            el.style[dir] = start + speed + 'px';
        }, 17)
    }
    /**
     * 获取样式
     * @param {HTMLElement} el 元素
     * @param {String} attr 样式属性
     */
    function getStyle(el, attr){
        return el.currentStyle ? el.currentStyle[attr] : getComputedStyle(el)[attr];
    }
    /**
     * 添加类名
     * @param {HTMLElement} el 元素
     * @param {String} cls 类名
     */
    function addClass(el, cls) {
        if (!hasClass(el, cls)) {
            el.className += ' ' + cls;
        }
    }
    /**
     * 判断元素是否含有该class
     * @param {HTMLElement} el 元素
     * @param {String} cls 类名
     */
    function hasClass(el, cls) {
        return (new RegExp('(\\s|^)' + cls + '(\\s|$)')).test(el.className);
    }
    /**
     * 移除class
     * @param {HTMLElement} el 元素
     * @param {String} cls 类名
     */
    function removeClass(el, cls) {
        if (hasClass(el, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            el.className = el.className.replace(reg, '');
        }
    }
    /**
     * 判断节点是行内还是会计元素
     * @param {HTMLElement} el 元素
     */
    function defaultDisplay(el){
        var iframe = document.createElement('iframe');//相当于html作用域
        document.body.appendChild(iframe);//将iframe追加进body中
        var iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;//iframe文档元素
        var node = iframeDoc.createElement(el.nodeName)//创建要判断的节点
        iframeDoc.body.appendChild(node);//将节点追加到iframe中
        var display = getStyle(node, 'display');//判断节点属性
        document.body.removeChild(iframe);//移除iframe
        return display;
    }
    /**
     * 元素透明度函数
     * @param {HTMLElement} el 元素
     * @param {Number} target opacity值
     * @param {Function} cb 回调函数
     */
    function opacity(el, target, cb){
        clearInterval(timer);
        var opc = getStyle(el, 'opacity')*10;
        var speed = target==0 ? -1 : 1;
        var timer = setInterval(function(){
            if(opc/10 == target){
                cb && cb();
                return clearInterval(timer);
            }
            opc += speed;
            el.style.opacity = opc/10;
        }, 34)       
    }
    //数组交集函数
    function intersection(arr1, arr2){
        var temp = [];
        for(var i=0; i<arr1.length; i++){
            for(var j=0; j<arr2.length; j++){
                if(arr1[i] === arr2[j]){
                    temp.push(arr1[i]);
                    break;
                }
            }
        }
        return temp;
    }
    //ajax函数
    function ajax(options){
        var url = options.url || '';
        var method = options.method || 'get';
        var data = options.data || {};
        var success = options.success || function(){};
        var xhr = new XMLHttpRequest();
        if(method === 'get'){
            xhr.open('get', url+'?'+getFormat(data), true);
            xhr.send();
        }else if (method === 'post'){
            if(typeof data == 'string' || data instanceof FormData){
                data = data;
            }else{
                data = JSON.stringify(data);
            }
            xhr.open('post', url, true);
            xhr.send(data);
        }
        xhr.onload = function () {
            //如果请求成功
            if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
                success(xhr.responseText);
            }
        }
        //get请求发送数据格式
        function getFormat(data){
            var str = '';
            for(var key in data){
                str += key + '=' + data[key] + '&';
            }
            return str.slice(0,-1);
        }
    }
    //------------------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------------

    //类jQuery封装
    function JQ(arg){
        if(typeof arg == 'string'){
            this.els = [].slice.call(document.querySelectorAll(arg));
        }else if(arg instanceof HTMLElement || arg instanceof HTMLDocument){
            this.els = [arg];
        }
    }

    //元素索引
    JQ.prototype.index = function(){
        var arr = [].slice.call(this.els[0].parentNode.children);
        return arr.indexOf(this.els[0]);
    }
    //设置样式
    JQ.prototype.css = function(arg){
        if(typeof arg == 'string'){
            return getStyle(this.els[0], arg);
        }else if(typeof arg == 'object'){
            for(var i=0; i<this.els.length; i++){
                for(var key in arg){
                    this.els[i].style[key] = arg[key];
                }
            }
            return this;
        }
    }
    //添加html标签属性
    JQ.prototype.attr = function(arg){
        if(typeof arg == 'string'){
            return this.els[0].getAttribute(arg);
        }else if(typeof arg == 'object'){
            for(var i=0; i<this.els.length; i++){
                for(var key in arg){
                    this.els[i].setAttribute(key, arg[key]);
                }
            }
            return this;
        }
    }
    //移除html标签属性
    JQ.prototype.removeAttr = function(attr){
        for(var i=0; i<this.els.length; i++){
            this.els[i].removeAttribute(attr);
        }
        return this;
    }
    //添加dom元素对象属性
    JQ.prototype.prop = function(arg){
        if(typeof arg == 'string'){
            return this.els[0][arg];
        }else if(typeof arg == 'object'){
            for(var i=0; i<this.els.length; i++){
                for(var key in arg){
                    this.els[i][key] = arg[key];
                }
            }
            return this;
        }
    }
    //移除dom元素对象属性
    JQ.prototype.removeProp = function(attr){
        for(var i=0; i<this.els.length; i++){
            this.els[i][attr] = null;
        }
        return this;
    }
    //元素内部文本内容
    JQ.prototype.text = function(arg){
        if(typeof arg == 'string'){
            for(var i=0; i<this.els.length; i++){
                this.els[i].innerText = arg;
            }
            return this;
        }else if(typeof arg == 'undefined'){
            return this.els[0].innerText;
        }
    }
    //元素内部html内容
    JQ.prototype.html = function(arg){
        if(typeof arg == 'string'){
            for(var i=0; i<this.els.length; i++){
                this.els[i].innerHTML = arg;
            }
            return this;
        }else if(typeof arg == 'undefined'){
            return this.els[0].innerHTML;
        }
    }
    //元素value值
    JQ.prototype.val = function(arg){
        if(typeof arg == 'string'){
            for(var i=0; i<this.els.length; i++){
                this.els[i].value = arg;
            }
            return this;
        }else if(typeof arg == 'undefined'){
            return this.els[0].value;
        }
    }
    //缓冲运动
    JQ.prototype.animate = function(options){
        for(var i=0; i<this.els.length; i++){
            for(var key in options){
                move(this.els[i], key, parseInt(options[key]));
            }
        }
        return this;
    }
    //添加类名
    JQ.prototype.addClass = function(cls){
        for(var i=0; i<this.els.length; i++){
            addClass(this.els[i], cls);
        }
        return this;
    }
    //类名是否存在
    JQ.prototype.hasClass = function(cls){
        for(var i=0; i<this.els.length; i++){
            hasClass(this.els[i], cls);
        }
        return this;
    }
    //移除类名
    JQ.prototype.removeClass = function(cls){
        for(var i=0; i<this.els.length; i++){
            removeClass(this.els[i], cls);
        }
        return this;
    }
    //父元素
    JQ.prototype.parent = function(){
        var arr = [];
        for(var i=0; i<this.els.length; i++){
            arr.push(this.els[i].parentNode);
        }
        this.els = arr;
        return this;
    }
    //子元素
    JQ.prototype.children = function(selector){
        var arr = [];
        if(selector){
            for(var i=0; i<this.els.length; i++){
                var temp1 = $(this.els[i]).children().els;
                var temp2 = $(this.els[i]).find(selector).els;
                arr = arr.concat(intersection(temp1, temp2));
            }
        }else{
            for(var i=0; i<this.els.length; i++){
                arr = arr.concat([].slice.call(this.els[i].children));
            }
        }
        this.els = arr;
        return this;
    }
    //兄弟元素
    JQ.prototype.siblings = function(){
        var arr = [];
        for(var i=0; i<this.els.length; i++){
            var temp = [].slice.call(this.els[i].parentNode.children);
            temp.splice(arr.indexOf(this.els[i]), 1);
            arr = arr.concat(temp);
        }
        this.els = arr;
        return this;
    }
    //上一个兄弟元素
    JQ.prototype.prev = function(){
        var arr = [];
        for(var i=0; i<this.els.length; i++){
            if(this.els[i].previousElementSibling){
                arr.push(this.els[i].previousElementSibling);
            }
        }
        this.els = arr;
        return this;
    }
    //下一个兄弟元素
    JQ.prototype.next = function(){
        var arr = [];
        for(var i=0; i<this.els.length; i++){
            if(this.els[i].nextElementSibling){
                arr.push(this.els[i].nextElementSibling);
            }
        }
        this.els = arr;
        return this;
    }
    //查找后代元素
    JQ.prototype.find = function(selector){
        var arr = [];
        for(var i=0; i<this.els.length; i++){
            var arr1 = [].slice.call(this.els[i].querySelectorAll(selector));
            for(var j=0; j<arr1.length; j++){
                arr.push(arr1[j]);
            }
        }
        this.els = arr;
        return this;
    }
    //根据索引指定的元素
    JQ.prototype.eq = function(num){
        this.els = this.els.slice(num, num+1);
        return this;
    }
    //第一个子元素
    JQ.prototype.firstChild = function(){
        var arr = [];
        for(var i=0; i<this.els.length; i++){
            arr.push(this.els[i].children[0]);
        }
        this.els = arr;
        return this;
    }
    //最后一个子元素
    JQ.prototype.lastChild = function(){
        var arr = [];
        for(var i=0; i<this.els.length; i++){
            arr.push(this.els[i].children[this.els[i].children.length-1]);
        }
        this.els = arr;
        return this;
    }
    //元素内部后面插入
    JQ.prototype.append = function(arg){
        for(var i=0; i<this.els.length; i++){
            if(arg instanceof HTMLElement){
                this.els[i].appendChild(arg);
            }else if(typeof arg == 'string'){
                this.els[i].innerHTML += arg;
            }
        }
        return this;
    }
    //元素内部前面插入
    JQ.prototype.prepend = function(arg){
        for(var i=0; i<this.els.length; i++){
            if(arg instanceof HTMLElement){
                this.els[i].insertBefore(arg, this.els[i].childNodes[0]);
            }else if(typeof arg == 'string'){
                this.els[i].innerHTML = arg + this.els[i].innerHTML;
            }
        }
        return this;
    }
    //元素前面插入
    JQ.prototype.before = function(arg){
        for(var i=0; i<this.els.length; i++){
            if(arg instanceof HTMLElement){
                this.els[i].parentNode.insertBefore(arg, this.els[i]);
            }else if(typeof arg == 'string'){
                this.els[i].outerHTML = arg + this.els[i].outerHTML;
            }
        }
        return this;
    }
    //元素后面插入
    JQ.prototype.after = function(arg){
        for(var i=0; i<this.els.length; i++){
            if(arg instanceof HTMLElement){
                this.els[i].parentNode.insertBefore(arg, this.els[i].nextSibling);
            }else if(typeof arg == 'string'){
                this.els[i].outerHTML += arg;
            }
        }
        return this;
    }
    //元素显示
    JQ.prototype.show = function(){
        for(var i=0; i<this.els.length; i++){
            var display = this.els[i].display || defaultDisplay(this.els[i]);
            this.els[i].style.display = display;
        }
        return this;
    }
    //元素隐藏
    JQ.prototype.hide = function(){
        for(var i=0; i<this.els.length; i++){
            this.els[i].display = getStyle(this.els[i], 'display');//在元素隐藏前将其display属性值保存
            this.els[i].style.display = 'none';
        }
        return this;
    }
    //逐渐显示
    JQ.prototype.fadeIn = function(){
        for(var i=0; i<this.els.length; i++){
            $(this.els[i]).show();
            opacity(this.els[i], 1);
        }
        return this;
    }
    //逐渐隐藏
    JQ.prototype.fadeOut = function(){
        var that = this;
        for(var i=0; i<this.els.length; i++){            
            (function(i){
                opacity(that.els[i], 0, function(){//注意回调函数是异步以及自执行函数this指向window
                    console.log(i)
                    $(that.els[i]).hide();
                })
            })(i);
        }
        return this;
    }
    
    //点击事件
    JQ.prototype.click = function(fn){
        for(var i=0; i<this.els.length; i++){
            this.els[i].onclick = fn;
        }
    }
    //鼠标移入事件
    JQ.prototype.mouseenter = function(fn){
        for(var i=0; i<this.els.length; i++){
            this.els[i].onmouseenter = fn;
        }
    }
    //鼠标移出事件
    JQ.prototype.mouseleave = function(fn){
        for(var i=0; i<this.els.length; i++){
            this.els[i].onmouseleave = fn;
        }
    }
    //鼠标按下事件
    JQ.prototype.mousedown = function(fn){
        for(var i=0; i<this.els.length; i++){
            this.els[i].onmousedown = fn;
        }
    }
    //鼠标移动事件
    JQ.prototype.mousemove = function(fn){
        for(var i=0; i<this.els.length; i++){
            this.els[i].onmousemove = fn;
        }
    }
    //鼠标抬起事件
    JQ.prototype.mouseup = function(fn){
        for(var i=0; i<this.els.length; i++){
            this.els[i].onmouseup = fn;
        }
    }
    //键盘按下事件
    JQ.prototype.keydown = function(fn){
        for(var i=0; i<this.els.length; i++){
            this.els[i].onkeydown = fn;
        }
    }
    //键盘抬起事件
    JQ.prototype.keyup = function(fn){
        for(var i=0; i<this.els.length; i++){
            this.els[i].onkeyup = fn;
        }
    }
    //焦点事件
    JQ.prototype.focus = function(fn){
        for(var i=0; i<this.els.length; i++){
            this.els[i].onfocus = fn;
        }
    }
    //失去焦点事件
    JQ.prototype.blur = function(fn){
        for(var i=0; i<this.els.length; i++){
            this.els[i].onblur = fn;
        }
    }
    //表单状态改变事件
    JQ.prototype.change = function(fn){
        for(var i=0; i<this.els.length; i++){
            this.els[i].onchange = fn;
        }
    }
    //表单输入事件
    JQ.prototype.input = function(fn){
        for(var i=0; i<this.els.length; i++){
            this.els[i].oninput = fn;
        }
    }
    //动态绑定事件
    JQ.prototype.on = function(event, fn, useCapture){
        useCapture = typeof useCapture == "boolean" ? useCapture : false;//是否捕获
        for(var i=0; i<this.els.length; i++){
            this.els[i].addEventListener(event, fn, useCapture);
        }
    }


    function $(arg){
        return new JQ(arg);
    }
    $.ajax = ajax;
    window.$ = $;
})(window);