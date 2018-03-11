package hamgraphs.spring.data.neo4j.controller;

import java.util.Map;

import hamgraphs.spring.data.neo4j.services.ActivityService;
import hamgraphs.spring.data.neo4j.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Joe Petrich
 */
@RestController("/")
public class ActivityController {

	final ActivityService activityService;
	final UserService userService;

	@Autowired
	public ActivityController(ActivityService activityService, UserService userService) {
		this.activityService = activityService;
		this.userService = userService;
	}

	@RequestMapping("/graph")
	public Map<String, Object> graph(@RequestParam(value = "limit",required = false) Integer limit) {
		return activityService.graph(limit == null ? 100 : limit);
	}

  @RequestMapping("/addRelationship")
  public void addRelationship(@RequestParam(value = "a1Title",required = true) String a1Title, @RequestParam(value = "a2Title", required = true) String a2Title) {
    activityService.addRelationship(a1Title, a2Title);
  }

  @RequestMapping("/addParticipant")
	public void addParticipant(@RequestParam(value = "callsign", required = true) String callsign, @RequestParam(value = "activityTitle", required = true) String activityTitle) {
		activityService.addParticipant(callsign, activityTitle);
  }
}
