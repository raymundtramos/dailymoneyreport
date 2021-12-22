function getDateStringHeader(currentDate) {
    var cDay = currentDate.getDate();
    var cMonth = currentDate.getMonth() + 1;
    var cYear = currentDate.getFullYear();
    var date = cMonth + '/' + cDay + '/' + cYear;
    var cHours = currentDate.getHours();
    var cHoursDisplay = (cHours <= 12) ? cHours : (cHours - 12);
    var cMinutes = currentDate.getMinutes();
    var cMinutesDisplay = (cMinutes < 10) ? '0' + cMinutes.toString() : cMinutes;
    var cSeconds = currentDate.getSeconds();
    var cSecondsDisplay = (cSeconds < 10) ? '0' + cSeconds.toString() : cSeconds;
    var time = cHoursDisplay + ':' + cMinutesDisplay + ':' + cSecondsDisplay;
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

function generateBreakdownTable(doc, xMargin, yMargin, title, denominationsArray, isCents) {
    var finalTotal = 0;

    var tableColumns = [
        { header: 'Denomination', dataKey: 'denomination', styles: { fillColor: [0, 0, 0] } },
        { header: 'Count', dataKey: 'count' },
        { header: 'Total', dataKey: 'total' }
    ];

    var tableBody = [];

    var elementPrefix = (isCents) ? 'cent' : 'dollar';

    for (var i = 0; i < denominationsArray.length; i++) {
        denomination = denominationsArray[i];
        denominationValue = (isCents) ? parseFloat((denomination / 100)).toFixed(2) : denomination;
        elementName = elementPrefix + denomination;
        denominationCount = parseInt(document.querySelector('[name=' + elementName + ']').value);
        denominationCount = (isNaN(denominationCount)) ? 0 : denominationCount;
        denominationTotal = parseFloat((denominationCount * denominationValue));

        // Update the report
        tableBody.push({ denomination: '$' + denominationValue, count: denominationCount, total: '$' + denominationTotal.toFixed(2) });

        // Update the total
        finalTotal += parseFloat(denominationTotal);
    }

    tableBody.push({ denomination: '', count: '', total: '$' + finalTotal.toFixed(2) });

    // Calculate the table width for the column sizes
    var tableWidth = doc.internal.pageSize.getWidth();

    // Subtract the 2 side margins
    tableWidth -= (xMargin * 2);

    // Add to the PDF document
    var nextYMargin = doc.lastAutoTable.finalY || yMargin;

    doc.text(title, xMargin, nextYMargin + yMargin);

    doc.autoTable({
        margin: { top: 0, left: xMargin, right: xMargin, bottom: 0 },
        startY: nextYMargin + (yMargin * 2),
        body: tableBody,
        columns: tableColumns,
        columnStyles: {
            denomination: { cellWidth: parseInt(tableWidth * 0.6), lineColor: '576574', lineWidth: { bottom: 0.5 } },
            count: { cellWidth: parseInt(tableWidth * 0.2), lineColor: '576574', lineWidth: { bottom: 0.5 } },
            total: { cellWidth: parseInt(tableWidth * 0.2), lineColor: '576574', lineWidth: { bottom: 0.5 } }
        },
    });

    return finalTotal;
}

function generateFinalTotal(doc, xMargin, yMargin, billTotal, coinTotal) {
    var tableColumns = [
        { header: 'Type', dataKey: 'type' },
        { header: '', dataKey: 'empty' },
        { header: 'Total', dataKey: 'total' }
    ];

    var tableBody = [
        { type: 'Bills', empty: '', total: '$' + billTotal.toFixed(2) },
        { type: 'Coins', empty: '', total: '$' + coinTotal.toFixed(2) },
        { type: '', empty: '', total: '$' + (billTotal + coinTotal).toFixed(2) }
    ];

    // Calculate the table width for the column sizes
    var tableWidth = doc.internal.pageSize.getWidth();

    // Subtract the 2 side margins
    tableWidth -= (xMargin * 2);

    var nextYMargin = doc.lastAutoTable.finalY || yMargin;

    doc.text('Final Total', xMargin, nextYMargin + yMargin)

    doc.autoTable({
        margin: { top: 0, left: xMargin, right: xMargin, bottom: 0 },
        startY: nextYMargin + (yMargin * 2),
        body: tableBody,
        columns: tableColumns,
        columnStyles: {
            type: { cellWidth: parseInt(tableWidth * 0.6), lineColor: '576574', lineWidth: { bottom: 0.5 } },
            empty: { cellWidth: parseInt(tableWidth * 0.2), lineColor: '576574', lineWidth: { bottom: 0.5 } },
            total: { cellWidth: parseInt(tableWidth * 0.2), lineColor: '576574', lineWidth: { bottom: 0.5 } }
        }
    });
}

function generateOpenReport() {
    var billTotal = 0;
    var coinTotal = 0;
    var billDenominations = new Array(100, 50, 20, 10, 5, 1);
    var coinDenominations = new Array(25, 10, 5, 1);

    var currentDate = new Date();
    var dateStringHeader = getDateStringHeader(currentDate);
    var dateStringFilename = getDateStringFilename(currentDate);

    var xMargin = 20;
    var yMargin = 30;
    var doc = new jspdf.jsPDF("p", "pt", "letter", true);
    doc.text('Daily Money Report - ' + dateStringHeader, xMargin, yMargin);

    billTotal = generateBreakdownTable(doc, xMargin, yMargin, "Bills", billDenominations, false);
    coinTotal = generateBreakdownTable(doc, xMargin, yMargin, "Coins", coinDenominations, true);
    generateFinalTotal(doc, xMargin, yMargin, billTotal, coinTotal);

    doc.save('DailyMoneyReport_' + dateStringFilename + '.pdf');
}