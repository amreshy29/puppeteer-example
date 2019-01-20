const puppeteer = require('puppeteer');

(async()=> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://sharedmoneytree.com');
 /*
  page.setViewport({width:320,height:600});
  await page.screenshot({path: 'learnapp.png'})
 */
 /*  await page.pdf({path: 'hd.pdf', format:'A4'}) */

  const dimension = await page.evaluate(()=> {
    return {
      width : document.documentElement.clientWidth,
      height : document.documentElement.clientHeight,
      deviceScaleFactor: window.devicePixelRatio
    }
  })
  console.log("Dimension" , dimension);


  await browser.close()
})()
