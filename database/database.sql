-- MySQL Script generated by MySQL Workbench
-- Wed Sep 12 11:49:06 2018
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema scenarioCreator
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema scenarioCreator
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `scenarioCreator` DEFAULT CHARACTER SET utf8 ;
USE `scenarioCreator` ;

-- -----------------------------------------------------
-- Table `scenarioCreator`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `scenarioCreator`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NULL,
  `password` VARCHAR(255) NULL,
  `userlevel` INT(11) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `scenarioCreator`.`scenarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `scenarioCreator`.`scenarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL,
  `sound` VARCHAR(255) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `scenarioCreator`.`scenario_descriptions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `scenarioCreator`.`scenario_descriptions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `description` VARCHAR(255) NULL,
  `scenarios_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_scenario_descriptions_scenarios_idx` (`scenarios_id` ASC),
  CONSTRAINT `fk_scenario_descriptions_scenarios`
    FOREIGN KEY (`scenarios_id`)
    REFERENCES `scenarioCreator`.`scenarios` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `scenarioCreator`.`active_scenarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `scenarioCreator`.`active_scenarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `location` VARCHAR(255) NULL,
  `tools` INT NULL,
  `finished` INT NULL DEFAULT 0,
  `alerted` INT NULL DEFAULT 0,
  `scenarios_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_active_scenarios_scenarios1_idx` (`scenarios_id` ASC),
  CONSTRAINT `fk_active_scenarios_scenarios1`
    FOREIGN KEY (`scenarios_id`)
    REFERENCES `scenarioCreator`.`scenarios` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
