// import request from 'request';
const rp = require('request-promise');

module.exports.getBody = getBody;
module.exports.checkOnline = checkOnline;
module.exports.getLongId = getLongId;

/**
 * Returns the body of id
 * @param {Number} roomId the room id
 * @return {Object} the json file of the item
 */
async function getBody(roomId) {
    let url = `http://api.live.bilibili.com/AppRoom/index?room_id=${roomId}&platform=android`;
    let id = await rp(url).then(
        (res) => {
            let data = JSON.parse(res);
            return data;
        }
    ).catch(
        (err) => console.error(err)
    );
    return id;
}

/**
 * Returns true if the room is online
 * @param {Number} roomId the room id
 * @return {Boolean}
 */
async function checkOnline(roomId) {
    let online = await getBody(roomId);
    let status = online.data.status;
    return status==='LIVE';
}

/**
 * Get long ID
 * @param {Number} roomId
 * @return {Number} long id of the room
 */
async function getLongId(roomId) {
    let data = await getBody(roomId);
    return data.data.room_id;
}
