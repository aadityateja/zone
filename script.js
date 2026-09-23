```javascript
/* =========================================================
   DRAVYA / ZONE
   September 2026
========================================================= */


/* =========================================================
   CONFIGURATION
========================================================= */

const PASSWORD = "Dravyaismyfriend@2026";

const STORAGE_KEY = "dravya-zone-september-2026";

const MONTH = 8; // September = 8 because JavaScript months start at 0

const YEAR = 2026;

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


/* =========================================================
   ELEMENTS
========================================================= */

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


/* =========================================================
   STORAGE
========================================================= */

let plannerData = loadData();


function createDefaultData() {

  const data = {
    monthObjective: "",
    weeks: {}
  };

  return data;
}


function loadData() {

  try {

    const saved =
      localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return createDefaultData();
    }

    return JSON.parse(saved);

  } catch (error) {

    console.error(
      "Could not load planner data:",
      error
    );

    return createDefaultData();
  }
}


function saveData() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(plannerData)
  );

  showSaved();
}


function showSaved() {

  saveStatus.textContent = "SAVED ✓";

  clearTimeout(showSaved.timeout);

  showSaved.timeout =
    setTimeout(() => {

      saveStatus.textContent =
        "ALL CHANGES SAVED";

    }, 1200);
}


/* =========================================================
   PASSWORD
========================================================= */

function unlockZone() {

  const enteredPassword =
    passwordInput.value;

  if (enteredPassword === PASSWORD) {

    localStorage.setItem(
      "dravya-zone-authenticated",
      "true"
    );

    lockScreen.classList.add("hidden");

    zone.classList.remove("hidden");

    passwordInput.value = "";

  } else {

    passwordError.classList.add("show");

    passwordInput.value = "";

    setTimeout(() => {

      passwordError.classList.remove("show");

    }, 1800);
  }
}


enterButton.addEventListener(
  "click",
  unlockZone
);


passwordInput.addEventListener(
  "keydown",
  event => {

    if (event.key === "Enter") {
      unlockZone();
    }

  }
);


/* =========================================================
   LOCK
========================================================= */

lockButton.addEventListener(
  "click",
  () => {

    localStorage.removeItem(
      "dravya-zone-authenticated"
    );

    zone.classList.add("hidden");

    lockScreen.classList.remove("hidden");

  }
);


/* =========================================================
   AUTH CHECK
========================================================= */

function checkAuthentication() {

  const authenticated =
    localStorage.getItem(
      "dravya-zone-authenticated"
    );

  if (authenticated === "true") {

    lockScreen.classList.add("hidden");

    zone.classList.remove("hidden");

  }

}


/* =========================================================
   DATE HELPERS
========================================================= */

function getDaysInMonth(
  year,
  month
) {

  return new Date(
    year,
    month + 1,
    0
  ).getDate();

}


function getFirstDay(
  year,
  month
) {

  return new Date(
    year,
    month,
    1
  ).getDay();

}


/* =========================================================
   CREATE DAY DATA
========================================================= */

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


/* =========================================================
   CREATE WEEK DATA
========================================================= */

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


/* =========================================================
   CREATE DAY CARD
========================================================= */

function createDayCard(day) {

  const card =
    document.createElement("article");

  card.className = "day-card";

  const date =
    new Date(
      YEAR,
      MONTH,
      day
    );

  const dayName =
    DAY_NAMES[date.getDay()];

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
        document.createElement("div");

      session.className = "session";

      session.innerHTML = `

        <div class="session-time">
          ${time}
        </div>

        <textarea
          placeholder="PLAN..."
          data-day="${day}"
          data-session="${index}"
        ></textarea>

      `;

      const textarea =
        session.querySelector("textarea");

      textarea.value =
        dayData.sessions[index] || "";

      textarea.addEventListener(
        "input",
        event => {

          const dayNumber =
            Number(
              event.target.dataset.day
            );

          const sessionIndex =
            Number(
              event.target.dataset.session
            );

          const data =
            getDayData(dayNumber);

          data.sessions[sessionIndex] =
            event.target.value;

          saveData();

        }
      );

      card.appendChild(session);

    }
  );


  return card;
}


/* =========================================================
   CREATE WEEK
========================================================= */

function createWeek(
  weekNumber,
  days
) {

  const week =
    document.createElement("section");

  week.className = "week";


  const header =
    document.createElement("div");

  header.className = "week-header";


  const weekData =
    getWeekData(weekNumber);


  header.innerHTML = `

    <div class="week-number">
      WEEK ${String(weekNumber).padStart(2, "0")}
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
    event => {

      plannerData.weeks[
        weekNumber
      ].objective =
        event.target.value;

      saveData();

    }
  );


  week.appendChild(header);


  const grid =
    document.createElement("div");

  grid.className = "days-grid";


  days.forEach(day => {

    if (day === null) {

      const empty =
        document.createElement("div");

      empty.className =
        "day-card empty";

      grid.appendChild(empty);

    } else {

      grid.appendChild(
        createDayCard(day)
      );

    }

  });


  week.appendChild(grid);

  return week;
}


/* =========================================================
   BUILD CALENDAR
========================================================= */

function buildCalendar() {

  calendar.innerHTML = "";

  const daysInMonth =
    getDaysInMonth(
      YEAR,
      MONTH
    );

  const firstDay =
    getFirstDay(
      YEAR,
      MONTH
    );

  let currentDay = 1;

  let weekNumber = 1;


  while (
    currentDay <= daysInMonth
  ) {

    const weekDays = [];


    for (
      let i = 0;
      i < 7;
      i++
    ) {

      /*
        Empty cells before September 1.
      */

      if (
        weekNumber === 1 &&
        i < firstDay
      ) {

        weekDays.push(null);

      } else if (
        currentDay <= daysInMonth
      ) {

        weekDays.push(
          currentDay
        );

        currentDay++;

      } else {

        weekDays.push(null);

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


/* =========================================================
   MONTH OBJECTIVE
========================================================= */

monthObjective.value =
  plannerData.monthObjective || "";


monthObjective.addEventListener(
  "input",
  event => {

    plannerData.monthObjective =
      event.target.value;

    saveData();

  }
);


/* =========================================================
   INITIALIZE
========================================================= */

buildCalendar();

checkAuthentication();
```
