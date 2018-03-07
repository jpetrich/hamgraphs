package hamgraphs.spring.data.neo4j.domain;


import java.util.ArrayList;
import java.util.Collection;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import org.neo4j.ogm.annotation.EndNode;
import org.neo4j.ogm.annotation.GraphId;
import org.neo4j.ogm.annotation.RelationshipEntity;
import org.neo4j.ogm.annotation.StartNode;
import org.springframework.stereotype.Component;


/**
 * @author Mark Angrish
 */
@JsonIdentityInfo(generator=ObjectIdGenerators.PropertyGenerator.class, property="id")
@RelationshipEntity(type = "RELATED_TO")
public class Relationship {

	@GraphId
	private Long id;

	private Collection<String> relationships = new ArrayList<>();

	@StartNode
	private Activity a1;

	@EndNode
	private Activity a2;

	public Relationship() {
	}

	public Relationship(Activity a1, Activity a2) {
		this.a1 = a1;
		this.a2 = a2;
	}

	public Long getId() {
		return id;
	}

	public Collection<String> getRelationships() {
		return relationships;
	}

	public Activity getA1() {
		return a1;
	}

	public Activity getA2() {
		return a2;
	}

	public void addRoleName(String name) {
		this.relationships.add(name);
	}
}
