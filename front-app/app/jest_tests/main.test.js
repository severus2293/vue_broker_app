import {io} from "socket.io-client";
const puppeteer = require('puppeteer');
test('Sell Test', async () => {
    let browser = await  puppeteer.launch({
        headless: false,
    })
    let page = await browser.newPage()
    await page.goto('http://localhost:8080/user/0/bargaing');
    await page.waitForSelector('.stockfield');
    const countbrock = await page.$eval('#countstockbrokfold-2',e=>e.innerHTML)
    const price = await page.$eval('#curprice-2',e=>e.innerHTML)
    const buy = await page.$eval('#buybut-2',el=>el.className = 'buybut');
    const sell = await page.$eval('#sellbut-2',el=>el.className = 'buybut');
    await page.$eval('#buycount-2', el => el.value = '2');
    await page.$eval('#sellcount-2', el => el.value = '2');
    const countstock = await page.$eval('#countstockfold-2',e=>e.innerHTML)
    //await buy.evaluate( buy => buy.click());
    //buy.click()
    await page.click('#buybut-2')
    buy_stock(0,price,2,2)
   // sell_stock(0,price,2,2)
    const sock = io('http://localhost:3000/usersocket')
    var mystock
    await sock.on('BargainStocks', (message) => {
        for(let stock of message){
            if(parseInt(stock.data.id) === 2){

                mystock = stock
                expect(parseInt(mystock.data.count)).toBe(parseInt(countstock) - 2);
                break
                //this.countvalue = stock.data.count
                //this.checkvalue = stock.data.participation
            }
        }
    })

    browser.close()
}, 16000);
/*test('Buy Test', async () => {
    let browser = await  puppeteer.launch({
        headless: false,
    })
    let page = await browser.newPage()
    await page.goto('http://localhost:8080/user/0/bargaing');
    await page.waitForSelector('.stockfield');
    const countbrock = await page.$eval('#countstockbrokfold-2',e=>e.innerHTML)
    const price = await page.$eval('#curprice-2',e=>e.innerHTML)
    const buy = await page.$eval('#buybut-2',el=>el.className = 'buybut');
    const sell = await page.$eval('#sellbut-2',el=>el.className = 'buybut');
    await page.$eval('#buycount-2', el => el.value = '2');
    await page.$eval('#sellcount-2', el => el.value = '2');
    const countstock = await page.$eval('#countstockfold-2',e=>e.innerHTML)
    //await buy.evaluate( buy => buy.click());
    //buy.click()
    await page.click('#buybut-2')
     buy_stock(0,price,2,2)
    //sell_stock(0,price,2,2)
    const sock = io('http://localhost:3000/usersocket')
    var mystock
    await sock.on('BargainStocks', (message) => {
        for(let stock of message){
            if(parseInt(stock.data.id) === 2){

                mystock = stock
                expect(parseInt(mystock.data.count)).toBe(parseInt(countstock) - 2);
                break
                //this.countvalue = stock.data.count
                //this.checkvalue = stock.data.participation
            }
        }
    })

    browser.close()
}, 16000);*/

function buy_stock(userid,price,count,stockid){
    const message = {
        count: count,
        price: parseFloat((price).replace('$','')),
        userid:  userid,
        stockid: stockid,
    }
    const sock = io('http://localhost:3000/usersocket')
    sock.emit('BuyStock',message)
}

function sell_stock(userid,price,count,stockid) {
    const message = {
        count: count,
        price: parseFloat((price).replace('$','')),
        userid:  userid,
        stockid: stockid,
    }
    const sock = io('http://localhost:3000/usersocket')
    sock.emit('SellStock',message)
}
