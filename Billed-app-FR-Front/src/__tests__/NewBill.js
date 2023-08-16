/**
 * @jest-environment jsdom
 */

import { screen, fireEvent, waitFor , render} from "@testing-library/dom" // Ajout fireEvent (déclenchement action sur DOM) & waitFor (Async)

import { ROUTES, ROUTES_PATH } from "../constants/routes.js"
import { localStorageMock } from "../__mocks__/localStorage.js"

import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import '@testing-library/jest-dom'
import mockStore from "../__mocks__/store"
import router from "../app/Router.js" 

import userEvent from "@testing-library/user-event"
jest.mock("../app/Store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then icon of mail in the vertical Layout must be highlighted", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user',  JSON.stringify({ type: 'Employee'}))
      const root = document.createElement('div')
      root.setAttribute('id', 'root')
      document.body.append(root)
      router();

      window.onNavigate(ROUTES_PATH.NewBill)
      await waitFor(() => screen.getByTestId('icon-mail'))

      const emailIcon = screen.getByTestId('icon-mail')
      expect(emailIcon).toBeTruthy();
      expect(screen.getByTestId('icon-mail').classList.contains('active-icon')).toBeTruthy();
    })

    test("Then the inputs forms should be displayed on the web page", () => {
      document.body.innerHTML = NewBillUI()

      const fieldTypeOfExpense= screen.getByTestId('expense-type')
      expect(fieldTypeOfExpense).toBeInTheDocument()

      const fieldExpenseName= screen.getByTestId('expense-name')
      expect(fieldExpenseName).toBeInTheDocument()

      const fieldDatePicker= screen.getByTestId('datepicker')
      expect(fieldDatePicker).toBeInTheDocument()

      const fieldAmount= screen.getByTestId('amount')
      expect(fieldAmount).toBeInTheDocument()

      const fieldVat= screen.getByTestId('vat')
      expect(fieldVat).toBeInTheDocument()

      const fieldPct= screen.getByTestId('pct')
      expect(fieldPct).toBeInTheDocument()

      const fieldCommentary= screen.getByTestId('commentary')
      expect(fieldCommentary).toBeInTheDocument()

      const fieldFile= screen.getByTestId('file')
      expect(fieldFile).toBeInTheDocument()
    });
    describe("When I am on the newBill page, I fill the form and submit", () => {
      test("Then the new bill should be added to the API POST", async() => {

        const html = NewBillUI()
        document.body.innerHTML = html
   
     // simulation and initialization of new bill   
    const bill = {
  "id": "UIUZtnPQvnbFnB0ozvJh",
   "name": "test3",
  "email": "a@a",
  "type": "Services en ligne",
  "vat": "60",
  "pct": 20,
  "commentAdmin": "bon bah d'accord",
  "amount": 300,
  "status": "accepted",
  "date": "2003-03-03",
  "commentary": "",
  "fileName": "facture-client-php-exportee-dans-document-pdf-enregistre-sur-disque-dur.png",
  "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…dur.png?alt=media&token=571d34cb-9c8f-430a-af52-66221cae1da3"
    }
    const fieldTypeOfExpense= screen.getByTestId('expense-type')
   fireEvent.change(fieldTypeOfExpense, {target: {value: bill.type}});
    expect(fieldTypeOfExpense.value).toBe(bill.type);
    console.log("fieldTypeOfExpense",fieldTypeOfExpense.value,bill.type)

    // const fieldTypeOfExpense= screen.getByTestId('expense-type')
    // userEvent.type(fieldTypeOfExpense,"Services en ligne", bill.type);
    //  expect(fieldTypeOfExpense.value).toBe(bill.type);
    //  console.log("fieldTypeOfExpense",fieldTypeOfExpense.value,bill.type)
 

    const expenseNameField = screen.getByTestId('expense-name')
    userEvent.type(expenseNameField, bill.name);
    expect(expenseNameField.value).toBe(bill.name);
    console.log("expenseNameField value:", expenseNameField.value,bill.name);

    const datePickerField = screen.getByTestId('datepicker')
   fireEvent.change(datePickerField, {target: {value: bill.date} })
    expect(datePickerField.value).toBe(bill.date)
    console.log("datePickerField value:", datePickerField.value,bill.date);

    const amountField = screen.getByTestId('amount')
    userEvent.type(amountField, bill.amount.toString());
    expect(parseInt(amountField.value)).toBe(parseInt(bill.amount));
    console.log("amountField value:",amountField.value,bill.amount);

    const vatField = screen.getByTestId('vat')
    userEvent.type(vatField, bill.vat.toString());
    expect(parseInt(vatField.value)).toBe(parseInt(bill.vat));
    console.log("vatField value:",vatField.value,bill.vat);

    const pctField = screen.getByTestId('pct')
    userEvent.type(pctField, bill.pct.toString());
    expect(parseInt(pctField.value)).toBe(parseInt(bill.pct));
    console.log("pctField value:",pctField.value,bill.pct);

    const CommentaryField = screen.getByTestId('commentary')
    userEvent.type(CommentaryField, bill.commentary);
    expect(CommentaryField.value).toBe(bill.commentary);
    console.log("CommentaryField value:",CommentaryField.value,bill.commentary);
    

    const onNavigate = pathname => { document.body.innerHTML =  ROUTES({ pathname})}
    const newBillForm = screen.getByTestId('form-new-bill')
    Object.defineProperty(window, 'localStorage', { value: localStorageMock})
    
    const newBill = new NewBill({document, onNavigate, store: mockStore, localStorage: window.localStorage})

    const handleChangeFile = jest.fn(newBill.handleChangeFile)
    newBillForm.addEventListener('change', handleChangeFile)

    const fileField = screen.getByTestId('file')
    fireEvent.change(fileField, {target: {files: [new File([bill.fileName], bill.fileUrl, {type: 'image/png'}) ] }})
    expect(fileField.files[0].name).toBe(bill.fileUrl)
    expect(fileField.files[0].type).toBe('image/png')
    expect(handleChangeFile).toHaveBeenCalled()

    const handleSubmit = jest.fn(newBill.handleSubmit);
    newBillForm.addEventListener("submit", handleSubmit);
    fireEvent.submit(newBillForm);
    expect(handleSubmit).toHaveBeenCalled();

  })
})
  })
});


