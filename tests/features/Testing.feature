Feature: A feature file for testing the Wellcome Player

  Scenario: Load the player
    Given The player successfully loaded
    Then The title should be "The biocrats"
    And The thumbnails tab should be open

  Scenario: Open the Index tab
    Given The index tab is visible
    When the user clicks on the index tab
    Then the index panel appears