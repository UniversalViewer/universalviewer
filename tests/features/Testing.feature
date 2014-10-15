Feature: A feature file for testing the Wellcome Player

  Scenario: Load the player
    Given The player successfully loaded
    Then The title should be "The biocrats"
    And The thumbnails tab should be open