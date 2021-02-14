const container = document.createElement('div');
container.classList = 'quickListContainer';

const plus = document.createElement('div');
plus.innerText = '+';
plus.classList = 'plus modificator buttonItem';

const minus = document.createElement('div');
minus.innerText = '-';
minus.classList = 'minus modificator buttonItem';

const percentButton = document.createElement('div');
percentButton.classList = 'percent buttonItem';
let percent = 0;
percentButton.innerText = percent + ' %';

container.appendChild(minus);
container.appendChild(percentButton);
container.appendChild(plus);


document.body.append(container);

function percentButtonClick() {
    p = document.querySelectorAll('.players>.playerGroup');
    function interpretPrice(str) {
        a = str.split('\n');
        a = a[0]
        a = a.split('.');
        joined = Number(a.join('').replace('€ ', ''))
        return joined
    }
    removedCount = 0;
    p.forEach((e) => {
        try {
            angebot = interpretPrice(e.querySelector('.playerOffer>.price').innerText);
            mw = interpretPrice(e.querySelector('.playerPoints>.price>strong').innerText);
            namez = e.querySelector('.playerName>.lastName').innerText
            let grenze = mw * (1 + (percent / 100))
            console.log('Grenze für ' + namez + ': ' + grenze + ' angebot: ' + angebot);
            if (grenze > angebot) {
                console.log('name: ', namez, ' angebot: ', angebot, typeof angebot, ' mw: ', mw, typeof mw);
                e.querySelector('.offerWidget>.cancelButton').click()
                removedCount++;
            } else if (e.querySelector('.playerOffer > .price.expired')) {
                e.querySelector('.offerWidget>.cancelButton').click()
                removedCount++;
            }
        }
        catch{ }
    })
    console.log('removed ' + removedCount + ' listings.');
    listedCount = 0
    if (removedCount > 0) {
        document.querySelector('#pageContentWrapper > div > div.TransferMarket.inner > div.leftContainer > div > div > div > div.statusBar > div > button').click();
        setTimeout(() => {
            w = document.querySelectorAll('.offerWidget > .sellPlayerButton');
            w.forEach((e) => {
                e.click();
                listedCount++;
            })
            document.querySelector('.buttonContainer > .btn.highlighted').click();
            console.log('listed ' + listedCount + ' players.')
        }, 500);
    }
}

function plusClick() {
    percent = percent + 0.1;
    percentButton.innerText =  percent + ' %';
}
function minusClick() {
    if (percent > 0) percent = percent - 0.1;
    percentButton.innerText = percent + ' %';
}

plus.onclick = () => plusClick();
minus.onclick = () => minusClick();
percentButton.onclick = () => percentButtonClick();
