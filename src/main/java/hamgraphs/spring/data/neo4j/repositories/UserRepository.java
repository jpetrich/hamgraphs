package hamgraphs.spring.data.neo4j.repositories;

import java.util.Collection;

import hamgraphs.spring.data.neo4j.domain.User;
import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 * @author Joe Petrich
 */
@RepositoryRestResource(collectionResourceRel = "users", path = "users")
public interface UserRepository extends PagingAndSortingRepository<User, Long> {
    User findByCallsign(@Param("call") String title);

    Collection<User> findByCallsignLike(@Param("call") String title);
}
