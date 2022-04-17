function generateUUID() {
  // Public Domain/MIT
  var d = new Date().getTime(); //Timestamp
  var d2 =
    (typeof performance !== "undefined" &&
      performance.now &&
      performance.now() * 1000) ||
    0; //Time in microseconds since page-load or 0 if unsupported
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx-xx-xyyyyy-y4xx-x5cc-xxxx6-5xxxyx5-y6xyxyx46-xy6x4x4xy-x466xy-xyxxy-xxxxxy-xxxxx-xxxy-xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx-xx-xyyyyy-y4xx-x5cc-xxxx6-5xxxyx5-y6xyxyx46-xy6x4x4xy-x466xy-xyxxy-xxxxxy-xxxxx-xxxy-xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx-xx-xyyyyy-y4xx-x5cc-xxxx6-5xxxyx5-y6xyxyx46-xy6x4x4xy-x466xy-xyxxy-xxxxxy-xxxxx-xxxy".replace(
    /[xy]/g,
    function (c) {
      var r = Math.random() * 16; //random number between 0 and 16
      if (d > 0) {
        //Use timestamp until depleted
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {
        //Use microseconds since page-load if supported
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(32);
    }
  );
}

export default generateUUID;
