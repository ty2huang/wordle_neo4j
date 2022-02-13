const getWordsBtn = document.querySelector('#getWords');
const queryInput = document.querySelector('#queryString');

const positionsInfo = new Array();
const existsCount = new Map();
const absentLetters = new Set();
const upperLimits = new Map();

function generateQuery() {
    const upperLimitClause = [];
    for (const [idx, [letter,limit]] of Object.entries(upperLimits).entries()) {
        upperLimitClause.push(`MATCH (n)-[r${idx}]->(m${idx}:Letter{char:'${letter}'})\n` +
            `  WITH n,m${idx},count(r${idx}) as count${idx}\n` +
            `  WHERE count${idx} = ${limit}`);
    }

    let pathsCount = 0;
    const matchClause = [];
    const whereClause = [];
    const returnList = [];
    for (const [idx, info] of positionsInfo.entries()) {
        if (info.correct !== '') {
            pathsCount++;
            matchClause.push(`p${pathsCount}=(n)-[:POS${idx+1}]->(:Letter{char:'${info.correct}'})`);
            returnList.push(`p${pathsCount}`);
        }
        for (const letter of info.incorrect) {
            whereClause.push(`NOT EXISTS {(n)-[:POS${idx+1}]->(:Letter{char:'${letter}'})}`);
        }
    }

    for (const [letter,count] of Object.entries(existsCount)) {
        for (let i = 0; i < count; i++) {
            pathsCount++;
            matchClause.push(`p${pathsCount}=(n)-->(:Letter{char:'${letter}'})`);
            returnList.push(`p${pathsCount}`);
        }
    }

    absentLetters.forEach(letter => whereClause.push(`NOT EXISTS {(n)-->(:Letter{char:'${letter}'})}`));

    const clauses = [];
    if (upperLimitClause.length > 0) clauses.push(upperLimitClause.join('\n')); 
    clauses.push('MATCH ' + ((matchClause.length > 0) ? matchClause.join(',\n  ') : '(n)'));
    if (whereClause.length > 0) clauses.push('WHERE ' + whereClause.join('\n  AND '));
    clauses.push('RETURN ' + ((returnList.length > 0) ? returnList.join(',') : 'n'));
    
    queryInput.innerHTML = clauses.join('\n');
}

function processTextArea() {
    queryInput.style.height = '1px';
    queryInput.style.height = (queryInput.scrollHeight) + 'px';
    queryInput.select()
}

chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    let tab = tabs[0];
    if (tab.url === 'https://wordlegame.org/') {
        document.querySelector('#introParagraph').style['display'] = 'none';
        document.querySelector('#functionality').style['display'] = 'block';
        document.querySelectorAll('.btn').forEach(x => x.disabled = false);

        chrome.tabs.executeScript(tab.id, {
            code: 'chrome.runtime.sendMessage(document.querySelector(".game_rows").innerHTML)'
        });
    }
});

chrome.runtime.onMessage.addListener(function(request) {
    for (let i = 0; i < 5; i++) positionsInfo.push({ correct:'', incorrect:[] });

    const div = document.createElement('div');
    div.innerHTML = request;

    div.querySelectorAll('.Row-locked-in').forEach(x => {
        const letterCountInWord = new Map();
        let index = 0;
        for (const node of x.children) {
            const letter = node.innerText[0].toLowerCase()
            const correctClass = 'letter-correct';
            const elsewhereClass = 'letter-elsewhere';
            const absentClass = 'letter-absent';

            if (node.classList.contains(absentClass)) {
                if ((letterCountInWord[letter] || 0) > 0) {
                    upperLimits[letter] = letterCountInWord[letter];
                } else {
                    absentLetters.add(letter);
                }
            } else {
                letterCountInWord[letter] = (letterCountInWord[letter] || 0 ) + 1;
                if (node.classList.contains(correctClass)) {
                    positionsInfo[index].correct = letter
                } else {
                    positionsInfo[index].incorrect.push(letter)
                }
            }
            index++;
        }

        for (const [letter, count] of Object.entries(letterCountInWord)) {
            if (count > (existsCount[letter] || 0)) existsCount[letter] = count;
        }
    });

    for (const obj of positionsInfo) {
        if (obj.correct !== '') existsCount[obj.correct] -= 1;
    }
    generateQuery();
    processTextArea();
});