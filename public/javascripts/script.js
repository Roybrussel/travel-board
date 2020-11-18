document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("IronGenerator JS imported successfully!");
  },
  false
);

function countChars(obj) {
  var strLength = obj.value.length;
  document.getElementById("current").innerHTML = strLength;
}
