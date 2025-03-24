// Partie menu avec effet accordéon - cartes qui se déplient
$(document).ready(function () {
    let menu = $('.menu');
    let menuItem1 = $('.m-item-1');
    let menuItem2 = $('.m-item-2');
    let menuItemHeight = 0;
    let isFirstClick = true; // Indicateur pour le premier clic
    
    // Initialisation explicite des éléments de menu
    menuItem1.css({
        'display': 'none',
        'z-index': '-1',
        'max-height': '0'
    });
    
    menuItem2.css({
        'display': 'none',
        'z-index': '-1',
        'max-height': '0'
    });
    
    // Fonction pour calculer la hauteur des éléments
    function updateHeights() {
        // Créer un clone temporaire pour mesurer sans affecter le DOM visible
        let tempClone = menuItem1.clone()
            .css({
                'position': 'absolute',
                'visibility': 'hidden',
                'display': 'block',
                'max-height': 'none',
                'z-index': '-9999'
            })
            .appendTo(menu);
        
        menuItemHeight = tempClone.outerHeight();
        tempClone.remove();
    }
    
    // Calculer au chargement
    updateHeights();
    
    menu.on('click', (e) => {
        if (e.target.nodeName == 'A')
            return;
        
        // Gestion spéciale pour le premier clic
        if (isFirstClick) {
            // S'assurer que les éléments sont configurés correctement avant animation
            menuItem1.css({
                'display': 'none',
                'max-height': '0',
                'z-index': '-1'
            });
            
            menuItem2.css({
                'display': 'none',
                'max-height': '0',
                'z-index': '-1'
            });
            
            isFirstClick = false;
        }
        
        menu.toggleClass('show');
        
        if (menu.hasClass('show')) {
            // Premier élément : d'abord régler le z-index puis afficher
            menuItem1.css({
                'z-index': '-1',
                'display': 'block',
                'max-height': '0',
                'overflow': 'hidden'
            });
            
            // Petit délai pour s'assurer que les styles sont appliqués
            setTimeout(function() {
                menuItem1.css('z-index', '2')
                    .animate({
                        'max-height': menuItemHeight
                    }, 300, function() {
                        // Une fois le premier élément déplié, positionner et déplier le second
                        menuItem2.css({
                            'top': `calc(100% + 24px + ${menuItemHeight}px - 1px)`,
                            'z-index': '-1',
                            'display': 'block',
                            'max-height': '0',
                            'overflow': 'hidden'
                        });
                        
                        // Petit délai pour le second élément aussi
                        setTimeout(function() {
                            menuItem2.css('z-index', '2')
                                .animate({
                                    'max-height': menuItemHeight
                                }, 300);
                        }, 50);
                    });
            }, 50);
        } else {
            // Fermer dans l'ordre inverse : d'abord le second élément
            menuItem2.animate({
                'max-height': '0'
            }, 300, function() {
                menuItem2.css({
                    'display': 'none',
                    'z-index': '-1'
                });
                
                // Puis le premier élément
                menuItem1.animate({
                    'max-height': '0'
                }, 300, function() {
                    menuItem1.css({
                        'display': 'none',
                        'z-index': '-1'
                    });
                });
            });
        }
        
        e.preventDefault();
        e.stopPropagation();
    });
    
    $(window).resize(updateHeights);
});

// SCROLL

document.addEventListener('scroll', function () {
	let header = document.querySelector('header');
	if (window.scrollY > 0) {
		header.classList.add('is-scrolling');
	} else {
		header.classList.remove('is-scrolling');
	}
});

document.addEventListener("DOMContentLoaded", () => {
	const header = document.querySelector("header");
	const containers = document.querySelectorAll("[data-bg]"); // Sélectionner tous les éléments avec data-bg
  
	const observer = new IntersectionObserver(
	  (entries) => {
		entries.forEach((entry) => {
		  if (entry.isIntersecting) {
			const bgColor = entry.target.getAttribute("data-bg");
			header.style.backgroundColor = bgColor; 
		  }
		});
	  },
	  {
		threshold: [0, 1], 
	  }
	);
  
	containers.forEach((container) => observer.observe(container));
  });
  
  