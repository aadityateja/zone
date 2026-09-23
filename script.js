document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     CONFIG
  ===================================================== */

  const PASSWORD = "Dravyaismyfriend@2026";

  const STORAGE_KEY =
    "dravya-zone-september-2026";

  const AUTH_KEY =
    "dravya-zone-authenticated";


  /* =====================================================
     ELEMENTS
  ===================================================== */

  const lockScreen =
    document.getElementById("lock-screen");

  const zone =
    document.getElementById("zone");

  const passwordInput =
    document.getElementById("password-input");

  const enterButton =
    document.getElementById("enter-button");

  const passwordError =
    document.getElementById("password-error");

  const lockButton =
    document.getElementById("lock-button");

  const calendar =
    document.getElementById("calendar");

  const monthObjective =
    document.getElementById("month-objective");

  const saveStatus =
    document.getElementById("save-status");


  /* =====================================================
     MONTH SETTINGS
  ===================================================== */

  const YEAR = 2026;

  // JavaScript: January = 0
  // September = 8
  const MONTH = 8;

  const SESSION_TIMES = [
    "10:30 — 1:30",
    "2:00 — 5:00",
    "5:00 — 7:00"
  ];

  const DAY_NAMES = [
    "SUN",
    "MON",
    "TUE",
    "WED",
    "THU",
    "FRI",
    "SAT"
  ];


  /* =====================================================
     LOAD DATA
  ===================================================== */

  let plannerData = {
    monthObjective: "",
    weeks: {},
    days: {}
  };


  try {

    const saved =
      localStorage.getItem(STORAGE_KEY);

    if (saved) {
      plannerData =
        JSON.parse(saved);
    }

  } catch (error) {

    console.error(
      "Could not load saved planner data:",
      error
    );

  }


  /* =====================================================
     SAVE
  ===================================================== */

  function saveData() {

    try {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(plannerData)
      );

      saveStatus.textContent =
        "SAVED ✓";

      clearTimeout(
        saveData.timeout
      );

      saveData.timeout =
        setTimeout(() => {

          saveStatus.textContent =
            "ALL CHANGES SAVED";

        }, 1200);

    } catch (error) {

      console.error(
        "Could not save planner:",
        error
      );

      saveStatus.textContent =
        "SAVE ERROR";

    }

  }


  /* =====================================================
     PASSWORD AUTHENTICATION
  ===================================================== */

  function unlock() {

    const entered =
      passwordInput.value.trim();


    console.log(
      "Password entered. Checking..."
    );


    if (entered === PASSWORD) {

      console.log(
        "PASSWORD CORRECT"
      );


      try {

        localStorage.setItem(
          AUTH_KEY,
          "true"
        );

      } catch (error) {

        console.warn(
          "Could not save authentication state.",
          error
        );

      }


      lockScreen.classList.add(
        "hidden"
      );

      zone.classList.remove(
        "hidden"
      );

      passwordInput.value = "";

      passwordError.classList.remove(
        "show"
      );


      /*
        Make sure the planner is visible
        immediately.
      */

      window.scrollTo(
        0,
        0
      );


    } else {

      console.log(
        "PASSWORD INCORRECT"
      );


      passwordError.classList.add(
        "show"
      );

      passwordInput.value = "";

      passwordInput.focus();


      setTimeout(() => {

        passwordError.classList.remove(
          "show"
        );

      }, 1800);

    }

  }


  /* =====================================================
     ENTER BUTTON
  ===================================================== */

  enterButton.addEventListener(
    "click",
    unlock
  );


  /* =====================================================
     ENTER KEY
  ===================================================== */

  passwordInput.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "Enter") {

        event.preventDefault();

        unlock();

      }

    }
  );


  /* =====================================================
     LOCK BUTTON
  ===================================================== */

  lockButton.addEventListener(
    "click",
    () => {

      localStorage.removeItem(
        AUTH_KEY
      );

      zone.classList.add(
        "hidden"
      );

      lockScreen.classList.remove(
        "hidden"
      );

      passwordInput.value = "";

      passwordInput.focus();

    }
  );


  /* =====================================================
     AUTH CHECK
  ===================================================== */

  function checkAuthentication() {

    try {

      const authenticated =
        localStorage.getItem(
          AUTH_KEY
        );


      if (authenticated === "true") {

        lockScreen.classList.add(
          "hidden"
        );

        zone.classList.remove(
          "hidden"
        );

      }

    } catch (error) {

      console.warn(
        "Authentication state unavailable.",
        error
      );

    }

  }


  /* =====================================================
     DATE HELPERS
  ===================================================== */

  function daysInMonth() {

    return new Date(
      YEAR,
      MONTH + 1,
      0
    ).getDate();

  }


  function firstDayOfMonth() {

    return new Date(
      YEAR,
      MONTH,
      1
    ).getDay();

  }


  /* =====================================================
     DAY DATA
  ===================================================== */

  function getDayData(day) {

    if (!plannerData.days) {
      plannerData.days = {};
    }


    if (!plannerData.days[day]) {

      plannerData.days[day] = {

        sessions: [
          "",
          "",
          ""
        ]

      };

    }


    return plannerData.days[day];

  }


  /* =====================================================
     WEEK DATA
  ===================================================== */

  function getWeekData(weekNumber) {

    if (!plannerData.weeks) {
      plannerData.weeks = {};
    }


    if (!plannerData.weeks[weekNumber]) {

      plannerData.weeks[weekNumber] = {

        objective: ""

      };

    }


    return plannerData.weeks[weekNumber];

  }


  /* =====================================================
     DAY CARD
  ===================================================== */

  function createDayCard(day) {

    const card =
      document.createElement("article");

    card.className =
      "day-card";


    const date =
      new Date(
        YEAR,
        MONTH,
        day
      );


    const dayName =
      DAY_NAMES[
        date.getDay()
      ];


    const dayData =
      getDayData(day);


    card.innerHTML = `

      <div class="day-header">

        <div class="day-name">
          ${dayName}
        </div>

        <div class="day-number">
          ${day}
        </div>

      </div>

    `;


    SESSION_TIMES.forEach(
      (time, index) => {

        const session =
          document.createElement(
            "div"
          );

        session.className =
          "session";


        session.innerHTML = `

          <div class="session-time">
            ${time}
          </div>

          <textarea
            placeholder="PLAN..."
          ></textarea>

        `;


        const textarea =
          session.querySelector(
            "textarea"
          );


        textarea.value =
          dayData.sessions[index] || "";


        textarea.addEventListener(
          "input",
          () => {

            dayData.sessions[index] =
              textarea.value;

            saveData();

          }
        );


        card.appendChild(
          session
        );

      }
    );


    return card;

  }


  /* =====================================================
     WEEK
  ===================================================== */

  function createWeek(
    weekNumber,
    days
  ) {

    const week =
      document.createElement(
        "section"
      );

    week.className =
      "week";


    const header =
      document.createElement(
        "div"
      );

    header.className =
      "week-header";


    const weekData =
      getWeekData(
        weekNumber
      );


    header.innerHTML = `

      <div class="week-number">
        WEEK ${String(
          weekNumber
        ).padStart(2, "0")}
      </div>

      <textarea
        class="week-objective"
        placeholder="Write this week's motto / objective..."
      ></textarea>

    `;


    const objective =
      header.querySelector(
        ".week-objective"
      );


    objective.value =
      weekData.objective || "";


    objective.addEventListener(
      "input",
      () => {

        weekData.objective =
          objective.value;

        saveData();

      }
    );


    week.appendChild(
      header
    );


    const grid =
      document.createElement(
        "div"
      );

    grid.className =
      "days-grid";


    days.forEach(
      day => {

        if (day === null) {

          const empty =
            document.createElement(
              "div"
            );

          empty.className =
            "day-card empty";

          grid.appendChild(
            empty
          );

        } else {

          grid.appendChild(
            createDayCard(day)
          );

        }

      }
    );


    week.appendChild(
      grid
    );


    return week;

  }


  /* =====================================================
     BUILD CALENDAR
  ===================================================== */

  function buildCalendar() {

    calendar.innerHTML = "";


    const totalDays =
      daysInMonth();


    const firstDay =
      firstDayOfMonth();


    let currentDay = 1;

    let weekNumber = 1;


    while (
      currentDay <= totalDays
    ) {

      const weekDays = [];


      for (
        let column = 0;
        column < 7;
        column++
      ) {

        /*
          Empty cells before
          September 1.
        */

        if (
          weekNumber === 1 &&
          column < firstDay
        ) {

          weekDays.push(
            null
          );

        }

        /*
          September dates.
        */

        else if (
          currentDay <= totalDays
        ) {

          weekDays.push(
            currentDay
          );

          currentDay++;

        }

        /*
          Empty cells after
          September 30.
        */

        else {

          weekDays.push(
            null
          );

        }

      }


      calendar.appendChild(
        createWeek(
          weekNumber,
          weekDays
        )
      );


      weekNumber++;

    }

  }


  /* =====================================================
     MONTH OBJECTIVE
  ===================================================== */

  monthObjective.value =
    plannerData.monthObjective || "";


  monthObjective.addEventListener(
    "input",
    () => {

      plannerData.monthObjective =
        monthObjective.value;

      saveData();

    }
  );


  /* =====================================================
     START
  ===================================================== */

  buildCalendar();

  checkAuthentication();


  console.log(
    "DRAVYA / ZONE initialized successfully."
  );

});

