package hamgraphs.spring.data.neo4j.domain;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import org.neo4j.ogm.annotation.GraphId;
import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Relationship;

/**
 * @author Joe Petricb
 */
@JsonIdentityInfo(generator=ObjectIdGenerators.PropertyGenerator.class, property="id")
@NodeEntity
public class Activity {

	@GraphId
	private Long id;

	private String title;

	private String description;

  private User creator;

  @Relationship(type = "RELATED_TO", direction = Relationship.UNDIRECTED)
  private List<Activity> relatedActivities = new ArrayList<>();

	public Activity() {
	}

	public Activity(String title, String description, User creator) {
		this.title = title;
		this.description = description;
    this.creator = creator;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public String getDescription() {
		return description;
	}

  public User getCreator() {
    return creator;
  }

	@Relationship(type = "RELATED_TO", direction = Relationship.UNDIRECTED)
  public List<Activity> getRelatedActivities() {
		System.out.println("getting relatedActivities");
		System.out.println(relatedActivities);
    return relatedActivities;
  }

  public void addRelatedActivity(Activity activity) {
    this.relatedActivities.add(activity);
  }
}
