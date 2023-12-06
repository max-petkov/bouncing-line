class BouncingLine {
  constructor(el, config) {
    this.container = typeof el === "object" ? el : document.querySelector(el);
    this.wrapper = null;
    this.svg = null;
    this.path = null;

    this.width = null;

    this.dir = 0;

    this.intensity = !config.intensity ? 100 : config.intensity; // Add Values between 0 and 100 (Bending Curve OPTION)
    this.area = !config.area ? 40 : config.area; // Add Values between 0 and 100 (Bending Curve OPTION)
    this.color = !config.color ? "#f52e6d" : config.color; // Add Values between 0 and 100 (Bending Curve OPTION)
    this.strokeWidth = !config.strokeWidth ? 2 : config.strokeWidth; // Add Values between 0 and 100 (Bending Curve OPTION)
  }

  setStylesContainer() {
    gsap.set(this.container, {
      position: "relative",
      width: "100%",
    });

    this.width = this.container.offsetWidth;
  }

  createArea() {
    this.container.innerHTML = `<div class="bouncing-area"></div>`;
    this.wrapper = this.container.querySelector(".bouncing-area");

    gsap.set(this.wrapper, {
      height: this.area,
      position: "absolute",
      width: "100%",
      top: 0,
      left: 0,
      y: "-50%"
    });
  }

  createSVG() {
    this.wrapper.innerHTML = `
        <svg>
          <path d="${this.generatePath()}"/>
        </svg>
    `;

    this.svg = this.container.querySelector("svg");
    this.path = this.container.querySelector("path");

    gsap.set(this.svg, {
      position: "absolute",
      width: "100%",
      height: "100%",
      overflow: "visible",
    });

    gsap.set(this.path, {
      fill: "none",
      stroke: this.color,
      strokeWidth: this.strokeWidth,
    });
  }

  generatePath(x, y) {
    x = x || this.width / 2;
    y = y || this.area / 2;

    // Starting path this path -> "M0, 0 Q0, 0, 300, 0"
    return `M0, ${this.area / 2} Q${x},${y} ${this.width},${this.area / 2}`;
  }

  bounce() {
    this.wrapper.addEventListener("mouseenter", function (e) {
        const { top } = this.svg.getBoundingClientRect();
        const y = Math.abs(e.pageY - top);
        this.dir = y > this.area / 2 ? -this.intensity : 0;

        return this.dir;
      }.bind(this)
    );

    this.wrapper.addEventListener("mousemove", function (e) {
        const { left, top } = this.svg.getBoundingClientRect();
        const x = e.pageX - left;
        const y = Math.abs(e.pageY - top);

        // Getting values between 0 and this.intensity(default 100) based on "y" and height
        const percentageY = (y / this.area) * this.intensity;

        // Adding height of the container + adding direction (knowing from where to start bending the curve)
        const sumY = percentageY + this.area / 2 + this.dir;

        gsap.to(this.path, {
          attr: {
            d: this.generatePath(x, sumY),
          },
          overwrite: true,
          duration: 0.2,
        });
      }.bind(this)
    );

    this.wrapper.addEventListener("mouseleave", function () {
        gsap.to(this.path, {
          attr: {
            d: this.generatePath(),
          },
          duration: 2,
          ease: "elastic.out(1, 0.2)",
        });
      }.bind(this)
    );
  }

  resize() {
    let w = window.innerWidth;

    window.addEventListener("resize", function() {

      if(w !== window.innerWidth) {
        w = window.innerWidth;
        this.width = this.container.offsetWidth;
        this.path.setAttribute("d", this.generatePath());
      }

    }.bind(this))
  }

  init() {
    this.setStylesContainer();
    this.createArea();
    this.createSVG();
    this.bounce();
    this.resize();

    console.log("Inpsired by https://hello.cuberto.com/");
  }
}

const line = new BouncingLine("[data-bouncing-line]", {
  strokeWidth: 6,
  intensity: 100,
  area: 100,
});
line.init();