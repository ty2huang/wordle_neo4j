# Wordle Assistant with Neo4j

This chrome extension generates the query for a neo4j database used for Wordle. Thus, it would be useful to set up your own neo4j database to fully utilize this extension. See the "Setup" section for more details.

Note that this extension only works on the [wordlegame.org](https://wordlegame.org/) website.

## Setup
---
To add this extension to your chrome browser, clone this repository, go to your [chrome extensions](chrome://extensions/), and enable developer mode. Then, click "Load unpacked" and load the entire `chrome_extension` folder.

Next set up your neo4j database. Go to [neo4j.com](https://neo4j.com/), and mouse over "Get Started". You have the choice to use AuraDB to host your graph database on the cloud, or download the Desktop client. The free version of AuraDB is sufficient for this use case.

It should be easy enough to follow instructions through the neo4j website to create your neo4j server and database. Once you database is created, see the query you can run at `data_ingestion/load_csv.cypher` load data to your database. This imports all "word to letter" relationships for all 5-letter words that Wordle accepts.

## Usage
---
While playing on the [wordlegame.org](https://wordlegame.org/) website, open the chrome extension to see the query you can run in your neo4j database. 

This extension scans the green, yellow, and gray letters of the game to generate the query to run such that you can visualize all possible words in neo4j.

Note: the "Get Possible Words" feature does not work yet, as it will be implemented at a later date.
