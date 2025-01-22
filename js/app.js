(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    function functions_getHash() {
        if (location.hash) return location.hash.replace("#", "");
    }
    function setHash(hash) {
        hash = hash ? `#${hash}` : window.location.href.split("#")[0];
        history.pushState("", "", hash);
    }
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout((() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout((() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
    };
    function spollers() {
        const spollersArray = document.querySelectorAll("[data-spollers]");
        if (spollersArray.length > 0) {
            document.addEventListener("click", setSpollerAction);
            const spollersRegular = Array.from(spollersArray).filter((function(item, index, self) {
                return !item.dataset.spollers.split(",")[0];
            }));
            if (spollersRegular.length) initSpollers(spollersRegular);
            let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", (function() {
                    initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
            function initSpollers(spollersArray, matchMedia = false) {
                spollersArray.forEach((spollersBlock => {
                    spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                    if (matchMedia.matches || !matchMedia) {
                        spollersBlock.classList.add("_spoller-init");
                        initSpollerBody(spollersBlock);
                    } else {
                        spollersBlock.classList.remove("_spoller-init");
                        initSpollerBody(spollersBlock, false);
                    }
                }));
            }
            function initSpollerBody(spollersBlock, hideSpollerBody = true) {
                let spollerItems = spollersBlock.querySelectorAll("details");
                if (spollerItems.length) spollerItems.forEach((spollerItem => {
                    let spollerTitle = spollerItem.querySelector("summary");
                    if (hideSpollerBody) {
                        spollerTitle.removeAttribute("tabindex");
                        if (!spollerItem.hasAttribute("data-open")) {
                            spollerItem.open = false;
                            spollerTitle.nextElementSibling.hidden = true;
                        } else {
                            spollerTitle.classList.add("_spoller-active");
                            spollerItem.open = true;
                        }
                    } else {
                        spollerTitle.setAttribute("tabindex", "-1");
                        spollerTitle.classList.remove("_spoller-active");
                        spollerItem.open = true;
                        spollerTitle.nextElementSibling.hidden = false;
                    }
                }));
            }
            function setSpollerAction(e) {
                const el = e.target;
                if (el.closest("summary") && el.closest("[data-spollers]")) {
                    e.preventDefault();
                    if (el.closest("[data-spollers]").classList.contains("_spoller-init")) {
                        const spollerTitle = el.closest("summary");
                        const spollerBlock = spollerTitle.closest("details");
                        const spollersBlock = spollerTitle.closest("[data-spollers]");
                        const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
                        const scrollSpoller = spollerBlock.hasAttribute("data-spoller-scroll");
                        const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                        if (!spollersBlock.querySelectorAll("._slide").length) {
                            if (oneSpoller && !spollerBlock.open) hideSpollersBody(spollersBlock);
                            !spollerBlock.open ? spollerBlock.open = true : setTimeout((() => {
                                spollerBlock.open = false;
                            }), spollerSpeed);
                            spollerTitle.classList.toggle("_spoller-active");
                            _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
                            if (scrollSpoller && spollerTitle.classList.contains("_spoller-active")) {
                                const scrollSpollerValue = spollerBlock.dataset.spollerScroll;
                                const scrollSpollerOffset = +scrollSpollerValue ? +scrollSpollerValue : 0;
                                const scrollSpollerNoHeader = spollerBlock.hasAttribute("data-spoller-scroll-noheader") ? document.querySelector(".header").offsetHeight : 0;
                                window.scrollTo({
                                    top: spollerBlock.offsetTop - (scrollSpollerOffset + scrollSpollerNoHeader),
                                    behavior: "smooth"
                                });
                            }
                        }
                    }
                }
                if (!el.closest("[data-spollers]")) {
                    const spollersClose = document.querySelectorAll("[data-spoller-close]");
                    if (spollersClose.length) spollersClose.forEach((spollerClose => {
                        const spollersBlock = spollerClose.closest("[data-spollers]");
                        const spollerCloseBlock = spollerClose.parentNode;
                        if (spollersBlock.classList.contains("_spoller-init")) {
                            const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                            spollerClose.classList.remove("_spoller-active");
                            _slideUp(spollerClose.nextElementSibling, spollerSpeed);
                            setTimeout((() => {
                                spollerCloseBlock.open = false;
                            }), spollerSpeed);
                        }
                    }));
                }
            }
            function hideSpollersBody(spollersBlock) {
                const spollerActiveBlock = spollersBlock.querySelector("details[open]");
                if (spollerActiveBlock && !spollersBlock.querySelectorAll("._slide").length) {
                    const spollerActiveTitle = spollerActiveBlock.querySelector("summary");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                    spollerActiveTitle.classList.remove("_spoller-active");
                    _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
                    setTimeout((() => {
                        spollerActiveBlock.open = false;
                    }), spollerSpeed);
                }
            }
        }
    }
    function tabs() {
        const tabs = document.querySelectorAll("[data-tabs]");
        let tabsActiveHash = [];
        if (tabs.length > 0) {
            const hash = functions_getHash();
            if (hash && hash.startsWith("tab-")) tabsActiveHash = hash.replace("tab-", "").split("-");
            tabs.forEach(((tabsBlock, index) => {
                tabsBlock.classList.add("_tab-init");
                tabsBlock.setAttribute("data-tabs-index", index);
                tabsBlock.addEventListener("click", setTabsAction);
                initTabs(tabsBlock);
            }));
            let mdQueriesArray = dataMediaQueries(tabs, "tabs");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", (function() {
                    setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
        }
        function setTitlePosition(tabsMediaArray, matchMedia) {
            tabsMediaArray.forEach((tabsMediaItem => {
                tabsMediaItem = tabsMediaItem.item;
                let tabsTitles = tabsMediaItem.querySelector("[data-tabs-titles]");
                let tabsTitleItems = tabsMediaItem.querySelectorAll("[data-tabs-title]");
                let tabsContent = tabsMediaItem.querySelector("[data-tabs-body]");
                let tabsContentItems = tabsMediaItem.querySelectorAll("[data-tabs-item]");
                tabsTitleItems = Array.from(tabsTitleItems).filter((item => item.closest("[data-tabs]") === tabsMediaItem));
                tabsContentItems = Array.from(tabsContentItems).filter((item => item.closest("[data-tabs]") === tabsMediaItem));
                tabsContentItems.forEach(((tabsContentItem, index) => {
                    if (matchMedia.matches) {
                        tabsContent.append(tabsTitleItems[index]);
                        tabsContent.append(tabsContentItem);
                        tabsMediaItem.classList.add("_tab-spoller");
                    } else {
                        tabsTitles.append(tabsTitleItems[index]);
                        tabsMediaItem.classList.remove("_tab-spoller");
                    }
                }));
            }));
        }
        function initTabs(tabsBlock) {
            let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-titles]>*");
            let tabsContent = tabsBlock.querySelectorAll("[data-tabs-body]>*");
            const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
            const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;
            if (tabsActiveHashBlock) {
                const tabsActiveTitle = tabsBlock.querySelector("[data-tabs-titles]>._tab-active");
                tabsActiveTitle ? tabsActiveTitle.classList.remove("_tab-active") : null;
            }
            if (tabsContent.length) tabsContent.forEach(((tabsContentItem, index) => {
                tabsTitles[index].setAttribute("data-tabs-title", "");
                tabsContentItem.setAttribute("data-tabs-item", "");
                if (tabsActiveHashBlock && index == tabsActiveHash[1]) tabsTitles[index].classList.add("_tab-active");
                tabsContentItem.hidden = !tabsTitles[index].classList.contains("_tab-active");
            }));
        }
        function setTabsStatus(tabsBlock) {
            let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-title]");
            let tabsContent = tabsBlock.querySelectorAll("[data-tabs-item]");
            const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
            function isTabsAnamate(tabsBlock) {
                if (tabsBlock.hasAttribute("data-tabs-animate")) return tabsBlock.dataset.tabsAnimate > 0 ? Number(tabsBlock.dataset.tabsAnimate) : 500;
            }
            const tabsBlockAnimate = isTabsAnamate(tabsBlock);
            if (tabsContent.length > 0) {
                const isHash = tabsBlock.hasAttribute("data-tabs-hash");
                tabsContent = Array.from(tabsContent).filter((item => item.closest("[data-tabs]") === tabsBlock));
                tabsTitles = Array.from(tabsTitles).filter((item => item.closest("[data-tabs]") === tabsBlock));
                tabsContent.forEach(((tabsContentItem, index) => {
                    if (tabsTitles[index].classList.contains("_tab-active")) {
                        if (tabsBlockAnimate) _slideDown(tabsContentItem, tabsBlockAnimate); else tabsContentItem.hidden = false;
                        if (isHash && !tabsContentItem.closest(".popup")) setHash(`tab-${tabsBlockIndex}-${index}`);
                    } else if (tabsBlockAnimate) _slideUp(tabsContentItem, tabsBlockAnimate); else tabsContentItem.hidden = true;
                }));
            }
        }
        function setTabsAction(e) {
            const el = e.target;
            if (el.closest("[data-tabs-title]")) {
                const tabTitle = el.closest("[data-tabs-title]");
                const tabsBlock = tabTitle.closest("[data-tabs]");
                if (!tabTitle.classList.contains("_tab-active") && !tabsBlock.querySelector("._slide")) {
                    let tabActiveTitle = tabsBlock.querySelectorAll("[data-tabs-title]._tab-active");
                    tabActiveTitle.length ? tabActiveTitle = Array.from(tabActiveTitle).filter((item => item.closest("[data-tabs]") === tabsBlock)) : null;
                    tabActiveTitle.length ? tabActiveTitle[0].classList.remove("_tab-active") : null;
                    tabTitle.classList.add("_tab-active");
                    setTabsStatus(tabsBlock);
                }
                e.preventDefault();
            }
        }
    }
    function showMore() {
        window.addEventListener("load", (function(e) {
            const showMoreBlocks = document.querySelectorAll("[data-showmore]");
            let showMoreBlocksRegular;
            let mdQueriesArray;
            if (showMoreBlocks.length) {
                showMoreBlocksRegular = Array.from(showMoreBlocks).filter((function(item, index, self) {
                    return !item.dataset.showmoreMedia;
                }));
                showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;
                document.addEventListener("click", showMoreActions);
                window.addEventListener("resize", showMoreActions);
                mdQueriesArray = dataMediaQueries(showMoreBlocks, "showmoreMedia");
                if (mdQueriesArray && mdQueriesArray.length) {
                    mdQueriesArray.forEach((mdQueriesItem => {
                        mdQueriesItem.matchMedia.addEventListener("change", (function() {
                            initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                        }));
                    }));
                    initItemsMedia(mdQueriesArray);
                }
            }
            function initItemsMedia(mdQueriesArray) {
                mdQueriesArray.forEach((mdQueriesItem => {
                    initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
            }
            function initItems(showMoreBlocks, matchMedia) {
                showMoreBlocks.forEach((showMoreBlock => {
                    initItem(showMoreBlock, matchMedia);
                }));
            }
            function initItem(showMoreBlock, matchMedia = false) {
                showMoreBlock = matchMedia ? showMoreBlock.item : showMoreBlock;
                let showMoreContent = showMoreBlock.querySelectorAll("[data-showmore-content]");
                let showMoreButton = showMoreBlock.querySelectorAll("[data-showmore-button]");
                showMoreContent = Array.from(showMoreContent).filter((item => item.closest("[data-showmore]") === showMoreBlock))[0];
                showMoreButton = Array.from(showMoreButton).filter((item => item.closest("[data-showmore]") === showMoreBlock))[0];
                const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
                if (matchMedia.matches || !matchMedia) if (hiddenHeight < getOriginalHeight(showMoreContent)) {
                    _slideUp(showMoreContent, 0, showMoreBlock.classList.contains("_showmore-active") ? getOriginalHeight(showMoreContent) : hiddenHeight);
                    showMoreButton.hidden = false;
                } else {
                    _slideDown(showMoreContent, 0, hiddenHeight);
                    showMoreButton.hidden = true;
                } else {
                    _slideDown(showMoreContent, 0, hiddenHeight);
                    showMoreButton.hidden = true;
                }
            }
            function getHeight(showMoreBlock, showMoreContent) {
                let hiddenHeight = 0;
                const showMoreType = showMoreBlock.dataset.showmore ? showMoreBlock.dataset.showmore : "size";
                const rowGap = parseFloat(getComputedStyle(showMoreContent).rowGap) ? parseFloat(getComputedStyle(showMoreContent).rowGap) : 0;
                if (showMoreType === "items") {
                    const showMoreTypeValue = showMoreContent.dataset.showmoreContent ? showMoreContent.dataset.showmoreContent : 3;
                    const showMoreItems = showMoreContent.children;
                    for (let index = 1; index < showMoreItems.length; index++) {
                        const showMoreItem = showMoreItems[index - 1];
                        const marginTop = parseFloat(getComputedStyle(showMoreItem).marginTop) ? parseFloat(getComputedStyle(showMoreItem).marginTop) : 0;
                        const marginBottom = parseFloat(getComputedStyle(showMoreItem).marginBottom) ? parseFloat(getComputedStyle(showMoreItem).marginBottom) : 0;
                        hiddenHeight += showMoreItem.offsetHeight + marginTop;
                        if (index == showMoreTypeValue) break;
                        hiddenHeight += marginBottom;
                    }
                    rowGap ? hiddenHeight += (showMoreTypeValue - 1) * rowGap : null;
                } else {
                    const showMoreTypeValue = showMoreContent.dataset.showmoreContent ? showMoreContent.dataset.showmoreContent : 150;
                    hiddenHeight = showMoreTypeValue;
                }
                return hiddenHeight;
            }
            function getOriginalHeight(showMoreContent) {
                let parentHidden;
                let hiddenHeight = showMoreContent.offsetHeight;
                showMoreContent.style.removeProperty("height");
                if (showMoreContent.closest(`[hidden]`)) {
                    parentHidden = showMoreContent.closest(`[hidden]`);
                    parentHidden.hidden = false;
                }
                let originalHeight = showMoreContent.offsetHeight;
                parentHidden ? parentHidden.hidden = true : null;
                showMoreContent.style.height = `${hiddenHeight}px`;
                return originalHeight;
            }
            function showMoreActions(e) {
                const targetEvent = e.target;
                const targetType = e.type;
                if (targetType === "click") {
                    if (targetEvent.closest("[data-showmore-button]")) {
                        const showMoreButton = targetEvent.closest("[data-showmore-button]");
                        const showMoreBlock = showMoreButton.closest("[data-showmore]");
                        const showMoreContent = showMoreBlock.querySelector("[data-showmore-content]");
                        const showMoreSpeed = showMoreBlock.dataset.showmoreButton ? showMoreBlock.dataset.showmoreButton : "500";
                        const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
                        if (!showMoreContent.classList.contains("_slide")) {
                            showMoreBlock.classList.contains("_showmore-active") ? _slideUp(showMoreContent, showMoreSpeed, hiddenHeight) : _slideDown(showMoreContent, showMoreSpeed, hiddenHeight);
                            showMoreBlock.classList.toggle("_showmore-active");
                        }
                    }
                } else if (targetType === "resize") {
                    showMoreBlocksRegular && showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;
                    mdQueriesArray && mdQueriesArray.length ? initItemsMedia(mdQueriesArray) : null;
                }
            }
        }));
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter((function(item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        }));
        if (media.length) {
            const breakpointsArray = [];
            media.forEach((item => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            }));
            let mdQueries = breakpointsArray.map((function(item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            }));
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach((breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter((function(item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    }));
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia
                    });
                }));
                return mdQueriesArray;
            }
        }
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    jQuery(document).ready((function($) {
        initSwiper();
        initHoverNewsCard();
        initSearch();
        function initSearch() {
            $(".search-btn").click((function() {
                $(".bar").toggleClass("active");
                $(".menu__list").toggleClass("hide");
                $(".header__menu").toggleClass("active");
                $(".header__buttons").toggleClass("active");
                if ($(".bar").hasClass("active")) {
                    $(".bar input").removeAttr("disabled");
                    $(this).removeClass("_icon-MagnifyingGlass-1");
                    $(this).addClass("_icon-X");
                } else {
                    $(".bar input").attr("disabled", "disabled");
                    $(this).addClass("_icon-MagnifyingGlass-1");
                    $(this).removeClass("_icon-X");
                }
                if ($(window).width() <= 1279) $(".header__logo").toggleClass("hide");
            }));
            $(".search-btn-mobile").click((function() {
                $(".bar-mobile").toggleClass("active");
                $(".menu-button").toggleClass("hide");
                $(".header__menu").toggleClass("active");
                $(".header__logo").toggleClass("hide");
                if ($(".bar-mobile").hasClass("active")) {
                    $(".bar-mobile input").removeAttr("disabled");
                    $(this).removeClass("_icon-Search");
                    $(this).addClass("_icon-X");
                } else {
                    $(".bar-mobile input").attr("disabled", "disabled");
                    $(this).addClass("_icon-Search");
                    $(this).removeClass("_icon-X");
                }
            }));
        }
        function initSwiper() {
            new Swiper(".slider-clients", {
                slidesPerView: "auto",
                spaceBetween: 24,
                loop: true,
                speed: 4e3,
                autoplay: {
                    delay: 300,
                    disableOnInteraction: false
                },
                breakpoints: {
                    1280: {
                        spaceBetween: 48
                    }
                }
            });
            new Swiper(".slider-completed", {
                slidesPerView: "auto",
                spaceBetween: 0,
                loop: false,
                scrollbar: {
                    el: ".swiper-scrollbar",
                    draggable: true
                },
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev"
                },
                breakpoints: {
                    1280: {
                        spaceBetween: 0
                    }
                }
            });
            new Swiper(".slider-offers", {
                slidesPerView: "auto",
                initialSlide: 1,
                spaceBetween: 16,
                loop: false,
                scrollbar: {
                    el: ".swiper-scrollbar",
                    draggable: true
                },
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev"
                },
                breakpoints: {
                    1280: {
                        spaceBetween: 24
                    }
                }
            });
            new Swiper(".slider-carousel", {
                slidesPerView: "auto",
                spaceBetween: 16,
                loop: false,
                scrollbar: {
                    el: ".swiper-scrollbar",
                    draggable: true
                },
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev"
                },
                breakpoints: {
                    1280: {
                        spaceBetween: 24
                    }
                }
            });
            new Swiper(".slider-team", {
                slidesPerView: "auto",
                spaceBetween: 16,
                loop: false,
                scrollbar: {
                    el: ".swiper-scrollbar",
                    draggable: true
                },
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev"
                },
                breakpoints: {
                    1280: {
                        spaceBetween: 24
                    }
                }
            });
            new Swiper(".slider-carousel-inner", {
                slidesPerView: 1,
                loop: true,
                speed: 1e3,
                effect: "fade",
                autoplay: {
                    delay: 4e3,
                    disableOnInteraction: false
                },
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true
                },
                breakpoints: {
                    1280: {}
                }
            });
            new Swiper(".slider-hero", {
                slidesPerView: 1,
                spaceBetween: 16,
                effect: "fade",
                loop: true,
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev"
                },
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true
                },
                on: {
                    init: function() {
                        const slide = this.slides[this.activeIndex];
                        this.el.style.backgroundImage = `url(${slide.dataset.background})`;
                        checkSwiperButtons();
                    },
                    slideChange: function() {
                        const slide = this.slides[this.activeIndex];
                        this.el.style.backgroundImage = `url(${slide.dataset.background})`;
                    }
                }
            });
        }
        function initHoverNewsCard() {
            let windowWidth = $(window).width();
            if (windowWidth >= 1280) $(".item-news").hover((function() {
                $(this).find(".item-news__text-holder-js").css("max-height", "158px");
            }), (function() {
                $(this).find(".item-news__text-holder-js").css("max-height", "80px");
            }));
        }
        function checkSwiperButtons() {
            let nextButton = $(".slider-hero .swiper-button-next");
            let prevButton = $(".slider-hero .swiper-button-prev");
            let sliderHero = $(".slider-hero");
            if (nextButton.length && prevButton.length && sliderHero.length) if (nextButton.hasClass("swiper-button-lock") || prevButton.hasClass("swiper-button-lock")) sliderHero.addClass("not-slider"); else sliderHero.removeClass("not-slider");
        }
        $(document).ready(initStableWindowWidth);
        $(window).resize(initStableWindowWidth);
        function initStableWindowWidth() {
            if (window.matchMedia("(min-width: 1280px)").matches) {
                let originalWidth = $(".wrapper").width();
                $("[data-fancybox]").click((function() {
                    $(".wrapper").width(originalWidth);
                    $(".header").width(originalWidth);
                }));
            }
        }
        if ($('[data-fancybox=""]').length > 0) $('[data-fancybox=""]').fancybox({
            autoFocus: false,
            touch: false,
            afterClose: function() {
                $(".wrapper").width("100%");
                $(".header").width("100%");
            }
        });
        $('a[href^="#"]').click((function(e) {
            e.preventDefault();
            let target = $(this.hash);
            if (target.length) {
                let headerHeight = $(".header").outerHeight();
                $("html, body").animate({
                    scrollTop: target.offset().top - headerHeight
                }, 1e3);
            }
        }));
        $(".input-file input[type=file]").on("change", (function() {
            let file = this.files[0];
            if (file) {
                let fileName = file.name;
                if (fileName.length > 25) fileName = fileName.substring(0, 22) + "...";
                $(this).closest(".input-file").find(".input-file-btn").html(fileName);
            }
        }));
    }));
    document.addEventListener("DOMContentLoaded", (function() {
        let acc = document.getElementsByClassName("accordion__title");
        let accClose = document.getElementsByClassName("accordion__close");
        let accCount = document.getElementsByClassName("accordion__count");
        let i;
        function closeAllExcept(activeAcc) {
            for (let j = 0; j < acc.length; j++) if (acc[j] !== activeAcc) {
                acc[j].classList.remove("active");
                acc[j].nextElementSibling.style.maxHeight = null;
                acc[j].closest(".accordion__wrapper").classList.remove("accordion-active");
            }
        }
        for (i = 0; i < acc.length; i++) acc[i].addEventListener("click", toggleAccordion);
        for (i = 0; i < accClose.length; i++) accClose[i].addEventListener("click", toggleAccordion);
        for (i = 0; i < accCount.length; i++) accCount[i].addEventListener("click", (function() {
            toggleAccordion.call(this.parentNode.querySelector(".accordion__title"));
        }));
        function toggleAccordion() {
            let accordionContent = this.classList.contains("accordion__close") ? this.previousElementSibling.querySelector(".accordion__content") : this.nextElementSibling;
            let isOpen = accordionContent.style.maxHeight;
            let accordionWrapper = this.closest(".accordion__wrapper");
            closeAllExcept(accordionWrapper.querySelector(".accordion__title"));
            if (isOpen) {
                accordionWrapper.querySelector(".accordion__title").classList.remove("active");
                accordionContent.style.maxHeight = null;
                accordionWrapper.classList.remove("accordion-active");
            } else {
                accordionWrapper.querySelector(".accordion__title").classList.add("active");
                accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
                accordionWrapper.classList.add("accordion-active");
            }
        }
        const menuButton = document.querySelector(".menu-button");
        const menuButtonIcon = document.querySelector(".menu-button__icon");
        const menuBody = document.querySelector(".menu__body");
        if (menuButton) menuButton.addEventListener("click", (function(e) {
            document.body.classList.toggle("_lock");
            menuButton.classList.toggle("_active");
            menuBody.classList.toggle("_active");
            if (menuButton.classList.contains("_active")) {
                menuButtonIcon.classList.remove("_icon-Menu");
                menuButtonIcon.classList.add("_icon-X");
            } else {
                menuButtonIcon.classList.add("_icon-Menu");
                menuButtonIcon.classList.remove("_icon-X");
            }
            let menuButtonText = menuButton.querySelector("span");
            if (menuButtonText.textContent === "Меню") menuButtonText.textContent = "Закрити"; else menuButtonText.textContent = "Меню";
        }));
        const buttonSubMenu = document.querySelectorAll(".header .spollers__title");
        const subMenus = document.querySelectorAll(".header .submenu");
        if (buttonSubMenu.length > 0) buttonSubMenu.forEach(((button, index) => {
            button.addEventListener("click", (function(e) {
                subMenus.forEach(((menu, menuIndex) => {
                    if (menuIndex !== index) {
                        menu.classList.remove("show");
                        buttonSubMenu[menuIndex].classList.remove("active");
                    }
                }));
                const subMenu = subMenus[index];
                const isActive = subMenu.classList.contains("show");
                subMenu.classList.toggle("show");
                button.classList.toggle("active", !isActive);
            }));
        }));
        document.querySelector(".clear-search-mobile").addEventListener("click", (function() {
            document.querySelector(".search-input-mobile").value = "";
        }));
        document.querySelectorAll(".form__clear-icon").forEach((function(clearIcon) {
            clearIcon.addEventListener("click", (function() {
                let inputParent = this.closest(".form__input-holder");
                let inputField = inputParent ? inputParent.querySelector("input") : null;
                if (inputField) inputField.value = "";
                let textareaParent = this.closest(".form__textarea-holder");
                let textareaField = textareaParent ? textareaParent.querySelector("textarea") : null;
                if (textareaField) textareaField.value = "";
            }));
        }));
        document.querySelectorAll(".clear-search").forEach((function(clearButton) {
            clearButton.addEventListener("click", (function() {
                let parent = this.closest(".bar__input-holder");
                parent.querySelector(".search-input").value = "";
            }));
        }));
        const copyLinkButton = document.getElementById("copyLinkButton");
        if (copyLinkButton) copyLinkButton.addEventListener("click", (event => {
            const urlToCopy = event.currentTarget.getAttribute("data-href");
            const sysInput = document.createElement("input");
            sysInput.value = urlToCopy;
            document.body.appendChild(sysInput);
            sysInput.select();
            document.execCommand("copy");
            document.body.removeChild(sysInput);
        }));
    }));
    window["FLS"] = true;
    isWebp();
    spollers();
    tabs();
    showMore();
})();