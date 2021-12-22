function getDateStringHeader(currentDate) {
    var cDay = currentDate.getDate();
    var cMonth = currentDate.getMonth() + 1;
    var cYear = currentDate.getFullYear();
    var date = cMonth + '/' + cDay + '/' + cYear;
    var cHours = currentDate.getHours();
    var cMinutes = currentDate.getMinutes();
    var cSeconds = currentDate.getSeconds();
    var time = (cHours - 12) + ':' + cMinutes + ':' + cSeconds;
    time += (cHours < 12) ? ' A.M.' : ' P.M.';

    return (date + ' - ' + time)
}

function getDateStringFilename(currentDate) {
    var cDay = currentDate.getDate();
    var cMonth = currentDate.getMonth() + 1;
    var cYear = currentDate.getFullYear();
    var date = cMonth + '_' + cDay + '_' + cYear;
    var time = currentDate.getHours() + '_' + currentDate.getMinutes() + '_' + currentDate.getSeconds();

    return (date + '-' + time)
}

function generateReportHeader(parentElement, dateString) {
    var titleElement = document.createElement('h1');
    titleElement.innerText = 'Daily Money Report - ' + dateString;

    parentElement.appendChild(titleElement);
}

function addValueToTable(table, denomination, count, total) {
    var htmlRow = document.createElement('tr');
    htmlRow.className = 'reportTableInfo';

    var htmlColumn = document.createElement('td');
    htmlColumn.className = 'reportDenomination';
    htmlColumn.innerText = denomination;
    htmlRow.appendChild(htmlColumn);

    var htmlColumn = document.createElement('td');
    htmlColumn.className = 'reportCount';
    htmlColumn.innerText = count;
    htmlRow.appendChild(htmlColumn);

    var htmlColumn = document.createElement('td');
    htmlColumn.className = 'reportTotal';
    htmlColumn.innerText = '$' + total.toFixed(2);
    htmlRow.appendChild(htmlColumn);

    table.appendChild(htmlRow)
}

function generateBreakdownTable(parentElement, title, denominationsArray, isCents) {
    var finalTotal = 0;

    var titleElement = document.createElement('h2');
    titleElement.innerText = title;

    var tableElement = document.createElement('table');
    tableElement.className = 'reportTable'

    var elementPrefix = (isCents) ? 'cent' : 'dollar';

    for (var i = 0; i < denominationsArray.length; i++) {
        denomination = denominationsArray[i];
        denominationValue = (isCents) ? parseFloat((denomination / 100)).toFixed(2) : denomination;
        elementName = elementPrefix + denomination;
        denominationCount = parseInt(document.querySelector('[name=' + elementName + ']').value);
        denominationCount = (isNaN(denominationCount)) ? 0 : denominationCount;
        denominationTotal = parseFloat((denominationCount * denominationValue).toFixed(2));

        // Update the report
        addValueToTable(tableElement, '$' + denominationValue, denominationCount, denominationTotal);

        // Update the total
        finalTotal += denominationTotal;
    }

    addValueToTable(tableElement, "", "", finalTotal);

    parentElement.appendChild(titleElement);
    parentElement.appendChild(tableElement);

    return finalTotal;
}

function generateFinalTotal(parentElement, billTotal, coinTotal) {
    var titleElement = document.createElement('h2');
    titleElement.innerText = 'Final Total';

    var tableElement = document.createElement('table');
    tableElement.className = 'reportTable'

    addValueToTable(tableElement, "Bills", "", billTotal);
    addValueToTable(tableElement, "Coins", "", coinTotal);
    addValueToTable(tableElement, "", "", billTotal + coinTotal);

    parentElement.appendChild(titleElement);
    parentElement.appendChild(tableElement);
}

function generateOpenReport() {
    var total = 0;
    var billTotal = 0;
    var coinTotal = 0;
    var billDenominations = new Array(100, 50, 20, 10, 5, 1);
    var coinDenominations = new Array(25, 10, 5, 1);
    var currentDate = new Date();
    var dateStringHeader = getDateStringHeader(currentDate);
    var dateStringFilename = getDateStringFilename(currentDate);

    var parentElement = document.createElement('div');
    parentElement.className = 'report';
    // parentElement.style.width = window.innerWidth;
    // parentElement.style.height = window.innerHeight;

    generateReportHeader(parentElement, dateStringHeader);
    billTotal = generateBreakdownTable(parentElement, "Bills", billDenominations, false);
    coinTotal = generateBreakdownTable(parentElement, "Coins", coinDenominations, true);
    generateFinalTotal(parentElement, billTotal, coinTotal);

    html2pdf(parentElement, {
        margin: 0.25,
        filename: 'DailyMoneyReport_' + dateStringFilename + '.pdf',
        image: { type: 'jpeg', quality: 1.00 },
        html2canvas: { dpi: 300, letterRendering: true, scrollX: 0, scrollY: 0 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    });
}