package hamgraphs.spring.data.neo4j;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

/**
* @author Joseph Petrich
*/

@SpringBootApplication
@EntityScan("hamgraphs.spring.data.neo4j.domain")
public class HamGraphsApplication {

	public static void main(String[] args) {
		SpringApplication.run(HamGraphsApplication.class, args);
	}
}
