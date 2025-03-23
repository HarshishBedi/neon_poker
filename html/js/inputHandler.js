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

    const firstItem = wheel.firstChild;
    if (firstItem) {
        firstItem.classList.add("active");
        lastActiveItem = firstItem;
        updateCallButton(firstItem.textContent);
    }
}

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

    const items = [
        "$10", "$20", "$30", "$40", "$50", "$60", "$70", "$80", "$90",
        "$100", "$110", "$120", "$130", "$140", "$150", "$160", "$170",
        "$180", "$190", "$200"
    ];
    window.createWheel(items);

    // ============================================================
    // Bet Roller Code (jQuery Plugin)
    // ============================================================
    jQuery.fn.momentus = function (cfg) {
        var now = Date.now || function () {
            return new Date().valueOf();
        },
            start_point = { x: 0, y: 0 },
            last_point = { x: 0, y: 0 },
            current_coords = { x: 0, y: 0 },
            last_coords = { x: 0, y: 0 },
            velocity = { x: 0, y: 0 },
            last_time = now(),
            inertia_time = last_time,
            mass = cfg.mass || 1000,
            u = cfg.u || 4,
            wheel_ratio = cfg.wheelRatio || 1000,
            mouse_ratio = cfg.mouseRatio || 20,
            touch_ratio = cfg.touchRatio || 1,
            on_change = cfg.onChange || function () { },
            frame_rate = cfg.frameRate || 60;

        function calculateVelocity(e) {
            var time = now(),
                delta_time = time - last_time,
                vel_x =
                    velocity.x +
                    last_coords.x / delta_time / (e.pageX ? mouse_ratio : touch_ratio),
                vel_y =
                    velocity.y +
                    last_coords.y / delta_time / (e.pageY ? mouse_ratio : touch_ratio);
            vel_x = !isNaN(vel_x) ? vel_x : 0;
            vel_y = !isNaN(vel_y) ? vel_y : 0;
            return { x: vel_x, y: vel_y };
        }

        $(this).on("mousedown touchstart", function (e) {
            e.preventDefault();
            var x = e.pageX || e.originalEvent.touches[0].pageX,
                y = e.pageY || e.originalEvent.touches[0].pageY;
            last_coords = { x: 0, y: 0 };
            start_point = { x: x, y: y };
            velocity = { x: 0, y: 0 };
            on_change(current_coords, velocity);

            $("body").on("mousemove touchmove", function (e) {
                e.preventDefault();
                var vel = calculateVelocity(e);
                last_time = now();
                var x = e.pageX || e.originalEvent.touches[0].pageX,
                    y = e.pageY || e.originalEvent.touches[0].pageY,
                    delta_x = x - start_point.x,
                    delta_y = y - start_point.y;
                last_point = start_point;
                start_point = { x: x, y: y };
                last_coords.x = delta_x;
                last_coords.y = delta_y;
                current_coords.x += delta_x;
                current_coords.y += delta_y;
                on_change(current_coords, vel);
            });

            $("body").on("mouseup touchend", function (e) {
                velocity = calculateVelocity(e);
                on_change(current_coords, velocity);
                inertia_time = null;
                $("body").off("mousemove touchmove mouseup touchend");
            });
        });

        $(this).on("wheel mousewheel", function (e) {
            if (velocity.x == 0 && velocity.y == 0) inertia_time = now();
            var delta_x = e.originalEvent.deltaX || 0,
                delta_y = e.originalEvent.deltaY || 0;
            velocity.x -= delta_x / wheel_ratio;
            velocity.y -= delta_y / wheel_ratio;
        });

        (function inertia() {
            velocity.x = !isNaN(velocity.x) ? velocity.x : 0;
            velocity.y = !isNaN(velocity.y) ? velocity.y : 0;

            if (!inertia_time) {
                inertia_time = now();
            } else if (velocity.x != 0 || velocity.y != 0) {
                var time = now(),
                    force_x = velocity.x * u,
                    force_y = velocity.y * u,
                    acc_x = force_x / mass,
                    acc_y = force_y / mass,
                    delta_time = time - inertia_time,
                    vel_x = velocity.x - acc_x * delta_time,
                    vel_y = velocity.y - acc_y * delta_time;
                vel_x = !isNaN(vel_x) ? vel_x : 0;
                vel_y = !isNaN(vel_y) ? vel_y : 0;
                velocity.x = vel_x;
                velocity.y = vel_y;
                var delta_x = vel_x * delta_time,
                    delta_y = vel_y * delta_time;
                last_coords.x = current_coords.x;
                last_coords.y = current_coords.y;
                current_coords.x += delta_x;
                current_coords.y += delta_y;
                inertia_time = time;
                on_change(current_coords, velocity);
            }

            if (window.requestAnimationFrame) {
                requestAnimationFrame(inertia);
            }
        })();
        return this;
    };

    $(".wheel").momentus({
        u: 50,
        mass: 1500,
        wheelRatio: -1500,
        mouseRatio: 4,
        onChange: function (coords, velocity) {
            const numItems = $(".wheel > div").length;
            const angleStep = 360 / numItems;
            let closestItem = null;
            let closestAngle = 9999;

            $(".wheel > div").each(function (i) {
                var angle = -(coords.y / 2) + angleStep * i;
                $(this).css({
                    transform: `perspective(300px) rotate3d(1,0,0,${angle}deg) translate3d(0,0,80px)`
                });
                let diff = Math.abs(angle % 360);
                if (diff < closestAngle) {
                    closestAngle = diff;
                    closestItem = this;
                }
            });

            $(".wheel > div").removeClass("active");

            if (closestItem) {
                $(closestItem).addClass("active");
                if (closestItem !== lastActiveItem) {
                    tickSound.currentTime = 0;
                    tickSound.play().catch(err => console.log("Audio play error:", err));
                    updateCallButton(closestItem.textContent);
                    lastActiveItem = closestItem;
                }
            }
        }
    });
};
