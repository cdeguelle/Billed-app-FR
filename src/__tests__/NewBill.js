import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import BillsUI from "../views/BillsUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"
import firebase from "../__mocks__/firebase"
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'


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
      const fileError = screen.getByTestId('file-error')
      const messageError = "Votre justificatif doit avoir comme extension jpeg, png ou jpg"
      input.addEventListener('change', handleChangeFile)
      userEvent.upload(input)
      expect(handleChangeFile(event)).toBeFalsy()
      expect(fileError).toContainHTML(messageError)
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

// test d'intégration POST
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to NewBill page", () => {
    describe("When I post a new bill", () => {
      test("fetches bills to mock API POST", async () => {
       const getSpy = jest.spyOn(firebase, "post")
       const bills = await firebase.post()
       expect(getSpy).toHaveBeenCalledTimes(1)
       expect(bills).toBe(200)
      })
      test("fetches bills to an API and fails with 404 message error", async () => {
        firebase.post.mockImplementationOnce(() =>
          Promise.reject(new Error("Erreur 404"))
        )
        const html = BillsUI({ error: "Erreur 404" })
        document.body.innerHTML = html
        const message = await screen.getByText(/Erreur 404/)
        expect(message).toBeTruthy()
      })
      test("fetches messages to an API and fails with 500 message error", async () => {
        firebase.post.mockImplementationOnce(() =>
          Promise.reject(new Error("Erreur 500"))
        )
        const html = BillsUI({ error: "Erreur 500" })
        document.body.innerHTML = html
        const message = await screen.getByText(/Erreur 500/)
        expect(message).toBeTruthy()
      })
    })
  })
})