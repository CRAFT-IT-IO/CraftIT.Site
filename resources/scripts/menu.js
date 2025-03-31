$(document).ready(function () {
    const menu = $('.menu');
    const menuItem1 = $('.m-item-1');
    const menuItem2 = $('.m-item-2');
    const menuToggle = $('.toggle-menu, .menu-label'); // Utiliser des éléments spécifiques pour le toggle

    let menuItemHeight = 0;
    let isAnimating = false;
    let closeTimeout;
    let isOpen = false;

    // Initial CSS state
    menuItem1.css({ display: 'none', zIndex: '-1', maxHeight: '0' });
    menuItem2.css({ display: 'none', zIndex: '-1', maxHeight: '0' });

    // Function to calculate height and position
    function updateHeights() {
        const tempClone = menuItem1.clone()
            .css({
                position: 'absolute',
                visibility: 'hidden',
                display: 'block',
                maxHeight: 'none',
                zIndex: '-9999'
            })
            .appendTo(menu);

        menuItemHeight = tempClone.outerHeight();
        tempClone.remove();

        // Recalculate isMobile and extraOffset after window resize
        const isMobile = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
        const extraOffset = window.innerWidth >= 1080 ? 24 : 0;
        menuItem2.css('top', `calc(100% + ${extraOffset}px + ${menuItemHeight}px - 1px)`);
    }

    updateHeights();
    $(window).on('resize', updateHeights);

    // Open animation
    function openMenu() {
        if (isAnimating || isOpen) return;
        isAnimating = true;

        const isMobile = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
        const extraOffset = window.innerWidth >= 1080 ? 24 : 0;

        menuItem1.css({
            zIndex: '-1',
            display: 'block',
            maxHeight: '0',
            overflow: 'hidden'
        });

        setTimeout(() => {
            menuItem1.css('z-index', '2')
                .animate({ maxHeight: menuItemHeight }, 150, () => {

                    menuItem2.css({
                        top: `calc(100% + ${extraOffset}px + ${menuItemHeight}px - 1px)`,
                        zIndex: '-1',
                        display: 'block',
                        maxHeight: '0',
                        overflow: 'hidden'
                    });

                    setTimeout(() => {
                        menuItem2.css('z-index', '2')
                            .animate({ maxHeight: menuItemHeight }, 150, () => {
                                isAnimating = false;
                                isOpen = true;
                            });
                    }, 50);
                });
        }, 50);
    }

    // Close animation
    function closeMenu() {
        if (isAnimating || !isOpen) return;
        isAnimating = true;

        menuItem2.animate({ maxHeight: '0' }, 150, () => {
            menuItem2.css({ display: 'none', zIndex: '-1' });

            menuItem1.animate({ maxHeight: '0' }, 150, () => {
                menuItem1.css({ display: 'none', zIndex: '-1' });
                isAnimating = false;
                isOpen = false;
            });
        });
    }

    const isInitiallyMobile = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    if (!isInitiallyMobile) {
        // Desktop behavior
        menu.on('mouseenter', () => {
            clearTimeout(closeTimeout);
            openMenu();
        });

        menu.on('mouseleave', () => {
            clearTimeout(closeTimeout);
            closeTimeout = setTimeout(closeMenu, 150);
        });
    } else {
        // Mobile behavior - uniquement sur les éléments de toggle
        menuToggle.on('click touchstart', function (e) {
            e.preventDefault();
            e.stopPropagation();
            isOpen ? closeMenu() : openMenu();
        });

        // Ne pas intercepter les clics sur les liens
        $('.menu-items a').on('click touchstart', function(e) {
            // Permettre la navigation normale pour les liens
            e.stopPropagation();
            return true;
        });

        $(document).on('click touchstart', function (e) {
            if (!$(e.target).closest('.menu').length && isOpen && !isAnimating) {
                closeMenu();
            }
        });
    }
});