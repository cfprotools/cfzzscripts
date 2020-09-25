$(function () {
  window._CFZ = window._CFZ || {};
  var document_url = _CFZ.document_url || null;
  var zoomzilla_public_api = 'https://cfzoomzilla.herokuapp.com/public_api/registrant';
  var occasion_id = _CFZ.occasion_id;
  var alreadySigned = localStorage.getItem('cfz_document_1_signed') || false;
  var alreadyLoggedIn = localStorage.getItem("cfz_already_logged_in") || false;

  if (alreadySigned && alreadySigned == "true" && !alreadyLoggedIn) {
    $('[data-title*="already-signed-warning"]').fadeIn();
  }

  $('[href="#validate-buyer"]').on('click', function (ev) {
    $('.otoloading').show();
    var email = $('[name="email"]').val();

    if (!email) {
      $('.otoloading').hide();
      alert("Email is required.")
      return false;
    }

    $.ajax(zoomzilla_public_api + '?occasion_id=' + occasion_id + '&email=' + encodeURIComponent(email))
    .done(function (data) {
      console.log(data);
      var email = data.email;
      var allowed = data.allowed;
      var first_name = data.first_name;
      var last_name = data.last_name;
      var member_email = data.member_email;
      var member_password = data.member_password;

      var error = data.error;

      if (error) {
        alert('There was a problem with your request. Please make sure you entered the correct email address. ' + error);
        $('.otoloading').hide();
        return false;
      }

      if (!allowed) {
        var signatures = data.signatures;

        if (!signatures && document_url) {
          if (!alreadySigned) {
            //go to document 1

            document_url = document_url.replace('{{email}}',email);
            document_url = document_url.replace('{{first_name}}',first_name);
            document_url = document_url.replace('{{last_name}}',last_name);

            window.location.href = document_url;

            return false;
          } else {
            alert("Sorry, it looks like you've already signed the agreements, but it hasn't quite reached our system yet.  Please wait a few minutes and try again.");
            $('.otoloading').hide();

            return false;
          }
        }

        //there must have been the required signature
        alert("Sorry, it looks like there is an issue with your registration. Please contact client care.");
        $('.otoloading').hide();

        return false;
      }

      if (email && allowed) {
        localStorage.setItem("cfz_email", email);
        localStorage.setItem("cfz_already_logged_in", "true");
        $('[name="member[email]"]').val(member_email);
        $('[name="member[password]"]').val(member_password);
        $('[name="member[password]"]').prop('type','text');
        $('[name="member[password]"]').attr('readonly', true).attr('autocomplete',false);

        $('form[action="/members/sign_in"]').submit();
      }
    })
    .fail(function (data) {
      $('.otoloading').hide();
      alert("There was an error processing your request.  Please refresh this page and try again.");
    });

    return false;
  });
});
