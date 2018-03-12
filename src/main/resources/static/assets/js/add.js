$(function () {
  // Load list of activities and populate the related dropdown
  $.get('/activities', function(data) {
      if (!data || !data._embedded || !data._embedded.activities) return;
      data = data["_embedded"].activities;
      $related = $('#related');
      $participations = $('#participations');
      data.forEach(function(activity) {
        $option = $('<option></option>').attr('id',activity.title).text(activity.title);
        $related.append($option);
        $participations.append($option.clone());
      });
  });

  $('#add-activity-form').submit(function() {
    var title = $('#title').val();
    var description = $('#description').val();
    if(!title || !description) {
      alert('Must specify title and description');
      return false;
    }
    var related = $('#related').val();
    $.ajax({
      type: 'POST',
      url: '/activities',
      contentType: 'application/json',
      data: JSON.stringify({title: title, description: description})
    })
    .then(function() {
      related.forEach(function(relatedActivity) {
        $.get('/addRelationship?a1Title='+encodeURIComponent(title)+'&a2Title='+encodeURIComponent(relatedActivity));
      });
      $('#title').val('');
      $('#description').val('');
      $('#related option').prop('selected',false);
    })
    .catch(function(error) {
      console.log(error);
      alert('There was an error adding the activity. Please try again. If this persists, contact the site admin.');
    });
    return false;
  });
  $('#participation-form').submit(function() {
    var callsign = $('#callsign').val();
    if(!callsign) {
      alert('Must specify callsign');
      return false;
    }
    var participations = $('#participations').val();
    participations.forEach(function(activity) {
      $.get('/addParticipant?callsign='+encodeURIComponent(callsign)+'&activityTitle='+encodeURIComponent(activity));
    });
    $('#callsign').val('');
    $('#participations option').prop('selected',false);
    return false;
  });

});
