// $(function(){
// })

$(document).ready(function() {

		// for Materialize 'select' input type (dropdown menu)
    $('select').material_select();
    $('.modal-trigger').leanModal({
          dismissible: true, // Modal can be dismissed by clicking outside of the modal
          opacity: .6, // Opacity of modal background
          in_duration: 150, // Transition in duration
          out_duration: 100, // Transition out duration
      }
    );


});