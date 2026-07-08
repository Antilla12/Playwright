Feature: Login functionality

  Background:
    Given I am on the login page

  Scenario: Valid login with correct credentials
    When I enter username "standard_user" and password "secret_sauce"
    Then I should be redirected to the inventory page
    And I should see the products title

  Scenario: Invalid login with wrong credentials
    When I enter username "wrong_user" and password "wrong_password"
    Then I should see an error message

  Scenario: Login with empty credentials
    When I enter username "" and password ""
    Then I should see an error message

  Scenario: Locked out user cannot login
    When I enter username "locked_out_user" and password "secret_sauce"
    Then I should see an error message

  Scenario Outline: Multiple login attempts
    When I enter username "<username>" and password "<password>"
    Then I should see "<result>"

    Examples:
      | username      | password     | result    |
      | standard_user | secret_sauce | inventory |
      | wrong_user    | wrong_pass   | error     |
      | locked_out_user | secret_sauce | error   |