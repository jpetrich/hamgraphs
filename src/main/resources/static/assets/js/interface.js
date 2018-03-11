$(function () {
  // figure out how much room we have for graph
  var height = window.innerHeight;
  var width = $('body').width() - $('#interface')[0].getBoundingClientRect().width;
  $('#graph').height(height);
  $('#interface').height(height-20);
  var GRAPH = new Graph(width,height);
  GRAPH.load();

  $('#reset').click(function() {
    GRAPH.resetPosition();
    return false;
  });
  $('#zoom-in').click(function() {
    GRAPH.zoom(1);
    return false;
  });
  $('#zoom-out').click(function() {
    GRAPH.zoom(-1);
    return false;
  });
  $('#move-left').click(function() {
    GRAPH.move('x',1);
    return false;
  });
  $('#move-right').click(function() {
    GRAPH.move('x',-1);
    return false;
  });
  $('#move-up').click(function() {
    GRAPH.move('y',1);
    return false;
  });
  $('#move-down').click(function() {
    GRAPH.move('y',-1);
    return false;
  });
  
  // highlight the selected node
  function highlight(title) {
    var $node = $('circle#hamgraph_'+title.replace(/ /g,'_'));
    if($node.hasClass('selected')) {
      $node.toggleClass('selected');
      GRAPH.centerOnNode(); // this resets the centering
    }
    else {
      $('circle').removeClass('selected');
      $node.addClass('selected');
    }
  }

  function selectActivityFromSearchResults(title) {
    var node = $('circle#hamgraph_'+title.replace(/ /g,'_'));
    if(node && node.length) {
      // workaround to trigger d3 click via jquery
      node.each(function(i,e) {
        var evt = new MouseEvent('click');
        e.dispatchEvent(evt);
      });
    }
    else {
      showDetails(title);
    }
  }

  function selectActivityFromNodeClick(e,node) {
    showDetails(node.title);
    highlight(node.title);
  }

  function showDetails(title) {
    /* load additional details for the activity into the details pane */
    $.get("/activities/search/findByTitle?title=" + encodeURIComponent(title), function (data) {
      if (!data ) return; //  || !data["_embedded"].movies) return;
      var activity = data; // ["_embedded"].movies[0];
      $("#detail-title").text(activity.title);
      $("#detail-description").text(activity.description);
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
    var query=$("#search").val();
    $.get("/activities/search/findByTitleLike?title=*" + encodeURIComponent(query) + "*", function (data) {
      var resultsContainer = $("#search-results").empty();
      if (!data) return;
      data = data["_embedded"].activities;
      data.forEach(function (activity) {
        var template = '<div class="search-result"><div class="title">'+activity.title+'</div><div class="description">'+activity.description+'</div></div>';
        $(template).appendTo(resultsContainer).click(function() { 
          var $this = $(this)
          if($this.hasClass('selected')) {
            $this.removeClass('selected');
          }
          else {
            $('.search-result').removeClass('selected');
            $this.addClass('selected');
          }
          selectActivityFromSearchResults($this.find(".title").text());
        })
      });
      selectActivityFromSearchResults(data[0].title);
    }, "json");
    return false;
  }

  $('#interface').on('selectActivityFromNodeClick',selectActivityFromNodeClick);
  $("#search").submit(search);
  $("#search-button").click(search);
  search();

});
