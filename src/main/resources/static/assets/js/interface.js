$(function () {
  function showActivity(title) {
    $.get("/activities/search/findByTitle?title=" + encodeURIComponent(title), function (data) {
      if (!data ) return; //  || !data["_embedded"].movies) return;
      var activity = data; // ["_embedded"].movies[0];
      $("#title").text(activity.title);
      $("#description").text(activity.description);
      /*
      var $list = $("#participants").empty();
      activity.participants.forEach(function (participants) {
      $.get(participants._links.user.href, function(personData) {
      var person = personData.callsign;
      $list.append($("<li>" + person + "</li>"));
      });
      });
      */
    }, "json");
    return false;
  }
  function search() {
    var query=$("#search").find("input[name=search]").val();
    $.get("/activities/search/findByTitleLike?title=*" + encodeURIComponent(query) + "*", function (data) {
      var t = $("table#results tbody").empty();
      if (!data) return;
      data = data["_embedded"].activities;
      data.forEach(function (activity) {
        $("<tr><td class='activity'>" + activity.title + "</td><td>" + activity.description + "</td></tr>").appendTo(t)
        .click(function() { showActivity($(this).find("td.activity").text());})
      });
      showActivity(data[0].title);
    }, "json");
    return false;
  }

  $("#search").submit(search);
  search();

  // WIP
  // figure out how much room we have for graph
  var height = window.innerHeight - 100 - $('#interface')[0].getBoundingClientRect().height;
  var width = $('body').width();
  $('#graph').height(height);
  loadGraph(width,height);
});
