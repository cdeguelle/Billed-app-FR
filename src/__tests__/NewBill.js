import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"
import userEvent from '@testing-library/user-event'


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I can change the proof file", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      const newBill = new NewBill({
        document, onNavigate, firestore, localStorage: window.localStorage
      })

      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      const file = screen.getByTestId('file')
      file.addEventListener('change', handleChangeFile)
      userEvent.upload(file)
      expect(handleChangeFile).toHaveBeenCalled()
    })
  })
})

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I can't upload a file with wrong extension", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const html = NewBillUI()
      document.body.innerHTML = html

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null
      
      const newBill = new NewBill({
        document, onNavigate, firestore, localStorage: window.localStorage
      })

      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      const input = screen.getByTestId('file')
      const event = {
        target: {
          value: "document.pdf"
        },
      }
      input.addEventListener('change', handleChangeFile)
      userEvent.upload(input)
      expect(handleChangeFile(event)).toBeFalsy()
    })
  })
})

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I can submit a new bill", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const html = NewBillUI()
      document.body.innerHTML = html

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null
      
      const newBill = new NewBill({
        document, onNavigate, firestore, localStorage: window.localStorage
      })

      const submitBtn = screen.getByTestId('submit-btn')
      const handleSubmit = jest.fn(newBill.handleSubmit)
      submitBtn.addEventListener('click', handleSubmit)
      fireEvent.click(submitBtn)
      expect(handleSubmit).toHaveBeenCalled()
    })
  })
})