Template.playMovieModal.rendered = function() {
    var modal, src;
    var videoString = Session.get('currentExercise').videoId
    console.log(videoString)
    $('#movie-iframe').attr('src', src = "https://www.youtube.com/embed/" + videoString );
  };