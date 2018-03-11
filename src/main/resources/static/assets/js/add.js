$(function () {
  // Load list of activities and populate the related dropdown
  $.get('/activities', function(data) {
      if (!data || !data._embedded || !data._embedded.activities) return;
      data = data["_embedded"].activities;
      $related = $('#related');
      data.forEach(function(activity) {
        $related.append('<option id="'+activity.title+'">'+activity.title+'</option>');
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
        $.get('/addRelationship?a1Title='+title+'&a2Title='+relatedActivity);
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

});
