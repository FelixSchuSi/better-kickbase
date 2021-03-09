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

function interpretPrice(str) {
    a = str.split('\n');
    a = a[0]
    a = a.split('.');
    joined = Number(a.join('').replace('€ ', ''))
    return joined
}

function toCsv(arr){
    let result = 'sep=,\n';
    // debugger;
    for (const [name, value] of arr){
        result += `${name},${value}\n`;
    }
    return result;
}

function extractPlayerData() {
    const players = Array.from(document.querySelectorAll('.players>.playerGroup'));
    const playerData = players.map((player) => {
        console.log(player);
        try {
            debugger;
            const offerElement = player.querySelector('.playerOffer>.price');
            const offer = offerElement ? interpretPrice(offerElement.innerText):-1;
            const mw = interpretPrice(player.querySelector('.playerPoints>.price>strong').innerText);
            const name = player.querySelector('.playerName>.lastName').innerText
            return offer > 0 ? [name, offer] : [name, mw];
        }catch (e){}
     });
     const csv = toCsv(playerData);
     console.log(csv);
     a=document.createElement('a');
     a.download="better-kb.csv";
     a.href='data:text/csv;charset=utf-8,'+encodeURI(csv);
     a.click();
     console.log(csv);
}


console.log('v008');
document.addEventListener("keydown", function(e) {
  if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)  && e.keyCode == 83) {
    e.preventDefault();
    console.log('export started');
    extractPlayerData();
  }
}, false);