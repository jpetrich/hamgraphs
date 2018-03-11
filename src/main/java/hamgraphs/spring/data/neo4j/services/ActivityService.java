package hamgraphs.spring.data.neo4j.services;

import java.util.*;
import java.util.function.Consumer;
import java.util.stream.Collectors;

import hamgraphs.spring.data.neo4j.domain.Activity;
import hamgraphs.spring.data.neo4j.domain.User;
import hamgraphs.spring.data.neo4j.repositories.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ActivityService {

	@Autowired ActivityRepository ActivityRepository;

	private Map<String, Object> toD3Format(Collection<Activity> activities) {
	    List<Activity> activitiesList = activities.stream().collect(Collectors.toList());
	    Integer minUsers = Math.max(1, activities.stream().map((Activity a) -> a.getPartipantsCount()).reduce(Integer.MAX_VALUE,(Integer a, Integer b) -> Math.min(a, b)));
	    HashSet<Activity> visited = new HashSet<>(activities.size());
		List<Map<String, Object>> nodes = activitiesList.stream().map((Activity a) -> {
			Map<String, Object> jsonMap = map("title", a.getTitle(), "label", "activity");
			jsonMap.put("relativeUserCount", Math.max(1, a.getPartipantsCount()/minUsers));
//			jsonMap.put("users", a.getParticipants());
			return jsonMap;
		}).collect(Collectors.toList());
		List<Map<String, Object>> rels = new ArrayList<>();
		activitiesList.stream()
            .filter((Activity a) -> !visited.contains(a))
            .forEach((Activity activity) -> {
                visited.add(activity);
                int source = activitiesList.indexOf(activity);
                activity.getRelatedActivities().stream()
                        .filter((Activity b) -> !visited.contains(b))
                        .forEach((Activity b) -> rels.add(map("source", source, "target", activitiesList.indexOf(b))));
                }
            );
		return map("nodes", nodes, "links", rels);
	}

	private Map<String, Object> map(String key1, Object value1, String key2, Object value2) {
		Map<String, Object> result = new HashMap<String, Object>(2);
		result.put(key1, value1);
		result.put(key2, value2);
		return result;
	}

	@Transactional(readOnly = true)
	public Map<String, Object>  graph(int limit) {
		Collection<Activity> result = ActivityRepository.graph(limit);
		return toD3Format(result);
	}

	@Transactional(readOnly = false)
	public void addRelationship(String a1Title, String a2Title) {
		ActivityRepository.addRelationship(a1Title, a2Title);
	}

	@Transactional(readOnly = false)
	public void addParticipant(String callsign, String activityTitle) {
		ActivityRepository.addParticipant(callsign, activityTitle);
	}

}
