document.addEventListener("DOMContentLoaded", () => {
    //Tabs
    const tabs = document.querySelectorAll(".tabheader__item"),
        tabsContent = document.querySelectorAll(".tabcontent"),
        tabsParent = document.querySelector(".tabheader__items");

    function hideTabContent() {
        tabsContent.forEach((item) => {
            item.classList.add("hide");
            item.classList.remove("show", "fade");
        });

        tabs.forEach((item) => {
            item.classList.remove("tabheader__item_active");
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add("show", "fade");
        tabsContent[i].classList.remove("hide");
        tabs[i].classList.add("tabheader__item_active");
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener("click", (event) => {
        let target = event.target;

        if (target && target.classList.contains("tabheader__item")) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    //Timer

    const deadline = "2020-12-31";

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60)) % 24),
            minutes = Math.floor((t / (1000 * 60)) % 60),
            seconds = Math.floor((t / 1000) % 60);

        return {
            total: t,
            days: days,
            hours: hours,
            minutes: minutes,
            seconds: seconds,
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector("#days"),
            hours = timer.querySelector("#hours"),
            minutes = timer.querySelector("#minutes"),
            seconds = timer.querySelector("#seconds"),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock(".timer", deadline);

    //Modal

    const modalTrigger = document.querySelectorAll("[data-modal]"),
        modal = document.querySelector(".modal"),
        modalCloseBtn = document.querySelector("[data-close]");

    function openModal() {
        modal.classList.add("show");
        modal.classList.remove("hide");
        document.body.style.overflow = "hidden";
        clearTimeout(timerModal);
    }

    modalTrigger.forEach((btn) =>
        btn.addEventListener("click", () => {
            openModal();
        })
    );

    function closeModal() {
        modal.classList.add("hide");
        modal.classList.remove("show");
        document.body.style.overflow = "";
    }

    modalCloseBtn.addEventListener("click", () => {
        closeModal();
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.code === "Escape" && modal.classList.contains("show")) {
            closeModal();
        }
    });

    let timerModal = setTimeout(() => {
        openModal();
    }, 5000);

    function showModalByScroll() {
        if (
            window.pageYOffset + document.documentElement.clientHeight >=
            document.documentElement.scrollHeight
        ) {
            openModal();
            window.removeEventListener("scroll", showModalByScroll);
        }
    }

    window.addEventListener("scroll", showModalByScroll);

    //Створення карточок меню

    let menuField = document.querySelector(".menu__field"),
        container = menuField.querySelector(".container");

    class Menu {
        constructor(urlImage, alt, heading, menuContent, price) {
            this.urlImage = urlImage;
            this.alt = alt;
            this.heading = heading;
            this.menuContent = menuContent;
            this.price = price;
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        createCard() {
            let menuItem = document.createElement("div");
            menuItem.className = "menu__item";
            container.append(menuItem);
            menuItem.innerHTML = `<img src=${this.urlImage} alt=${this.alt}>
             <h3 class="menu__item-subtitle">Меню "${this.heading}"</h3>
             <div class="menu__item-descr">${this.menuContent}</div>
             <div class="menu__item-divider"></div>
             <div class="menu__item-price">
                 <div class="menu__item-cost">Цена:</div>
                 <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
             </div>`;
        }
    }

    new Menu(
        "img/tabs/vegy.jpg",
        "vegy",
        "Фитнес",
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9
    ).createCard();

    //Form

    const forms = document.querySelectorAll("form");

    const message = {
        loading: "Loading",
        success: "Thank you! We will contact",
        failure: "Something went wrong...",
    };

    forms.forEach((item) => {
        postData(item);
    });

    function postData(form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const statusMessage = document.createElement("div");
            statusMessage.classList.add("status");
            statusMessage.textContent = message.loading;
            form.append(statusMessage);

            const request = XMLHttpRequest();
            request.open("POST", "srever.php");

            request.setRequestHeader("Content-type", "multipart/form-data");
            const formData = new FormData(form);

            request.send(formData);

            request.addEventListener("load", () => {
                if (request.status == 200) {
                    console.log(request.response);
                    statusMessage.textContent = message.success;
                } else {
                    statusMessage.textContent = message.failure;
                }
            });
        });
    }

    fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            body: JSON.stringify({
                name: "Alex",
            }),
            headers: {
                "Content-type": "application/json",
            },
        })
        .then((response) => response.json())
        .then((json) => console.log(json));
});