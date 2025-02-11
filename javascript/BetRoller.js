class BetWheel {
    constructor() {
        this.lastActiveItem = null;
    }

    createWheel(items) {
        const wheel = document.querySelector(".wheel");
        wheel.innerHTML = ""; // Clear existing items
        const numItems = items.length;
        const angleStep = 360 / numItems;
        const radius = 80;

        items.forEach((item, i) => {
            const div = document.createElement("div");
            div.textContent = item;
            div.dataset.index = i; // Store index for reference

            const angle = i * angleStep;
            div.style.transform = `perspective(300px) rotate3d(1,0,0,${angle}deg) translate3d(0,0,${radius}px)`;
            wheel.appendChild(div);
        });

        // Set the first item as active by default
        const firstItem = wheel.firstChild;
        if (firstItem) {
            firstItem.classList.add("active");
            this.lastActiveItem = firstItem;
        }
    }

    updateCallButton(value) {
        const callButton = document.getElementById("call-button");
        callButton.textContent = value.toUpperCase() === 'ALL-IN' ? "ALL-IN" : `Call - ${value}`;
        callButton.setAttribute("value", value);
    }

    applyMomentusEffect() {
        $(".wheel").momentus({
            u: 50,
            mass: 1500,
            wheelRatio: -1500,
            mouseRatio: 4,
            onChange: this.handleWheelChange.bind(this)
        });
    }

    handleWheelChange(coords) {
        const numItems = $(".wheel > div").length;
        const angleStep = 360 / numItems;
        let closestItem = null;
        let closestAngle = 9999;

        $(".wheel > div").each(function (i) {
            const angle = -(coords.y / 2) + angleStep * i;
            $(this).css({
                "transform": `perspective(300px) rotate3d(1,0,0,${angle}deg) translate3d(0,0,80px)`
            });

            let diff = Math.abs(angle % 360);
            if (diff < closestAngle) {
                closestAngle = diff;
                closestItem = this;
            }
        });

        // Remove 'active' class from all items
        $(".wheel > div").removeClass("active");

        // Add 'active' class to the closest item
        if (closestItem) {
            $(closestItem).addClass("active");
            this.updateCallButton(closestItem.textContent);
            this.lastActiveItem = closestItem;
        }
    }
}