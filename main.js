
window.addEventListener("DOMContentLoaded", () => {
  const checklistWidget = document.querySelector("#checklist");
  const listItems = checklistWidget.querySelectorAll("li");
  const circle = document.querySelector("#circleProgress");
  const circleText = document.querySelector("#circlePercent");
  const celebration = document.querySelector("#celebration");

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
    const total = listItems.length;
    const checked = Array.from(listItems).filter(li => li.classList.contains("checked")).length;
    const percent = (checked / total) * 100;
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDashoffset = offset;

    const current = parseInt(circleText.textContent);
    animateCount(current, Math.round(percent), 600);
    celebration.style.display = percent === 100 ? "block" : "none";
  }

  listItems.forEach((li, index) => {
    const saved = localStorage.getItem("checklist-" + index);
    if (saved === "true") {
      li.classList.add("checked");
    }
    li.addEventListener("click", () => {
      li.classList.toggle("checked");
      const isChecked = li.classList.contains("checked");
      localStorage.setItem("checklist-" + index, isChecked);
      updateProgress();
    });
  });

  updateProgress();
});
