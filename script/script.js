const targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 14);

function getTimeSegmentElements(segmentElement) {
  const segmentDisplay = segmentElement.querySelector('.segment-display');
  const segmentDisplayTop = segmentDisplay.querySelector('.segment-display__top');
  const segmentDisplayBottom = segmentDisplay.querySelector('.segment-display__bottom');
  const segmentOverlay = segmentDisplay.querySelector('.segment-overlay');
  const segmentOverlayTop = segmentOverlay.querySelector('.segment-overlay__top');
  const segmentOverlayBottom = segmentOverlay.querySelector('.segment-overlay__bottom');

  return {
    segmentDisplayTop,
    segmentDisplayBottom,
    segmentOverlay,
    segmentOverlayTop,
    segmentOverlayBottom,
  };
}

function updateSegmentValues(displayElement, overlayElement, value) {
  displayElement.textContent = value;
  overlayElement.textContent = value;
}

function updateTimeSegment(timeSegments, timeValue) {
  const segmentElements = [];
  timeSegments.forEach(segment => segmentElements.push(getTimeSegmentElements(segment)));

  if (parseInt(segmentElements[0].segmentDisplayTop.textContent, 10) === timeValue) {
    return;
  }

  segmentElements.forEach(segment => segment.segmentOverlay.classList.add('flip'));

  segmentElements.forEach(segment => {
    updateSegmentValues(segment.segmentDisplayTop, segment.segmentOverlayBottom, timeValue);
    updateSegmentValues(segment.segmentDisplayBottom, segment.segmentOverlayTop, timeValue);
  });

  function finishAnimation() {
    segmentElements.forEach(segment => segment.segmentOverlay.classList.remove('flip'));

    segmentElements.forEach(segment => {
      updateSegmentValues(segment.segmentDisplayTop, segment.segmentOverlayTop, timeValue);
      updateSegmentValues(segment.segmentDisplayBottom, segment.segmentOverlayBottom, timeValue);
    });

    this.removeEventListener('animationend', finishAnimation);
  }

  segmentElements[0].segmentOverlay.addEventListener('animationend', finishAnimation);
}

function updateTimeSection(sectionID, timeValue) {
  const sectionElement = document.getElementById(sectionID);
  const timeSegments = sectionElement.querySelectorAll('.time-segment');
  updateTimeSegment(timeSegments, timeValue);
}

function getTimeRemaining(targetDateTime) {
  const nowTime = Date.now();
  const complete = nowTime >= targetDateTime;

  if (complete) {
    return {
      complete,
      seconds: 0,
      minutes: 0,
      hours: 0,
      days: 0
    };
  }

  const timeDiff = targetDateTime - nowTime;
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  return {
    complete,
    seconds,
    minutes,
    hours,
    days
  };
}

function updateAllSegments() {
  const timeRemainingBits = getTimeRemaining(new Date(targetDate).getTime());

  updateTimeSection('days', timeRemainingBits.days);
  updateTimeSection('hours', timeRemainingBits.hours);
  updateTimeSection('minutes', timeRemainingBits.minutes);
  updateTimeSection('seconds', timeRemainingBits.seconds);

  return timeRemainingBits.complete;
}

const countdownTimer = setInterval(() => {
  const isComplete = updateAllSegments();

  if (isComplete) {
    clearInterval(countdownTimer);
  }
}, 1000);

updateAllSegments();
