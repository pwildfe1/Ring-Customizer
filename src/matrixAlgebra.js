/**
 * Created by Fransic on 4/13/2017.
 */

function transposeMatrix(matrix) {
    var reverse = [];

    for(var i=0; i<matrix[0].length; i++){
        var data = [];
        for(var j=0; j<matrix.length; j++){
            data.push(matrix[j][i]);
        }
        reverse.push(data);
    }

    matrix.transpose=reverse;
}


function matrixDiff(matrixA,matrixB){
    var result = [];
    for(var i=0; i<matrixA.length;i++){
        var col = [];
        for(var j=0; j<matrixA[i];j++){
            col.push(matrixA[i][j]-matrixB[i][j]);
        }
        result.push(col);
    }
    return result;
}

function vectorDiff(vecA,vecB){
    var result = [];
    for(var i=0; i<vecA.length;i++){
        result.push(vecA[i]-vecB[i])
    }
    return result;
}

function vectorAdd(vecA,vecB){
    var result = [];
    for(var i=0; i<vecA.length;i++){
        result.push(vecA[i]+vecB[i])
    }
    return result;
}


function vectorScale(vec,scale){
    var result = [];
    for(var i=0; i<vec.length;i++){
        result.push(vec[i]*scale);
    }
    return result;
}



function vectorMag(vec){
    var result = 0;
    for(var i=0; i<vec.length;i++){
        result = result + Math.pow(vec[i],2);
    }
    return Math.pow(result,.5);
}


function vectorRot3D(v,angle,AXIS) {
    var u = vectorScale(AXIS,1/vectorMag(AXIS));
    var ang = Math.PI * angle / 180;
    var f = 1 - Math.cos(ang);
    var R11 = Math.cos(ang) + Math.pow(u[0], 2) * (f);
    var R21 = u[1] * u[0] * (f) + u[2] * Math.sin(ang);
    var R31 = u[2] * u[0] * (f) - u[1] * Math.sin(ang);
    var x = R11 * v[0] + R21 * v[1] + R31 * v[2];
    var R12 = u[0] * u[1] * (f) - u[2] * Math.sin(ang);
    var R22 = Math.cos(ang) + Math.pow(u[1], 2) * (f);
    var R32 = u[2] * u[1] * (f) + u[0] * Math.sin(ang);
    var y = R12 * v[0] + R22 * v[1] + R32 * v[2];
    var R13 = u[0] * u[2] * (f) + u[1] * Math.sin(ang);
    var R23 = u[1] * u[2] * (f) - u[0] * Math.sin(ang);
    var R33 = Math.cos(ang) + Math.pow(u[2], 2) * (f);
    var z = R13 * v[0] + R23 * v[1] + R33 * v[2];
    return [x, y, z]
}


function matrixDist(matrixA,matrixB){
    var result = [];
    for(var i=0; i<matrixA.length;i++){
        var col = [];
        if(matrixA[i].length>1){
            for(var j=0; j<matrixA[i];j++){
                col.push(Math.abs(matrixA[i][j]-matrixB[i][j]));
            }
        }else{
            col.push(Math.abs(matrixA[i]-matrixB[i]));
        }
        result.push(col);
    }
    return result;
}

function matrixAdd(matrixA,matrixB){
    var result = [];
    for(var i=0; i<matrixA.length;i++){
        var col = [];
        if(matrixA[i].length>1){
            for(var j=0; j<matrixA[i];j++){
                col.push(matrixA[i][j]+matrixB[i][j]);
            }
        }else{
            col.push(matrixA[i]+matrixB[i])
        }
        result.push(col);
    }
    return result;
}


/*
 UNITIZES VALUES TO CREATE A UNBIASED MATRIX WITH EQUAL WEIGHTS
 */

function unitizeVector(values){
    evaluateData(values);
    var normalize = [];
    for(var i = 0; i<values.length;i++) {
        var val = parseFloat(values[i]);
        normalize.push((val - values.minimum) / (values.maximum - values.minimum));
    }
    return normalize;
}



/*
 EVALUATES DATA BY RETURNING THE MIN THE MAX AND THE RANGE
 */

function evaluateData(values){
    var minimum = parseFloat(values[0]);
    var maximum = parseFloat(values[0]);
    for(var i = 0 ;i<values.length;i++){
        var val = parseFloat(values[i]);
        if(val>maximum){
            maximum = val;
        }
        if(val<minimum){
            minimum = val;
        }
    }
    values.minimum = minimum;
    values.maximum = maximum;
    values.range = maximum-minimum;
    return values;
}

