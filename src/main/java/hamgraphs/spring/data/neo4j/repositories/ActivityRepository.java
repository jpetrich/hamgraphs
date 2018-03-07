package hamgraphs.spring.data.neo4j.repositories;

import java.util.Collection;

import hamgraphs.spring.data.neo4j.domain.Activity;
import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 * @author Joe Petrich
 */
@RepositoryRestResource(collectionResourceRel = "activities", path = "activities")
public interface ActivityRepository extends PagingAndSortingRepository<Activity, Long> {

	Activity findByTitle(@Param("title") String title);

	Collection<Activity> findByTitleLike(@Param("title") String title);

	@Query("MATCH (m:Activity)<-[r:RELATED_TO]-(a:Activity) RETURN m,r,a LIMIT {limit}")
	Collection<Activity> graph(@Param("limit") int limit);
}
