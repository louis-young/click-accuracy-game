/**
 * Click Accuracy Game.
 *
 * @author Louis Young.
 */

class Target {
  constructor() {
    this.x = this.coordinate;
    this.y = this.coordinate;
  }

  get coordinate() {
    const coordinate = Math.ceil(Math.floor(Math.random() * 75) + 0);

    return coordinate;
  }

  get coordinates() {
    const coordinates = {
      x: this.x,
      y: this.y,
    };

    return coordinates;
  }
}

class State {
  static hide() {
    const states = document.querySelectorAll(".state");

    states.forEach((state) => {
      state.classList.remove("state--active");
    });
  }

  static start() {
    State.hide();

    const state = document.querySelector(".state--game");

    state.classList.add("state--active");
  }

  static end() {
    State.hide();

    const state = document.querySelector(".state--results");

    state.classList.add("state--active");
  }
}

const canvas = document.querySelector(".state--game");

class Game {
  constructor(configuration) {
    this.duration = configuration.duration;

    this.speed = 500;

    this.loop = null;

    this.statistics = {
      targets: 0,
      hits: 0,
      clicks: 0,
    };
  }

  get clickAccuracy() {
    const clickAccuracy = Math.round((this.statistics.hits / this.statistics.clicks) * 100) || 0;

    return clickAccuracy;
  }

  get targetAccuracy() {
    const targetAccuracy = Math.round((this.statistics.hits / this.statistics.targets) * 100);

    return targetAccuracy;
  }

  addTarget() {
    const target = new Target();

    const { x, y } = target.coordinates;

    canvas.innerHTML += `<button class='target' style='top:${x}%;left:${y}%'></button>`;

    this.statistics.targets += 1;
  }

  end() {
    State.end();

    clearInterval(this.loop);

    canvas.innerHTML = "";

    const targets = document.querySelector(".statistic__targets");

    targets.textContent = this.statistics.targets;

    const hits = document.querySelector(".statistic__hits");

    hits.textContent = this.statistics.hits;

    const targetAccuracy = document.querySelector(".statistic__target-accuracy");

    targetAccuracy.textContent = this.targetAccuracy;

    const clicks = document.querySelector(".statistic__clicks");

    clicks.textContent = this.statistics.clicks;

    const clickAccuracy = document.querySelector(".statistic__click-accuracy");

    clickAccuracy.textContent = this.clickAccuracy;
  }

  start() {
    State.start();

    this.loop = setInterval(this.addTarget.bind(this), this.speed);

    this.initialise();

    setTimeout(this.end.bind(this), this.duration);
  }

  initialise() {
    canvas.addEventListener("mousedown", (event) => {
      this.statistics.clicks += 1;

      if (!event.target.classList.contains("target")) {
        return;
      }

      event.target.remove();

      this.statistics.hits += 1;
    });
  }
}

const start = document.querySelector(".start");

start.addEventListener("click", () => {
  const configuration = {
    duration: 10000,
  };

  const game = new Game(configuration);

  game.start();
});
