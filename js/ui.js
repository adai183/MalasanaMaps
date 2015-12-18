 // Menu Toggle Script
$("#menu-toggle").click(function(e) {
                e.preventDefault();
                $("#wrapper").toggleClass("toggled");
                $("#menu-toggle").toggleClass("active");
            });      