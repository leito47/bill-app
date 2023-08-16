/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import userEvent from "@testing-library/user-event"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import Bills from "../containers/Bills.js";
import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import router from "../app/Router.js";

import { NewBill } from '../containers/NewBill.js'

jest.mock("../app/Store", () => mockStore)

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
         expect(windowIcon.classList.contains("active-icon")).toBe(true) 

    })
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-mail'))
      const windowIcon = screen.getByTestId('icon-mail')
      //to-do write expect expression
         expect(windowIcon.classList.contains("active-icon")).toBe(false) 

    })

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })

  // Testing the icon eye
  describe('When I click on the eye icon of one bill', () => {
    test('Then a modal should open', async () => {
      const onNavigate = pathname => { document.body.innerHTML = ROUTES({ pathname }); };
      Object.defineProperty(window, "localStorage", { value: localStorageMock });
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));
      document.body.innerHTML = BillsUI({ data: bills })
      const containerBills = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage
      })

      const modaleFile = document.getElementById('modaleFile')
      $.fn.modal = jest.fn(() => modaleFile.classList.add('show'))

      const eyeIcon = await screen.getAllByTestId('icon-eye')

      const handleClickIconEye = jest.fn((icon)=> containerBills.handleClickIconEye(icon))
 
      eyeIcon.forEach(icon => {
      icon.addEventListener('click', handleClickIconEye(icon))
      userEvent.click(icon)
      expect(handleClickIconEye).toHaveBeenCalled()
      })
      expect(modaleFile).toBeTruthy()
    })
  })
  // TEST D'INTEGRATION GET
describe('Given I am connected as employee', () => {
  describe('When I am on the Bills page', () => {
    test('Then we fetch the bills from mock API GET', async () => {
      localStorage.setItem('user', JSON.stringify({ type: 'Employee, e@e'}))
      const root = document.createElement('div')
      root.setAttribute('id', 'root')
      document.body.appendChild(root)

      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getAllByText('Mes notes de frais'))

      expect(screen.getByTestId('tbody')).toBeTruthy()
    })
  })

  describe('When an error occurs in API', () => {
    beforeEach(() => {
      jest.spyOn(mockStore, 'bills')
      Object.defineProperty(window, 'localStorage', {value: localStorageMock})
      window.localStorage.setItem('user', JSON.stringify( {type: 'Employee', email: 'e@e'}))
      const root = document.createElement('div')
      root.setAttribute('id', 'root')
      document.body.appendChild(root)
      router()
    })

    test('Then we fetch the bills from the API and this fails 404 error message', async () => {
      mockStore.bills.mockImplementationOnce(() => {
        return { list: () => { return Promise.reject(new Error('Erreur 404')); }}
      })
    // })

    window.onNavigate(ROUTES_PATH.Bills)
    await new Promise(process.nextTick)
    const message = await screen.getByText(/Erreur 404/)
    expect(message).toBeTruthy()
  })

  test('Then we fetch the message from API an we have in return a 500 message error', async ()=> {
      mockStore.bills.mockImplementationOnce(() => {
        return { list: () => { return Promise.reject(new Error('Erreur 500')); }}
      })

        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick)
        const message = await screen.getByText(/Erreur 500/)
        expect(message).toBeTruthy()
      })
  })
})



})


