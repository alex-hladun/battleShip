/* eslint-disable no-undef */

let setUpGame = function(jQuery, data, options, element) {
  console.log("ready to play BATTLESHIP!!");

  $(".cell").hover(function() {
    $(".cell").addClass("cell-selected");
  }, function() {
    $(".cell").removeClass("cell-selected");
  });
};

// // Set height and widths for optimal graph display. Also add "px" to some
// // strings.
// let totalArray = [];
// let barMax = 0;
// let chartWidth = options.width + "px";
// let chartHeight = options.height + "px";
// let areaWidth = "90%";
// let yAxisWidth = 5;
// let titleAxisHeight = "6%";
// let xaxisHeight = "6%";
// let areaHeight = "78%";
// let barVal = [];