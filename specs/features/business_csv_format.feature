Feature: Csv conversion
  As a business consumer
  Text result sould follow csv principle

  Scenario: Conusme business service
    Given Some existing prompts
    When Processing the prompt service
    Then Prompts should be returns as a csv string
