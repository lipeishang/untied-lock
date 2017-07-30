function untiedLock() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext('2d');
    this.pswObj = window.localStorage.getItem('password') ? {
        step: 0,
        spassword: JSON.parse(window.localStorage.getItem('password'))
    } : {};
    var isTouch = false;
    // this.throughArr = [];
    this.unthroughArr = [];
    this.radio = document.getElementsByName("radio");
    createCircle();
    document.getElementById("title").innerHTML=("请输入手势密码");
    touchEvent(isTouch);//添加事件函数

}

function getMov(po) {// 核心变换方法在touchmove时候调用，在移动的过程中画出轨迹
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    for (var i = 0; i < this.circleArray.length; i++) {       // 每帧先把面板画出来
        this.drawCircle(this.circleArray[i].x, this.circleArray[i].y);
    }

    this.drawPoint(this.throughArr);// 每帧花轨迹
    this.drawLine(po, this.throughArr);// 每帧画圆心

    for (var i = 0; i < this.unthroughArr.length; i++) {
        if (Math.abs(po.x - this.unthroughArr[i].x) < this.r && Math.abs(po.y - this.unthroughArr[i].y) < this.r) {
            this.drawPoint(this.unthroughArr[i].x, this.unthroughArr[i].y);
            this.throughArr.push(this.unthroughArr[i]);
            console.log(this.throughArr);
            this.unthroughArr.splice(i, 1);
            break;
        }
    }
}

function drawStatusPoint(type) { // 初始化状态线条
    for (var i = 0 ; i < this.throughArr.length ; i++) {
        this.ctx.fillStyle = type;
        this.ctx.strokeStyle = type;
        this.ctx.beginPath();
        this.ctx.arc(this.throughArr[i].x, this.throughArr[i].y, this.r, 0, Math.PI * 2, true);
        this.ctx.closePath();
        this.ctx.stroke();
    }
}

function checkPass(psw1, psw2) {// 检测密码
    var p1 = '',
        p2 = '';
    for (var i = 0 ; i < psw1.length ; i++) {
        p1 += psw1[i].index + psw1[i].index;
    }
    for (var i = 0 ; i < psw2.length ; i++) {
        p2 += psw2[i].index + psw2[i].index;
    }
    return p1 === p2;
}

function storePass(psw) {// touchend结束之后对密码和状态的处理
    if (psw.length < 5 && this.pswObj.step === 0) {
        document.getElementById('title').innerHTML = '密码太短，至少需要5个点';
        setTimeout(function () {
            document.getElementById('title').innerHTML = '请输入手势密码';
        }, 800);
    }
    else {
        if (this.pswObj.step == 1 && this.radio[0].checked === true) {
            if (this.checkPass(this.pswObj.fpassword, psw)) {
                this.pswObj.step = 2;
                this.pswObj.spassword = psw;
                document.getElementById('title').innerHTML = '密码保存成功';
                this.drawStatusPoint('#2CFF26');
                window.localStorage.setItem('password', JSON.stringify(this.pswObj.spassword));
                // window.localStorage.setItem('chooseType', this.chooseType);
            } else {
                document.getElementById('title').innerHTML = '两次的不一致，请重新设置密码';
                this.drawStatusPoint('red');
                this.pswObj.step = 0;
                // delete this.pswObj.step;
            }
        } else if (this.pswObj.step == 2 && this.radio[1].checked === true) {
            if (this.checkPass(this.pswObj.spassword, psw)) {
                document.getElementById('title').innerHTML = '密码正确！';
                this.drawStatusPoint('#2CFF26');
            } else {
                this.drawStatusPoint('red');
                document.getElementById('title').innerHTML = '输入的密码不正确';
            }
        } else if (this.pswObj.step == 0 && this.radio[0].checked === true) {

            this.pswObj.step = 1;
            this.pswObj.fpassword = psw;
            document.getElementById('title').innerHTML = '请再次输入手势密码';
        }
    }
}

function drawPoint() { // 初始化圆心
    for (var i = 0; i < this.throughArr.length; i++) {
        this.ctx.fillStyle = '#CFE6FF';
        this.ctx.beginPath();
        this.ctx.arc(this.throughArr.x, this.throughArr.y, this.r, 0, Math.PI * 2, true);
        this.ctx.closePath();
        this.ctx.fillStyle = "rgb(2,100,30)";
    }
}
//画九个小圆
function drawLine(po) {// 解锁轨迹
    this.ctx.beginPath();
    this.ctx.lineWidth = 3;
    this.ctx.moveTo(this.throughArr[0].x, this.throughArr[0].y);
    for (var i = 1; i < this.throughArr.length; i++) {
        this.ctx.lineTo(this.throughArr[i].x, this.throughArr[i].y);
    }
    this.ctx.lineTo(po.x, po.y);
    this.ctx.stroke();
    this.ctx.closePath();

}

function drawCircle(x, y) {
    this.ctx.strokeStyle = 'rgb(0,' + Math.floor(255 - 42.5) + ',' + Math.floor(255 - 42.5) + ')';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    // console.log(this.r);
    this.ctx.arc(x, y, this.r, 0, Math.PI * 2, true);
    this.ctx.closePath();
    this.ctx.stroke();
}

function reset() {
    createCircle();
}

function createCircle() {// 创建解锁点的坐标，根据canvas的大小来平均分配半径
    var count = 0;
    this.unthroughArr = [];
    this.throughArr = [];
    this.circleArray = [];
    this.r = this.ctx.canvas.width / (2 + 4 * 3);// 公式计算
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            count++;
            var obj = {
                x: j * 4 * this.r + 3 * this.r,
                y: i * 4 * this.r + 3 * this.r,
                index: count++
            };
            this.circleArray.push(obj);
            // console.log(this.circleArray);
            this.unthroughArr.push(obj);
            // console.log(this.unthroughArr)
        }
    }
    //清空画布
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    //根据我的点数画小圆
    for (var i = 0; i < this.circleArray.length; i++) {
        drawCircle(this.circleArray[i].x, this.circleArray[i].y);
    }
}

function getPosition(e) {// 获取touch点相对于canvas的坐标
    var rect = e.currentTarget.getBoundingClientRect();
    var po = {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
    };
    return po;
}

//给每个圈绑定触摸事件
function touchEvent() { //isTouch为false
    var self = this;
    // this.throughArr = [];
    this.canvas.addEventListener("touchstart", function (startEve) {//将触摸到的点画出来

        startEve.preventDefault();
        var p = getPosition(startEve);//开始触摸到的点的坐标
        for (var i = 0; i < self.circleArray.length; i++) {
            if (Math.abs(p.x - self.circleArray[i].x) < self.r && Math.abs(p.y - self.circleArray[i].y) < self.r) {
                //证明现在触摸到的点在圈圈内部
                //不能重复再画，设置触摸状态为true
                self.isTouch = true;
                //保存这个点的位置
                //先把触摸的这个点画出来
                drawPoint(self.circleArray[i].x, self.circleArray[i].y);
                //保存去掉正确路径下的圈圈
                // console.log(self.unthroughArr);
                self.throughArr.push(self.circleArray[i]);
                self.unthroughArr.splice(i, 1);
                // console.log(self.throughArr);
                break;
            }
        }
    }, false);
    this.canvas.addEventListener("touchmove", function (moveEve) {
        if (self.isTouch) {
            getMov(getPosition(moveEve));
        }
    }, false);
    this.canvas.addEventListener("touchend", function (endEve) {
        if (self.isTouch) {
            self.isTouch = false;
            storePass(self.throughArr);
            setTimeout(function () {
                reset();
            }, 300);
        }
    }, false);
}
