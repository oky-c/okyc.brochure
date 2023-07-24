/**
 * 카카오 서비스 초기화
 * @param kakaoKey
 */
function initKakao(kakaoKey) {
    Kakao.init(kakaoKey);
    console.log(Kakao.isInitialized());
}

/**
 * 카카오 메시지 전송
 *
 * @param linkTitle
 * @param linkCount
 * @param commentCount
 * @param sharedCount
 */
function share2KakaoLink(linkTitle, linkCount=286, commentCount=45, sharedCount=845) {
    Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
            title: gTitle,
            description: gDesc,
            imageUrl: gKakaoThumb,
            link: {
                mobileWebUrl: gUrl,
                webUrl: gUrl,
            },
        },
        social: {
            likeCount: linkCount,
            commentCount: commentCount,
            sharedCount: sharedCount,
        },
        buttons: [
            {
                title: linkTitle,
                link: {
                    mobileWebUrl: gUrl,
                    webUrl: gUrl,
                },
            }
        ],
    })
}

/**
 * 문자로 전송
 */
function share2SMS() {
    const userAgent = navigator.userAgent.toLocaleLowerCase()

    if (userAgent.search('android') > -1) {
        location.href = `sms:?body=${gTitle}%0a ${gUrl}`
    } else if (userAgent.search('iphone') > -1 || uagent.search('ipad') > -1) {
        location.href = `sms:&body=${gTitle}%0a ${gUrl}`
    }
}

/**
 * 클립보드로 복사
 */
function share2Clipboard() {
    const t = document.createElement("textarea");
    document.body.appendChild(t);
    t.value = `${gTitle}\n${gUrl}`;
    t.select();
    document.execCommand('copy');
    document.body.removeChild(t);
    alert("주소가 복사되었습니다. 원하는 곳에 붙여넣기 해주세요.");
}

/**
 * 페이스북 공유
 */
function share2Facebook() {
    let openNewWindow = window.open('about:blank');
    openNewWindow.location.href = `https://www.facebook.com/sharer.php?u=${gUrl}`;
}

/**
 * 네이버 블로그 공유
 */
function share2NaverBlog() {
    let openNewWindow = window.open('about:blank');
    openNewWindow.location.href = `https://blog.naver.com/openapi/share?url=${gUrl}&title=${gTitle}`;
}

/**
 * 이메일로 공유
 */
function share2Email() {
    location.href=`mailto:?subject=${gTitle}&body=${gUrl}`;
}

/**
 * 아이디를 통한 페이지 이동
 * @param id
 */
function movePageByID(id) {
    gSwiper.allowSlidePrev = true;
    gSwiper.allowSlideNext = true;
    let slideIndex = $(`#${id}.swiper-slide`).index();
    gSwiper.slideTo(slideIndex);
}

/**
 * 전화문의 폼 노출
 */
function showContact() {
    $("#share-buttons").removeClass('on');
    $("#popover-contact").addClass('on');
    $(".btn-share").hide();
    $('.btn-close').show();
}

/**
 * 모든 팝업 닫기
 */
function hidePopup() {
    $("#share-buttons").removeClass('on');
    $("#popover-contact").removeClass('on');
    $("#popover-contact-ok").removeClass('on');
    $('.btn-close').hide();
    $(".btn-share").show();
}

/**
 * 슬라이드에서 애니메이션 및 인포팝업 설정 확인후 출력
 */
function checkPopoverNAnimation() {
    let activeSlide = $(`.swiper-slide:nth-child(${(gSwiper.realIndex+1)})`);
    activeSlide.find('.el').each((index, itm)=>{
        $(itm).addClass($(itm).data('animate'));
    });

    let hasSwipe = activeSlide.hasClass('popover-swipe');
    let hasScroll = activeSlide.hasClass('popover-scroll');
    let hasContact = activeSlide.hasClass('contact-button');

    if(hasContact) {
        $("#contact-button").addClass("show");
        $("#contact-button-wrapper").show();
    } else {
        $("#contact-button").removeClass("show");
        $("#contact-button-wrapper").hide();
    }

    // 좌우 & 스크롤
    if(hasScroll && hasSwipe) {
        setTimeout(()=>{
            $("#swipe-info").css('display','flex').delay(1000).fadeOut(500);
            setTimeout(()=>{
                $("#scroll-down-wrapper").css('display', 'flex').delay(1000).hide(0);
            },500);
        },1000);
    // 좌우로 넘겨보세요
    } else if(hasSwipe) {
        setTimeout(()=>{
            $("#swipe-info").css('display','flex').delay(1000).fadeOut(500);
        },1000);
    // 스크롤 하세요
    } else if(hasScroll) {
        setTimeout(()=>{
            $("#scroll-down-wrapper").css('display', 'flex').delay(1000).hide(0);
        },1000);
    }
}

/**
 * 인증문자 발송
 */
function sendCertNumber() {
    let name = $("#contact-name");
    let cp = $("#contact-cp");

    $.ajax("https://client-api.okyc.kr/cn/send", {
        type: "POST",
        crossDomain: true,
        withCredentials: false,
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            "name":name.val(),
            "cp":cp.val()
        }),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("x-api-key",gApiKey);
        },
        success: function(res) {
            alert(res.msg);
        }
    })
}

/**
 * 인증문자 검증
 */
function confirmCertNumber() {
    let name = $("#contact-name");
    let cp = $("#contact-cp");
    let cn = $("#contact-cert-number");

    $.ajax("https://client-api.okyc.kr/cn/confirm", {
        type: "POST",
        crossDomain: true,
        withCredentials: false,
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            "cp":cp.val(),
            "cn":cn.val()
        }),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("x-api-key",gApiKey);
        },
        success: function(res) {
            if(res.success) {
                cp.attr("readonly", "readonly");
                name.attr("readonly", "readonly");
                cn.attr("readonly", "readonly");
                $("#confirmed-cn").val("1");
                alert(res.msg);
            } else {
                alert(res.msg);
            }
        }
    })
}

const isMobile = () => {
    try {
        document.createEvent("TouchEvent");
        return true;
    } catch (e) {
        return false;
    }
};

/**
 * 상담 신청
 */
function submitContact() {
    if($("#confirmed-cn").val() !== "1") {
        alert("인증번호 확인을 먼저 진행해 주세요.");
        return;
    }
    let name = $("#contact-name");
    let cp = $("#contact-cp");
    let cn = $("#contact-cert-number");
    let category = $("#category");

    $.ajax("https://client-api.okyc.kr/contact/submit", {
        type: "POST",
        crossDomain: true,
        withCredentials: false,
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            "category":category.val(),
            "referer":gUrl,
            "device":isMobile()?'Mobile':'PC',
            "name":name.val(),
            "cp":cp.val(),
            "cn":cn.val()
        }),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("x-api-key",gApiKey);
        },
        success: function(res) {
            if(res.success) {
                hidePopup();
                $("#popover-contact-ok").addClass('on');
            } else {
                alert(res.msg);
            }
            cp.removeAttr("readonly");
            name.removeAttr("readonly");
            cn.removeAttr("readonly");
            cp.val("");
            name.val("");
            cn.val("");
        }
    })
}

$(function(){

    $(".btn-share").click(function (){
        $("#popover-contact").removeClass('on');
        $("#share-buttons").toggleClass('on');
        $(this).hide();
        $('.btn-close').show();
    });
    gSwiper = new Swiper("#gSwiper", {
        autoHeight: true,
        lazy: true,
        allowSlidePrev: false,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        on: {
            activeIndexChange: function() {
                let activeSlide = $(`.swiper-slide:nth-child(${(gSwiper.realIndex+1)})`);
                this.allowSlideNext = !activeSlide.hasClass('slide-end');
                this.allowSlidePrev = !activeSlide.hasClass('slide-start');
            },
            slideChange: ()=>{
                scrollTo(0, 0);
                checkPopoverNAnimation();
            },
            transitionEnd: function () {
            }
        }
    });

    let subSwiper;
    let transition = true;

    $(".subSwiper").each(function(){

        let space = parseInt($(this).data('space'));
        if(!space) space = 0;
        let id = $(this).attr('id');
        let nested = $(this).data('nested') === undefined;

        subSwiper = new Swiper(`#${id}`, {
            slidesPerView: "auto",
            centeredSlides: true,
            spaceBetween: space,
            nested: nested,
            navigation: {
                nextEl: `#${id} .sub-swiper-button-next`,
                prevEl: `#${id} .sub-swiper-button-prev`,
            },
            on: {
                slideChange: (swiper)=>{
                    let sync = $(swiper.el).attr("data-sync-element");
                    if(sync) {
                        $('#'+sync).children().fadeOut(800);
                        $(`#${sync} img:nth-child(${(swiper.activeIndex+1)})`).fadeIn(800);
                    }
                },
                transitionEnd: function () {
                    transition = false;
                },
                transitionStart: function () {
                    transition = true;
                }
            }
        });
    });

    $(".link2subSlide").click(function(){
        $(".link2subSlide").each(function(){
            $(this).attr("src",$(this).data('off'));
        });
        $(this).attr("src",$(this).data('on'));
        let slideNum = parseInt($(this).data("link"));
        let slideOrd = parseInt($(this).data("order"));
        subSwiper.slideTo(slideNum);
    });


    $(".sub2Swiper").each(function(){

        let id = $(this).attr('id');

        let sub2Swiper = new Swiper(`#${id}`, {
            navigation: {
                nextEl: `#${id} .sub2-swiper-button-next`,
                prevEl: `#${id} .sub2-swiper-button-prev`,
            },
            on: {
                transitionEnd: function () {
                    transition = false;
                },
                transitionStart: function () {
                    transition = true;
                }
            }
        });

        $(document).on('click', '.sub2-swiper-button-next.swiper-button-disabled', function(){
            if(!transition && sub2Swiper.activeIndex === sub2Swiper.slides.length - 1) {
                let target = $(this).data('target');
                $(`#${target}`)[0].swiper.slideNext();
                transition = true;
            }
        });

        $(document).on('click', '.sub2-swiper-button-prev.swiper-button-disabled', function(){
            if(!transition && sub2Swiper.activeIndex === 0) {
                let target = $(this).data('target');
                $(`#${target}`)[0].swiper.slidePrev();
                transition = true;
            }
        });
    });


    setTimeout(()=>{
        checkPopoverNAnimation();
    },1200);

    const io = new IntersectionObserver(entries => {
        entries.forEach(entry=>{
            if(entry.intersectionRatio > 0) {
                $("#contact-button-wrapper").addClass('on');
            } else {
                $("#contact-button-wrapper").removeClass('on');
            }
        })
    });
    io.observe(document.querySelector("#copyright"));
});
