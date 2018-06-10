const download = require('download-file');
const rp = require('request-promise');
const tool = require('./tool');

module.exports.run = run;

/**
 * Test and run recorder
 * @param {Number} roomId - room number
 * @param {Number} longId - room long id if differs
 */
async function run(roomId, longId) {
    console.log('Check room if it is online.');
    let online = await tool.checkOnline(roomId);
    if (online) {
        console.log(`Room ${roomId} online and should be recording :3`);
        record(longId);
    } else {
        console.log(`Room ${roomId} is currently offline, try again in 5000ms`);
        await sleep(5000);
        run(roomId);
    }
}

/**
 * Download item from url
 * @param {Number} roomId - long id of room
 */
async function record(roomId) {
    let url = `https://api.live.bilibili.com/room/v1/Room/playUrl?cid=${roomId}&quality=0&platform=web`;
    let downloadUrl = await rp(url)
        .then(
            (res) => {
                let data = JSON.parse(res);
                return data.data.durl[0].url;
            }
        )
        .catch( (err) => console.error(err) );

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
 * @return {Promise}
 */
function sleep(millis) {
    return new Promise((resolve) => setTimeout(resolve, millis));
}
