function calculateRange()
{
    var rref, rrefTolerance;
    var desiredAccuracy, measurementAccuracy;
    var adcError, adcNumberOfCodes, adcValue;
    var xMin, xMax;
    var rMin, rMax;
    var message = '';

    rref = getInputValue("rref");
    if (rref > 1000000)
    {
        // rref = 1000000;
        message = 'Reference resistor value &gt; 1&nbsp;MOhm is not recommended. ';
    }
    if (rref < 1000)
    {
        // rref = 1000;
        message = 'Reference resistor value &lt; 1&nbsp;kOhm is not recommended. ';
    }
    rrefTolerance = getInputValue("rrefTolerance") / 100;
    adcNumberOfCodes = Math.pow(2, getInputValue("adcBits"));
    adcError = getInputValue("adcError");
    desiredAccuracy = getInputValue("desiredAccuracy") / 100;

    var c = adcNumberOfCodes * adcError / (Math.abs(desiredAccuracy) - Math.abs(rrefTolerance));
    xMin = (1 * adcNumberOfCodes - Math.sqrt(Math.pow(adcNumberOfCodes, 2) - 4 * c)) / 2;
    xMax = (1 * adcNumberOfCodes + Math.sqrt(Math.pow(adcNumberOfCodes, 2) - 4 * c)) / 2;
    rMin = rref / ((adcNumberOfCodes / xMin) - 1);
    rMax = rref / ((adcNumberOfCodes / xMax) - 1);
    adcValue = adcNumberOfCodes / ((rref / rMin) + 1);
    document.getElementById("calculatedrMin").value = rMin.toPrecision(5);
    document.getElementById("calculatedrMax").value = rMax.toPrecision(5);
    if (rrefTolerance >= desiredAccuracy)
    {
        message += 'Desired measurement accuracy value is too low.';
    } else if (4 * c > Math.pow(adcNumberOfCodes, 2))
    {
        message += 'Desired measurement accuracy value is too low.';
    } else
    {
        message += '';
    }
    if (message === '')
    {
        document.getElementById("rangeMessage").style.display = "none";
    } else
    {
        document.getElementById("rangeMessage").style.display = "block";
        document.getElementById("rangeMessage").style.color = "red";
        document.getElementById("rangeMessage").innerHTML = message;
    }
}
function calculateRRef()
{
    var rref, rrefTolerance;
    var adcError, adcNumberOfCodes, adcValue;
    var accuracyAtMin, accuracyAtMax, measurementAccuracy;
    var rMin, rMax;
    var message = '';

    rMin = getInputValue("rMin");
    rMax = getInputValue("rMax");
    rrefTolerance = getInputValue("rrefTolerance") / 100;
    adcNumberOfCodes = Math.pow(2, getInputValue("adcBits"));
    adcError = getInputValue("adcError");

    rref = Math.sqrt(rMax * rMin);
    if (rref > 1000000)
    {
        // rref = 1000000;
        message = 'Reference resistor value &gt; 1&nbsp;MOhm is not recommended.';
    }
    if (rref < 1000)
    {
        // rref = 1000;
        message = 'Reference resistor value &lt; 1&nbsp;kOhm is not recommended.';
    }
    if (document.getElementById("E24").checked === true)
    {
        rref = tuneResistanceE24(rref);
    }
    adcValue = adcNumberOfCodes / ((rref / rMin) + 1);
    accuracyAtMin = Math.abs(adcNumberOfCodes * adcError / (adcValue * (adcNumberOfCodes - adcValue))) + Math.abs(rrefTolerance);
    adcValue = adcNumberOfCodes / ((rref / rMax) + 1);
    accuracyAtMax = Math.abs(adcNumberOfCodes * adcError / (adcValue * (adcNumberOfCodes - adcValue))) + Math.abs(rrefTolerance);
    measurementAccuracy = Math.max(accuracyAtMin, accuracyAtMax);
    document.getElementById("calculatedrref").value = rref.toPrecision(5);
    document.getElementById("measurementAccuracy").value = (measurementAccuracy * 100).toPrecision(2);
    if (message === '')
    {
        document.getElementById("rrefMessage").style.display = "none";
    } else
    {
        document.getElementById("rrefMessage").style.display = "block";
        document.getElementById("rrefMessage").style.color = "red";
        document.getElementById("rrefMessage").innerHTML = message;
    }
}
function tuneResistanceE24(r)
{
    var resistorValuesE24 = [10, 11, 12, 13, 15, 16, 18, 20, 22, 24, 27, 30, 33, 36, 39, 43, 47, 51, 56, 62, 68, 75, 82, 91, 100];
    var decade;

    decade = Math.floor(Math.log10(r));
    r = r / Math.pow(10.0, decade) * 10;
    var rTuned = resistorValuesE24[0];
    var d = Math.abs(r - resistorValuesE24[0]);
    for (i = 1; i < 25; i++)
    {
        if (Math.abs(r - resistorValuesE24[i]) < d)
        {
            rTuned = resistorValuesE24[i];
            d = Math.abs(r - resistorValuesE24[i]);
        }
    }
    return rTuned * Math.pow(10.0, decade - 1);
}
function getInputValue(id)
{
    return Number(document.getElementById(id).value);
}
