import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I can't submit a newBill with a different extension proof of jpeg, png or jpg", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const bill = new NewBill
      const file = screen.getByTestId("file")
    })
  })
})