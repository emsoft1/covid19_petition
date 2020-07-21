(function () {
    let c1 = $("#cy1");
    let c2 = $("#cy2");
    let c3 = $("#cy3");
    let c4 = $("#cy4");
    // console.log(c1);
    function u() {
        c1.css(
            "transform",
            "translate(" +
                (window.innerWidth - 150) +
                "px," +
                (window.innerHeight - 150) +
                "px" +
                ")"
        );
        c2.css(
            "transform",
            "translate(" + (window.innerWidth - 150) + "px," + 0 + "px" + ")"
        );
        c3.css(
            "transform",
            "translate(" + 0 + "px," + (window.innerHeight - 150) + "px" + ")"
        );
        c4.css("transform", "translate(" + 0 + "px," + 0 + "px" + ")");
        console.log("heeeeeellllo");
    }

    setTimeout(() => {
        u();
    }, 500);

    function c1r() {
        setTimeout(() => {
            c1.css(
                "transform",
                "translate(" + randx() + "px," + randy() + "px" + ")"
            );
            c2r();
        }, 3000);
    }
    function c2r() {
        setTimeout(() => {
            c2.css(
                "transform",
                "translate(" + randx() + "px," + randy() + "px" + ")"
            );

            c3r();
        }, 2500);
    }
    function c3r() {
        setTimeout(() => {
            c3.css(
                "transform",
                "translate(" + randx() + "px," + randy() + "px" + ")"
            );

            c4r();
        }, 2700);
    }
    function c4r() {
        setTimeout(() => {
            c4.css(
                "transform",
                "translate(" + randx() + "px," + randy() + "px" + ")"
            );

            c1r();
        }, 3100);
    }

    c1r();
    console.log(randx());

    function randx() {
        return Math.floor(Math.random() * window.innerWidth - 300) + 150;
    }
    function randy() {
        return Math.floor(Math.random() * window.innerHeight - 300) + 150;
    }
})();
