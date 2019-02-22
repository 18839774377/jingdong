window.onload = function() {

    // 1.0 搜索栏的背景透明
    window.onscroll = function() {
        effect()
    }
    effect()
    function effect() {
        // 获取轮播图的高度
        var bannerHeight = document.querySelector(".jd_banner").offsetHeight;
        // 获取头部导航的高度
        var searchBox = document.querySelector(".jd_search");
        var opacity = 0;
        // 获取页面滚动出去的距离，有兼容问题
        var offsetTop = document.body.scrollTop || document.documentElement.scrollTop;
        // 判断当前滚动出去的距离是否小于banner的高度
        if(offsetTop < bannerHeight) {
            opacity = offsetTop / bannerHeight;
        } else {
            opacity = 1;
        }
        // 判断完成之后接收opacity的值设置给盒子
        searchBox.style.backgroundColor = "rgba(233, 35, 34 , "+ opacity +")";
    }

    // 2.0 倒计时秒杀
    var spans = document.querySelector(".jd_sk_time").children;
    var totalTime = 3700; // 以后的时间均来自于服务器
    var timer = setInterval(function() {
        calTime()
    }, 1000) 
    calTime() // 不需要等待执行
    function calTime() {
        totalTime--
        if(totalTime < 0) {
            // 如果到达时间后退出执行
            clearInterval(timer)
            return
        }
        // 获取时分秒
        var hour = Math.floor(totalTime / 3600);
        var mins = Math.floor(totalTime % 3600 / 60);
        var second = Math.floor(totalTime % 60);
        // 设置每一个盒子的内容
        spans[0].innerText = Math.floor(hour / 10);
        spans[1].innerText = Math.floor(hour % 10);
        spans[3].innerText = Math.floor(mins / 10);
        spans[4].innerText = Math.floor(mins % 10);
        spans[6].innerText = Math.floor(second / 10);
        spans[7].innerText = Math.floor(second % 10);
    }


    // 3.0 处理轮播图的结构和样式
    bannerEffect()
    function bannerEffect() {
        var index = 1;
        // 3.1 修改结构，添加首尾图片
        var bannerBox = document.querySelector(".jd_banner");
        var ulBox = bannerBox.children[0];
        var firstLi = ulBox.children[0];
        var lastLi = ulBox.querySelector("li:last-of-type");
        // 把第1个li深层克隆一份，追加到ul中
        ulBox.appendChild(firstLi.cloneNode(true));
        // 把最后一个li深层克隆一份，置于第1个li之前
        ulBox.insertBefore(lastLi.cloneNode(true), firstLi);

        var bannerWidth = bannerBox.offsetWidth;
        var count = ulBox.children.length;
        // 当屏幕大小发生改变的时候，及时修正当前盒子大小和位置
        window.onresize = function() {
            resizeBanner()
        }
        // 3.2 设置默认样式
        resizeBanner()
        function resizeBanner() {
            // 获取单张图片的宽度
            bannerWidth = bannerBox.offsetWidth;
            // 设置ul盒子的总宽度
            ulBox.style.width = count * bannerWidth + "px";
            for(var i = 0; i < count; i++) {
                // 设置每一个li标签的宽度
                ulBox.children[i].style.width = bannerWidth + "px"
            }
            // 设置ul盒子的默认偏移
            ulBox.style.left = -(index * bannerWidth) + "px";
        }

        // 3.3 设置自动轮播
        var timerId;  // 由于内部的变量在touchstart的时候找不到，所以必须是外面的
        setTime() // 封装完之后，先要调用一次
        function setTime() {
            timerId = setInterval(function() {
                index++
                ulBox.style.transition = "left .3s ease-in-out"
                ulBox.style.left = -(index * bannerWidth) + "px";
                if(index == count - 1) {
                    setTimeout(function() {
                        index = 1
                        ulBox.style.transition = "none"
                        ulBox.style.left = -(index * bannerWidth) + "px";

                        setIndicators(index)
                    }, 300)
                }
            }, 1000)
        }

        // 4.0 设置手动轮播
        var startX,moveX,distanceX;
        var　isEnd = true;
        // 4.1 监听触摸按下的事件
        ulBox.addEventListener("touchstart", function(e) {
            clearInterval(timerId)
            startX = e.targetTouches[0].clientX;
        })
        // 4.2 监听触摸滑动的事件
        ulBox.addEventListener("touchmove", function(e) {
            if(isEnd) {
                moveX = e.targetTouches[0].clientX;
                distanceX = moveX - startX;
                ulBox.style.transition = "none"
                ulBox.style.left = -(index * bannerWidth) + distanceX + "px";
            }
        })
        // 4.3 监听触摸结束的事件
        ulBox.addEventListener("touchend", function() {
            isEnd = false;
            if(Math.abs(distanceX) > 100) {
                // 确定要翻页
                if(distanceX > 0) {
                    index--
                } else {
                    index++
                }
                ulBox.style.transition = "left .3s ease-in-out"
                ulBox.style.left = -(index * bannerWidth) + "px";
            } else if (Math.abs(distanceX) > 0) {
                // 确定要回弹
                ulBox.style.transition = "left .3s ease-in-out"
                ulBox.style.left = -(index * bannerWidth) + "px";
            }

            startX = 0;
            moveX = 0;
            distanceX = 0;
        })
        // 4.4 监听过渡结束的事件（过渡每次结束都会响应，而只需要在第一张和最后一张的时候处理特殊情况）
        ulBox.addEventListener("webkitTransitionEnd", function() {
            // 最后一张的时候
            if(index == count - 1) {
                index = 1;
                ulBox.style.transition = "none"
                ulBox.style.left = -(index * bannerWidth) + "px";
            // 第一张的时候
            } else if (index == 0) {
                index = count - 2;
                ulBox.style.transition = "none"
                ulBox.style.left = -(index * bannerWidth) + "px";
            }
            // 设置小点
            setIndicators(index)

            setTimeout(function() {
                isEnd = true;

                clearInterval(timerId);
                setTime()
            }, 500)
        })

        // 5.0 点标记的设置
        var indicators = bannerBox.querySelector("ol").children;
        function setIndicators(index) {
            for(var i = 0; i < indicators.length; i++) {
                indicators[i].classList.remove("active");
            }
            indicators[index - 1].classList.add("active")
        }
    }
    
}