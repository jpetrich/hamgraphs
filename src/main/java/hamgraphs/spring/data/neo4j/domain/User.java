package hamgraphs.spring.data.neo4j.domain;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import org.neo4j.ogm.annotation.GraphId;
import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Relationship;

/**
 * @author Joseph Petrich
 */
@JsonIdentityInfo(generator=ObjectIdGenerators.PropertyGenerator.class, property="id")
@NodeEntity
public class User {

	@GraphId
	private Long id;

	private String callsign;

	@Relationship(type = "PARTICIPATES_IN", direction = Relationship.OUTGOING)
	private List<Activity> activities = new ArrayList<>();

	public User() {
	}

	public User(String callsign) {
		this.callsign = callsign;
	}

	public Long getId() {
		return id;
	}

	public String getCallsign() {
		return callsign;
	}

	public List<Activity> getActivities() {
		return activities;
	}
}
