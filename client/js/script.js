counter = function() {
  var value = $('#text-entry').val();
  var minimum = $('#wordCountMinimum').html();

  if (value.length == 0) {
    $('#wordCount').html(0);
    return;
  }

  var regex = /\s+/gi;
  var wordCount = value.trim().replace(regex, ' ').split(' ').length;

  //Set an arbitrary upper limit so people can't dump in huge text files
  if(wordCount >= minimum && wordCount <= 5000){
    $('#text-file-save').removeAttr('disabled')
  } else {
    $('#text-file-save').attr('disabled', 'disabled')
  }

  $('#wordCount').html(wordCount);
};

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

  $('#text-file-save').attr('disabled', 'disabled')
  $('#word-count-input').hide();
  $('#content-type-selection').click(function(){
    if($('#text').is(':checked')) {
      $('#word-count-input').show();
    } else {
      $('#word-count-input').hide();
    }
  })
  $('#text-entry').keydown(counter);

  $('#upload-text-form').submit(function(e){
    e.preventDefault();

    var textAreaContent = $('#text-entry').val();
    var wordCount       = $('#wordCount').html();
    var title           = $('#text-title').val();
    var note            = $('#text-note').val();

    $.ajax({
      url: '/submissions/uploadtext',
      method: 'post',
      data: {newSubmission: textAreaContent, wordCount: wordCount.trim(), title: title.trim(), note: note.trim()},
      success: function(data){
        window.location.href = '/dashboard';
      },
      error: function(err){
        window.location.href = '/dashboard';
        console.log(err)
      }
    })
  })


});