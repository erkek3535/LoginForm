import { beforeEach, expect, test } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { server } from '../mocks/server';
import 'mutationobserver-shim';
import fs from 'fs';
import path from 'path';

const loginPage = fs
  .readFileSync(path.resolve(__dirname, '../components/Login.jsx'), 'utf8')
  .replaceAll(/(?:\r\n|\r|\n| )/g, '');

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => {
  server.resetHandlers();
  document.body.innerHTML = '';
});
beforeEach(() => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
});

test("Login componentinde usehistory kullanılmış", async () => {
  expect(loginPage.includes('useHistory()')).toBe(true);
});

test("Login componentinde form verileri için useState kullanılmış ve başlangıç değeri tanımlanmış", async () => {
  expect(loginPage.includes('useState(')).toBe(true);
  expect(loginPage.includes('useState()')).not.toBe(true);
});

test("Login componentinde handleChange fonksiyonu tanımlanmış", async () => {
  expect(loginPage.includes('handleChange')).toBe(true);
});

test("Login componentinde handleSubmit fonksiyonu tanımlanmış", async () => {
  expect(loginPage.includes('handleSubmit')).toBe(true);
});

test("handleSubmitde preventDefault() tanımlanmış", async () => {
  const part = loginPage.split('handleSubmit')[1];
  expect(part.includes('.preventDefault()')).toBe(true);
});

test("handleSubmitde axios get isteği yapılmış", async () => {
  const part = loginPage.split('handleSubmit')[1];
  expect(loginPage.includes('importaxiosfrom')).toBe(true);
  expect(part.includes('axios.get(')).toBe(true);
});

test('Login form test kullanıcısı bilgileri ile doldurulunca doğru sayfaya yönleniyor', async () => {
  const user = userEvent.setup();
  const email = screen.getByPlaceholderText(/Enter your email/i);
  const password = screen.getByPlaceholderText(/Enter your password/i);
  await user.type(email, 'erdem.guntay@wit.com.tr');
  await user.type(password, '9fxIH0GXesEwH_I');
  const loginButton = screen.getByText('Sign In');
  await user.click(loginButton);
  await screen.findByText(/electronics/i);
  await screen.findByText('/main');
});

test('Login form yanlış email, doğru password ile doldurulunca error sayfasına yönleniyor', async () => {
  const user = userEvent.setup();
  const login = screen.getByText('Login');
  await user.click(login);
  const email = screen.getByPlaceholderText(/Enter your email/i);
  const password = screen.getByPlaceholderText(/Enter your password/i);
  await user.type(email, 'erdem@wit.com.tr');
  await user.type(password, '9fxIH0GXesEwH_I');
  const loginButton = screen.getByText('Sign In');
  await user.click(loginButton);
  await screen.findByText('/error');
});

test('Login form doğru email, yanlış password ile doldurulunca error sayfasına yönleniyor', async () => {
  const user = userEvent.setup();
  const login = screen.getByText('Login');
  await user.click(login);
  const email = screen.getByPlaceholderText(/Enter your email/i);
  const password = screen.getByPlaceholderText(/Enter your password/i);
  await user.type(email, 'erdem@wit.com.tr');
  await user.type(password, 'abcde');
  const loginButton = screen.getByText('Sign In');
  await user.click(loginButton);
  await screen.findByText('/error');
});
