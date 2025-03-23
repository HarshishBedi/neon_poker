// ============================================================
// Input Handling & Event Listeners
// ============================================================

// Create the bet-roller wheel
window.createWheel = function (items) {
    const wheel = document.querySelector(".wheel");
    wheel.innerHTML = "";
    const numItems = items.length;
    const angleStep = 360 / numItems;
    const radius = 80;

    items.forEach((item, i) => {
        const div = document.createElement("div");
        div.textContent = item;
        div.dataset.index = i;
        const angle = i * angleStep;
        div.style.transform = `perspective(300px) rotate3d(1,0,0,${angle}deg) translate3d(0,0,${radius}px)`;
        wheel.appendChild(div);
    });

    if (wheel.firstChild) wheel.firstChild.classList.add("active");
};

window.initInputHandlers = function () {
    // Betting controls
    document.getElementById("fold-button").addEventListener("click", window.fold);
    document.getElementById("call-button").addEventListener("click", window.placeBet);

    // Use Joker (Glitch card)
    const useJokerButton = document.getElementById("use-joker-button");
    if (useJokerButton) {
        useJokerButton.addEventListener("click", () => {
            const player = window.currentPlayer;
            if ((player === 1 && window.player1Cards.includes("GLITCH")) || (player === 2 && window.player2Cards.includes("GLITCH"))) {
                window.useGlitch(player);
            } else {
                alert("No Joker card available!");
            }
        });
    }

    // Initialize bet roller wheel
    const items = [
        "$10", "$20", "$30", "$40", "$50", "$60", "$70", "$80", "$90",
        "$100", "$110", "$120", "$130", "$140", "$150", "$160", "$170",
        "$180", "$190", "$200"
    ];
    window.createWheel(items);

    // jQuery momentus plugin for wheel inertia
    jQuery.fn.momentus = function (cfg) {
        var now = Date.now || (() => new Date().valueOf());
        var start_point = { x: 0, y: 0 }, last_coords = { x: 0, y: 0 }, velocity = { x: 0, y: 0 };
        var last_time = now(), inertia_time = last_time;
        var mass = cfg.mass || 1000, u = cfg.u || 4;
        var wheel_ratio = cfg.wheelRatio || 1000, mouse_ratio = cfg.mouseRatio || 20;
        var on_change = cfg.onChange || function () { };

        function calculateVelocity(e) {
            var time = now(), delta = time - last_time;
            var vel_x = (last_coords.x / delta) / (e.pageX ? mouse_ratio : 1);
            return { x: vel_x, y: 0 };
        }

        $(this).on("mousedown touchstart", function (e) {
            e.preventDefault();
            var startX = e.pageX || e.originalEvent.touches[0].pageX;
            last_coords = { x: 0, y: 0 };
            $(document).on("mousemove touchmove", function (e) {
                e.preventDefault();
                var x = e.pageX || e.originalEvent.touches[0].pageX;
                var deltaX = x - startX;
                last_coords.x = deltaX;
                startX = x;
                on_change({ x: deltaX, y: 0 }, velocity);
            }).on("mouseup touchend", function () {
                $(document).off("mousemove touchmove mouseup touchend");
            });
        });

        return this;
    };

    // Attach momentus to wheel element
    $(".wheel").momentus({ u: 50, mass: 1500, wheelRatio: -1500, mouseRatio: 4, onChange: (coords) => window.updateCallButton($(".wheel > div.active").text()) });
};
