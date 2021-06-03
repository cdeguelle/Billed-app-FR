import { screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js"
import { bills } from "../fixtures/bills.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import { ROUTES } from "../constants/routes"

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      const user = JSON.stringify({
        type: "Employee"
      })
      window.localStorage.setItem('user', user)
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const expected = "active-icon"
      const billIcon = screen.getByTestId("icon-window")
      expect(billIcon).toHaveAttribute('class', expected)
    })
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(parseInt(datesSorted[datesSorted.length-1], 10)).toBeLessThan(parseInt(datesSorted[datesSorted.length-2], 10))
    })
  })
})

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page and data is loading", () => {
    test("Then BillsUI return Loading page", () => {
      const loading = true
      const html = BillsUI({ loading })
      document.body.innerHTML = html
      expect(screen.getAllByText('Loading...')).toBeTruthy()
    })
  })
})

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page and data is error", () => {
    test("Then BillsUI return Error page", () => {
      const error = "Une erreur est survenue"
      const html = BillsUI({ error })
      document.body.innerHTML = html
      expect(screen.getByTestId('error-message')).toBeTruthy()
    })
  })
})

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then the newBill button works", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      const billsPage = new Bills({
        document, onNavigate, firestore, localStorage: window.localStorage
      })

      const handleClickNewBill = jest.fn(billsPage.handleClickNewBill)
      const buttonNewBill = screen.getByTestId('btn-new-bill')
      buttonNewBill.addEventListener('click', handleClickNewBill)
      userEvent.click(buttonNewBill)
      expect(handleClickNewBill).toHaveBeenCalled()
    })
  })
})

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then the icons eye works", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      const billsPage = new Bills({
        document, onNavigate, firestore, localStorage: window.localStorage
      })

      const handleClickIconEye = jest.fn(billsPage.handleClickIconEye)
      const iconEye = screen.getAllByTestId('icon-eye')
      iconEye.forEach(icon => {
        icon.addEventListener('click', (e) => handleClickIconEye(icon))
      })
      iconEye.forEach(icon => userEvent.click(icon))
      expect(handleClickIconEye).toHaveBeenCalled()
    })
  })
})