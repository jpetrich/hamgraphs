package hamgraphs.spring.data.neo4j.services;

import java.util.*;

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
		List<Map<String, Object>> nodes = new ArrayList<>();
		List<Map<String, Object>> rels = new ArrayList<>();
		int i = 0;
		Iterator<Activity> result = activities.iterator();
		while (result.hasNext()) {
			System.out.println("in hasNext()");

			Activity activity = result.next();
			nodes.add(map("title", activity.getTitle(), "label", "activity"));
			int target = i;
			i++;
			for (Activity a2 : activity.getRelatedActivities()) {
				System.out.println("looping");
				Map<String, Object> otherActivity = map("title", a2.getTitle(), "label", "activity");
				int source = nodes.indexOf(otherActivity);
				if (source == -1) {
					nodes.add(otherActivity);
					source = i++;
				}
				rels.add(map("source", source, "target", target));
			}
		}
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
}
