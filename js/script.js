/* =====================================================
   ELEMENTS
===================================================== */

/* Slider */

const rail =
  document.getElementById("sliderRail");

const thumb =
  document.getElementById("sliderThumb");


/* Falling / changing image */

const fallingImage =
  document.getElementById("fallingImage");

const changingImage =
  document.getElementById("changingImage");


/* Videos */

const kazuhaVideo =
  document.getElementById("kazuhaVideo");

const wishingVideo =
  document.getElementById("wishingVideo");

const apologizeVideo =
  document.getElementById("apologizeVideo");


/* Text content */

const birthdayMessage =
  document.getElementById("birthdayMessage");

const wishTitle =
  document.getElementById("wishTitle");

const wishText =
  document.getElementById("wishText");


/* Background music */

const backgroundMusic =
  document.getElementById("backgroundMusic");


/* =====================================================
   IMAGE LIST
===================================================== */

const images = [
  "assets/images/image1.jpg",
  "assets/images/image2.jpg",
  "assets/images/image3.jpg",
  "assets/images/image4.jpg"
];


/*
  0 = image1
  1 = image2
  2 = image3
  3 = image4
*/

let currentImageIndex = 0;


/* =====================================================
   TEXT CONTENT
===================================================== */


/*
  This is shown as content number 3
  in both loops.
*/

const birthdayQuote = {

  title:
    "Eppy befday Ekallll✨",

  text:
    "Semoga kekal semak, kekal comel, kekal sihat, kekal fit and so onnnnnnnn (>_<)."

};


/*
  This is shown as content number 4
  in both loops.
*/

const photoQuote = {

  title:
    "Sorry 😭",

  text:
    "Sorry, xde gambar lain, ni je ada... don't know where all the old pictures went 😭"

};


/* =====================================================
   CONTENT SEQUENCE
===================================================== */

/*

  FIRST LOOP

  0 = kazuha.mp4
  1 = wishing.mp4
  2 = birthday quote
  3 = photo quote


  SECOND LOOP

  4 = kazuha.mp4
  5 = apologize.mp4
  6 = same birthday quote
  7 = same photo quote


  Then return to step 0.

*/

const contentSequence = [

  /* ===================================================
     FIRST LOOP
  =================================================== */

  {
    type: "kazuha"
  },

  {
    type: "wishing"
  },

  {
    type: "quote",
    content: birthdayQuote
  },

  {
    type: "quote",
    content: photoQuote
  },


  /* ===================================================
     SECOND LOOP
  =================================================== */

  {
    type: "kazuha"
  },

  {
    type: "apologize"
  },

  {
    type: "quote",
    content: birthdayQuote
  },

  {
    type: "quote",
    content: photoQuote
  }

];


/*
  Start with Kazuha.
*/

let contentStep = 0;


/* =====================================================
   MUSIC STATE
===================================================== */

let musicStarted = false;

let musicFadeInterval = null;


/*
  Background music volume.

  0.2 = quiet
  0.35 = medium
  0.6 = louder
*/

const musicVolume = 0.35;


/* =====================================================
   SLIDER STATE
===================================================== */

let progress = 0;

let dragging = false;

let animationRunning = false;

let pointerOffset = 0;

let animationFrame = null;


/*
  Minimum amount the slider needs
  to move before changing content.

  0.08 = 8%
*/

const revealThreshold = 0.08;


/* =====================================================
   PRELOAD IMAGES
===================================================== */

function preloadImages() {

  images.forEach((src) => {

    const img =
      new Image();

    img.src =
      src;

  });

}


preloadImages();


/* =====================================================
   START BACKGROUND MUSIC
===================================================== */

function startMusic() {

  /*
    Do not start again if
    music already started.
  */

  if (musicStarted) {
    return;
  }


  musicStarted = true;


  /*
    Start silently.
  */

  backgroundMusic.volume = 0;


  backgroundMusic
    .play()

    .then(() => {

      /*
        Clear old fade timer.
      */

      if (musicFadeInterval) {

        clearInterval(
          musicFadeInterval
        );

      }


      let volume = 0;


      /*
        Slowly fade music in.
      */

      musicFadeInterval =
        setInterval(() => {

          volume += 0.02;


          if (
            volume >=
            musicVolume
          ) {

            volume =
              musicVolume;


            clearInterval(
              musicFadeInterval
            );


            musicFadeInterval =
              null;

          }


          backgroundMusic.volume =
            volume;

        }, 70);

    })

    .catch((error) => {

      console.log(
        "Background music could not start:",
        error
      );


      musicStarted =
        false;

    });

}


/* =====================================================
   PAUSE MUSIC
===================================================== */

function pauseMusic() {

  if (
    !backgroundMusic.paused
  ) {

    backgroundMusic.pause();

  }

}


/* =====================================================
   RESUME MUSIC
===================================================== */

function resumeMusic() {

  if (!musicStarted) {
    return;
  }


  /*
    Restore normal volume.
  */

  backgroundMusic.volume =
    musicVolume;


  backgroundMusic
    .play()
    .catch(() => {});

}


/* =====================================================
   PAUSE ALL VIDEOS
===================================================== */

function pauseVideos() {

  if (kazuhaVideo) {
    kazuhaVideo.pause();
  }


  if (wishingVideo) {
    wishingVideo.pause();
  }


  if (apologizeVideo) {
    apologizeVideo.pause();
  }

}


/* =====================================================
   HIDE ALL CONTENT
===================================================== */

function hideAllContent() {

  if (kazuhaVideo) {

    kazuhaVideo.classList.remove(
      "active"
    );

  }


  if (wishingVideo) {

    wishingVideo.classList.remove(
      "active"
    );

  }


  if (apologizeVideo) {

    apologizeVideo.classList.remove(
      "active"
    );

  }


  if (birthdayMessage) {

    birthdayMessage.classList.remove(
      "active"
    );

  }

}


/* =====================================================
   SHOW CONTENT
===================================================== */

function showContent(step) {

  const item =
    contentSequence[step];


  if (!item) {
    return;
  }


  /*
    Hide old content.
  */

  hideAllContent();


  /*
    Pause all videos before
    showing a new one.
  */

  pauseVideos();


  /* ===================================================
     KAZUHA VIDEO
  =================================================== */

  if (
    item.type ===
    "kazuha"
  ) {

    kazuhaVideo.classList.add(
      "active"
    );


    /*
      Restart Kazuha video.
    */

    try {

      kazuhaVideo.currentTime = 0;

    }

    catch (error) {}


    /*
      Kazuha remains muted so
      background music can play.
    */

    kazuhaVideo.muted = true;


    kazuhaVideo
      .play()
      .catch((error) => {

        console.log(
          "Kazuha video could not play:",
          error
        );

      });


    /*
      Background music continues.
    */

    resumeMusic();


    return;

  }


  /* ===================================================
     WISHING VIDEO
  =================================================== */

  if (
    item.type ===
    "wishing"
  ) {

    wishingVideo.classList.add(
      "active"
    );


    /*
      Restart from beginning.
    */

    try {

      wishingVideo.currentTime = 0;

    }

    catch (error) {}


    /*
      Pause background music so
      the video's own audio is clear.
    */

    pauseMusic();


    wishingVideo
      .play()
      .catch((error) => {

        console.log(
          "Wishing video could not play:",
          error
        );

      });


    return;

  }


  /* ===================================================
     APOLOGY VIDEO
  =================================================== */

  if (
    item.type ===
    "apologize"
  ) {

    apologizeVideo.classList.add(
      "active"
    );


    /*
      Restart from beginning.
    */

    try {

      apologizeVideo.currentTime = 0;

    }

    catch (error) {}


    /*
      Pause background music so
      apologize.mp4 audio can be heard.
    */

    pauseMusic();


    apologizeVideo
      .play()
      .catch((error) => {

        console.log(
          "Apology video could not play:",
          error
        );

      });


    return;

  }


  /* ===================================================
     TEXT / QUOTE
  =================================================== */

  if (
    item.type ===
    "quote"
  ) {

    /*
      Put text inside message area.
    */

    wishTitle.textContent =
      item.content.title;


    wishText.textContent =
      item.content.text;


    /*
      Show text.
    */

    birthdayMessage.classList.add(
      "active"
    );


    /*
      Background music continues
      while reading the quote.
    */

    resumeMusic();


    return;

  }

}


/* =====================================================
   WISHING VIDEO ENDED
===================================================== */

wishingVideo.addEventListener(
  "ended",

  () => {

    /*
      Resume background music
      after wishing.mp4 ends.
    */

    resumeMusic();

  }
);


/* =====================================================
   APOLOGY VIDEO ENDED
===================================================== */

apologizeVideo.addEventListener(
  "ended",

  () => {

    /*
      Resume background music
      after apologize.mp4 ends.
    */

    resumeMusic();

  }
);


/* =====================================================
   NEXT CONTENT
===================================================== */

function nextContent() {

  contentStep++;


  /*
    After second loop,
    return to first loop.
  */

  if (
    contentStep >=
    contentSequence.length
  ) {

    contentStep = 0;

  }


  showContent(
    contentStep
  );

}


/* =====================================================
   NEXT IMAGE
===================================================== */

function changeToNextImage() {

  currentImageIndex++;


  /*
    image4 → image1
  */

  if (
    currentImageIndex >=
    images.length
  ) {

    currentImageIndex = 0;

  }


  changingImage.src =
    images[currentImageIndex];

}


/* =====================================================
   MEASUREMENTS
===================================================== */

function getMeasurements() {

  const railRect =
    rail.getBoundingClientRect();


  const thumbRect =
    thumb.getBoundingClientRect();


  const padding =
    6;


  const maxMove =

    railRect.height -

    thumbRect.height -

    (padding * 2);


  return {

    railRect,

    thumbRect,

    padding,

    maxMove

  };

}


/* =====================================================
   UPDATE SCENE
===================================================== */

/*

  progress = 0

  Slider:
  top

  Photo:
  above / hidden


  progress = 1

  Slider:
  bottom

  Photo:
  completely covering content

*/

function updateScene() {

  const {
    maxMove
  } =
    getMeasurements();


  /* ===================================================
     SLIDER POSITION
  =================================================== */

  const sliderY =

    progress *

    maxMove;


  thumb.style.transform =

    `translateY(${sliderY}px)`;


  /* ===================================================
     IMAGE POSITION
  =================================================== */

  const imageY =

    -105 +

    (
      progress *
      105
    );


  fallingImage.style.transform =

    `translateY(${imageY}%)`;

}


/* =====================================================
   START DRAG
===================================================== */

function startDrag(event) {

  /*
    Prevent dragging while
    bounce animation runs.
  */

  if (animationRunning) {
    return;
  }


  /*
    First interaction starts
    background music.
  */

  startMusic();


  dragging =
    true;


  thumb.classList.add(
    "dragging"
  );


  /*
    Remember where user grabbed
    the slider.
  */

  const thumbRect =
    thumb.getBoundingClientRect();


  pointerOffset =

    event.clientY -

    thumbRect.top;


  /*
    Keep pointer attached to
    slider during drag.
  */

  try {

    thumb.setPointerCapture(
      event.pointerId
    );

  }

  catch (error) {}


  event.preventDefault();

}


/* =====================================================
   MOVE DRAG
===================================================== */

function moveDrag(event) {

  if (!dragging) {
    return;
  }


  const {

    railRect,

    padding,

    maxMove

  } =
    getMeasurements();


  /*
    Calculate slider position.
  */

  let y =

    event.clientY -

    railRect.top -

    padding -

    pointerOffset;


  /*
    Keep slider inside rail.
  */

  y =
    Math.max(

      0,

      Math.min(

        y,

        maxMove

      )

    );


  /*
    Convert position to
    progress 0 → 1.
  */

  if (
    maxMove <= 0
  ) {

    progress =
      0;

  }

  else {

    progress =
      y / maxMove;

  }


  /*
    Move both photo and slider.
  */

  updateScene();


  event.preventDefault();

}


/* =====================================================
   END DRAG
===================================================== */

function endDrag(event) {

  if (!dragging) {
    return;
  }


  dragging =
    false;


  thumb.classList.remove(
    "dragging"
  );


  /*
    Release captured pointer.
  */

  try {

    if (
      thumb.hasPointerCapture(
        event.pointerId
      )
    ) {

      thumb.releasePointerCapture(
        event.pointerId
      );

    }

  }

  catch (error) {}


  /*
    Bounce back upward.
  */

  bounceBack();

}


/* =====================================================
   BOUNCE BACK
===================================================== */

function bounceBack() {

  animationRunning =
    true;


  /*
    Store how far slider
    was pulled down.
  */

  const startProgress =
    progress;


  /*
    Ignore tiny accidental pulls.
  */

  const shouldReveal =

    startProgress >=
    revealThreshold;


  /*
    Bounce duration.
  */

  const duration =
    700;


  const startTime =
    performance.now();


  /*
    IMPORTANT:

    Change the content while
    the photo is still covering
    the background.

    Therefore the new content is
    revealed naturally when the
    photo moves upward.
  */

  if (shouldReveal) {

    nextContent();

  }


  /* ===================================================
     ANIMATION
  =================================================== */

  function animate(now) {

    const elapsed =

      now -

      startTime;


    const t =

      Math.min(

        elapsed /

        duration,

        1

      );


    /*
      Elastic bounce.
    */

    const eased =
      easeOutElastic(t);


    /*
      Move back toward top.
    */

    progress =

      startProgress *

      (1 - eased);


    /*
      Small overshoot.
    */

    progress =

      Math.max(

        -0.035,

        progress

      );


    /*
      Move slider + photo.
    */

    updateScene();


    /* =================================================
       CONTINUE
    ================================================= */

    if (t < 1) {

      animationFrame =

        requestAnimationFrame(
          animate
        );


      return;

    }


    /* =================================================
       FINISHED
    ================================================= */

    progress =
      0;


    updateScene();


    animationRunning =
      false;


    animationFrame =
      null;


    /*
      The photo is now completely
      above the visible area.

      Switch to the next image here
      so the change isn't visible.
    */

    if (shouldReveal) {

      changeToNextImage();

    }

  }


  animationFrame =

    requestAnimationFrame(
      animate
    );

}


/* =====================================================
   ELASTIC EASING
===================================================== */

function easeOutElastic(t) {

  const c4 =

    (2 * Math.PI) /

    3;


  if (t === 0) {
    return 0;
  }


  if (t === 1) {
    return 1;
  }


  return (

    Math.pow(

      2,

      -10 * t

    )

    *

    Math.sin(

      (
        t * 10 -
        0.75
      )

      *

      c4

    )

    +

    1

  );

}


/* =====================================================
   POINTER EVENTS
===================================================== */

thumb.addEventListener(
  "pointerdown",
  startDrag
);


thumb.addEventListener(
  "pointermove",
  moveDrag
);


thumb.addEventListener(
  "pointerup",
  endDrag
);


thumb.addEventListener(
  "pointercancel",
  endDrag
);


/* =====================================================
   RESIZE
===================================================== */

window.addEventListener(
  "resize",

  () => {

    if (!animationRunning) {

      updateScene();

    }

  }
);


/* =====================================================
   INITIAL STATE
===================================================== */

/*
  Position slider and photo.
*/

updateScene();


/*
  Show Kazuha first.
*/

showContent(0);


/*
  Try to autoplay Kazuha.

  Kazuha should have:
  muted
  autoplay
  loop
  playsinline

  in your HTML.
*/

kazuhaVideo
  .play()
  .catch(() => {});