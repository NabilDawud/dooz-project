// Initialize Swipers
document.addEventListener("DOMContentLoaded", function () {

document.querySelectorAll('.swiper-adv').forEach(swiperEl => {
    new Swiper(swiperEl, {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 12,
        watchOverflow: true,
        autoplay: {
            delay: 3500,
            disableOnInteraction: false
        },
        pagination: {
            el: swiperEl.querySelector(".swiper-pagination"),
            clickable: true
        },
        navigation: {
            nextEl: swiperEl.querySelector(".swiper-button-next"),
            prevEl: swiperEl.querySelector(".swiper-button-prev")
        }
    })
});

// Change navbar style on scroll

(() => {
    const header = document.getElementById("doozHeader");
    const SCROLL_POINT = 110;

    const update = () => {
        header.classList.toggle("is-scrolled", window.scrollY >= SCROLL_POINT);
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
})();


(() => {
    const marquee = document.querySelector(".dooz-breaking-ticker__marquee");
    if (!marquee) return;

    const pxPerSecond = 90; // زِدها أسرع، قللها أبطأ
    const width = marquee.scrollWidth / 1; // لأننا مكررين مرتين
    const duration = Math.max(12, Math.round(width / pxPerSecond));

    marquee.style.animationDuration = duration + "s";
})();

//   Hero Swiper
new Swiper(".dooz-hero-swiper", {
    loop: true,
    slidesPerView: 1,
    speed: 650,
    autoplay: {
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
    },
    pagination: {
        el: ".dooz-hero-swiper__pagination",
        clickable: true
    },
    navigation: {
        nextEl: ".dooz-hero-swiper-button-next",
        prevEl: ".dooz-hero-swiper-button-prev"
    },
    // خيار لطيف: سلايد ناعم بدل السحب الحاد
    effect: "slide",
});

// Video Rail Swiper
new Swiper(".js-video-rail", {
    loop: true,
    spaceBetween: 14,

    // ✅ أهم شيء: 4 عناصر
    slidesPerView: 4,

    // ✅ يتحرك "سلايد واحد" كل مرة
    slidesPerGroup: 1,


    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
    },

    speed: 600,
    // 🔹 تفعيل السحب بالماوس
    simulateTouch: true,        // مهم للماوس
    grabCursor: true,           // شكل المؤشر (✋)
    allowTouchMove: true,

    // 🔹 خلي Swiper يلتقط السحب من الكونتينر
    touchEventsTarget: ".dooz-video-rail",

    pagination: {
        el: ".dooz-video-rail__dots",
        clickable: true
    },

    navigation: {
        nextEl: ".dooz-video-rail__btn--next",
        prevEl: ".dooz-video-rail__btn--prev"
    },

    // Responsive: يقلل العناصر على الشاشات الأصغر
    breakpoints: {
        0: { slidesPerView: 1 },
        576: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        992: { slidesPerView: 4 }
    }
});


// ====== 2) عناصر المودال ======
const modal = document.getElementById("calModal");
const modalTitle = document.getElementById("calModalTitle");
const modalBody = document.getElementById("calModalBody");

function openModal(dateStr, items) {
    modalTitle.textContent = `أحداث يوم ${dateStr}`;
    modalBody.innerHTML = items.map(e =>
        `<a class="dooz-cal-modal__item" href="${e.url || "#"}" target="_blank" rel="noopener">${e.title}</a>`
    ).join("");

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

// إغلاق بالضغط على الخلفية أو زر OK
modal.addEventListener("click", (e) => {
    if (e.target?.dataset?.close) closeModal();
});

// ESC
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
});

// Mini Calendar
(() => {
    const calEl = document.querySelector(".dooz-mini-cal");
    const grid = document.getElementById("calGrid");
    const elMonth = document.getElementById("calMonth");
    const elYear = document.getElementById("calYear");

    const prevBtn = document.querySelector(".dooz-mini-cal__nav--prev");
    const nextBtn = document.querySelector(".dooz-mini-cal__nav--next");

    const monthNames = [
        "كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران",
        "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول"
    ];

    const toSatFirstIndex = (jsDay) => (jsDay + 1) % 7;

    const today = new Date();
    let viewY = today.getFullYear();
    let viewM = today.getMonth();

    const EVENTS = {
        "2024-05-24": [
            { title: "فعالية ثقافية في نابلس", url: "#" }
        ],
        "2025-05-12": [
            { title: "مهرجان فني", url: "#" }
        ]
        ,
        "2026-01-11": [
            { title: "فقط للتجربة", url: "#" }
        ]
    };


    function render() {
        elMonth.textContent = monthNames[viewM];
        elYear.textContent = String(viewY);
        grid.innerHTML = "";

        const first = new Date(viewY, viewM, 1);
        const daysInMonth = new Date(viewY, viewM + 1, 0).getDate();
        const startIndex = toSatFirstIndex(first.getDay());

        // كم أسبوع فعليًا؟
        const neededCells = startIndex + daysInMonth;
        const weeksNeeded = Math.ceil(neededCells / 7);
        calEl.dataset.weeks = String(weeksNeeded);

        const totalCells = weeksNeeded * 7;

        for (let i = 0; i < totalCells; i++) {
            const cell = document.createElement("div");
            cell.className = "dooz-mini-cal__day";

            const dayNum = i - startIndex + 1;

            // خلايا فاضية
            if (dayNum < 1 || dayNum > daysInMonth) {
                cell.classList.add("is-empty");
                grid.appendChild(cell);
                continue;
            }

            cell.textContent = dayNum;

            // اليوم الحالي
            if (
                viewY === today.getFullYear() &&
                viewM === today.getMonth() &&
                dayNum === today.getDate()
            ) {
                cell.classList.add("is-today");
            }

            // ====== هنا الجزء المهم للأحداث ======
            const mm = String(viewM + 1).padStart(2, "0");
            const dd = String(dayNum).padStart(2, "0");
            const dateStr = `${viewY}-${mm}-${dd}`;

            if (EVENTS[dateStr]?.length) {
                cell.classList.add("has-event");
                cell.classList.add("is-clickable");

                cell.addEventListener("click", () => {
                    openModal(dateStr, EVENTS[dateStr]);
                });
            }
            // =====================================

            grid.appendChild(cell);
        }
    }

    prevBtn.addEventListener("click", () => {
        viewM--;
        if (viewM < 0) { viewM = 11; viewY--; }
        render();
    });

    nextBtn.addEventListener("click", () => {
        viewM++;
        if (viewM > 11) { viewM = 0; viewY++; }
        render();
    });

    render();
})();

// community swiper

// const heroSwiper = new Swiper(".doozsmallswiperleft", {
//     slidesPerView: 1,
//     spaceBetween: 12,
//     loop: true,
//     speed: 550,
//     autoplay: {
//         delay: 3000,
//         disableOnInteraction: false,
//         pauseOnMouseEnter: true
//     },

//     // Touch
//     simulateTouch: true,
//     grabCursor: true,

//     // Navigation
//     navigation: {
//         nextEl: ".doozsmallswiperleft .swiper-button-next",
//         prevEl: ".doozsmallswiperleft .swiper-button-prev",
//     },

//     // Pagination (قابلة للنقر)
//     pagination: {
//         el: ".doozsmallswiperleft .swiper-pagination",
//         clickable: true,
//     },

//     // (اختياري) تحسينات للأداء
//     preloadImages: false,
//     lazy: true,
//     watchSlidesProgress: true,
// });

document.querySelectorAll(".doozsmallswiperleft").forEach((el) => {
    const slidesCount = el.querySelectorAll(".swiper-slide").length;
    new Swiper(el, {
        slidesPerView: 1,
        spaceBetween: 12,
        loop: slidesCount > 1,
        speed: 550,

        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },

        // Touch
        simulateTouch: true,
        grabCursor: true,

        // ✅ خليها من داخل نفس السوايبر
        navigation: {
            nextEl: el.querySelector(".swiper-button-next"),
            prevEl: el.querySelector(".swiper-button-prev"),
        },

        // ✅ pagination من داخل نفس السوايبر
        pagination: {
            el: el.querySelector(".swiper-pagination"),
            clickable: true,
        },

        preloadImages: false,
        lazy: true,
        watchSlidesProgress: true,
    });
});

// // تغير كلاس ال container-md , px-md-0 إلى container-lg , px-lg-0
// const dooz_main_navbar_toggler = document.querySelector(".dooz-main-navbar .dooz-main-navbar__toggler");
//   const dooz_main_navbar__inner = document.querySelector(".dooz-main-navbar .dooz-main-navbar__inner");

//   dooz_main_navbar_toggler.addEventListener("click", function () {
//     // container
//     dooz_main_navbar__inner.classList.toggle("container-md");
//     dooz_main_navbar__inner.classList.toggle("container-lg");

//     // padding
//     dooz_main_navbar__inner.classList.toggle("px-md-0");
//     dooz_main_navbar__inner.classList.toggle("px-lg-0");
//   })

});