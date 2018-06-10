const download = require('download-file');
const rp = require('request-promise');
const tool = require('./tool');

module.exports.run = run;
module.exports.record = record;

/**
 * Test and run recorder
 * @param {Number} roomId - room number
 */
async function run(roomId) {
    console.log('Check room if it is online.');
    let online = await tool.checkOnline(roomId);
    if (online) {
        console.log(`Room ${roomId} online and should be recording :3`);
        let longId = await getLongId(roomId);
        record(longId);
    } else {
        console.log(`Room ${roomId} is currently offline, try again in 5000ms`);
        await sleep(5000);
        run(roomId);
    }
}

/**
 * Get long ID
 * @param {Number} roomId
 * @return {Number} long id of the room
 */
async function getLongId(roomId) {
    let data = await tool.getBody(roomId);
    return data.data.room_id;
}

/**
 * Download the item from url
 * @param {Number} roomId
 */
async function record(roomId) {
    let url = `https://api.live.bilibili.com/room/v1/Room/playUrl?cid=${roomId}&quality=0&platform=web`;
    let data = await rp(url)
        .then(
            (res) => {
                let data = JSON.parse(res);
                return data.data;
            }
        )
        .catch( (err) => console.error(err) );

    let downloadUrl = data.durl[0].url;
    let d = new Date();
    let options = {
        directory: 'output/' + roomId,
        filename: `${d.getFullYear()}${d.getMonth()}${d.getDate()}-`
            +`${d.getHours()}${d.getMinutes()}${d.getSeconds()}.flv`,
    };
    download(downloadUrl, options, (err) => {
        if (err) console.error(err);
        console.log('Stream ends... Return to run');
        run(roomId);
    });
}

/**
 * Works on next operation
 * @param {Number} millis
 * @return {function}
 */
function sleep(millis) {
    return new Promise((resolve) => setTimeout(resolve, millis));
}
