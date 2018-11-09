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

- use the following files in /agents (with `node {filename}`):
	- start_all.js (start bot)
	- end_all.js (stop bot)
	- reset_log.js (clear the forever log files)
	- rem_logs.js (remove the forever log files)

- only stop the bot with end_all.js (graceful exit)
- if you want to start single agents manually make sure that the row in the sql table "mb_sys" has a column value of 1 for column "sysRunning"
