# hamgraphs

## Getting Started

To get started (using these instructions), make sure you have Maven, Spring Boot, and Docker installed.  First clone the repository.  After cloning the repository, run the command 

    mvn install

Then, to create the Docker image that will run the Spring Boot app server, run

    docker build -t hamgraphs/server:latest .

Finally, to run an instance of neo4j locally along with the hamgraphs server, run

    docker-compose up
    
If you have never used neo4j before you will need to browse to [localhost:7474](http://localhost:7474) and login with the credentials neo4j/neo4j.  When prompted, set the password to temporary.  If you choose a different password, or have configured neo4j before, edit the application.properties file in src/main/resources to reflect the credentials for neo4j you have set up.
    
Now, you should be able to browse to [localhost:8080](http://localhost:8080) and see the application.  Add some activities and see the graph grow!

## Making Changes and re-running

If you are planning on doing a lot of development, I would recommend running your neo4j instance separately from the Spring Boot application.  You can do this by running the docker container for neo4j separately, and then running the hamgraphs web server in docker separately, or using `mvn spring-boot:run`.  Note that if you do this, you will want to edit the application.properties file to appropriately link to the network address and port for neo4j (it is currently configured to work with the docker-compose created network.  Then, as you make changes in Java, you can just rerun the web server, and the HTML/Javascript/CSS is statically served so you can simply edit those files locally and refresh your browser to see the changes.

## Debugging

Neo4j has a nice web interface to browse the graph, even if you don't know much GraphQL.  Simply navigate to [localhost:7474](http://localhost:7474) (or wherever you have configured neo4j to be exposed) and login with the credentials neo4j/temporary (or whatever credentials you have specified).

Using `docker-compose up` or `mvn spring-boot:run` logs will appear in the terminal. You can also run the application through Eclipse or Intellij IDEA Enterprise Edition if you want full debugger support.
