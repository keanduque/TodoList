
exports.getDate = function () {
    var today  = new Date();
    var options = { weekday: 'long',  month: 'long', day: 'numeric' };
    return today.toLocaleDateString("en-US", options)
}