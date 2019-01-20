const puppeteer = require('puppeteer');

const CREDS = require('./creds');
//const User = require('./models/user');

async function run () {
  var browser = await puppeteer.launch({headless: false})
  const page = await browser.newPage();

  await page.goto('https://github.com/login');

  // dom element selectors
  const USERNAME_SELECTOR = '#login_field';
  const PASSWORD_SELECTOR = '#password';
  const BUTTON_SELECTOR = '#login > form > div.auth-form-body.mt-3 > input.btn.btn-primary.btn-block';

  await page.click(USERNAME_SELECTOR);
  await page.keyboard.type(CREDS.username);

  await page.click(PASSWORD_SELECTOR);
  await page.keyboard.type(CREDS.password);

  await page.click(BUTTON_SELECTOR);

  await page.waitForNavigation();

  const userToSearch = 'john';

  const searchUrl = `https://github.com/search?q=${userToSearch}&type=Users&utf8=%E2%9C%93`;

  await page.goto(searchUrl);
  await page.waitFor(2000);


  // const LIST_USERNAME_SELECTOR = '#user_search_results > div.user-list > div:nth-child(1) > div.d-flex > div > a';
  const LIST_USERNAME_SELECTOR = '#user_search_results > div.user-list > div:nth-child(INDEX) > div.d-flex > div > a';
  // const LIST_EMAIL_SELECTOR = '#user_search_results > div.user-list > div:nth-child(2) > div.d-flex > div > ul > li:nth-child(2) > a';
  const LIST_EMAIL_SELECTOR = '#user_search_results > div.user-list > div:nth-child(INDEX) > div.d-flex > div > a';

  const LENGTH_SELECTOR_CLASS = 'user-list-item';

    let listLength = await page.evaluate((sel) => {
      return document.getElementsByClassName(sel).length;
    }, LENGTH_SELECTOR_CLASS);
    console.log(listLength);
    const numPages = await getNumPages(page);

    for(let i = 1; i<= numPages; i++ ) {
      (async(i)=>{
        console.log(i)
        var userNameSelector = LIST_USERNAME_SELECTOR.replace('INDEX',i);
        var emailNameSelector = LIST_EMAIL_SELECTOR.replace('INDEX', i);
        console.log("emailNameSelector" , emailNameSelector)
      let userName = await page.evaluate((sel)=> {
        console.log("sel :: ",sel)
        return document.querySelector(sel).getAttribute('href').replace('/','')
      }, userNameSelector);

      let email = await page.evaluate((email) => {
        console.log("email :: ",email)
        let element =  document.querySelector(email).href;
        return element;
      },emailNameSelector)
      if(!email) {

      }
      console.log(userName, ' -> ', email);
      })(i)
    }
  browser.close()

}
async function getNumPages(page) {
  const NUM_USER_SELECTOR = 'div.d-flex.flex-justify-between.border-bottom.pb-3 > h3';

  let inner = await page.evaluate((sel) => {
    let html = document.querySelector(sel).innerText;

    // format is: "69,803 users"
    return html.replace(',', '').replace('users', '').trim();
  }, NUM_USER_SELECTOR);

  let numUsers = parseInt(inner);

  console.log('numUsers: ', numUsers);

  /*
  * GitHub shows 10 resuls per page, so
  */
  let numPages = Math.ceil(numUsers / 10);
  return numPages;
}
run()
