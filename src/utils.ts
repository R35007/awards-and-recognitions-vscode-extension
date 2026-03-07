import { darkGradients, messages } from "./constants";

export function getRandomMessage() {
  return messages[Math.floor(Math.random() * messages.length)];
}

export function getRandomDarkStyle() {
  return { background: darkGradients[Math.floor(Math.random() * darkGradients.length)] };
}

export function getConfettiScript(style: string, count: number): string {
  const scripts: { [key: string]: string } = {
    cannon: `
        function fire() {
          confetti({
            particleCount: Math.max(1, ${count}),
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      `,
    fireworks: `
        function fire() {
          var duration = 1500;
          var animationEnd = Date.now() + duration;
          var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
          var total = Math.max(1, ${count});
          var remaining = total;

          function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
          }

          var interval = setInterval(function() {
            var timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0 || remaining <= 0) {
              clearInterval(interval);
              return;
            }

            var ticksLeft = Math.max(1, Math.ceil(timeLeft / 250));
            var perSide = Math.max(1, Math.ceil(remaining / (ticksLeft * 2)));

            var leftCount = Math.min(remaining, perSide);
            remaining -= leftCount;

            var rightCount = Math.min(remaining, perSide);
            remaining -= rightCount;

            if (leftCount > 0) {
              confetti({ ...defaults, particleCount: leftCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            }
            if (rightCount > 0) {
              confetti({ ...defaults, particleCount: rightCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }
          }, 250);
        }
      `,
    snow: `
        function fire() {
          var duration = 2000;
          var animationEnd = Date.now() + duration;
          var skew = 1;
          var total = Math.max(1, ${count});
          var remaining = total;

          function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
          }

          (function frame() {
            var timeLeft = animationEnd - Date.now();
            var ticks = Math.max(200, 500 * (timeLeft / duration));
            skew = Math.max(0.8, skew - 0.001);

            if (timeLeft <= 0 || remaining <= 0) {
              return;
            }

            var frameCount = Math.min(remaining, Math.max(1, Math.ceil(total / 60)));
            remaining -= frameCount;

            confetti({
              particleCount: frameCount,
              startVelocity: 0,
              ticks: ticks,
              origin: { x: Math.random(), y: (Math.random() * skew) - 0.2 },
              colors: ["#ffffff"],
              shapes: ["circle"],
              gravity: randomInRange(0.4, 0.6),
              scalar: randomInRange(0.4, 1),
              drift: randomInRange(-0.4, 0.4),
            });

            if (timeLeft > 0 && remaining > 0) {
              requestAnimationFrame(frame);
            }
          })();
        }
      `,
    stars: `
        function fire() {
          var defaults = {
            spread: 360,
            ticks: 50,
            gravity: 0,
            decay: 0.94,
            startVelocity: 30,
            colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
          };

          var total = Math.max(1, ${count});
          var remaining = total;
          var rounds = 3;

          function shoot() {
            if (remaining <= 0) {
              return;
            }

            var roundCount = Math.min(remaining, Math.max(1, Math.ceil(total / rounds)));
            remaining -= roundCount;

            var starCount = Math.max(1, Math.ceil(roundCount * 0.8));
            var circleCount = Math.max(0, roundCount - starCount);

            confetti({ ...defaults, particleCount: starCount, scalar: 1.2, shapes: ["star"] });
            if (circleCount > 0) {
              confetti({ ...defaults, particleCount: circleCount, scalar: 0.75, shapes: ["circle"] });
            }
          }

          setTimeout(shoot, 0);
          setTimeout(shoot, 100);
          setTimeout(shoot, 200);
        }
      `,
    emoji: `
        function fire() {
          var scalar = 2;
          var party = confetti.shapeFromText({ text: "\uD83C\uDF89", scalar: scalar });
          var defaults = {
            spread: 360,
            ticks: 60,
            gravity: 0,
            decay: 0.96,
            startVelocity: 20,
            shapes: [party],
            scalar: scalar,
          };

          var total = Math.max(1, ${count});
          var remaining = total;
          var rounds = 3;

          function shoot() {
            if (remaining <= 0) {
              return;
            }

            var roundCount = Math.min(remaining, Math.max(1, Math.ceil(total / rounds)));
            remaining -= roundCount;

            var primary = Math.max(1, Math.floor(roundCount * 0.6));
            var flat = Math.max(0, Math.floor(roundCount * 0.1));
            var circles = Math.max(0, roundCount - primary - flat);

            confetti({ ...defaults, particleCount: primary });
            if (flat > 0) {
              confetti({ ...defaults, particleCount: flat, flat: true });
            }
            if (circles > 0) {
              confetti({ ...defaults, particleCount: circles, scalar: scalar / 2, shapes: ["circle"] });
            }
          }

          setTimeout(shoot, 0);
          setTimeout(shoot, 100);
          setTimeout(shoot, 200);
        }
      `,
    schoolPride: `
        function fire() {
          var end = Date.now() + 2000;
          var colors = ["#BB0000", "#FFFFFF"];
          var total = Math.max(1, ${count});
          var remaining = total;

          (function frame() {
            var timeLeft = end - Date.now();
            if (timeLeft <= 0 || remaining <= 0) {
              return;
            }

            var ticksLeft = Math.max(1, Math.ceil(timeLeft / 16));
            var perSide = Math.max(1, Math.ceil(remaining / (ticksLeft * 2)));

            var leftCount = Math.min(remaining, perSide);
            remaining -= leftCount;

            var rightCount = Math.min(remaining, perSide);
            remaining -= rightCount;

            if (leftCount > 0) {
              confetti({ particleCount: leftCount, angle: 60, spread: 55, origin: { x: 0 }, colors: colors });
            }
            if (rightCount > 0) {
              confetti({ particleCount: rightCount, angle: 120, spread: 55, origin: { x: 1 }, colors: colors });
            }

            if (Date.now() < end && remaining > 0) {
              requestAnimationFrame(frame);
            }
          })();
        }
      `,
    realistic: `
        function fire() {
          var total = Math.max(1, ${count});
          var remaining = total;
          var defaults = { origin: { y: 0.7 } };

          function shoot(targetCount, opts) {
            if (remaining <= 0) {
              return;
            }

            var particleCount = Math.min(remaining, Math.max(0, targetCount));
            if (particleCount <= 0) {
              return;
            }

            remaining -= particleCount;
            confetti({ ...defaults, ...opts, particleCount: particleCount });
          }

          shoot(Math.floor(total * 0.25), { spread: 26, startVelocity: 55 });
          shoot(Math.floor(total * 0.2), { spread: 60 });
          shoot(Math.floor(total * 0.35), { spread: 100, decay: 0.91, scalar: 0.8 });
          shoot(Math.floor(total * 0.1), { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
          shoot(remaining, { spread: 120, startVelocity: 45 });
        }
      `,
  };

  return scripts[style] || scripts.cannon;
}
