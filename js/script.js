/* =====================================================
   ELEMENTS
===================================================== */

const rail = document.getElementById("sliderRail");
const thumb = document.getElementById("sliderThumb");

const fallingImage = document.getElementById("fallingImage");
const changingImage = document.getElementById("changingImage");

const contentStage = document.getElementById("contentStage");

const kazuhaVideo = document.getElementById("kazuhaVideo");
const wishingVideo = document.getElementById("wishingVideo");
const apologizeVideo = document.getElementById("apologizeVideo");

const birthdayMessage = document.getElementById("birthdayMessage");
const wishTitle = document.getElementById("wishTitle");
const wishText = document.getElementById("wishText");

const backgroundMusic = document.getElementById("backgroundMusic");


/* =====================================================
   IMAGES

   image4 has been removed.
   The images will cycle:

   image1 → image2 → image3 → image1...
===================================================== */

const images = [
    "assets/images/image1.png",
    "assets/images/image2.png",
    "assets/images/image3.png"
];

let currentImageIndex = 0;


/* =====================================================
   QUOTES
===================================================== */

const birthdayQuote = {
    title: "A Little Wish For You ✨",
    text: "I hope this new year of your life brings you more happiness, beautiful memories, good people, and many reasons to smile."
};

const sorryQuote = {
    title: "Sorry 😭",
    text: "Sorry, xde gambar lain, ni je ada... don't know where all the old pictures have gone."
};


/* =====================================================
   CONTENT SEQUENCE

   LOOP 1
   0 = Kazuha
   1 = Wishing YouTube
   2 = Birthday Quote
   3 = Sorry Quote

   LOOP 2
   4 = Kazuha
   5 = Apology YouTube
   6 = Birthday Quote
   7 = Sorry Quote

   Then return to 0.
===================================================== */

const contentSequence = [

    /* FIRST LOOP */

    {
        type: "kazuha"
    },

    {
        type: "youtube",
        video: wishingVideo
    },

    {
        type: "quote",
        title: birthdayQuote.title,
        text: birthdayQuote.text
    },

    {
        type: "quote",
        title: sorryQuote.title,
        text: sorryQuote.text
    },


    /* SECOND LOOP */

    {
        type: "kazuha"
    },

    {
        type: "youtube",
        video: apologizeVideo
    },

    {
        type: "quote",
        title: birthdayQuote.title,
        text: birthdayQuote.text
    },

    {
        type: "quote",
        title: sorryQuote.title,
        text: sorryQuote.text
    }

];


/* Start with Kazuha */

let currentContentIndex = 0;


/* =====================================================
   SLIDER STATE
===================================================== */

let progress = 0;

let dragging = false;

let animationRunning = false;

let pointerOffset = 0;

let animationFrame = null;


/*
   How far the slider needs to be pulled
   before changing content.
*/

const revealThreshold = 0.08;


/* =====================================================
   MUSIC SETTINGS
===================================================== */

let musicStarted = false;


/*
   Change this to false if you want the background
   music to KEEP playing while the YouTube videos play.
*/

const pauseMusicDuringYouTube = true;


/* Background music volume */

if (backgroundMusic) {
    backgroundMusic.volume = 0.35;
}


/* =====================================================
   START BACKGROUND MUSIC
===================================================== */

function startBackgroundMusic() {

    if (!backgroundMusic) return;

    if (musicStarted) return;

    musicStarted = true;

    backgroundMusic.play().catch(() => {
        /*
           Some browsers may still block autoplay.
           It will try again on the next interaction.
        */

        musicStarted = false;
    });
}


/* =====================================================
   RESUME MUSIC
===================================================== */

function resumeBackgroundMusic() {

    if (!backgroundMusic) return;

    backgroundMusic.play()
        .then(() => {

            musicStarted = true;

        })
        .catch(() => {

            /* Ignore autoplay restriction */

        });
}


/* =====================================================
   PAUSE MUSIC
===================================================== */

function pauseBackgroundMusic() {

    if (!backgroundMusic) return;

    backgroundMusic.pause();
}


/* =====================================================
   YOUTUBE CONTROL

   Because wishingVideo and apologizeVideo are iframe
   YouTube videos, .play() and .pause() do NOT work.

   We communicate with YouTube using postMessage.
===================================================== */

function sendYouTubeCommand(iframe, command, args = []) {

    if (!iframe) return;

    if (!iframe.contentWindow) return;

    const message = JSON.stringify({

        event: "command",

        func: command,

        args: args

    });

    iframe.contentWindow.postMessage(
        message,
        "*"
    );
}


/* =====================================================
   PLAY YOUTUBE
===================================================== */

function playYouTube(iframe) {

    if (!iframe) return;

    /*
       Start video from beginning.
    */

    sendYouTubeCommand(
        iframe,
        "seekTo",
        [0, true]
    );


    /*
       Small delay gives YouTube time to process seekTo.
    */

    setTimeout(() => {

        sendYouTubeCommand(
            iframe,
            "playVideo"
        );

    }, 100);

}


/* =====================================================
   PAUSE YOUTUBE
===================================================== */

function pauseYouTube(iframe) {

    if (!iframe) return;

    sendYouTubeCommand(
        iframe,
        "pauseVideo"
    );
}


/* =====================================================
   STOP ALL YOUTUBE VIDEOS
===================================================== */

function pauseAllYouTubeVideos() {

    pauseYouTube(wishingVideo);

    pauseYouTube(apologizeVideo);
}


/* =====================================================
   HIDE ALL CONTENT
===================================================== */

function hideAllContent() {

    const contents = document.querySelectorAll(
        ".stage-content"
    );

    contents.forEach((content) => {

        content.classList.remove("active");

        content.style.opacity = "0";

        content.style.visibility = "hidden";

        content.style.pointerEvents = "none";

        content.style.zIndex = "1";

    });

}


/* =====================================================
   SHOW CONTENT
===================================================== */

function activateContent(element) {

    if (!element) return;

    element.classList.add("active");

    element.style.opacity = "1";

    element.style.visibility = "visible";

    element.style.zIndex = "5";


    /*
       YouTube needs pointer events so the user
       can use its controls.
    */

    if (element.tagName === "IFRAME") {

        element.style.pointerEvents = "auto";

    } else {

        element.style.pointerEvents = "none";

    }

}


/* =====================================================
   SHOW KAZUHA
===================================================== */

function showKazuha() {

    hideAllContent();

    pauseAllYouTubeVideos();


    /* Show Kazuha */

    activateContent(kazuhaVideo);


    /* Restart Kazuha */

    if (kazuhaVideo) {

        try {

            kazuhaVideo.currentTime = 0;

        } catch (error) {}


        kazuhaVideo.play().catch(() => {});

    }


    /* Bring background music back */

    resumeBackgroundMusic();

}


/* =====================================================
   SHOW YOUTUBE VIDEO
===================================================== */

function showYouTubeVideo(video) {

    hideAllContent();


    /* Pause Kazuha */

    if (kazuhaVideo) {

        kazuhaVideo.pause();

    }


    /* Stop any other YouTube video */

    pauseAllYouTubeVideos();


    /* Show selected YouTube */

    activateContent(video);


    /*
       Stop background music so it does not overlap
       with the YouTube video's sound.
    */

    if (pauseMusicDuringYouTube) {

        pauseBackgroundMusic();

    }


    /* Play YouTube */

    playYouTube(video);

}


/* =====================================================
   SHOW QUOTE
===================================================== */

function showQuote(title, text) {

    hideAllContent();

    pauseAllYouTubeVideos();


    if (kazuhaVideo) {

        kazuhaVideo.pause();

    }


    wishTitle.textContent = title;

    wishText.textContent = text;


    activateContent(birthdayMessage);


    /*
       Restart quote entrance animation
    */

    birthdayMessage.classList.remove(
        "message-change"
    );


    /*
       Force browser to refresh animation
    */

    void birthdayMessage.offsetWidth;


    birthdayMessage.classList.add(
        "message-change"
    );


    /*
       Resume background music after YouTube
    */

    resumeBackgroundMusic();

}


/* =====================================================
   RENDER CURRENT CONTENT
===================================================== */

function renderContent() {

    const item =
        contentSequence[currentContentIndex];


    if (!item) return;


    /* -------------------------
       KAZUHA
    ------------------------- */

    if (item.type === "kazuha") {

        showKazuha();

        return;
    }


    /* -------------------------
       YOUTUBE
    ------------------------- */

    if (item.type === "youtube") {

        showYouTubeVideo(
            item.video
        );

        return;
    }


    /* -------------------------
       QUOTE
    ------------------------- */

    if (item.type === "quote") {

        showQuote(
            item.title,
            item.text
        );

    }

}


/* =====================================================
   NEXT CONTENT
===================================================== */

function showNextContent() {

    currentContentIndex++;


    /*
       After item 7,
       return to item 0.
    */

    if (
        currentContentIndex >=
        contentSequence.length
    ) {

        currentContentIndex = 0;

    }


    renderContent();

}


/* =====================================================
   CHANGE IMAGE
===================================================== */

function changeToNextImage() {

    currentImageIndex++;


    if (
        currentImageIndex >=
        images.length
    ) {

        currentImageIndex = 0;

    }


    /*
       Small fade when changing image.
    */

    changingImage.style.opacity = "0";


    setTimeout(() => {

        changingImage.src =
            images[currentImageIndex];


        changingImage.style.opacity = "1";

    }, 150);

}


/* =====================================================
   PRELOAD IMAGES
===================================================== */

function preloadImages() {

    images.forEach((src) => {

        const img = new Image();

        img.src = src;

    });

}


preloadImages();


/* =====================================================
   MEASURE SLIDER
===================================================== */

function getMeasurements() {

    const railRect =
        rail.getBoundingClientRect();


    const thumbRect =
        thumb.getBoundingClientRect();


    const padding = 6;


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
   UPDATE SLIDER + FALLING IMAGE
===================================================== */

function updateScene() {

    const {
        maxMove
    } = getMeasurements();


    /* Slider movement */

    const sliderY =
        progress * maxMove;


    thumb.style.transform =
        `translateY(${sliderY}px)`;


    /*
       Image starts above the content.

       progress = 0
       image = -105%

       progress = 1
       image = 0%

       Therefore pulling the slider down
       makes the image fall down.
    */

    const imageY =
        -105 + (progress * 105);


    fallingImage.style.transform =
        `translateY(${imageY}%)`;

}


/* =====================================================
   START DRAG
===================================================== */

function startDrag(event) {

    if (animationRunning) return;


    /*
       Starting the music here is important because
       browsers allow audio after user interaction.
    */

    startBackgroundMusic();


    dragging = true;


    thumb.classList.add(
        "dragging"
    );


    const thumbRect =
        thumb.getBoundingClientRect();


    pointerOffset =
        event.clientY -
        thumbRect.top;


    try {

        thumb.setPointerCapture(
            event.pointerId
        );

    } catch (error) {}


    event.preventDefault();

}


/* =====================================================
   MOVE DRAG
===================================================== */

function moveDrag(event) {

    if (!dragging) return;


    const {

        railRect,

        padding,

        maxMove

    } = getMeasurements();


    let y =

        event.clientY -

        railRect.top -

        padding -

        pointerOffset;


    /*
       Prevent slider from leaving rail.
    */

    y = Math.max(
        0,
        Math.min(
            y,
            maxMove
        )
    );


    progress =

        maxMove <= 0

            ? 0

            : y / maxMove;


    updateScene();


    event.preventDefault();

}


/* =====================================================
   END DRAG
===================================================== */

function endDrag(event) {

    if (!dragging) return;


    dragging = false;


    thumb.classList.remove(
        "dragging"
    );


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

    } catch (error) {}


    bounceBack();

}


/* =====================================================
   BOUNCE BACK
===================================================== */

function bounceBack() {

    animationRunning = true;


    const startProgress = progress;


    /*
       Only change content when the user
       actually pulls the slider.
    */

    const shouldReveal =

        startProgress >=
        revealThreshold;


    const duration = 700;


    const startTime =
        performance.now();


    /*
       Change content while image begins
       moving upward.

       This makes the falling image hide
       the content transition.
    */

    if (shouldReveal) {

        showNextContent();

    }


    function animate(now) {

        const elapsed =
            now - startTime;


        const t = Math.min(
            elapsed / duration,
            1
        );


        const eased =
            easeOutElastic(t);


        progress =

            startProgress *
            (1 - eased);


        /*
           Allows tiny overshoot for
           elastic bounce effect.
        */

        progress = Math.max(
            -0.035,
            progress
        );


        updateScene();


        if (t < 1) {

            animationFrame =
                requestAnimationFrame(
                    animate
                );

            return;
        }


        /*
           Return exactly to top.
        */

        progress = 0;


        updateScene();


        animationRunning = false;


        animationFrame = null;


        /*
           Change image after bounce finishes.
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
   ELASTIC BOUNCE
===================================================== */

function easeOutElastic(t) {

    const c4 =
        (2 * Math.PI) / 3;


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

            (t * 10 - 0.75)

            *

            c4

        )

        +

        1

    );

}


/* =====================================================
   EVENTS
===================================================== */

thumb.style.touchAction = "none";


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
   WINDOW RESIZE
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
   EXTRA USER INTERACTION FOR MUSIC

   Useful for browsers that block audio on first attempt.
===================================================== */

document.addEventListener(
    "pointerdown",
    () => {

        if (!musicStarted) {

            startBackgroundMusic();

        }

    },
    {
        once: false
    }
);


/* =====================================================
   INITIAL STATE
===================================================== */

/*
   Make sure all content begins hidden
   except Kazuha.
*/

currentContentIndex = 0;


/*
   Put image1 as starting image.
*/

currentImageIndex = 0;

changingImage.src =
    images[currentImageIndex];


/*
   Position slider and falling image.
*/

updateScene();


/*
   Show Kazuha first.
*/

renderContent();


/*
   Kazuha is muted in HTML,
   so autoplay should normally work.
*/

if (kazuhaVideo) {

    kazuhaVideo
        .play()
        .catch(() => {});

}