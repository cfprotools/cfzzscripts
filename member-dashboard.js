$(function () {
  var zoomzilla_public_api = 'https://cfzoomzilla.herokuapp.com/public_api/registrant';
  var email = localStorage.getItem("cfz_email") || localStorage.getItem("garlic:"+document.location.host+"*>input.email");
  var occasion_id = _CFZ.occasion_id || null;
  
  $.ajax(zoomzilla_public_api + '?occasion_id=' + occasion_id + '&email=' + email)
  .done(function (data) {
    var zoomLink = null;
    var allowed = data.allowed;
    
    if (data.error || !allowed) {
      console.log(data.error);
      zoomLink = "javascript:alert('Looks like there was a problem looking up your Zoom Room. Please contact the help desk.')";
      $(document).on('click', '[href="#zoomzilla-link"]', function () {
        console.log(zoomLink);
        $(this).attr('href', zoomLink).attr('target','_blank');
      });
      return false;
    }
    
    if (data.room) {
      zoomLink = data.room.link;
    } else {
      zoomLink = "javascript:alert('It appears you have not yet been assigned a Zoom link. Please contact the help desk.')";
    }

    if (zoomLink) {
      $(document).on('click', '[href="#zoomzilla-link"]', function () {
        $(this).attr('href', zoomLink).attr('target','_top');
      });
    }
    
  });
});
