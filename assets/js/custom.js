$(function () {
    imagesProgress(); // 이미지 로딩 소스
    // counter(); // 제거함 (더 이상 필요 없음)

    var dot = $("#dot > ul > li");
    var cont = $("#contents > section");
    var menuBtn = $(".menu-button.wrap");
    var dotNav = $("#dot");

    // ************************************************************
    // 1. Dot 클릭 이벤트
    // ************************************************************
    dot.click(function (e) {
        e.preventDefault();
        var target = $(this);
        var index = target.index();
        var section = cont.eq(index);
        var offset = section.offset().top;
        $("html,body").stop(true, true).animate({ scrollTop: offset }, 1200, "easeInOutExpo");
    });

    // ************************************************************
    // 2. 스크롤 이벤트 (섹션 3,4,5 애니메이션 및 Dot 활성화용)
    // ************************************************************
    var didScroll = false;
    var scrollTimer;

    $(window).scroll(function () {
        didScroll = true;
    });

    // 0.1초마다 스크롤 위치 감지 (성능 최적화)
    scrollTimer = setInterval(function () {
        if (didScroll) {
            didScroll = false;
            checkScrollPosition();
        }
    }, 100);

    // ************************************************************
    // 3. 스크롤 위치에 따른 로직 (여기가 섹션 3,4,5를 제어합니다)
    // ************************************************************
    function checkScrollPosition() {
        var wScroll = $(window).scrollTop();
        var windowHeight = $(window).height();
        
        // --- 3-1. 햄버거 버튼 색상 변경 ---
        const OFFSET_COLOR = 600;
        if (wScroll >= cont.eq(4).offset().top - OFFSET_COLOR) {
            menuBtn.removeClass("show");
        } else if (wScroll >= cont.eq(3).offset().top - OFFSET_COLOR) {
            menuBtn.addClass("show");
        } else if (wScroll >= cont.eq(2).offset().top - OFFSET_COLOR) {
            menuBtn.removeClass("show");
        } else if (wScroll >= cont.eq(1).offset().top - OFFSET_COLOR) {
            menuBtn.addClass("show");
        } else {
            menuBtn.removeClass("show");
        }

        // --- 3-2. Dot 활성화 (Active) ---
        const OFFSET_ACTIVE = 100;
        dot.removeClass("on");
        for (var i = cont.length - 1; i >= 0; i--) {
            if (wScroll >= cont.eq(i).offset().top - OFFSET_ACTIVE) {
                dot.eq(i).addClass("on");
                break;
            }
        }

        // --- 3-3. Dot 텍스트 색상 변경 ---
        dot.each(function () {
            var $li = $(this);
            var $span = $li.find("span");
            var dotTop = ($span.length > 0) ? $span.offset().top + ($span.height() / 2) : $li.offset().top;
            
            var currentSectionIdx = -1;
            cont.each(function (index) {
                var secTop = $(this).offset().top - 10;
                var secBottom = secTop + $(this).outerHeight();
                if (dotTop >= secTop && dotTop < secBottom) {
                    currentSectionIdx = index;
                    return false;
                }
            });

            if (currentSectionIdx === 1 || currentSectionIdx === 3) {
                $li.addClass("dark-text");
            } else {
                $li.removeClass("dark-text");
            }
        });

        // --- 3-4. 섹션별 애니메이션 (여기가 복구되어야 섹션 3,4,5가 나옵니다) ---
        
        // [Sec 2] About (기존 타이틀 등)
        $(".sec2 .strapline").toggleClass("show", wScroll >= $(".sec2 .strapline").offset().top - windowHeight / 1.5);
        $(".sec2 h3").toggleClass("show", wScroll >= $(".sec2 h3").offset().top - windowHeight / 1.5);
        $(".photo img").toggleClass("show", wScroll >= $(".photo img").offset().top - windowHeight / 1.5);
        $(".photo p").toggleClass("show", wScroll >= $(".photo p").offset().top - windowHeight / 1.3);
        // *참고: 기존 .skill-wrap 애니메이션은 아래 IntersectionObserver가 대신하므로 여기선 작동 안 해도 무방함

        // [Sec 3] Portfolio
        var sec3_elements = [
            ".sec3 .strapline", ".sec3 h3",
            ".sec3 .cont_left .s3_img:eq(0)", ".sec3 .cont_left .revealer:eq(0)", ".sec3 .cont_left .s3_text:eq(0)",
            ".sec3 .cont_left .s3_img:eq(1)", ".sec3 .cont_left .revealer:eq(1)", ".sec3 .cont_left .s3_text:eq(1)",
            ".sec3 .cont_left .s3_img:eq(2)", ".sec3 .cont_left .revealer:eq(2)", ".sec3 .cont_left .s3_text:eq(2)",
            ".sec3 .cont_left .s3_img:eq(3)", ".sec3 .cont_left .revealer:eq(3)", ".sec3 .cont_left .s3_text:eq(3)",
            ".sec3 .cont_right .s3_img:eq(0)", ".sec3 .cont_right .revealer:eq(0)", ".sec3 .cont_right .s3_text:eq(0)",
            ".sec3 .cont_right .s3_img:eq(1)", ".sec3 .cont_right .revealer:eq(1)", ".sec3 .cont_right .s3_text:eq(1)",
            ".sec3 .cont_right .s3_img:eq(2)", ".sec3 .cont_right .revealer:eq(2)", ".sec3 .cont_right .s3_text:eq(2)",
            ".sec3 .cont_right .s3_img:eq(4)", ".sec3 .cont_right .revealer:eq(3)", ".sec3 .cont_right .s3_text:eq(3)",
        ];
        $.each(sec3_elements, function(i, selector) {
            var $el = $(selector);
            if ($el.length) {
                var offsetTop = $el.offset().top || 0;
                $el.toggleClass("show", wScroll >= offsetTop - windowHeight / 1.5);
            }
        });

        // [Sec 4] Animation
        $(".sec4 .strapline").toggleClass("show", wScroll >= $(".sec4 .strapline").offset().top - windowHeight / 1);
        $(".sec4 h3").toggleClass("show", wScroll >= $(".sec4 h3").offset().top - windowHeight / 1);
        $(".sec4 .ani_wrap").toggleClass("show", wScroll >= $(".sec4 .ani_wrap").offset().top - windowHeight / 1);

        // [Sec 5] Contact
        $(".sec5 .strapline").toggleClass("show", wScroll >= $(".sec5 .strapline").offset().top - windowHeight / 1);
        $(".sec5 h3").toggleClass("show", wScroll >= $(".sec5 h3").offset().top - windowHeight / 1);
        $(".sec5 .namecard .sp1").toggleClass("show", wScroll >= $(".sec5 .namecard .sp1").offset().top - windowHeight / 1);
        $(".sec5 .namecard .card").toggleClass("show", wScroll >= $(".sec5 .namecard .card").offset().top - windowHeight / 1);
        $(".sec5 .namecard .sp2").toggleClass("show", wScroll >= $(".sec5 .namecard .sp2").offset().top - windowHeight / 1);
    }

    // ************************************************************
    // 4. 일반 앵커 클릭
    // ************************************************************
    $('a[href^="#"]').on("click", function (e) {
        e.preventDefault();
        var target = $($(this).attr("href"));
        if (target.length) {
            $("html, body").stop(true, true).animate({ scrollTop: target.offset().top }, 1200, "easeInOutExpo");
        }
    });

    // ************************************************************
    // 5. [신규] 기술 스택 배지 순차 애니메이션 (반복 실행 수정됨)
    // ************************************************************
    if ('IntersectionObserver' in window) {
        var badgeObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                var badges = entry.target.querySelectorAll('.animate-badge');
                
                if (entry.isIntersecting) {
                    // 화면에 들어왔을 때: 순차적으로 보이기
                    badges.forEach(function(badge, index) {
                        // 이미 보이고 있는 상태가 아닐 때만 타임아웃 설정
                        if (!badge.classList.contains('visible')) {
                            setTimeout(function() {
                                badge.classList.add('visible');
                            }, index * 100); 
                        }
                    });
                } else {
                    // 화면에서 나갔을 때: 클래스 제거 (재진입 시 애니메이션 재실행을 위해)
                    badges.forEach(function(badge) {
                        badge.classList.remove('visible');
                    });
                }
            });
        }, { threshold: 0.2 }); // 20% 보이면 실행

        var skillCategories = document.querySelectorAll('.skill-category');
        if (skillCategories.length > 0) {
            skillCategories.forEach(function(category) {
                badgeObserver.observe(category);
            });
        }
    } else {
        // 구형 브라우저 호환
        $('.animate-badge').addClass('visible');
    }

    // ************************************************************
    // 기타 함수들 (imagesProgress 등)
    // ************************************************************
    function imagesProgress() { 
        var $container = $("#progress"),
            $progressBar = $container.find(".bubble"),
            $progressText = $container.find(".progress-text"),
            imgLoad = imagesLoaded("body"),
            imgTotal = imgLoad.images.length,
            imgLoaded = 0,
            current = 0,
            progressTimer = setInterval(updateProgress, 1000 / 60);

        imgLoad.on("progress", function () {
            imgLoaded++;
        });

        function updateProgress() {
            var target = (imgLoaded / imgTotal) * 100;
            current += (target - current) * 0.1;
            $progressText.text(Math.floor(current) + '%');

            if (current >= 100) {
                clearInterval(progressTimer);
                $progressBar.add($progressText)
                    .delay(500)
                    .animate({ opacity: 0 }, 100, function () {
                        $container.animate({ top: '-110%' }, 1000, 'easeInOutQuint');
                    });
                $("body").addClass("active");
            }
            if (current > 99.98) {
                current = 100;
            }
        }
    }

    // Modal
    $(".close").click(function () {
        $("#modal.modal2").addClass("out");
    });
    $(".ani3").click(function () {
        $("#modal.modal3").removeAttr("class").addClass("one").addClass("modal3");
    });
    $(".close").click(function () {
        $("#modal.modal3").addClass("out");
    });
    $(".ani4").click(function () {
        $("#modal.modal4").removeAttr("class").addClass("one").addClass("modal4");
    });
    $(".close").click(function () {
        $("#modal.modal4").addClass("out");
    });
    $(".ani5").click(function () {
        $("#modal.modal5").removeAttr("class").addClass("one").addClass("modal5");
    });
    $(".close").click(function () {
        $("#modal.modal5").addClass("out");
    });
});