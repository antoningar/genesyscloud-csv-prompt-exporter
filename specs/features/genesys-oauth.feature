Feature: Genesys auth
  As a developer
  To make this function works
  I need to give it oauth elements

  Scenario: Give Oauth elements
    Given a valid input event
    When context has a clientContext
    And clientContext contains a non-empty gc_client_id
    And clientContext contains a non-empty gc_client_secret
    And clientContext contains a non-empty gc_aws_region
    Then it should return a successful response