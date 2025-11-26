$(function () {
        imagesProgress(); //이미지 로딩 소스
        counter();
        var dot = $("#dot > ul > li");
        var cont = $("#contents > section");
        var menuBtn = $(".menu-button.wrap");
        var dotNav = $("#dot");
        var dotList = [];
        dot.each(function() {
            dotList.push($(this).attr("id"));
        });
        
        // ************************************************************
        // 1. Dot 클릭 이벤트 최적화: stop(true, true) 적용 (렉 방지)
        // ************************************************************
        dot.click(function (e) {
            e.preventDefault();
            var target = $(this);
            var index = target.index();
            var section = cont.eq(index);
            var offset = section.offset().top; 
            
            // 핵심: 연속 클릭 시 큐에 쌓인 애니메이션을 즉시 멈추고 새 애니메이션 시작
            $("html,body").stop(true, true).animate({ 
                scrollTop: offset 
            }, 1200, "easeInOutExpo");
        });

        // -------------------------------------------------------------
        
        // ************************************************************
        // 2. 스크롤 이벤트 성능 최적화 (Throttling) 환경 설정
        // - 실제 스크롤 로직(checkScrollPosition)을 100ms마다 한 번만 실행되도록 제한
        // ************************************************************
        var didScroll = false;
        var scrollTimer;

        $(window).scroll(function () {
            didScroll = true;
        });

        // 100ms 간격으로 실행
        scrollTimer = setInterval(function() {
            if (didScroll) {
                didScroll = false;
                checkScrollPosition(); 
            }
        }, 100); 
        
        // 스크롤 이벤트 핸들러가 로드될 때 한 번 실행하여 초기 상태 설정
        $(window).triggerHandler('scroll'); 

        // -------------------------------------------------------------
        
        // ************************************************************
        // 3. 무거운 스크롤 감지 로직 통합 함수 (Throttling 대상)
        // ************************************************************
        function checkScrollPosition() {
            var wScroll = $(window).scrollTop();
            const OFFSET_COLOR = 600; // 햄버거 버튼 색상 전환 오프셋
            const OFFSET_ACTIVE = 100; // Dot Active 처리를 위한 오프셋
            // ★ 중요: 대각선 배경 오차 보정값 (CSS top: -83px을 감안)
            const VISUAL_OFFSET = 10; 
            var windowHeight = $(window).height();

            // ------------------------------------------------------------
            // 3-1. 햄버거 버튼 색상 변경 로직
            // ------------------------------------------------------------
            
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


            // ------------------------------------------------------------
            // 3-2. Dot 네비게이션 활성화 처리 (Active Class)
            // ------------------------------------------------------------
            dot.removeClass("on");

            for (var i = cont.length - 1; i >= 0; i--) {
                var sectionTop = cont.eq(i).offset().top - OFFSET_ACTIVE; 

                if (wScroll >= sectionTop) {
                    dot.eq(i).addClass("on");
                    break;
                }
            }
            
            // ------------------------------------------------------------
            // 3-3. 개별 Dot 배경 감지 및 색상 변경 (Span 기준)
            // ------------------------------------------------------------
            
            dotNav.removeClass("light-bg-theme"); 
            dot.removeClass("color-change"); 

            dot.each(function() {
                var $li = $(this);
                var $span = $li.find("span"); 
                
                // span 텍스트의 '중앙' 위치를 기준으로 잡습니다.
                if ($span.length > 0) {
                    var dotTop = $span.offset().top + ($span.height() / 2); 
                } else {
                    var dotTop = $li.offset().top;
                }
                
                var currentSectionIdx = -1;

                cont.each(function(index) {
                    var secTop = $(this).offset().top - VISUAL_OFFSET; 
                    var secBottom = secTop + $(this).outerHeight();

                    if (dotTop >= secTop && dotTop < secBottom) {
                        currentSectionIdx = index;
                        return false;
                    }
                });

                // S2(index 1) 또는 S4(index 3)라면 어두운 텍스트(.dark-text) 적용
                if (currentSectionIdx === 1 || currentSectionIdx === 3) {
                    $li.addClass("dark-text");
                } else {
                    $li.removeClass("dark-text"); 
                }
            });
            
            // ------------------------------------------------------------
            // 3-4. 스크롤 시 섹션 애니메이션 로직
            // ------------------------------------------------------------
            
            // jQuery .eq() 선택자를 사용하는 요소를 미리 배열로 정리 (최적화)
            var sec3_elements = [
                ".sec3 .strapline", ".sec3 h3",
                // Left Column
                ".sec3 .cont_left .s3_img:eq(0)", ".sec3 .cont_left .revealer:eq(0)", ".sec3 .cont_left .s3_text:eq(0)",
                ".sec3 .cont_left .s3_img:eq(1)", ".sec3 .cont_left .revealer:eq(1)", ".sec3 .cont_left .s3_text:eq(1)",
                ".sec3 .cont_left .s3_img:eq(2)", ".sec3 .cont_left .revealer:eq(2)", ".sec3 .cont_left .s3_text:eq(2)",
                ".sec3 .cont_left .s3_img:eq(3)", ".sec3 .cont_left .revealer:eq(3)", ".sec3 .cont_left .s3_text:eq(3)",
                // Right Column
                ".sec3 .cont_right .s3_img:eq(0)", ".sec3 .cont_right .revealer:eq(0)", ".sec3 .cont_right .s3_text:eq(0)",
                ".sec3 .cont_right .s3_img:eq(1)", ".sec3 .cont_right .revealer:eq(1)", ".sec3 .cont_right .s3_text:eq(1)",
                ".sec3 .cont_right .s3_img:eq(2)", ".sec3 .cont_right .revealer:eq(2)", ".sec3 .cont_right .s3_text:eq(2)",
            ];
            
            // sec2 about
            $(".sec2 .strapline").toggleClass("show", wScroll >= $(".sec2 .strapline").offset().top - windowHeight / 1.5);
            $(".sec2 h3").toggleClass("show", wScroll >= $(".sec2 h3").offset().top - windowHeight / 1.5);
            $(".photo img").toggleClass("show", wScroll >= $(".photo img").offset().top - windowHeight / 1.5);
            $(".photo p").toggleClass("show", wScroll >= $(".photo p").offset().top - windowHeight / 1.3);
            $(".sec2 .skill-wrap").toggleClass("show", wScroll >= $(".sec2 .skill-wrap").offset().top - windowHeight / 1.5);

            // sec3 coding (toggleClass로 간결화)
            $.each(sec3_elements, function(i, selector) {
                var $el = $(selector);
                if ($el.length) {
                    // .offset().top이 없으면 애니메이션 스킵
                    var offsetTop = $el.offset().top || 0;
                    $el.toggleClass("show", wScroll >= offsetTop - windowHeight / 1.5);
                }
            });

            // sec4 animation
            $(".sec4 .strapline").toggleClass("show", wScroll >= $(".sec4 .strapline").offset().top - windowHeight / 1);
            $(".sec4 h3").toggleClass("show", wScroll >= $(".sec4 h3").offset().top - windowHeight / 1);
            $(".sec4 .ani_wrap").toggleClass("show", wScroll >= $(".sec4 .ani_wrap").offset().top - windowHeight / 1);

            // sec5 contact
            $(".sec5 .strapline").toggleClass("show", wScroll >= $(".sec5 .strapline").offset().top - windowHeight / 1);
            $(".sec5 h3").toggleClass("show", wScroll >= $(".sec5 h3").offset().top - windowHeight / 1);
            $(".sec5 .namecard .sp1").toggleClass("show", wScroll >= $(".sec5 .namecard .sp1").offset().top - windowHeight / 1);
            $(".sec5 .namecard .card").toggleClass("show", wScroll >= $(".sec5 .namecard .card").offset().top - windowHeight / 1);
            $(".sec5 .namecard .sp2").toggleClass("show", wScroll >= $(".sec5 .namecard .sp2").offset().top - windowHeight / 1);
        }

        // -------------------------------------------------------------

        // ************************************************************
        // 4. 일반 앵커 클릭 이벤트
        // ************************************************************
        $('a[href^="#"]').on("click", function (e) {
            e.preventDefault();
            var target = $($(this).attr("href"));

            if (target.length) {
                // 애니메이션 지속 시간 600ms -> 1200ms로 변경하여 느려진 효과 부여
                $("html, body").stop(true, true).animate({ scrollTop: target.offset().top }, 1200, "easeInOutExpo");
            }
        });


        // counter 함수 (기존 코드 유지)
        function counter() { 
            if ($('.about .count').size()) {
                $c = $('.about .count');

                $c.each(function () {
                    var $this = $(this);
                    $this.data('target', parseInt($this.html()));
                    $this.data('counted', false);
                    $this.html('0');
                });

                // counter 함수 내의 스크롤 이벤트는 Throttling 대상이 아님
                $(window).on('scroll', function () {
                    var speed = 5000;

                    $c.each(function (i) {
                        var $t = $(this);
                        if (!$t.data('counted') && $(window).scrollTop() + $(window).height() >= $t.offset().top) {

                            $t.data('counted', true);

                            $t.animate({
                                dummy: 1
                            }, {
                                duration: speed,
                                step: function (now) {
                                    var $this = $(this);
                                    var val = Math.round($this.data('target') * now);
                                    $this.html(val);
                                },
                                easing: 'easeInOutQuart'
                            });

                            // easy pie
                            $('.pie').easyPieChart({
                                barColor: '#030303',
                                trackColor: '#030303',
                                scaleColor: '#030303',
                                scaleLength: 5,
                                lineWidth: 1,
                                size: 200,
                                lineCap: 'round',
                                animate: { duration: speed, enabled: true }
                            });
                        }
                    });
                }).triggerHandler('scroll');
            }
        }

        // imageProgress 함수 (기존 코드 유지)
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
                    //$container.addClass("progress-complete");
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

        // modal (기존 코드 유지)
        $(".ani1").click(function () {
            $("#modal.modal1").removeAttr("class").addClass("one").addClass("modal1");
        });
        $(".close").click(function () {
            $("#modal.modal1").addClass("out");
        });
        $(".ani2").click(function () {
            $("#modal.modal2").removeAttr("class").addClass("one").addClass("modal2");
        });
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