const recorder = require('./lib/recorder');
const tool = require('./lib/tool');

// Using arguments
let args = process.argv.slice(2);

if (args.length < 1) {
    console.error('Usage node app.js [roomid1] [roomid2] ...');
} else {
    args.forEach((id, index) => {
        if (isNaN(id)) {
            console.error(`Error item ${index}: RoomID (${id}) `
                + 'must be an Integer');
        } else if (id <= 0) {
            console.error(`Error item ${index}: RoomID (${id}) `
                + 'has to be greater than 0');
        } else {
            console.log(`Room ID = ${id}`);
            runRecorder(id);
        }
    });
}

/**
 * Runs recorder using long id
 * @param {Number} id
 */
async function runRecorder(id) {
    let longId = await tool.getLongId(id);
    recorder.run(id, longId);
}
