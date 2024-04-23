const fs = require('fs').promises;
const puppeteer = require('puppeteer')
const TelegramBot = require('node-telegram-bot-api');

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}
const token = '7154916666:AAFNIOrg5QaFUY_XdT6RcjzfP452a2zKPNA';
const ratebChatID = 1631333030;
const nasser = 1462861733;
const user = 1631333030


var newNumbers = []
var storedNumbers = [];
const bot = new TelegramBot(token, { polling: true });

// bot.on('message', (msg) => {
//     const chatId = msg.chat.id;
//     console.log(msg.chat.id)
// });
bot.on('message', (msg) => {
    try {
        if (msg.text.includes('-')) {
            const processes = msg.text.split('*')
            console.log(processes);
            processes.forEach((element) => {
                const data = element.split('-')
                storedNumbers = JSON.parse(localStorage.getItem("nums"));
                if (!storedNumbers.includes(data[0]))
                    return;


                if (data[0] != '') {
                    const number = data[0];
                    const id = data[1];
                    const fName = data[2];
                    const lName = data[3];
                    const fatherName = data[4];
                    const motherName = data[5];
                    const phoneNumber = data[6];
                    const dobDay = data[7];
                    const dobMonth = data[8];
                    const dobYear = data[9];
                    const code = data[10];
                    const dataOb = {
                        "number": number,
                        "id": id,
                        "firstName": fName,
                        "lastName": lName,
                        "fatherName": fatherName,
                        "motherName": motherName,
                        "phoneNumber": phoneNumber,
                        "dobDay": dobDay,
                        "dobMonth": dobMonth,
                        "dobYear": dobYear,
                        "code": code
                    };
                    console.log(dataOb)
                    bookNumber(dataOb).then(_ => bot.sendPhoto(msg.chat.id, "./images/screenMtc.jpg"))
                }
            })
        } else {
            bookNumber(auto).then(_ => { bot.sendPhoto(ratebChatID, "./images/screenMtc.jpg"); bot.sendMessage(JSON.stringify(auto)) });
        }
    } catch { }
});

const bookNumber = async (data) => {
    const browser = await puppeteer.launch({
        args: [
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--no-zygote",
        ],
        executablePath:
            process.env.NODE_ENV === "production"
                ? process.env.PUPPETEER_EXECUTABLE_PATH
                : puppeteer.executablePath()
    })
    const page = await browser.newPage()
    try {
        await page.goto('https://www.touch.com.lb/autoforms/portal/touch/onlinereservation', { waitUntil: 'networkidle2', timeout: 0 });
        await Promise.all([
            page.waitForNavigation(),
            page.click("#numbers > input[type=button]:nth-child(10)"),
            page.setViewport({
                width: 1080,
                height: 1920,
                deviceScaleFactor: 1
            })

        ]);
        await page.$eval('#available-Numbers > div > select', (element, data) => {
            var options = element.options;
            for (var i = 0; i < options.length; i++) {
                if (options[i].text === data.number) {
                    element.selectedIndex = i;
                }
            }

        }, data);

        await page.$eval('#divID > input[type=text]', (el, data) => el.value = data.id, data);
        await page.$eval('#divReID > input[type=text]', (el, data) => el.value = data.id, data);
        page.click("#id-submit > input[type=BUTTON]"),
            await page.waitForNavigation(),
            await page.waitForSelector("#divFName > input[type=text]")
        await page.$eval('#divFName > input[type=text]', (el, data) => el.value = data.firstName, data);
        await page.$eval('#divFatherName > input[type=text]', (el, data) => el.value = data.fatherName, data);
        await page.$eval('#divLName > input[type=text]', (el, data) => el.value = data.lastName, data);
        await page.$eval('#divMother > input[type=text]', (el, data) => el.value = data.motherName, data);
        await page.$eval('#divrefnb > input[type=text]', (el, data) => el.value = data.phoneNumber, data);
        await page.$eval("#divdob > input", (el, data) => el.value = data.dobYear, data);
        await page.$eval('#divdob > div.styleSelect.daySelect > select', (element, data) => {
            var options = element.options;
            for (var i = 0; i < options.length; i++) {
                if (options[i].text === data.dobDay) {
                    element.selectedIndex = i;
                }
            }

        }, data);
        await page.$eval("#divdob > div:nth-child(3) > select", (element, data) => {
            var options = element.options;
            for (var i = 0; i < options.length; i++) {
                if (options[i].text === data.dobMonth) {
                    element.selectedIndex = i;
                }
            }
        }, data);

        page.click("#SubButL"),
            await page.waitForNavigation();

        await page.$eval("#divID > input[type=text]:nth-child(2)", (el, data) => el.value = data.code, data);


        page.click("#divID > input[type=BUTTON]:nth-child(4)"),
            await page.waitForNavigation();
        await page.setViewport({
            width: 1080,
            height: 500,
        });
        await page.screenshot({ path: `./images/screenMtc.jpg` });
        await browser.close()
    } catch {
        await browser.close()

    } finally {
        await browser.close()

    }


}
async function readFileAsync(path, options) {
    try {
        const data = await fs.readFile(path, options);
        return data;
    } catch (err) {
        console.error('Error reading file:', err);
        throw err;
    }
}
async function writeFileAsync(path, data, options) {
    try {
        await fs.writeFile(path, data, options);
        console.log('File written successfully.');
    } catch (err) {
        console.error('Error writing file:', err);
        throw err;
    }
}
const autoReserve = async () => {
    newNumbers.forEach(async (number) => {
        if (number === '') return;

        if (number[0] == '3') number = '0' + number;
        let id;
        let ids;
        try {
            const data = await readFileAsync('ids.json', 'utf8');
            ids = JSON.parse(data);
            if (ids.length == 0) return;
            id = ids[0]
        } catch (err) {
            console.log(err);
        }

        let aaa = number[6] == '6' && number[7] == '8' && number[4] === number[3];
        let abacac = number[2] === number[4] && number[4] === number[6] && number[5] === number[7];
        let aabccb = number[2] === number[3] && number[5] === number[6] && number[4] === number[7];
        let abbacc = number[2] === number[5] && number[4] === number[3] && number[6] === number[7];
        let xxxabx = number[2] === number[3] && number[2] === number[4] && number[2] === number[7];
        let abbccd03 = number[0] === '0' && number[1] === '3' && number[3] === number[4] && number[5] === number[6];
        let aabcxx03 = number[0] === '0' && number[1] === '3' && number[2] === number[3] && number[6] === number[7];
        let abccdd03 = number[0] === '0' && number[1] === '3' && number[5] === number[4] && number[6] === number[7];
        let abcbbc03 = number[0] === '0' && number[1] === '3' && number[5] === number[3] && number[5] === number[6] && number[4] === number[7];
        let a7077700 = number[0] === '7' && number[1] === '0' && number[2] === number[3] && number[5] === '7' && number[6] === number[7];
        let abaaca = number[2] === number[4] && number[2] === number[5] && number[2] === number[7];
        let xyxyabxy = number[0] === number[2] && number[2] === number[6] && number[1] === number[3] && number[1] === number[7];
        let xyabxyxy = number[0] === number[4] && number[0] === number[6] && number[1] === number[5] && number[1] === number[7];
        let xyxyxyab = number[0] === number[2] && number[0] === number[4] && number[1] === number[5] && number[1] === number[7];
        let abxxab03 = number[6] === number[2] && number[3] === number[7];
        // let codeabcplus10 = (parseInt(number.substring(5, 8)) - parseInt(number.substring(2, 5))) === 10;
        // let codeabcminus10 = (parseInt(number.substring(2, 5)) - parseInt(number.substring(5, 8))) === 10;
        // let codeabcplus100 = (parseInt(number.substring(5, 8)) - parseInt(number.substring(2, 5))) === 100;
        // let codeabcminus100 = (parseInt(number.substring(2, 5)) - parseInt(number.substring(5, 8))) === 100;
        let abc81888 = number[0] === '8' && number[1] === '1' && number[2] === '8' && number[3] === '8' && number[3] === '8' && number[4] === '8';
        let abcbzbxb = number[1] === number[3] && number[1] === number[5] && number[1] === number[7];
        let xaxbxzxy = number[0] === number[2] && number[4] === number[6];
        // let codeabcplus10plus10 = (parseInt(number.substring(6)) - parseInt(number.substring(4, 6))) + ((parseInt(number.substring(4, 6)) - parseInt(number.substring(2, 4)))) === 20;
        let abcbab = number[3] === number[5] && number[3] === number[7];
        let aacdaa = number[2] === number[3] && number[6] === number[7];
        id['number'] = number;

        if (abacac || abbacc || xxxabx || aabccb || abbccd03 || aabcxx03 || abccdd03 || abcbbc03 || a7077700 || abaaca || xyxyabxy || xyabxyxy || xyxyxyab || abxxab03 || abc81888 || abcbzbxb || xaxbxzxy || abcbab || aacdaa) {
            bookNumber(id);
        }
        ids.shift();
        await writeFileAsync('ids.json', JSON.stringify(ids), 'utf8');
    })
}

const getNumbers = async () => {
    const browser = await puppeteer.launch({
        args: [
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--no-zygote",
        ],
        executablePath:
            process.env.NODE_ENV === "production"
                ? process.env.PUPPETEER_EXECUTABLE_PATH
                : puppeteer.executablePath(),
    })
    const page = await browser.newPage()
    await page.goto('https://www.touch.com.lb/autoforms/portal/touch/onlinereservation', { waitUntil: 'networkidle2', timeout: 0 });
    await Promise.all([
        page.waitForNavigation(),
        await page.$eval('#id1', el => el.value = 0),
        page.click("#numbers > input[type=button]:nth-child(10)"),
        page.setViewport({
            width: 1000,
            height: 1000,
            deviceScaleFactor: 1
        })

    ]);
    var nums = await page.evaluate(() => { return Array.from(document.querySelectorAll("#available-Numbers > div > select > option")).map(x => x.text) });
    async function numbersFilter() {
        if (localStorage.getItem("nums") != null) {
            storedNumbers = JSON.parse(localStorage.getItem("nums"));
            for (i of nums) {
                if (!storedNumbers.includes(i)) {
                    newNumbers.push(i);
                    storedNumbers.push(i)
                }
            }
            localStorage.setItem("nums", JSON.stringify(storedNumbers));
        } else {
            newNumbers = nums;
            storedNumbers = nums;
            localStorage.setItem("nums", JSON.stringify(storedNumbers));
        }
    }
    await numbersFilter()
    await browser.close()
    if (newNumbers.length > 0) {
        await sendNotifications()
    }

}
const sendNotifications = async () => {
    // autoReserve();
    let c = 0
    var list = rearrangeNumbers(newNumbers);
    list.forEach((number) => {
        if (number === '') return;
        if (number[0] == '3') number = '0' + number;
        let abacac = number[2] === number[4] && number[4] === number[6] && number[5] === number[7];
        let aabccb = number[2] === number[3] && number[5] === number[6] && number[4] === number[7];
        let abbacc = number[2] === number[5] && number[4] === number[3] && number[6] === number[7];
        let xxxabx = number[2] === number[3] && number[2] === number[4] && number[2] === number[7];
        let abbccd03 = number[0] === '0' && number[1] === '3' && number[3] === number[4] && number[5] === number[6];
        let aabcxx03 = number[0] === '0' && number[1] === '3' && number[2] === number[3] && number[6] === number[7];
        let abccdd03 = number[0] === '0' && number[1] === '3' && number[5] === number[4] && number[6] === number[7];
        let abcbbc03 = number[0] === '0' && number[1] === '3' && number[5] === number[3] && number[5] === number[6] && number[4] === number[7];
        let a7077700 = number[0] === '7' && number[1] === '0' && number[2] === number[3] && number[5] === '7' && number[6] === number[7];
        let abaaca = number[2] === number[4] && number[2] === number[5] && number[2] === number[7];
        let xyxyabxy = number[0] === number[2] && number[2] === number[6] && number[1] === number[3] && number[1] === number[7];
        let xyabxyxy = number[0] === number[4] && number[0] === number[6] && number[1] === number[5] && number[1] === number[7];
        let xyxyxyab = number[0] === number[2] && number[0] === number[4] && number[1] === number[5] && number[1] === number[7];
        let abxxab03 = number[6] === number[2] && number[3] === number[7];
        let codeabcplus10 = (parseInt(number.toString().substring(5, 8)) - parseInt(number.toString().substring(2, 5))) === 10;
        let codeabcminus10 = (parseInt(number.toString().substring(2, 5)) - parseInt(number.toString().substring(5, 8))) === 10;
        let codeabcplus100 = (parseInt(number.toString().substring(5, 8)) - parseInt(number.toString().substring(2, 5))) === 100;
        let codeabcminus100 = (parseInt(number.toString().substring(2, 5)) - parseInt(number.toString().substring(5, 8))) === 100;
        let abc81888 = number[0] === '8' && number[1] === '1' && number[2] === '8' && number[3] === '8' && number[3] === '8' && number[4] === '8';
        let abcbzbxb = number[1] === number[3] && number[1] === number[5] && number[1] === number[7];
        let xaxbxzxy = number[0] === number[2] && number[4] === number[6];
        let codeabcplus10plus10 = (parseInt(number.toString().substring(6)) - parseInt(number.toString().substring(4, 6))) + ((parseInt(number.toString().substring(4, 6)) - parseInt(number.toString().substring(2, 4)))) === 20;
        let abcbab = number[3] === number[5] && number[3] === number[7];
        let aacdaa = number[2] === number[3] && number[6] === number[7];
        if (abacac || abbacc || xxxabx || aabccb || abbccd03 || aabcxx03 || abccdd03 || abcbbc03 || a7077700 || abaaca || xyxyabxy || xyabxyxy || xyxyxyab || abxxab03 || abc81888 || abcbzbxb || xaxbxzxy || abcbab || aacdaa) {
            const index = list.indexOf(number);
            list.splice(index, 1);
            list.unshift(number);
        }
    })
    if (newNumbers.length > 0) {
        if (list.length > 30) {
            for (let i = 0; i < list.length; i += 30) {
                const chunk = list.slice(i, i + 30);
                bot.sendMessage(nasser, chunk.join(' '));
                // bot.sendMessage(user, chunk.join(' '));
            }
        }
        const remaining = list.slice((Math.floor(list.length / 30)) * 30);
        if (remaining.length > 0) {
            bot.sendMessage(nasser, remaining.join(' '));
            // bot.sendMessage(user, remaining.join(' '));
        }
    }

}
const rearrangeNumbers = (numbers) => {
    // Convert the numbers to an array of strings
    const nums = numbers.map(Number);

    // Sort the numbers in ascending order
    nums.sort((a, b) => a - b);

    // Initialize variables
    let prevNum = nums[0];
    let currGroup = [prevNum];
    let groups = [currGroup];

    // Group the numbers based on proximity to each other
    for (let i = 1; i < nums.length; i++) {
        const currNum = nums[i];
        const diff = currNum - prevNum;

        if (diff <= 1) {
            currGroup.push(currNum);
        } else {
            currGroup = [currNum];
            groups.push(currGroup);
        }

        prevNum = currNum;
    }

    // Flatten the groups into a single array
    const result = groups.reduce((acc, group) => acc.concat(group), []);

    // Return the rearranged numbers as a string
    return result
}
setInterval(() => {
    try {
        getNumbers().then(() => {
            newNumbers = [];
            storedNumbers = [];
        })
    } catch {
    }

}, 17 * 1000);
