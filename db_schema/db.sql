-- MySQL dump 10.13  Distrib 5.7.23, for Linux (x86_64)
--
-- Host: localhost    Database: metrics_bot
-- ------------------------------------------------------
-- Server version	5.7.23-0ubuntu0.16.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Temporary table structure for view `charts_facebook`
--

DROP TABLE IF EXISTS `charts_facebook`;
/*!50001 DROP VIEW IF EXISTS `charts_facebook`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `charts_facebook` AS SELECT 
 1 AS `id`,
 1 AS `doi`,
 1 AS `origin`,
 1 AS `substr(url,1,180)`,
 1 AS `fb_sum`,
 1 AS `reaction_count_facebook`,
 1 AS `share_count_facebook`,
 1 AS `comment_count_facebook`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `charts_mendeley`
--

DROP TABLE IF EXISTS `charts_mendeley`;
/*!50001 DROP VIEW IF EXISTS `charts_mendeley`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `charts_mendeley` AS SELECT 
 1 AS `id`,
 1 AS `doi`,
 1 AS `origin`,
 1 AS `substring(url,1,180)`,
 1 AS `sum_mendeley`,
 1 AS `reader_count_mendeley`,
 1 AS `group_count_mendeley`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `charts_mendeley_s`
--

DROP TABLE IF EXISTS `charts_mendeley_s`;
/*!50001 DROP VIEW IF EXISTS `charts_mendeley_s`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `charts_mendeley_s` AS SELECT 
 1 AS `id`,
 1 AS `doi`,
 1 AS `type`,
 1 AS `origin`,
 1 AS `sum_mendeley`,
 1 AS `reader_count_mendeley`,
 1 AS `group_count_mendeley`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `charts_reddit`
--

DROP TABLE IF EXISTS `charts_reddit`;
/*!50001 DROP VIEW IF EXISTS `charts_reddit`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `charts_reddit` AS SELECT 
 1 AS `id`,
 1 AS `doi`,
 1 AS `origin`,
 1 AS `substring(url,1,180)`,
 1 AS `count_reddit`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `charts_twitter`
--

DROP TABLE IF EXISTS `charts_twitter`;
/*!50001 DROP VIEW IF EXISTS `charts_twitter`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `charts_twitter` AS SELECT 
 1 AS `id`,
 1 AS `doi`,
 1 AS `origin`,
 1 AS `substring(url,1,180)`,
 1 AS `sum_twitter`,
 1 AS `count_twitter_unique`,
 1 AS `count_twitter_retweets`,
 1 AS `first_update_twitter`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `charts_twitter_s`
--

DROP TABLE IF EXISTS `charts_twitter_s`;
/*!50001 DROP VIEW IF EXISTS `charts_twitter_s`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `charts_twitter_s` AS SELECT 
 1 AS `id`,
 1 AS `doi`,
 1 AS `type`,
 1 AS `origin`,
 1 AS `sum_twitter`,
 1 AS `count_twitter_unique`,
 1 AS `count_twitter_retweets`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `charts_wikipedia`
--

DROP TABLE IF EXISTS `charts_wikipedia`;
/*!50001 DROP VIEW IF EXISTS `charts_wikipedia`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `charts_wikipedia` AS SELECT 
 1 AS `work_id`,
 1 AS `doi`,
 1 AS `origin`,
 1 AS `substring(works.url, 1, 180)`,
 1 AS `sum_wikipedia`,
 1 AS `en`,
 1 AS `de`,
 1 AS `ceb`,
 1 AS `sv`,
 1 AS `fr`,
 1 AS `nl`,
 1 AS `ru`,
 1 AS `it`,
 1 AS `es`,
 1 AS `pl`,
 1 AS `war`,
 1 AS `vi`,
 1 AS `ja`,
 1 AS `zh`,
 1 AS `pt`,
 1 AS `uk`,
 1 AS `sr`,
 1 AS `fa`,
 1 AS `ca`,
 1 AS `ar`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `charts_youtube`
--

DROP TABLE IF EXISTS `charts_youtube`;
/*!50001 DROP VIEW IF EXISTS `charts_youtube`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `charts_youtube` AS SELECT 
 1 AS `id`,
 1 AS `doi`,
 1 AS `origin`,
 1 AS `substring(url,1,180)`,
 1 AS `count_youtube`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `check_twitter`
--

DROP TABLE IF EXISTS `check_twitter`;
/*!50001 DROP VIEW IF EXISTS `check_twitter`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `check_twitter` AS SELECT 
 1 AS `id`,
 1 AS `work_id`,
 1 AS `type`,
 1 AS `created`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `checks`
--

DROP TABLE IF EXISTS `checks`;
/*!50001 DROP VIEW IF EXISTS `checks`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `checks` AS SELECT 
 1 AS `max(last_update_facebook)`,
 1 AS `max(last_update_mendeley)`,
 1 AS `max(last_update_reddit)`,
 1 AS `max(last_update_twitter)`,
 1 AS `max(last_update_youtube)`,
 1 AS `max(last_update_url_browser)`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `checks_dumps`
--

DROP TABLE IF EXISTS `checks_dumps`;
/*!50001 DROP VIEW IF EXISTS `checks_dumps`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `checks_dumps` AS SELECT 
 1 AS `max(created)`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `checks_wikipedia`
--

DROP TABLE IF EXISTS `checks_wikipedia`;
/*!50001 DROP VIEW IF EXISTS `checks_wikipedia`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `checks_wikipedia` AS SELECT 
 1 AS `max(_en)`,
 1 AS `max(_de)`,
 1 AS `max(_ceb)`,
 1 AS `max(_sv)`,
 1 AS `max(_fr)`,
 1 AS `max(_nl)`,
 1 AS `max(_ru)`,
 1 AS `max(_it)`,
 1 AS `max(_es)`,
 1 AS `max(_pl)`,
 1 AS `max(_war)`,
 1 AS `max(_vi)`,
 1 AS `max(_ja)`,
 1 AS `max(_zh)`,
 1 AS `max(_pt)`,
 1 AS `max(_uk)`,
 1 AS `max(_sr)`,
 1 AS `max(_fa)`,
 1 AS `max(_ca)`,
 1 AS `max(_ar)`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `data_dumps_mendeley`
--

DROP TABLE IF EXISTS `data_dumps_mendeley`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `data_dumps_mendeley` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `work_id` int(10) unsigned NOT NULL,
  `obj_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data` mediumtext COLLATE utf8mb4_unicode_ci,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `work_id` (`work_id`),
  UNIQUE KEY `obj_id` (`obj_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20414 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `data_dumps_reddit`
--

DROP TABLE IF EXISTS `data_dumps_reddit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `data_dumps_reddit` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `work_id` int(10) unsigned NOT NULL,
  `hash` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `data` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `work_id` (`work_id`,`hash`)
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `data_dumps_twitter`
--

DROP TABLE IF EXISTS `data_dumps_twitter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `data_dumps_twitter` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `work_id` int(10) unsigned NOT NULL,
  `obj_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data` mediumtext COLLATE utf8mb4_unicode_ci,
  `type` tinyint(4) DEFAULT NULL,
  `search_url` text COLLATE utf8mb4_unicode_ci,
  `occurred` datetime DEFAULT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `work_id` (`work_id`,`obj_id`),
  KEY `obj_id` (`obj_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11123 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `data_dumps_wikipedia`
--

DROP TABLE IF EXISTS `data_dumps_wikipedia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `data_dumps_wikipedia` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `work_id` int(10) unsigned NOT NULL,
  `wiki` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `data` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `wiki` (`wiki`,`work_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1141 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `data_dumps_youtube`
--

DROP TABLE IF EXISTS `data_dumps_youtube`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `data_dumps_youtube` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `work_id` int(10) unsigned NOT NULL,
  `hash` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `data` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `work_id` (`work_id`,`hash`)
) ENGINE=InnoDB AUTO_INCREMENT=1703 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mb_sys`
--

DROP TABLE IF EXISTS `mb_sys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mb_sys` (
  `sysRunning` tinyint(4) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary table structure for view `pool`
--

DROP TABLE IF EXISTS `pool`;
/*!50001 DROP VIEW IF EXISTS `pool`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `pool` AS SELECT 
 1 AS `id`,
 1 AS `doi`,
 1 AS `origin`,
 1 AS `committed_doi_resolve`,
 1 AS `last_update_url_browser`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `sources`
--

DROP TABLE IF EXISTS `sources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sources` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url` text COLLATE utf8mb4_unicode_ci,
  `data_saving` smallint(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary table structure for view `stats`
--

DROP TABLE IF EXISTS `stats`;
/*!50001 DROP VIEW IF EXISTS `stats`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `stats` AS SELECT 
 1 AS `id`,
 1 AS `doi`,
 1 AS `type`,
 1 AS `origin`,
 1 AS `substring(url,1,180)`,
 1 AS `sum_mendeley`,
 1 AS `reader_count_mendeley`,
 1 AS `group_count_mendeley`,
 1 AS `sum_twitter`,
 1 AS `count_twitter_unique`,
 1 AS `count_twitter_retweets`,
 1 AS `first_update_twitter`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `stats_all`
--

DROP TABLE IF EXISTS `stats_all`;
/*!50001 DROP VIEW IF EXISTS `stats_all`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `stats_all` AS SELECT 
 1 AS `id`,
 1 AS `origin`,
 1 AS `type`,
 1 AS `doi`,
 1 AS `sum_facebook`,
 1 AS `sum_mendeley`,
 1 AS `count_reddit`,
 1 AS `sum_twitter`,
 1 AS `sum_wikipedia`,
 1 AS `count_youtube`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `stats_mend`
--

DROP TABLE IF EXISTS `stats_mend`;
/*!50001 DROP VIEW IF EXISTS `stats_mend`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `stats_mend` AS SELECT 
 1 AS `id`,
 1 AS `doi`,
 1 AS `type`,
 1 AS `origin`,
 1 AS `substring(url, 1, 180)`,
 1 AS `sum_mendeley`,
 1 AS `reader_count_mendeley`,
 1 AS `group_count_mendeley`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `stats_twit`
--

DROP TABLE IF EXISTS `stats_twit`;
/*!50001 DROP VIEW IF EXISTS `stats_twit`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `stats_twit` AS SELECT 
 1 AS `id`,
 1 AS `doi`,
 1 AS `type`,
 1 AS `origin`,
 1 AS `substring(url,1,180)`,
 1 AS `sum_mendeley`,
 1 AS `reader_count_mendeley`,
 1 AS `group_count_mendeley`,
 1 AS `sum_twitter`,
 1 AS `count_twitter_unique`,
 1 AS `count_twitter_retweets`,
 1 AS `first_update_twitter`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `stats_url`
--

DROP TABLE IF EXISTS `stats_url`;
/*!50001 DROP VIEW IF EXISTS `stats_url`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `stats_url` AS SELECT 
 1 AS `id`,
 1 AS `type`,
 1 AS `origin`,
 1 AS `doi`,
 1 AS `url`,
 1 AS `last_update_url_browser`,
 1 AS `created`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `sums`
--

DROP TABLE IF EXISTS `sums`;
/*!50001 DROP VIEW IF EXISTS `sums`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `sums` AS SELECT 
 1 AS `sum(reaction_count_facebook)`,
 1 AS `sum(comment_count_facebook)`,
 1 AS `sum(share_count_facebook)`,
 1 AS `sum(comment_plugin_count_facebook)`,
 1 AS `sum(reader_count_mendeley)`,
 1 AS `sum(group_count_mendeley)`,
 1 AS `sum(count_reddit)`,
 1 AS `sum(count_twitter_unique)`,
 1 AS `sum(count_twitter_retweets)`,
 1 AS `sum(count_youtube)`,
 1 AS `sum_wikipedia`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `types`
--

DROP TABLE IF EXISTS `types`;
/*!50001 DROP VIEW IF EXISTS `types`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `types` AS SELECT 
 1 AS `type`,
 1 AS `count`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `url_groups`
--

DROP TABLE IF EXISTS `url_groups`;
/*!50001 DROP VIEW IF EXISTS `url_groups`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `url_groups` AS SELECT 
 1 AS `work_id`,
 1 AS `count`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `urls`
--

DROP TABLE IF EXISTS `urls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `urls` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `work_id` int(10) unsigned NOT NULL,
  `hash` varchar(16) NOT NULL,
  `prot` tinyint(3) unsigned NOT NULL,
  `url` text NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `reaction_count_facebook` int(10) unsigned DEFAULT NULL,
  `comment_count_facebook` int(10) unsigned DEFAULT NULL,
  `share_count_facebook` int(10) unsigned DEFAULT NULL,
  `comment_plugin_count_facebook` int(10) unsigned DEFAULT NULL,
  `count_reddit` int(10) unsigned DEFAULT NULL,
  `count_youtube` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `work_id` (`work_id`,`hash`)
) ENGINE=InnoDB AUTO_INCREMENT=3712 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary table structure for view `w_err_NO_DELETE`
--

DROP TABLE IF EXISTS `w_err_NO_DELETE`;
/*!50001 DROP VIEW IF EXISTS `w_err_NO_DELETE`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `w_err_NO_DELETE` AS SELECT 
 1 AS `id`,
 1 AS `doi`,
 1 AS `url`,
 1 AS `state`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `wikipedia`
--

DROP TABLE IF EXISTS `wikipedia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wikipedia` (
  `work_id` int(10) unsigned NOT NULL,
  `en` mediumint(8) unsigned DEFAULT NULL,
  `_en` datetime DEFAULT NULL,
  `de` mediumint(8) unsigned DEFAULT NULL,
  `_de` datetime DEFAULT NULL,
  `ceb` mediumint(8) unsigned DEFAULT NULL,
  `_ceb` datetime DEFAULT NULL,
  `sv` mediumint(8) unsigned DEFAULT NULL,
  `_sv` datetime DEFAULT NULL,
  `fr` mediumint(8) unsigned DEFAULT NULL,
  `_fr` datetime DEFAULT NULL,
  `nl` mediumint(8) unsigned DEFAULT NULL,
  `_nl` datetime DEFAULT NULL,
  `ru` mediumint(8) unsigned DEFAULT NULL,
  `_ru` datetime DEFAULT NULL,
  `it` mediumint(8) unsigned DEFAULT NULL,
  `_it` datetime DEFAULT NULL,
  `es` mediumint(8) unsigned DEFAULT NULL,
  `_es` datetime DEFAULT NULL,
  `pl` mediumint(8) unsigned DEFAULT NULL,
  `_pl` datetime DEFAULT NULL,
  `war` mediumint(8) unsigned DEFAULT NULL,
  `_war` datetime DEFAULT NULL,
  `vi` mediumint(8) unsigned DEFAULT NULL,
  `_vi` datetime DEFAULT NULL,
  `ja` mediumint(8) unsigned DEFAULT NULL,
  `_ja` datetime DEFAULT NULL,
  `zh` mediumint(8) unsigned DEFAULT NULL,
  `_zh` datetime DEFAULT NULL,
  `pt` mediumint(8) unsigned DEFAULT NULL,
  `_pt` datetime DEFAULT NULL,
  `uk` mediumint(8) unsigned DEFAULT NULL,
  `_uk` datetime DEFAULT NULL,
  `sr` mediumint(8) unsigned DEFAULT NULL,
  `_sr` datetime DEFAULT NULL,
  `fa` mediumint(8) unsigned DEFAULT NULL,
  `_fa` datetime DEFAULT NULL,
  `ca` mediumint(8) unsigned DEFAULT NULL,
  `_ca` datetime DEFAULT NULL,
  `ar` mediumint(8) unsigned DEFAULT NULL,
  `_ar` datetime DEFAULT NULL,
  PRIMARY KEY (`work_id`),
  KEY `_en` (`_en`),
  KEY `_de` (`_de`),
  KEY `_ceb` (`_ceb`),
  KEY `_sv` (`_sv`),
  KEY `_fr` (`_fr`),
  KEY `_nl` (`_nl`),
  KEY `_ru` (`_ru`),
  KEY `_it` (`_it`),
  KEY `_es` (`_es`),
  KEY `_pl` (`_pl`),
  KEY `_war` (`_war`),
  KEY `_vi` (`_vi`),
  KEY `_ja` (`_ja`),
  KEY `_zh` (`_zh`),
  KEY `_pt` (`_pt`),
  KEY `_uk` (`_uk`),
  KEY `_sr` (`_sr`),
  KEY `_fa` (`_fa`),
  KEY `_ca` (`_ca`),
  KEY `_ar` (`_ar`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary table structure for view `wikipedia_sums`
--

DROP TABLE IF EXISTS `wikipedia_sums`;
/*!50001 DROP VIEW IF EXISTS `wikipedia_sums`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `wikipedia_sums` AS SELECT 
 1 AS `sum(en)`,
 1 AS `sum(de)`,
 1 AS `sum(ceb)`,
 1 AS `sum(sv)`,
 1 AS `sum(fr)`,
 1 AS `sum(nl)`,
 1 AS `sum(ru)`,
 1 AS `sum(it)`,
 1 AS `sum(es)`,
 1 AS `sum(pl)`,
 1 AS `sum(war)`,
 1 AS `sum(vi)`,
 1 AS `sum(ja)`,
 1 AS `sum(zh)`,
 1 AS `sum(pt)`,
 1 AS `sum(uk)`,
 1 AS `sum(sr)`,
 1 AS `sum(fa)`,
 1 AS `sum(ca)`,
 1 AS `sum(ar)`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `work_meta`
--

DROP TABLE IF EXISTS `work_meta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `work_meta` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `work_id` int(10) unsigned NOT NULL,
  `title` text COLLATE utf8mb4_unicode_ci,
  `authors_apa` text COLLATE utf8mb4_unicode_ci,
  `pubYear` smallint(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `work_id` (`work_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26334 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `works`
--

DROP TABLE IF EXISTS `works`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `works` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unspec',
  `origin` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'unspec',
  `doi` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url` text COLLATE utf8mb4_unicode_ci,
  `urls` tinyint(4) DEFAULT '0',
  `committed_doi_resolve` datetime DEFAULT NULL,
  `url_crawled` tinyint(4) NOT NULL DEFAULT '0',
  `last_update_url_browser` datetime DEFAULT NULL,
  `state` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `reaction_count_facebook` int(10) unsigned DEFAULT NULL,
  `comment_count_facebook` int(10) unsigned DEFAULT NULL,
  `share_count_facebook` int(10) unsigned DEFAULT NULL,
  `comment_plugin_count_facebook` int(10) unsigned DEFAULT NULL,
  `reader_count_mendeley` int(10) unsigned DEFAULT NULL,
  `group_count_mendeley` int(10) unsigned DEFAULT NULL,
  `count_reddit` int(10) unsigned DEFAULT NULL,
  `count_twitter_unique` int(10) unsigned NOT NULL DEFAULT '0',
  `count_twitter_retweets` int(10) unsigned NOT NULL DEFAULT '0',
  `count_youtube` int(10) unsigned DEFAULT NULL,
  `last_update_facebook` datetime DEFAULT NULL,
  `last_update_mendeley` datetime DEFAULT NULL,
  `last_update_reddit` datetime DEFAULT NULL,
  `last_update_twitter` datetime DEFAULT NULL,
  `last_update_youtube` datetime DEFAULT NULL,
  `last_update_meta` datetime DEFAULT NULL,
  `tries_twitter` smallint(5) unsigned NOT NULL DEFAULT '0',
  `first_update_twitter` datetime DEFAULT NULL,
  `highest_id_twitter` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `doi` (`doi`),
  KEY `last_update_mendeley` (`last_update_mendeley`),
  KEY `last_update_url_browser` (`last_update_url_browser`),
  KEY `state` (`state`),
  KEY `last_update_meta` (`last_update_meta`),
  KEY `url_crawled` (`url_crawled`,`last_update_twitter`),
  KEY `url_crawled_2` (`url_crawled`,`last_update_facebook`),
  KEY `url_crawled_3` (`url_crawled`,`last_update_reddit`),
  KEY `url_crawled_4` (`url_crawled`,`last_update_youtube`)
) ENGINE=InnoDB AUTO_INCREMENT=131044 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`gbv`@`localhost`*/ /*!50003 TRIGGER insert_work AFTER INSERT ON works FOR EACH ROW INSERT INTO wikipedia(work_id) VALUES (NEW.id) */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `charts_facebook`
--

/*!50001 DROP VIEW IF EXISTS `charts_facebook`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`gbv`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `charts_facebook` AS select `works`.`id` AS `id`,`works`.`doi` AS `doi`,`works`.`origin` AS `origin`,substr(`works`.`url`,1,180) AS `substr(url,1,180)`,((`works`.`reaction_count_facebook` + `works`.`share_count_facebook`) + `works`.`comment_count_facebook`) AS `fb_sum`,`works`.`reaction_count_facebook` AS `reaction_count_facebook`,`works`.`share_count_facebook` AS `share_count_facebook`,`works`.`comment_count_facebook` AS `comment_count_facebook` from `works` order by ((`works`.`reaction_count_facebook` + `works`.`share_count_facebook`) + `works`.`comment_count_facebook`) desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `charts_mendeley`
--

/*!50001 DROP VIEW IF EXISTS `charts_mendeley`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`gbv`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `charts_mendeley` AS select `works`.`id` AS `id`,`works`.`doi` AS `doi`,`works`.`origin` AS `origin`,substr(`works`.`url`,1,180) AS `substring(url,1,180)`,(`works`.`reader_count_mendeley` + `works`.`group_count_mendeley`) AS `sum_mendeley`,`works`.`reader_count_mendeley` AS `reader_count_mendeley`,`works`.`group_count_mendeley` AS `group_count_mendeley` from `works` order by (`works`.`reader_count_mendeley` + `works`.`group_count_mendeley`) desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `charts_mendeley_s`
--

/*!50001 DROP VIEW IF EXISTS `charts_mendeley_s`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`gbv`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `charts_mendeley_s` AS select `works`.`id` AS `id`,`works`.`doi` AS `doi`,`works`.`type` AS `type`,`works`.`origin` AS `origin`,(`works`.`reader_count_mendeley` + `works`.`group_count_mendeley`) AS `sum_mendeley`,`works`.`reader_count_mendeley` AS `reader_count_mendeley`,`works`.`group_count_mendeley` AS `group_count_mendeley` from `works` where ((`works`.`reader_count_mendeley` > 0) or (`works`.`group_count_mendeley` > 0)) order by (`works`.`reader_count_mendeley` + `works`.`group_count_mendeley`) desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `charts_reddit`
--

/*!50001 DROP VIEW IF EXISTS `charts_reddit`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`gbv`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `charts_reddit` AS select `works`.`id` AS `id`,`works`.`doi` AS `doi`,`works`.`origin` AS `origin`,substr(`works`.`url`,1,180) AS `substring(url,1,180)`,`works`.`count_reddit` AS `count_reddit` from `works` order by `works`.`count_reddit` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `charts_twitter`
--

/*!50001 DROP VIEW IF EXISTS `charts_twitter`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`gbv`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `charts_twitter` AS select `works`.`id` AS `id`,`works`.`doi` AS `doi`,`works`.`origin` AS `origin`,substr(`works`.`url`,1,180) AS `substring(url,1,180)`,(`works`.`count_twitter_unique` + `works`.`count_twitter_retweets`) AS `sum_twitter`,`works`.`count_twitter_unique` AS `count_twitter_unique`,`works`.`count_twitter_retweets` AS `count_twitter_retweets`,`works`.`first_update_twitter` AS `first_update_twitter` from `works` order by (`works`.`count_twitter_unique` + `works`.`count_twitter_retweets`) desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `charts_twitter_s`
--

/*!50001 DROP VIEW IF EXISTS `charts_twitter_s`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`gbv`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `charts_twitter_s` AS select `works`.`id` AS `id`,`works`.`doi` AS `doi`,`works`.`type` AS `type`,`works`.`origin` AS `origin`,(`works`.`count_twitter_unique` + `works`.`count_twitter_retweets`) AS `sum_twitter`,`works`.`count_twitter_unique` AS `count_twitter_unique`,`works`.`count_twitter_retweets` AS `count_twitter_retweets` from `works` where ((`works`.`count_twitter_unique` > 0) or (`works`.`count_twitter_retweets` > 0)) order by (`works`.`count_twitter_unique` + `works`.`count_twitter_retweets`) desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `charts_wikipedia`
--

/*!50001 DROP VIEW IF EXISTS `charts_wikipedia`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`gbv`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `charts_wikipedia` AS select `wikipedia`.`work_id` AS `work_id`,`works`.`doi` AS `doi`,`works`.`origin` AS `origin`,substr(`works`.`url`,1,180) AS `substring(works.url, 1, 180)`,(((((((((((((((((((`wikipedia`.`en` + `wikipedia`.`de`) + `wikipedia`.`ceb`) + `wikipedia`.`sv`) + `wikipedia`.`fr`) + `wikipedia`.`nl`) + `wikipedia`.`ru`) + `wikipedia`.`it`) + `wikipedia`.`es`) + `wikipedia`.`pl`) + `wikipedia`.`war`) + `wikipedia`.`vi`) + `wikipedia`.`ja`) + `wikipedia`.`zh`) + `wikipedia`.`pt`) + `wikipedia`.`uk`) + `wikipedia`.`sr`) + `wikipedia`.`fa`) + `wikipedia`.`ca`) + `wikipedia`.`ar`) AS `sum_wikipedia`,`wikipedia`.`en` AS `en`,`wikipedia`.`de` AS `de`,`wikipedia`.`ceb` AS `ceb`,`wikipedia`.`sv` AS `sv`,`wikipedia`.`fr` AS `fr`,`wikipedia`.`nl` AS `nl`,`wikipedia`.`ru` AS `ru`,`wikipedia`.`it` AS `it`,`wikipedia`.`es` AS `es`,`wikipedia`.`pl` AS `pl`,`wikipedia`.`war` AS `war`,`wikipedia`.`vi` AS `vi`,`wikipedia`.`ja` AS `ja`,`wikipedia`.`zh` AS `zh`,`wikipedia`.`pt` AS `pt`,`wikipedia`.`uk` AS `uk`,`wikipedia`.`sr` AS `sr`,`wikipedia`.`fa` AS `fa`,`wikipedia`.`ca` AS `ca`,`wikipedia`.`ar` AS `ar` from (`wikipedia` left join `works` on((`wikipedia`.`work_id` = `works`.`id`))) order by (((((((((((((((((((`wikipedia`.`en` + `wikipedia`.`de`) + `wikipedia`.`ceb`) + `wikipedia`.`sv`) + `wikipedia`.`fr`) + `wikipedia`.`nl`) + `wikipedia`.`ru`) + `wikipedia`.`it`) + `wikipedia`.`es`) + `wikipedia`.`pl`) + `wikipedia`.`war`) + `wikipedia`.`vi`) + `wikipedia`.`ja`) + `wikipedia`.`zh`) + `wikipedia`.`pt`) + `wikipedia`.`uk`) + `wikipedia`.`sr`) + `wikipedia`.`fa`) + `wikipedia`.`ca`) + `wikipedia`.`ar`) desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `charts_youtube`
--

/*!50001 DROP VIEW IF EXISTS `charts_youtube`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`gbv`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `charts_youtube` AS select `works`.`id` AS `id`,`works`.`doi` AS `doi`,`works`.`origin` AS `origin`,substr(`works`.`url`,1,180) AS `substring(url,1,180)`,`works`.`count_youtube` AS `count_youtube` from `works` order by `works`.`count_youtube` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `check_twitter`
--

/*!50001 DROP VIEW IF EXISTS `check_twitter`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`gbv`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `check_twitter` AS select `data_dumps_twitter`.`id` AS `id`,`data_dumps_twitter`.`work_id` AS `work_id`,`data_dumps_twitter`.`type` AS `type`,`data_dumps_twitter`.`created` AS `created` from `data_dumps_twitter` order by `data_dumps_twitter`.`id` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `checks`
--

/*!50001 DROP VIEW IF EXISTS `checks`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`gbv`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `checks` AS select max(`works`.`last_update_facebook`) AS `max(last_update_facebook)`,max(`works`.`last_update_mendeley`) AS `max(last_update_mendeley)`,max(`works`.`last_update_reddit`) AS `max(last_update_reddit)`,max(`works`.`last_update_twitter`) AS `max(last_update_twitter)`,max(`works`.`last_update_youtube`) AS `max(last_update_youtube)`,max(`works`.`last_update_url_browser`) AS `max(last_update_url_browser)` from `works` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `checks_dumps`
--

/*!50001 DROP VIEW IF EXISTS `checks_dumps`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`gbv`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `checks_dumps` AS select max(`data_dumps_mendeley`.`created`) AS `max(created)` from `data_dumps_mendeley` union all select max(`data_dumps_reddit`.`created`) AS `max(created)` from `data_dumps_reddit` union all select max(`data_dumps_twitter`.`created`) AS `max(created)` from `data_dumps_twitter` union all select max(`data_dumps_wikipedia`.`created`) AS `max(created)` from `data_dumps_wikipedia` union all select max(`data_dumps_youtube`.`created`) AS `max(created)` from `data_dumps_youtube` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `checks_wikipedia`
--

/*!50001 DROP VIEW IF EXISTS `checks_wikipedia`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`gbv`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `checks_wikipedia` AS select max(`wikipedia`.`_en`) AS `max(_en)`,max(`wikipedia`.`_de`) AS `max(_de)`,max(`wikipedia`.`_ceb`) AS `max(_ceb)`,max(`wikipedia`.`_sv`) AS `max(_sv)`,max(`wikipedia`.`_fr`) AS `max(_fr)`,max(`wikipedia`.`_nl`) AS `max(_nl)`,max(`wikipedia`.`_ru`) AS `max(_ru)`,max(`wikipedia`.`_it`) AS `max(_it)`,max(`wikipedia`.`_es`) AS `max(_es)`,max(`wikipedia`.`_pl`) AS `max(_pl)`,max(`wikipedia`.`_war`) AS `max(_war)`,max(`wikipedia`.`_vi`) AS `max(_vi)`,max(`wikipedia`.`_ja`) AS `max(_ja)`,max(`wikipedia`.`_zh`) AS `max(_zh)`,max(`wikipedia`.`_pt`) AS `max(_pt)`,max(`wikipedia`.`_uk`) AS `max(_uk)`,max(`wikipedia`.`_sr`) AS `max(_sr)`,max(`wikipedia`.`_fa`) AS `max(_fa)`,max(`wikipedia`.`_ca`) AS `max(_ca)`,max(`wikipedia`.`_ar`) AS `max(_ar)` from `wikipedia` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `pool`
--

/*!50001 DROP VIEW IF EXISTS `pool`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`gbv`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `pool` AS select `works`.`id` AS `id`,`works`.`doi` AS `doi`,`works`.`origin` AS `origin`,`works`.`committed_doi_resolve` AS `committed_doi_resolve`,`works`.`last_update_url_browser` AS `last_update_url_browser` from `works` order by `works`.`last_update_url_browser` limit 80 */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `stats`
--

/*!50001 DROP VIEW IF EXISTS `stats`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`gbv`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `stats` AS select `works`.`id` AS `id`,`works`.`doi` AS `doi`,`works`.`type` AS `type`,`works`.`origin` AS `origin`,substr(`works`.`url`,1,180) AS `substring(url,1,180)`,(`works`.`reader_count_mendeley` + `works`.`group_count_mendeley`) AS `sum_mendeley`,`works`.`reader_count_mendeley` AS `reader_count_mendeley`,`works`.`group_count_mendeley` AS `group_count_mendeley`,(`works`.`count_twitter_unique` + `works`.`count_twitter_retweets`) AS `sum_twitter`,`works`.`count_twitter_unique` AS `count_twitter_unique`,`works`.`count_twitter_retweets` AS `count_twitter_retweets`,`works`.`first_update_twitter` AS `first_update_twitter` from `works` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `stats_all`
--

/*!50001 DROP VIEW IF EXISTS `stats_all`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`gbv`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `stats_all` AS select `works`.`id` AS `id`,`works`.`origin` AS `origin`,`works`.`type` AS `type`,`works`.`doi` AS `doi`,(((`works`.`reaction_count_facebook` + `works`.`comment_count_facebook`) + `works`.`share_count_facebook`) + `works`.`comment_plugin_count_facebook`) AS `sum_facebook`,(`works`.`reader_count_mendeley` + `works`.`group_count_mendeley`) AS `sum_mendeley`,`works`.`count_reddit` AS `count_reddit`,(`works`.`count_twitter_unique` + `works`.`count_twitter_retweets`) AS `sum_twitter`,(((((((((((((((((((`wikipedia`.`en` + `wikipedia`.`de`) + `wikipedia`.`ceb`) + `wikipedia`.`sv`) + `wikipedia`.`fr`) + `wikipedia`.`nl`) + `wikipedia`.`ru`) + `wikipedia`.`it`) + `wikipedia`.`es`) + `wikipedia`.`pl`) + `wikipedia`.`war`) + `wikipedia`.`vi`) + `wikipedia`.`ja`) + `wikipedia`.`zh`) + `wikipedia`.`pt`) + `wikipedia`.`uk`) + `wikipedia`.`sr`) + `wikipedia`.`fa`) + `wikipedia`.`ca`) + `wikipedia`.`ar`) AS `sum_wikipedia`,`works`.`count_youtube` AS `count_youtube` from (`works` left join `wikipedia` on((`works`.`id` = `wikipedia`.`work_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `stats_mend`
--

/*!50001 DROP VIEW IF EXISTS `stats_mend`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`gbv`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `stats_mend` AS select `works`.`id` AS `id`,`works`.`doi` AS `doi`,`works`.`type` AS `type`,`works`.`origin` AS `origin`,substr(`works`.`url`,1,180) AS `substring(url, 1, 180)`,(`works`.`reader_count_mendeley` + `works`.`group_count_mendeley`) AS `sum_mendeley`,`works`.`reader_count_mendeley` AS `reader_count_mendeley`,`works`.`group_count_mendeley` AS `group_count_mendeley` from `works` order by `sum_mendeley` desc limit 50 */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `stats_twit`
--

/*!50001 DROP VIEW IF EXISTS `stats_twit`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`gbv`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `stats_twit` AS select `stats`.`id` AS `id`,`stats`.`doi` AS `doi`,`stats`.`type` AS `type`,`stats`.`origin` AS `origin`,`stats`.`substring(url,1,180)` AS `substring(url,1,180)`,`stats`.`sum_mendeley` AS `sum_mendeley`,`stats`.`reader_count_mendeley` AS `reader_count_mendeley`,`stats`.`group_count_mendeley` AS `group_count_mendeley`,`stats`.`sum_twitter` AS `sum_twitter`,`stats`.`count_twitter_unique` AS `count_twitter_unique`,`stats`.`count_twitter_retweets` AS `count_twitter_retweets`,`stats`.`first_update_twitter` AS `first_update_twitter` from `stats` where (`stats`.`sum_twitter` <> 0) order by `stats`.`sum_twitter` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `stats_url`
--

/*!50001 DROP VIEW IF EXISTS `stats_url`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`gbv`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `stats_url` AS select `works`.`id` AS `id`,`works`.`type` AS `type`,`works`.`origin` AS `origin`,`works`.`doi` AS `doi`,`works`.`url` AS `url`,`works`.`last_update_url_browser` AS `last_update_url_browser`,`works`.`created` AS `created` from `works` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `sums`
--

/*!50001 DROP VIEW IF EXISTS `sums`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`gbv`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `sums` AS select sum(`works`.`reaction_count_facebook`) AS `sum(reaction_count_facebook)`,sum(`works`.`comment_count_facebook`) AS `sum(comment_count_facebook)`,sum(`works`.`share_count_facebook`) AS `sum(share_count_facebook)`,sum(`works`.`comment_plugin_count_facebook`) AS `sum(comment_plugin_count_facebook)`,sum(`works`.`reader_count_mendeley`) AS `sum(reader_count_mendeley)`,sum(`works`.`group_count_mendeley`) AS `sum(group_count_mendeley)`,sum(`works`.`count_reddit`) AS `sum(count_reddit)`,sum(`works`.`count_twitter_unique`) AS `sum(count_twitter_unique)`,sum(`works`.`count_twitter_retweets`) AS `sum(count_twitter_retweets)`,sum(`works`.`count_youtube`) AS `sum(count_youtube)`,sum((((((((((((((((((((`wikipedia`.`en` + `wikipedia`.`de`) + `wikipedia`.`ceb`) + `wikipedia`.`sv`) + `wikipedia`.`fr`) + `wikipedia`.`nl`) + `wikipedia`.`ru`) + `wikipedia`.`it`) + `wikipedia`.`es`) + `wikipedia`.`pl`) + `wikipedia`.`war`) + `wikipedia`.`vi`) + `wikipedia`.`ja`) + `wikipedia`.`zh`) + `wikipedia`.`pt`) + `wikipedia`.`uk`) + `wikipedia`.`sr`) + `wikipedia`.`fa`) + `wikipedia`.`ca`) + `wikipedia`.`ar`)) AS `sum_wikipedia` from (`works` left join `wikipedia` on((`works`.`id` = `wikipedia`.`work_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `types`
--

/*!50001 DROP VIEW IF EXISTS `types`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`gbv`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `types` AS select `works`.`type` AS `type`,count(`works`.`type`) AS `count` from `works` group by `works`.`type` order by `count` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `url_groups`
--

/*!50001 DROP VIEW IF EXISTS `url_groups`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`gbv`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `url_groups` AS select `urls`.`work_id` AS `work_id`,count(0) AS `count` from `urls` group by `urls`.`work_id` having (`count` > 1) order by `count` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `w_err_NO_DELETE`
--

/*!50001 DROP VIEW IF EXISTS `w_err_NO_DELETE`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`gbv`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `w_err_NO_DELETE` AS select `works`.`id` AS `id`,`works`.`doi` AS `doi`,`works`.`url` AS `url`,`works`.`state` AS `state` from `works` where (`works`.`state` <> '0') */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `wikipedia_sums`
--

/*!50001 DROP VIEW IF EXISTS `wikipedia_sums`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_unicode_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`gbv`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `wikipedia_sums` AS select sum(`wikipedia`.`en`) AS `sum(en)`,sum(`wikipedia`.`de`) AS `sum(de)`,sum(`wikipedia`.`ceb`) AS `sum(ceb)`,sum(`wikipedia`.`sv`) AS `sum(sv)`,sum(`wikipedia`.`fr`) AS `sum(fr)`,sum(`wikipedia`.`nl`) AS `sum(nl)`,sum(`wikipedia`.`ru`) AS `sum(ru)`,sum(`wikipedia`.`it`) AS `sum(it)`,sum(`wikipedia`.`es`) AS `sum(es)`,sum(`wikipedia`.`pl`) AS `sum(pl)`,sum(`wikipedia`.`war`) AS `sum(war)`,sum(`wikipedia`.`vi`) AS `sum(vi)`,sum(`wikipedia`.`ja`) AS `sum(ja)`,sum(`wikipedia`.`zh`) AS `sum(zh)`,sum(`wikipedia`.`pt`) AS `sum(pt)`,sum(`wikipedia`.`uk`) AS `sum(uk)`,sum(`wikipedia`.`sr`) AS `sum(sr)`,sum(`wikipedia`.`fa`) AS `sum(fa)`,sum(`wikipedia`.`ca`) AS `sum(ca)`,sum(`wikipedia`.`ar`) AS `sum(ar)` from `wikipedia` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-09-14  7:35:05
