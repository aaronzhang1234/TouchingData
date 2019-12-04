const say = require('say');

say.export("Hello, Welcome to Touching Data", 'Alex', 1, "./say.wav", (err) => {
    if (err) {
        console.error(err)
    }
    console.log("Audio has been saved");
})