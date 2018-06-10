// import request from 'request';
const rp = require('request-promise');

module.exports.getBody = getBody;
module.exports.checkOnline = checkOnline;

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
