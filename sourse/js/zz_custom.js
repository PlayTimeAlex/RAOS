var $jsWidth, $newsContainer, $wrap, $bMobilenav, $jsAcademicContainer, scrollbarWidth;

(function($) {
    $(document).ready(function(){
        $newsContainer = $('.js-news');
        $jsAcademicContainer = $('.js-academic_container');
        $('body').append('<div class="js-width" />');
        $jsWidth = $('.js-width');
        scrollbarWidth = $.getScrollbarWidth();


        if($newsContainer.length){
            news_brakepoints();
        }

        if($jsAcademicContainer.length){
            academicBreacepoints();
        }


        $(window).resize(function(){
            if($newsContainer.length){
                news_brakepoints();
            }
        });

        $wrap = $('.wrap');
        $bMobilenav = $('.b-mobilenav');

        $('.js-open-menu').click(function(){
            if($bMobilenav.hasClass('open')){
                $bMobilenav.removeClass('open');
                $wrap.removeClass('menu-open');
                console.log('close');
            } else {
                $bMobilenav.addClass('open');
                $wrap.addClass('menu-open');
                console.log('open');
            }

        });

        $('.js-close-menu').click(function(){
            $bMobilenav.removeClass('open');
            $wrap.removeClass('menu-open');
        });

        $('.js-styler').styler({
            onFormStyled: function(){
                $('select.b-tbar__sort').change(function(){
                    var tt = $(this).val();
                    window.location.href = tt;
                });
            }
        });

        var $jsPopupContent = $('.js-popup-content');
        if($jsPopupContent.length){
            $('body').append('<div class="b-modal b-modal_hide"><div class="b-modal__cont" style="padding-right:'+scrollbarWidth+'px;"><div class="aconteiner"><a class="b-modal__arrow b-modal__arrow_prev" href=""></a><a class="b-modal__arrow b-modal__arrow_next" href=""></a></div></div><div class="b-modal__content"><div class="loaded-content"></div><button class="b-modal__close" title="Закрыть"></button></div></div>');
        }
        $('.js-popup-content').click(function(e){
            e.preventDefault();
            var url = $(this).attr('href');

            $.ajax({
                url: url,
                beforeSend: function(){
                    $('body').addClass('open-popup').css("paddingRight", scrollbarWidth);
                    $('.b-header').css("paddingRight", scrollbarWidth);
                    $('.b-modal').addClass('loading').css('display', 'block').stop().animate({
                        opacity: 1
                    }, 300);
                },
                success: function(result){
                    $('.b-modal').removeClass('loading');
                    $(".loaded-content").html(result).stop().animate({
                        opacity: 1
                    }, 300);

                },
                error: function(){
                    alert("Ошибка загрузки контента.");
                    popup_close();
                }
            });
        });

        $('body').on('click', '.b-modal__arrow', function(e){
            e.preventDefault();
            var url = $(this).attr('href');

            $.ajax({
                url: url,
                beforeSend: function(){
                    $('.b-modal').addClass('loading');
                    $(".loaded-content").stop().animate({
                        opacity: 0
                    }, 300);
                    $('.b-modal__arrow_prev, .b-modal__arrow_next').css("opacity","0");
                },
                success: function(result){
                    $('.b-modal').removeClass('loading');
                    $(".loaded-content").html(result).stop().animate({
                        opacity: 1
                    }, 300);
                    $('.b-modal__arrow_prev, .b-modal__arrow_next').css("opacity","1");
                },
                error: function(){
                    alert("Ошибка загрузки контента.");
                    popup_close();
                }
            });
        });
        $('body').on('click', '.b-modal', function(e){
            if( e.target !== this )
                return;
            popup_close();
        });
        $('body').on('click', '.b-modal__close', function(){
            popup_close();
        });


        //Переключение новостей
        var $jsNewsCat = $('.js-news-cat');

        $jsNewsCat.click(function(e){
            e.preventDefault();
            var $link = $(this);
            $.ajax({
                url: $link.attr('href'),
                beforeSend: function () {
                    $newsContainer.stop().animate({
                        opacity: 0
                    }, 200);
                },
                success: function (result) {
                    setTimeout(function(){
                        $jsNewsCat.removeClass('current');
                        $link.addClass('current');
                        $newsContainer.html(result).stop().animate({
                            opacity: 1
                        }, 300);
                    }, 210);
                },
                error: function () {
                    $newsContainer.html('<div style="font-size:20px;">Пожалуйста обновите страницу</div>');
                    alert('Ошибка загрузки');
                }
            });
        });

    });

    $(window).load(function() {
        var $promoSlider = $('.b-main__slider').flexslider({
            controlNav: false,
            directionNav: false,
            smoothHeight: true,
            start: function(slider){
                slider.css("backgroundImage","none");
            }
        });
        $('.js-flex-prev').click(function(){
            $promoSlider.flexslider("prev");
        });
        $('.js-flex-next').click(function(){
            $promoSlider.flexslider("next");
        });

        $('.b-partners').flexslider({
            animation: "slide",
            animationLoop: false,
            itemWidth: 230,
            itemMargin: 0,
            minItems: 1,
            maxItems: 5,
            directionNav: false
        });

        var wow = new WOW();
        wow.init();

        $('.wow[data-wow-delay]').each(function(){
            $(this).css('transitionDelay', $(this).data('wow-delay'));
        });
    });
}(jQuery));

function news_brakepoints(){
    var width = parseInt($jsWidth.css('width'));
    $newsContainer.children('.pr-breakepoint').remove();

    if(width >= 992){
        $newsCols = $newsContainer.find('.js-news__col:nth-child(4n)');
        $newsCols.after('<div class="pr-breakepoint" />');
        return;
    } else if(width >= 768){
        $newsCols = $newsContainer.find('.js-news__col:nth-child(3n)');
        $newsCols.after('<div class="pr-breakepoint" />');
                return;
    }
}

function academicBreacepoints(){
    var $phone = $jsAcademicContainer.find('.js-academic_col:nth-child(2n)'),
        $tablet = $jsAcademicContainer.find('.js-academic_col:nth-child(3n)'),
        $desctop = $jsAcademicContainer.find('.js-academic_col:nth-child(4n)');

    $phone.after('<div class="breakepoint_phone" />');
    $tablet.after('<div class="breakepoint_tablet" />');
    $desctop.after('<div class="breakepoint_desctop" />');

}

function popup_close(){
    $(".b-modal__content").animate({
        opacity: 0
    }, 300, function(){
        var $content = $(this);
        $('.b-modal').animate({
            opacity: 0
        }, 100, function(){
            $(this).css('display', 'none');
            $('body').removeClass('open-popup').css("paddingRight", 0);
            $('.b-header').css("paddingRight", 0);
            $content.css("opacity", 1).children('.loaded-content').html('');
            $(this).children('.b-modal__arrow').css('opacity', 0);
        });

    });
}