module.exports = function (message, type){
  this.message = message;
  this.error = type === undefined ? message : type;
}
