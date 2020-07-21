(function () {
    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext("2d");
    const submit = $("#submit");
    const curl = $("#canvasurl");
    const cr = $("#canr");
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";

    let isMouseDown = false;
    let x = 0;
    let y = 0;

    function draw(event) {
        if (!isMouseDown) {
            return;
        } else {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(
                event.clientX - canvas.offsetLeft,
                event.clientY - canvas.offsetTop
            );
            ctx.stroke();
            [x, y] = [
                event.clientX - canvas.offsetLeft,
                event.clientY - canvas.offsetTop,
            ];
            cr.val("yes");
        }
    }

    canvas.addEventListener("mousedown", (event) => {
        isMouseDown = true;
        [x, y] = [
            event.clientX - canvas.offsetLeft,
            event.clientY - canvas.offsetTop,
        ];
    });

    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", () => (isMouseDown = false));
    canvas.addEventListener("mouseout", () => (isMouseDown = false));
    submit.on("mousedown", () => curl.val(canvas.toDataURL()));
})();
