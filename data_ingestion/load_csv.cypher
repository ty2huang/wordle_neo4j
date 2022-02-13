LOAD CSV WITH HEADERS FROM "https://raw.githubusercontent.com/ty2huang/wordle_neo4j/main/wordle.csv" AS csvLine
MERGE (word:Word {name: csvLine.word});

LOAD CSV WITH HEADERS FROM "https://raw.githubusercontent.com/ty2huang/wordle_neo4j/main/wordle.csv" AS csvLine
MATCH (word:Word {name: csvLine.word})
MERGE (first:Letter {char: csvLine.pos_1})
MERGE (word)-[:POS1]->(first);

LOAD CSV WITH HEADERS FROM "https://raw.githubusercontent.com/ty2huang/wordle_neo4j/main/wordle.csv" AS csvLine
MATCH (word:Word {name: csvLine.word})
MERGE (second:Letter {char: csvLine.pos_2})
MERGE (word)-[:POS2]->(second);

LOAD CSV WITH HEADERS FROM "https://raw.githubusercontent.com/ty2huang/wordle_neo4j/main/wordle.csv" AS csvLine
MATCH (word:Word {name: csvLine.word})
MERGE (third:Letter {char: csvLine.pos_3})
MERGE (word)-[:POS3]->(third);

LOAD CSV WITH HEADERS FROM "https://raw.githubusercontent.com/ty2huang/wordle_neo4j/main/wordle.csv" AS csvLine
MATCH (word:Word {name: csvLine.word})
MERGE (fourth:Letter {char: csvLine.pos_4})
MERGE (word)-[:POS4]->(fourth);

LOAD CSV WITH HEADERS FROM "https://raw.githubusercontent.com/ty2huang/wordle_neo4j/main/wordle.csv" AS csvLine
MATCH (word:Word {name: csvLine.word})
MERGE (fifth:Letter {char: csvLine.pos_5})
MERGE (word)-[:POS5]->(fifth);
