Feature: Genesys auth
  As a developer
  Function should fail
  If I call it whithout gc oauth values

  Scenario Outline: Give wrong gc oauth values/
    Given a valid input event
    And clientContext gc_client_id is <id>
    And clientContext gc_client_secret is <secret>
    And clientContext gc_aws_region is <region>
    When calling the function
    Then it should return a 400 status code

    Examples:
      | id | secret | region |
      | id | secret |        |
      | id |        | region |
      |    | secret | region |