var counter = function() {
  var value = $('#text-entry').val();
  var minimum = $('#wordCountMinimum').html();
  if (value.length == 0) {
    $('#wordCount').html(0);
    return;
  }
  var regex = /\s+/gi;
  var wordCount = value.trim().replace(regex, ' ').split(' ').length;
  //Set an arbitrary upper limit so people can't dump in huge text files
  if (wordCount >= minimum && wordCount <= 5000) {
    $('#text-file-save').removeAttr('disabled')
  } else {
    $('#text-file-save').attr('disabled', 'disabled');
  }
  $('#wordCount').html(wordCount);
};

$(document).ready(function() {

  // for Materialize modal
  $('.modal-trigger').leanModal({
    dismissible: true, // Modal can be dismissed by clicking outside of the modal
    opacity: .6, // Opacity of modal background
    in_duration: 100, // Transition in duration
    out_duration: 100 // Transition out duration
  });

  // for Materialize dropdown menu button
  $('.dropdown-button').dropdown({
     belowOrigin: true,
     constrain_width: true,
     inDuration: 100,
     outDuration: 100
   });

  // for uploading text submissions
  $('#text-file-save').attr('disabled', 'disabled');
  $('#word-count-input').hide();
  $('#content-type-selection').click(function(){
    if($('#text').is(':checked')) {
      $('#word-count-input').show();
    } else {
      $('#word-count-input').hide();
    }
  });
  $('#text-entry').keydown(counter);
  $('#upload-text-form').submit(function(e) {
    e.preventDefault();
    var textAreaContent = $('#text-entry').val();
    var wordCount       = $('#wordCount').html();
    var title           = $('#text-title').val();
    var note            = $('#text-note').val();
    $.ajax({
      url: '/submissions/uploadtext',
      method: 'post',
      data: {
        newSubmission : textAreaContent,
        wordCount     : wordCount.trim(),
        title         : title.trim(),
        note          : note.trim()
      },
      success: function(data) {
        window.location.href = '/dashboard';
      },
      error: function(err) {
        console.log(err);
        window.location.href = '/dashboard';
      }
    });
  });

  $('#upload-link-form').submit(function(e) {
    e.preventDefault();
    var title = $('#link-title').val();
    var link  = $('#link-entry').val();
    var note  = $('#link-note').val();
    $.ajax({
      url: '/submissions/uploadtext',
      method: 'post',
      data: {
        newSubmission : link.trim(),
        title         : title.trim(),
        note          : note.trim()
      },
      success: function(data) {
        window.location.href = '/dashboard';
      },
      error: function(err) {
        console.log(err);
        window.location.href = '/dashboard';
      }
    });
  });

  $('#submit-comment').submit(function(e){
    e.preventDefault();
    var content = $('#comment').val();
    var date = new Date();
    var path = window.location.pathname.split('/');
    $.ajax({
      url: '/submissions/comment',
      method: 'post',
      data: {
        content: content,
        date: date,
        goalId: path[2],
        userId: path[3],
        weekNum: path[4],
        subNum: path[5]
      },
      success: function(data){
        $('#comment').val("")
        $('#comments-container').prepend('<div class="comment z-depth-1"><p>' + content + '</p><small>' + data.author
          + ' @ ' + date + '</small></div>')
      },
      error: function(data){
        console.log(err);
        window.location.href = '/dashboard';
      }
    });
  })

  // Selecting submissions for portfolio from archive view
  $('.port-select-toggle-button').on('click', function() {
    $(this).css('background-color', 'red');
    var selectedWeek = $(this).attr('week');
    var weekOneIndexed = Number(selectedWeek) + 1;
    var selectedSub = Number(prompt("Choose the submission number for week #" + weekOneIndexed + " to add to your portfolio.")) - 1;
    $.ajax({
      url: '/portfolio/select',
      type: 'post',
      data: {
        selectedWeek: selectedWeek,
        selectedSub: selectedSub
      },
      success: function(data) {
        window.location.href = '/archive';
      },
      error: function(err) {
        console.log(err);
      }
    });
  });

  // For archive port-select-toggle-button hover
  $('.port-select-toggle-button').hover(function() {
      $(this).css('background-color', 'blue');
  }, function() {
      $(this).css('background-color', 'gray');
  });

  $('.change-active-goal').on('click', function(){
    var goalId = $(this).attr('id');
    $.ajax({
      url: '/archive/changeActiveGoal',
      type: 'put',
      data: {
        goalId: goalId
      },
      success: function(data){
        location.reload()
      },
      error: function(err){
        console.log(err);
      }
    });
  });

});
