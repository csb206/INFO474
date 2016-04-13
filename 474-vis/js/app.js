/*
Questions:

 1) How does he MIC levels for each treatment affect the Gram Staining 
*/

'use strict';

function makePlot() { 
    Plotly.d3.csv("./antibiotics_data.csv", 
        function(data) { 
            console.log("Processing data");
            processData(data);
        });
};
 
 makePlot();


function processData(allRows) {
    console.log(allRows);
    
    var data = [];
    var penPos = [];
    var penNeg = [];
    var strPos = [];
    var strNeg = [];
    var neoPos = [];
    var neoNeg = [];
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
    var pen = [];
    var str = [];
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


    var column1 = {
        x: ['Penicilin', 'Streptomycin', 'Neomycin'],
        y: [posPenMean, posStrMean, posNeoMean],
        name: 'Positive',
        type: 'bar'
    };

    var column2 = {
        x: ['Penicilin' , 'Streptomycin', 'Neomycin'],
        y: [negPenMean, negStrMean, negNeoMean],
        name: 'Negative',
        type: 'bar'
    };

    var data = [column1, column2];
    var layout = {barmode: 'group'};
    Plotly.newPlot('graph1', data, layout, {staticPlot: true});

};

function makePlotly(penPos, penNeg, strPos, strNeg, neoPos, neoNeg) {
    var plotDiv = document.getElementById("plot");
    var dataNames = ['Pencilin Positive', 'Penicilin Negative', 'Streptomycin Positive', 
        + 'Streptomycin Negative', 'Neomycin Positive', 'Neomycin Negative'];
    var dataValues = [penPos, penNeg, strPos, strNeg, neoPos, neoNeg];
    var data = [];
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

    var layout = {
        xaxis: {
            title: 'Gram Stain'
        },
        yaxis: {
            title: 'MIC Level (log-transformed)',
        },
        hovermode: 'closest'
    };

    Plotly.newPlot('graph2', data, layout, {staticPlot: true});

};


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

    var layout = {
        autosize: true,

        height: 700,
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
            xaxis: {
                title: 'Penicilin',
                type: 'linear',
                zeroline: false
            },
            yaxis: {
                title: 'Streptomycin',
                type: 'linear',
                zeroline: false
            },
            zaxis: {
                title: 'Neomycin',
                type: 'linear',
                zeroline: false
            }
        },
        title: 'MIC Levels Across Treatments (Bring cursor to far left or right to scroll down),',
        width: 1300,

    };

  Plotly.newPlot('graph3', data, layout);

}; 

/*
Plotly.newPlot('graph2', data, layout, {staticPlot: true});
*/