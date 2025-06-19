const defaultItems = ["Buy groceries", "Finish homework", "Walk the dog", "Read a book"];
let ringThickness = 30;
let animationSpeed = 600;
let ringColor = "url(#progressGradient)";
let celebrationMessage = "All Entities are Consolidated!";

function loadChecklist(items) {
  const checklist = document.getElementById('checklist');
  checklist.innerHTML = '';
  items.forEach((text, i) => {
    const li = document.createElement('li');
    const check = document.createElement('div');
    check.className = 'checkmark';
    check.textContent = '✓';

    const span = document.createElement('span');
    span.textContent = text;

    li.appendChild(check);
    li.appendChild(span);

    const saved = localStorage.getItem('checklist-' + i);
    if (saved === 'true') li.classList.add('checked');

    li.addEventListener('click', () => {
      li.classList.toggle('checked');
      const isChecked = li.classList.contains('checked');
      localStorage.setItem('checklist-' + i, isChecked);
      updateProgress();
    });

    checklist.appendChild(li);
  });
}

const circle = document.getElementById('circleProgress');
const circleText = document.getElementById('circlePercent');
const celebration = document.getElementById('celebration');

function animateCount(start, end, duration) {
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.round(start + (end - start) * progress);
    circleText.textContent = `${value}%`;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function updateProgress() {
  const listItems = document.querySelectorAll('#checklist li');
  const total = listItems.length;
  const checked = Array.from(listItems).filter(li => li.classList.contains('checked')).length;
  const percent = (checked / total) * 100;

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  circle.setAttribute('stroke-dashoffset', offset);
  circle.setAttribute('stroke-width', ringThickness);
  circle.setAttribute('stroke', ringColor);

  const current = parseInt(circleText.textContent);
  animateCount(current, Math.round(percent), animationSpeed);

  celebration.textContent = celebrationMessage;
  celebration.style.display = percent === 100 ? 'block' : 'none';
}

function loadProperties() {
  if (typeof window.sap !== 'undefined' && sap.designstudio && sap.designstudio.sdk) {
    sap.designstudio.sdk.Component.subclass("custom.animated.checklist", function () {
      var me = this;

      this.init = function () {
        this.addProperty("listItems");
        this.addProperty("ringThickness");
        this.addProperty("ringColor");
        this.addProperty("animationSpeed");
        this.addProperty("celebrationMessage");

        me.$().append($("#checklist"));
        loadChecklist(defaultItems);
        updateProgress();
      };

      this.listItems = function (value) {
        if (value) {
          const parsed = typeof value === 'string' ? JSON.parse(value) : value;
          loadChecklist(parsed);
          updateProgress();
          return this;
        }
        return defaultItems;
      };

      this.ringThickness = function (value) {
        if (value !== undefined) {
          ringThickness = parseInt(value);
          updateProgress();
          return this;
        }
        return ringThickness;
      };

      this.ringColor = function (value) {
        if (value !== undefined) {
          ringColor = value;
          updateProgress();
          return this;
        }
        return ringColor;
      };

      this.animationSpeed = function (value) {
        if (value !== undefined) {
          animationSpeed = parseInt(value);
          updateProgress();
          return this;
        }
        return animationSpeed;
      };

      this.celebrationMessage = function (value) {
        if (value !== undefined) {
          celebrationMessage = value;
          updateProgress();
          return this;
        }
        return celebrationMessage;
      };
    });
  } else {
    loadChecklist(defaultItems);
    updateProgress();
  }
}

loadProperties();