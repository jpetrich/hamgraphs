package hamgraphs.spring.data.neo4j.services;

import hamgraphs.spring.data.neo4j.domain.Activity;
import hamgraphs.spring.data.neo4j.repositories.ActivityRepository;
import hamgraphs.spring.data.neo4j.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService {

	@Autowired
	UserRepository UserRepository;
}
