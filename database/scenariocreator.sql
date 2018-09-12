-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 12, 2018 at 12:15 PM
-- Server version: 10.1.26-MariaDB
-- PHP Version: 7.1.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `scenariocreator`
--

-- --------------------------------------------------------

--
-- Table structure for table `active_scenarios`
--

CREATE TABLE `active_scenarios` (
  `id` int(11) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `tools` int(11) DEFAULT NULL,
  `finished` int(11) DEFAULT '0',
  `alerted` int(11) DEFAULT '0',
  `scenarios_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `scenarios`
--

CREATE TABLE `scenarios` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `sound` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `scenario_descriptions`
--

CREATE TABLE `scenario_descriptions` (
  `id` int(11) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `scenarios_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `userlevel` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `userlevel`) VALUES
(1, 'admin', 'd033e22ae348aeb5660fc2140aec35850c4da997', 1),
(12, 'docent', '7e1bd9325a2238e5efb4ae9ba99d9f82af1af12e', 2),
(17, 'test', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 3);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `active_scenarios`
--
ALTER TABLE `active_scenarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_active_scenarios_scenarios1_idx` (`scenarios_id`);

--
-- Indexes for table `scenarios`
--
ALTER TABLE `scenarios`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `scenario_descriptions`
--
ALTER TABLE `scenario_descriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_scenario_descriptions_scenarios_idx` (`scenarios_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `active_scenarios`
--
ALTER TABLE `active_scenarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `scenarios`
--
ALTER TABLE `scenarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `scenario_descriptions`
--
ALTER TABLE `scenario_descriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `active_scenarios`
--
ALTER TABLE `active_scenarios`
  ADD CONSTRAINT `fk_active_scenarios_scenarios1` FOREIGN KEY (`scenarios_id`) REFERENCES `scenarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `scenario_descriptions`
--
ALTER TABLE `scenario_descriptions`
  ADD CONSTRAINT `fk_scenario_descriptions_scenarios` FOREIGN KEY (`scenarios_id`) REFERENCES `scenarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
