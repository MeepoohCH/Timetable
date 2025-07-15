-- MySQL dump 10.13  Distrib 9.3.0, for Linux (x86_64)
--
-- Host: localhost    Database: IoT_db
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Exam`
--

DROP TABLE IF EXISTS `Exam`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Exam` (
  `exam_id` int unsigned NOT NULL AUTO_INCREMENT,
  `examType` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `startTime` time NOT NULL,
  `endTime` time NOT NULL,
  `location` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`exam_id`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Exam`
--

LOCK TABLES `Exam` WRITE;
/*!40000 ALTER TABLE `Exam` DISABLE KEYS */;
INSERT INTO `Exam` VALUES (62,'midterm','2025-08-26','09:30:00','12:30:00',''),(63,'final','2025-10-21','09:30:00','12:30:00',''),(64,'midterm','2025-08-27','09:30:00','12:30:00',''),(65,'final','2025-10-22','09:30:00','12:30:00',''),(66,'midterm','2025-08-30','09:30:00','12:30:00',''),(67,'final','2025-10-28','09:30:00','12:30:00',''),(68,'final','2025-10-30','09:30:00','11:30:00',''),(69,'midterm','2025-09-29','09:30:00','12:30:00',''),(70,'final','2025-10-24','09:30:00','12:30:00',''),(71,'midterm','2025-08-29','09:30:00','12:30:00',''),(72,'final','2025-11-03','09:30:00','12:30:00',''),(73,'midterm','2025-08-31','09:30:00','12:30:00',''),(74,'final','2025-10-20','09:30:00','12:30:00','');
/*!40000 ALTER TABLE `Exam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Subject`
--

DROP TABLE IF EXISTS `Subject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Subject` (
  `subject_id` char(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `subjectName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `credit` tinyint NOT NULL,
  `creditType` char(7) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Subject`
--

LOCK TABLES `Subject` WRITE;
/*!40000 ALTER TABLE `Subject` DISABLE KEYS */;
INSERT INTO `Subject` VALUES ('01006012','COMPUTER PROGRAMMING',3,'2-2-5'),('01006020','GENERAL PHYSICS 1',3,'3-0-6'),('01006021','GENERAL PHYSICS LABORATORY 1',1,'0-3-2'),('01236254','CIRCUITS AND ELECTRONICS',3,'2-2-5'),('01236255','INTRODUCTION TO INTERNET OF THINGS',3,'2-2-5'),('01006028','PRE-ACTIVITIES FOR ENGINEERS',1,'0-3-2'),('01006030','CALCULUS 1',3,'3-0-6'),('01006031','CALCULUS 2',3,'3-0-6'),('90642118','APPLICATION SOFTWARE FOR BUSINESS',2,'1-2-3'),('01006032','ELEMENTARY DIFFERENTIAL EQUATIONS AND LINEAR ALGEBRA',3,'3-0-6'),('01236200','ENGINEERING STATISTICS',3,'3-0-6'),('01236250','ELECTROMAGNETIC FIELDS',3,'3-0-6'),('01236256','MICROCONTROLLER AND EMBEDDED SYSTEMS',3,'3-2-5'),('01236258','PRINCIPLES OF COMMUNICATIONS',3,'3-0-6'),('01236260','CYBER-PHYSICAL SYSTEM AND SENSOR',3,'2-2-5');
/*!40000 ALTER TABLE `Subject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Teacher`
--

DROP TABLE IF EXISTS `Teacher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Teacher` (
  `teacher_id` char(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `teacherName` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `teacherSurname` char(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `isDeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`teacher_id`),
  UNIQUE KEY `teacherName` (`teacherName`,`teacherSurname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Teacher`
--

LOCK TABLES `Teacher` WRITE;
/*!40000 ALTER TABLE `Teacher` DISABLE KEYS */;
INSERT INTO `Teacher` VALUES ('1','รศ.ดร.','บุณย์ชนะ','ภู่ระหงษ์',0),('10','ดร.','นัชนัยน์','รุ่งเหมือนฟ้า',0),('11','ผศ.ดร.','อรรถพล','ป้อมสถิตย์',0),('12','ผศ.','ไพศาล','สิทธิโยภาสกุล',0),('13','นาย','ธีรสิทธิ์','โท้ทอง',0),('14','ดร.','สุวิไล','พุ่มโพธิ์',0),('15','ดร.','สมสิน','ทองไกรรัตน์',0),('2','ผศ.ดร.','ธนวิชญ์','อนุวงศ์พินิจ',0),('3','รศ.ดร.','อรรถสิทธิ์','หล่าสกุล',0),('4','ผศ.','สรพงษ์','วชิรรัตนพรกุล',0),('5','ผศ.ดร.','วันวิสา','ชัชวงษ์',0),('6','ผศ.ดร.','พิกุลแก้ว','ตังติสานนท์',0),('7','ผศ.ดร.','เกล็ดดาว','สัตย์เจริญ',0),('8','ผศ.','นิจจารีย์','สัตยารักษ์',0),('9','ผศ.','ดลชัย','สุขเจริญผล',0);
/*!40000 ALTER TABLE `Teacher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Timetable`
--

DROP TABLE IF EXISTS `Timetable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Timetable` (
  `timetable_id` int unsigned NOT NULL AUTO_INCREMENT,
  `subject_id` char(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `subjectType` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `yearLevel` tinyint unsigned NOT NULL,
  `degree` tinyint unsigned NOT NULL,
  `sec` smallint unsigned NOT NULL,
  `semester` tinyint unsigned NOT NULL,
  `academicYear` smallint unsigned NOT NULL,
  `weekday` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `startTime` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `endTime` char(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `midterm_id` int DEFAULT NULL,
  `final_id` int DEFAULT NULL,
  `teacher_id` char(20) DEFAULT NULL,
  PRIMARY KEY (`timetable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Timetable`
--

LOCK TABLES `Timetable` WRITE;
/*!40000 ALTER TABLE `Timetable` DISABLE KEYS */;
INSERT INTO `Timetable` VALUES (31,'01006012','ท',1,1,25,1,2568,'พุธ','08:00','10:00','E12-101',64,65,'8,3'),(32,'01006012','ท',1,1,26,1,2568,'พุธ','13:00','15:00','E12-101',64,65,'8,3'),(33,'01006012','ป',1,1,125,1,2568,'พุธ','10:00','12:00','E12-101',NULL,NULL,'3'),(34,'01006012','ป',1,1,126,1,2568,'พุธ','15:00','17:00','E12-101',NULL,NULL,'8,3'),(38,'01006028','ป',1,1,1,1,2568,'พฤหัส','13:00','14:30','',NULL,NULL,'13,1'),(39,'01006028','ป',1,1,1,1,2568,'พฤหัส','14:45','16:15','',NULL,NULL,'13,1'),(40,'01006030','ท',1,1,30,1,2568,'อังคาร','08:45','10:15','ME-402',62,63,'10'),(41,'01006030','ท',1,1,30,1,2568,'อังคาร','10:30','12:00','ME-402',NULL,NULL,'10'),(42,'01006031','ท',1,1,41,1,2568,'เสาร์','08:45','10:15','E12-505',62,63,'10,8'),(43,'01006031','ท',1,1,41,1,2568,'เสาร์','10:30','12:00','E12-505',NULL,NULL,''),(44,'01236254','ท',1,1,29,1,2568,'อังคาร','13:00','15:00',' E12-1009',69,70,'4'),(45,'01236254','ท',1,1,30,1,2568,'จันทร์','08:30','10:30','E12-1009',71,70,'10'),(46,'01236254','ป',1,1,209,1,2568,'อังคาร','15:00','17:00','E12-1009',NULL,NULL,'13,10,4'),(47,'01236254','ป',1,1,300,1,2568,'จันทร์','10:30','12:30','E12-1009',NULL,NULL,'13,10,4'),(48,'01236255','ท',1,1,29,1,2568,'พฤหัส','08:30','10:30','E12-201',NULL,72,'2,12'),(49,'01236255','ป',1,1,209,1,2568,'พฤหัส','10:30','12:30','E12-201',NULL,NULL,'2,13,1,12'),(50,'01006032','ท',2,1,29,1,2568,'อังคาร','08:45','10:15','E12-806 ',62,63,'14'),(51,'01006032','ท',2,1,29,1,2568,'อังคาร','10:30','12:00','E12-806 ',NULL,NULL,'14'),(53,'01236200','ท',2,1,28,1,2568,'จันทร์','13:00','14:30','E12-801',66,67,'5'),(54,'01236200','ท',2,1,28,1,2568,'จันทร์','14:45','16:15','E12-801',NULL,NULL,'14'),(55,'01006032','ท',2,1,30,1,2568,'จันทร์','08:45','10:15','E12-802',62,63,'14'),(56,'01006032','ท',2,1,30,1,2568,'จันทร์','10:30','12:00','E12-802',NULL,NULL,'14'),(60,'01236256','ป',2,1,208,1,2568,'อังคาร','15:00','17:00','E12-1008',NULL,NULL,'1,12,15'),(61,'01236256','ท',2,1,28,1,2568,'อังคาร','13:00','15:00','E12-1008',73,NULL,'1,12,15'),(62,'01236256','ท',2,1,29,1,2568,'อังคาร','08:30','10:30','E12-1008',73,NULL,'1,12,15'),(63,'01236256','ป',2,1,209,1,2568,'อังคาร','10:30','12:30',' E12-1008',NULL,NULL,'1,12,15'),(64,'01236258','ท',2,1,28,1,2568,'พฤหัส','13:00','14:30','E12-805',71,70,'5'),(65,'01236258','ท',2,1,28,1,2568,'พฤหัส','14:45','16:15','E12-805',71,70,'5'),(66,'01236260','ท',2,1,28,1,2568,'พฤหัส','08:30','10:30','E12-1009',NULL,74,'4'),(67,'01236260','ป',2,1,208,1,2568,'พฤหัส','10:30','12:30','E12-1009',NULL,NULL,'5,4');
/*!40000 ALTER TABLE `Timetable` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-15 11:00:15
