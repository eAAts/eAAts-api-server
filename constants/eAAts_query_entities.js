const orderCreateds = "id\norderId\ncreator\nminParticipants\nfeeType\nblockNumber\nblockTimestamp\ntransactionHash";
const orderJoineds = "id\norderId\nblockNumber\nblockTimestamp\ntransactionHash";
const orderDeliveryStarteds = "id\norderId\nblockNumber\nblockTimestamp\ntransactionHash";
const deliveryCompleteds = "id\norderId\nblockNumber\nblockNumber\blockTimestamp\ntransactionHash";

module.exports = {
    orderCreateds,
    orderJoineds,
    orderDeliveryStarteds,
    deliveryCompleteds,
};
