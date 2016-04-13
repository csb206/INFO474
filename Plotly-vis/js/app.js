
'use strict';
// Don't execute any code until everything is on the DOM
$(document).ready(function() {
        // takes in the csv file and processes the data in the appropiate order
    function makePlot() { 
        Plotly.d3.csv("./antibiotics_data.csv", 
            function(data) { 
                console.log("Processing data");
                processData(data);
            });
    };
     
     makePlot();

     // This method processes the data by dividing the gram staining result for each treatment
     // into groups. 
     // Given parameter is all the rows of data in the csv file correctly formatted. 
     // Takes the logrithmic value of each MIC level in positive and negative gram stain results. 
     // Seperates the Pencilin, Streptomycin and Neomycin MIC levels to count number of positive and
     // negative grain stain result.
     // Returns the means of MIC levels categorized by grain stain of each treatment. 
    function processData(allRows) {
        console.log(allRows);
        
        var data = [];
        var penPos = [];
        var penNeg = [];
        var strPos = [];
        var strNeg = [];
        var neoPos = [];
        var neoNeg = [];
        // all the positive grain stain result MIC levels placed in array
        // all the negative grain stain result MIC levels placed in array
        for (var i = 0; i < allRows.length; i++) {
            var row = allRows[i];
            var x = row['Gram Staining '];
            if (x == 'positive') {
                penPos.push(Math.log(row['Penicilin']));
                strPos.push(Math.log(row['Streptomycin ']));
                neoPos.push(Math.log(row['Neomycin']));
            } else {
                penNeg.push(Math.log(row['Penicilin']));
                strNeg.push(Math.log(row['Streptomycin ']));
                neoNeg.push(Math.log(row['Neomycin']));
            }
        }
        // total amount of pencilin MIC levels (positive and negative)
        var pen = [];
        // total amount of streptomycin MIC levels (positive and negative)
        var str = [];
        // total amount of neomycin MIC levels (positive and negative)
        var neo = [];

        for (var i = 0; i < penPos.length; i++) {
            pen.push(penPos[i]);
        }
        for (var i = 0; i < penNeg.length; i++) {
            pen.push(penNeg[i]);
        }
        for (var i = 0; i < strPos.length; i++) {
            str.push(strPos[i]);
        }
        for (var i = 0; i < strNeg.length; i++) {
            str.push(strNeg[i]);
        }
        for (var i = 0; i < neoPos.length; i++) {
            neo.push(neoPos[i]);
        }
        for (var i = 0; i < neoNeg.length; i++) {
            neo.push(neoNeg[i]);
        }

        makeBarGraph(penPos, penNeg, strPos, strNeg, neoPos, neoNeg);
        makePlotly(penPos, penNeg, strPos, strNeg, neoPos, neoNeg);
        make3dPlot(pen, str, neo);
    };  

});

// this function makes the bar graph in example 1
// calculates the means of all treatment grain stain result types, 
// for example: Positive Penicilin. 
// counts the number of each result type per treatment.
// given parameters: 
// penPos = an array of all the logorithmic values of positive Pencilin MIC levels
// penNeg = an array of all the logorithmic values of negative Pencilin MIC levels
// strPos = an array of all the logorithmic values of positive Streptomycin MIC levels
// strNeg = an array of all the logorithmic values of negative Streptomycin MIC levels
// neoPos = an array of all the logorithmic values of positive Neomycin MIC levels
// neoNeg = an array of all the logorithmic values of negative Neomycin MIC levels
function makeBarGraph(penPos, penNeg, strPos, strNeg, neoPos, neoNeg) {
    
    var posTotal = 0;
    var posCount = 0;
    for (var i = 0; i < penPos.length; i++) { 
        var pos =  penPos[i];
        posTotal += pos;
        posCount++;
    }
    var posPenMean = posTotal / posCount;
    
    var negTotal = 0;
    var negCount = 0; 
    for (var i = 0; i < penNeg.length; i++) {
        var neg = penNeg[i];
        negTotal += neg;
        negCount++;
    }
    var negPenMean = negTotal / negCount; 

    var posStrTotal = 0;
    var posStrCount = 0;
     for (var i = 0; i < strPos.length; i++) { 
        var pos =  strPos[i];
        posStrTotal += pos;
        posStrCount++;
    }
    var posStrMean = posStrTotal / posCount;

    var negStrTotal = 0;
    var negStrCount = 0; 
    for (var i = 0; i < strNeg.length; i++) {
        var neg = strNeg[i];
        negStrTotal += neg;
        negStrCount++;
    }
    var negStrMean = negStrTotal / negStrCount; 


    var posNeoTotal = 0;
    var posNeoCount = 0;
     for (var i = 0; i < neoPos.length; i++) { 
        var pos =  strPos[i];
        posNeoTotal += pos;
        posNeoCount++;
    }
    var posNeoMean = posNeoTotal / posNeoCount;

    var negNeoTotal = 0;
    var negNeoCount = 0; 
    for (var i = 0; i < strNeg.length; i++) {
        var neg = strNeg[i];
        negNeoTotal += neg;
        negNeoCount++;
    }
    var negNeoMean = negNeoTotal / negNeoCount;

    // plotting the positive means of the MIC levels for each treatment on left column (bar) 
    // of each grouped bar

    var column1 = {
        x: ['Penicilin', 'Streptomycin', 'Neomycin'],
        y: [posPenMean, posStrMean, posNeoMean],
        name: 'Positive',
        type: 'bar'
    };

    // plotting the negative means of the MIC levels for each treatment on right column (bar)
    // of each grouped bar
    var column2 = {
        x: ['Penicilin' , 'Streptomycin', 'Neomycin'],
        y: [negPenMean, negStrMean, negNeoMean],
        name: 'Negative',
        type: 'bar'
    };
 
    // grouping the left and right column together for each group
    var data = [column1, column2];
    var layout = {barmode: 'group'};
    Plotly.newPlot('graph1', data, layout, {staticPlot: true});

};

// this function creates the box-chart graph
// given parameters: the same as makeBarGraph method (below)
// penPos = an array of all the logorithmic values of positive Pencilin MIC levels
// penNeg = an array of all the logorithmic values of negative Pencilin MIC levels
// strPos = an array of all the logorithmic values of positive Streptomycin MIC levels
// strNeg = an array of all the logorithmic values of negative Streptomycin MIC levels
// neoPos = an array of all the logorithmic values of positive Neomycin MIC levels
// neoNeg = an array of all the logorithmic values of negative Neomycin MIC levels
function makePlotly(penPos, penNeg, strPos, strNeg, neoPos, neoNeg) {
    var plotDiv = document.getElementById("plot");
    var dataNames = ['Pencilin Positive', 'Penicilin Negative', 'Streptomycin Positive', 'Streptomycin Negative', 'Neomycin Positive', 'Neomycin Negative'];
    var dataValues = [penPos, penNeg, strPos, strNeg, neoPos, neoNeg];
    var data = [];
    // iterating thru dataNames and dataValues to plot each marker with correlated information
    for (var i = 0; i < dataNames.length; i++) {
        var plot = {
            name: dataNames[i],
            y: dataValues[i],
            mode: 'markers',
            type: 'box',
            boxpoints: 'all',
            
        };
        data.push(plot);
    }

    // the layout of the box chart graph 
    var layout = {
        xaxis: {
            title: 'Gram Stain'
        },
        yaxis: {
            title: 'MIC Level (log-transformed)',
        },
        hovermode: 'closest'
    };

    // plotting the Plotly graph
    Plotly.newPlot('graph2', data, layout, {staticPlot: true});

};

// this function creates the 3d scatter plot
// given parameters: 
// pen = 1st dimension of the plot, the total amount of pencilin MIC levels (positive and negative)
// str = 2nd dimension of the plot, the total amount of streptomycin MIC levels (positive and negative)
// neo = 3rd dimensions of the plot, the total amount of total amount of neomycin MIC levels (positive and negative)
function make3dPlot(pen, str, neo) {
    var logPen = pen.map(function(x) {
        return Math.log(x);
    });
    var logStr = str.map(function(x) {
        return Math.log(x);
    });
    var logNeo = neo.map(function(x) {
        return Math.log(x);
    });
    
    var data = [{
       x: pen,
       y: str,
       z: neo,
       mode: 'markers',
       type: 'scatter3d',
       // marker color and size
       marker: {
         color: '#34DDDD',
         size: 5
            }
        },{
         alphahull: 9,
         opacity: 0.3,
         type: 'mesh3d',
         x: pen,
         y: str,
         z: neo
    }];
    // the details about formatting and the graphical dimensions of this graph. 
    var layout = {
        autosize: true,
        height: 700,
        width: 1300,
        scene: {
            aspectratio: {
                x: 1,
                y: 1,
                z: 1
            },
            camera: {
                center: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                eye: {
                    x: 1.25,
                    y: 1.25,
                    z: 1.25
                },
                up: {
                    x: 1,
                    y: 1,
                    z: 1
                }
            },
            // Pencilin MIC level scale
            xaxis: {
                title: 'Penicilin',
                type: 'linear',
                zeroline: false
            },
            // Streptomycin MIC level scale
            yaxis: {
                title: 'Streptomycin',
                type: 'linear',
                zeroline: false
            },
            // Neomycin MIC level scale
            zaxis: {
                title: 'Neomycin',
                type: 'linear',
                zeroline: false
            }
        },
        title: 'MIC Levels Across Treatments (Bring cursor to far left or right to scroll down),',
    };
    // when I use staticPlot: true for this scatter plot, the graphic disappears
    // the only object that shows is the title of the graph
    Plotly.newPlot('graph3', data, layout);
}; 