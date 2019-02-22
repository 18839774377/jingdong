$(function() {
    var index = 1;
    // 1.0 修改结构
        // 在图片列表ul的盒子中，首尾各添加一张复制的图片
    var banner = $(".jd_banner");
    var bannerWidth = banner.width();
    var ulBox = $(".jd_bannerImg");
    // 找到首尾的图片
    var firstLi = ulBox.children().eq(0);
    var lastLi = ulBox.children().last();
    // 在图片列表中增加
    ulBox.append(firstLi.clone());
    ulBox.prepend(lastLi.clone());

    // 2.0 修改样式
    var count = ulBox.children().length;
    console.log(bannerWidth)
    ulBox.width(count * bannerWidth);
    ulBox.children().each(function(index, ele) {
        $(ele).width(bannerWidth);
    })
    // ulbox的默认偏移
    ulBox.css("left", -index * bannerWidth);

    // 3.0 自动轮播
    function ulAnimate() {
        ulBox.animate({
            "left": -(index * bannerWidth)
        }, 200, "ease-in-out", function() {
            // 判断当前是否是最后一张
            if(index == count - 1) {
                index = 1;
                ulBox.css("left", -index * bannerWidth);
            // 判断当前是否为第一张
            } else if (index == 0) {
                index = count - 2;
                ulBox.css("left", -index * bannerWidth);
            }
        })
    }

    var timerId = setInterval(function() {
        index++;
        ulAnimate()
    }, 1000)

    // 4.0 设置左右滑动
    // 左滑动
    ulBox.on("swipeLeft", function () {
        clearInterval(timerId);
        index++;
        ulAnimate()
        
        setTimeout(function () {
            timerId = setInterval(function() {
                index++;
                ulAnimate()
            }, 2000);
        }, 500)
    });

    // 右滑动
    ulBox.on("swipeRight", function () {
        clearInterval(timerId);
        index--;
        ulAnimate()
        
        setTimeout(function () {
            timerId = setInterval(function() {
                index++;
                ulAnimate()
            }, 2000);
        }, 500)
    });
})