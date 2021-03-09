const reListButton = document.createElement('div');
reListButton.classList = 'reListButton';
reListButton.innerText = 're-list';

document.body.append(reListButton);

function reListButtonClick() {
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
        
            console.log('Grenze für ' + namez + ': ' + mw + ' angebot: ' + angebot);
            if (mw > angebot) {
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

reListButton.onclick = () => reListButtonClick();