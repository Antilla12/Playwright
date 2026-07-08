Feature: Shopping Cart functionality

  Background:
    Given I am logged in as "standard_user"

  Scenario: Add a product to cart
    When I add the first product to the cart
    Then the cart badge should show "1"

  Scenario: Add multiple products to cart
    When I add the first product to the cart
    And I add the second product to the cart
    Then the cart badge should show "2"

  Scenario: Remove a product from cart
    When I add the first product to the cart
    And I go to the cart page
    And I remove the first item from the cart
    Then the cart should be empty

  Scenario: Complete checkout
    When I add the first product to the cart
    And I go to the cart page
    And I proceed to checkout
    And I fill in my details "John" "Doe" "12345"
    And I complete the order
    Then I should see the order confirmation