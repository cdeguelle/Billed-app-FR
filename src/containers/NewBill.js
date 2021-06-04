
import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"

export default class NewBill {
  constructor({ document, onNavigate, firestore, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.firestore = firestore
    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
    formNewBill.addEventListener("submit", this.handleSubmit)
    const file = this.document.querySelector(`input[data-testid="file"]`)
    file.addEventListener("change", this.handleChangeFile)
    this.fileUrl = null
    this.fileName = null
    new Logout({ document, localStorage, onNavigate })
  }
  handleChangeFile = e => {
    const file = this.document.querySelector(`input[data-testid="file"]`).files[0]
    const filePath = e.target.value.split(/\\/g)
    const fileName = filePath[filePath.length-1]
    const fileFormating = fileName.split(".")
    const fileFormat = fileFormating[fileFormating.length-1]
    if (fileFormat === "jpeg" || fileFormat === "png" || fileFormat === "jpg") {
      this.firestore
      .storage
      .ref(`justificatifs/${fileName}`)
      .put(file)
      .then(snapshot => snapshot.ref.getDownloadURL())
      .then(url => {
        this.fileUrl = url
        this.fileName = fileName
      })
      const fileError = this.document.getElementById('file-error')
      fileError.innerHTML = ""
    } else {
      this.document.querySelector(`input[data-testid="file"]`).value = ''
      const fileError = this.document.getElementById('file-error')
      fileError.innerHTML = "Votre justificatif doit avoir comme extension jpeg, png ou jpg"
      fileError.style.color = "red"
      return false
    }
  }
  handleSubmit = (e, bill) => {
    e.preventDefault()
    const email = JSON.parse(localStorage.getItem("user")).email
    bill = {
      email,
      type: this.document.querySelector(`select[data-testid="expense-type"]`).value,
      name:  this.document.querySelector(`input[data-testid="expense-name"]`).value,
      amount: parseInt(this.document.querySelector(`input[data-testid="amount"]`).value),
      date:  this.document.querySelector(`input[data-testid="datepicker"]`).value,
      vat: this.document.querySelector(`input[data-testid="vat"]`).value,
      pct: parseInt(this.document.querySelector(`input[data-testid="pct"]`).value) || 20,
      commentary: this.document.querySelector(`textarea[data-testid="commentary"]`).value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: 'pending'
    }
    this.createBill(bill)
    this.onNavigate(ROUTES_PATH['Bills'])
    
  }

  // not need to cover this function by tests
  createBill = (bill) => {
    if (this.firestore) {
      this.firestore
      .bills()
      .add(bill)
      .then(() => {
        this.onNavigate(ROUTES_PATH['Bills'])
      })
      .catch(error => error)
    }
  }
}