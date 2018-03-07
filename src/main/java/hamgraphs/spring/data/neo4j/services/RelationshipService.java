package hamgraphs.spring.data.neo4j.services;

import java.util.*;

import hamgraphs.spring.data.neo4j.domain.Activity;
import hamgraphs.spring.data.neo4j.domain.User;
import hamgraphs.spring.data.neo4j.repositories.RelationshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RelationshipService {

	@Autowired RelationshipRepository RelationshipRepository;

	@Transactional(readOnly = false)
	public void addRelationship(String a1Title, String a2Title) {
    RelationshipRepository.addRelationship(a1Title, a2Title);
	}
}
