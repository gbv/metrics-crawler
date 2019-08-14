# Web Crawler for the project **metrics*

Project website: https://metrics-project.net/

## Installation

- install packages via npm
- globally install node package "forever"

- for sending of automated status mails you need php (not neccessary for main functionality)

- set up database and use /db_schema/db.sql and lines in /db_schema/my.cnf (customize the config lines before copying)
	- insert one row into database table "mb_sys" with sysRunning = 1

- for the doi resolving set up firefox with a profile (about:profiles) that
	- starts with a blank page
	- has disk caching disabled (about:config, browser.cache.disk.enable = false)
	- optionally has an extension installed that sends custom headers so you are not crawling anonymously

- install and set up "geckodriver" for firefox

- check if you are happy with what /agents/_doi_agents/kill_processes.js does

- create a /agents/config.json according to /agents/example_config.json and enter your data

- set your environment variables according to /docs/env_template.txt (use your credentials), you can copy the content of /docs/env_template.txt to your .bashrc (home directory, linux)


## Using the Bot

- import data
	- works identified by doi: insert into table 'works', you must fill column 'doi' with doi like 10.xxxxxxx, you can fill the work type into the 'type' column, you can fill the origin of the work (for example the repository it is listed in) into the column 'origin'; dot not fill into any other columns
	- works identified by repository handles: insert into table 'works_alt', you must fill column 'local_handle' with the repository handle, you must fill column 'repo' with the repo the work is listed in, you must fill column 'term_1' (with a search term like repository landing page url) if you want to crawl twitter - you can add more terms in 'term_2' and 'term_2', do not fill into any other columns
		

- use the following files in /agents (with `node {filename}`):
	- start_all.js (start bot)
	- end_all.js (stop bot)
	- reset_log.js (clear the forever log files)
	- rem_logs.js (remove the forever log files)

- only stop the bot with end_all.js (graceful exit)
- if you want to start single agents manually make sure that the row in the sql table "mb_sys" has a column value of 1 for column "sysRunning"
