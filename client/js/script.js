$(document).ready(function() {

  // for Materialize modal
  $('.modal-trigger').leanModal({
    dismissible: true, // Modal can be dismissed by clicking outside of the modal
    opacity: .6, // Opacity of modal background
    in_duration: 100, // Transition in duration
    out_duration: 100, // Transition out duration
  });

  // for Materialize dropdown menu button
  $('.dropdown-button').dropdown({
     belowOrigin: true,
     constrain_width: true,
     inDuration: 100,
     outDuration: 100
   });

});