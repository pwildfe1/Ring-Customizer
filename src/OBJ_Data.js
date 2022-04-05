/*
CREATED TO MANIPULATE ORIGINAL OBJ DATA WITHOUT RENDERING!!!!
 */

var OBJ_Data = function(data) {

    this.input = data;
    this.header = [];
    this.verts = [];
    this.modVerts = [];
    this.vNorms = [];
    this.modVNorms = [];
    this.vTxt = [];
    this.faces = [];
    this.faceTxt = [];
    this.faceNorm =[];
    this.output = '';

    this.bounds = [];

    this.parseInput();

}


OBJ_Data.prototype.parseInput = function(){

    var marker = false;

    for(var i=0; i<this.input.length; i++){

        var line = this.input[i].split(' ');

        if(line[0] === 'o'){
            this.name = line[1];
            marker = true;
        }

        if(line[0] === 'v'){
            var entry = [];
            for(var j=1; j<line.length; j++) {
                entry.push(parseFloat(line[j]));
            }
            this.verts.push(entry);
            this.modVerts.push(entry);
        }

        if(line[0] === 'vt'){
            var entry = [];
            for(var j=1; j<line.length; j++) {
                entry.push(parseFloat(line[j]));
            }
            this.vTxt.push(entry);
        }

        if(line[0] === 'vn'){
            var entry = [];
            for(var j=1; j<line.length; j++) {
                entry.push(parseFloat(line[j]));
            }
            this.vNorms.push(entry);
            this.modVNorms.push(entry);
        }

        if(line[0] === 'f'){
            var fIndex = [];
            var fTxt = [];
            var fNorms = [];
            for(var j=1; j<line.length; j++) {

                var entry = line[j].split('/');

                fIndex.push(entry[0]);

                if(entry.length>1){fTxt.push(parseInt(entry[1],10))}

                if(entry.length>2){fNorms.push(parseInt(entry[2],10))}

            }
            this.faces.push(fIndex);
            this.faceNorm.push(fNorms);
            this.faceTxt.push(fTxt);
        }

    }

    this.boundingBox()

}


/*
THIS FUNCTION WORKS EXACTLY LIKE ITS RENDERED (keyCap.js OBJECT) COUNTERPART
 */

OBJ_Data.prototype.warpLong = function (warpRangeF,warpRangeB,warpF,warpB,pointF,pointB) {


    for(var i=0; i<this.verts.length; i++){

        var vecF = [0,pointF[1]-this.verts[i][1],0];
        var distF = vectorMag(vecF);
        var valF = (1-distF/warpRangeF)*warpF*(this.verts[i][2]/pointF[2]);

        var vecB = [0,pointB[1]-this.verts[i][1],0];
        var distB = vectorMag(vecB);
        var valB = (1-distB/warpRangeB)*warpB*(this.verts[i][2]/pointB[2]);


        var newVertex = this.verts[i];

        if (distF<warpRangeF) {

            vecF = vectorScale(vecF, valF);
            newVertex = vectorAdd(newVertex, vecF);
            newVertex = [this.verts[i][0],newVertex[1],this.verts[i][2]];

        }

        if (distB<warpRangeB) {

            vecB = vectorScale(vecB, valB);
            newVertex = vectorAdd(newVertex, vecB);
            newVertex = [this.verts[i][0],newVertex[1],this.verts[i][2]];

        }

        this.modVerts[i] = newVertex;

    }

    this.boundingBox();

    return this.modVerts;

}

/*
THIS FUNCTION WORKS EXACTLY LIKE ITS RENDERED (keyCap.js OBJECT) COUNTERPART
 */

OBJ_Data.prototype.warpWide = function(warpRangeR,warpRangeL,warpR,warpL,pointR,pointL){

    for(var i=0; i<this.verts.length; i++){

        var vecR = [pointR[0]-this.verts[i][0],0,0];
        var distR = vectorMag(vecR);
        var valR = (1-distR/warpRangeR)*warpR*(this.verts[i][2]/pointR[2]);

        var vecL = [pointL[0]-this.verts[i][0],0,0];
        var distL = vectorMag(vecL);
        var valL = (1-distL/warpRangeL)*warpL*(this.verts[i][2]/pointL[2]);


        var newVertex = this.verts[i];

        if (distR<warpRangeR) {

            vecR = vectorScale(vecR, valR);
            newVertex = vectorAdd(newVertex, vecR);
            newVertex = [newVertex[0],this.verts[i][1],this.verts[i][2]];

        }

        if (distL<warpRangeL) {

            vecL = vectorScale(vecL, valL);
            newVertex = vectorAdd(newVertex, vecL);
            newVertex = [newVertex[0],this.verts[i][1],this.verts[i][2]];

        }

        this.modVerts[i] = newVertex;

    }

    this.boundingBox();

    return this.modVerts;

}


/*
FUNCTION MOLDS THE VERTEX INFORMATION OF THE BACKEND TOP TEXTURE SURFACE OBJ TO SPECIFIED GUIDE POINTS WITH THE SAME
X,Y LOCATION. THIS ENSURES THAT THE BACKEND OBJ FILE MATCHES THE TOP TEXTURE SURFACE THAT IS RENDERED.
 */

OBJ_Data.prototype.guideZ = function(guidePts){

    for(var i=0; i<this.modVerts.length; i++){

        var projectedVert = [this.modVerts[i][0],this.modVerts[i][1],0];
        var minimum = 100000;
        var chosenZ = this.modVerts[i][2];

        for(var j=0; j<guidePts.length; j++){

            var projectedGuide = [guidePts[j][0],guidePts[j][1],0];
            var dist = vectorMag(vectorDiff(projectedGuide,projectedVert));
            if(dist<minimum){
                minimum = dist;
                chosenZ = guidePts[j][2];
            }

        }

        this.modVerts[i][2] = chosenZ;

    }

    this.boundingBox();

    return this.modVerts

}


OBJ_Data.prototype.computeNormals = function(){

    for(var i=0; i<this.faces.length; i++){

        for(var j=0; j<this.faces[i].length; j++) {

            var pt01 = this.modVerts[this.faces[i][j]-1];
            var pt02 = this.modVerts[this.faces[i][(j+1)%4]-1];
            var pt03 = this.modVerts[this.faces[i][(j+3)%4]-1];
            var vec01 = vectorDiff(pt02,pt01);
            var vec02 = vectorDiff(pt03,pt01);
            var norm  = vectorRot3D(vec01,90,vec02);

            this.modVNorms[this.faceNorm[i][j]] = vectorScale(norm,1/vectorMag(norm));

        }

    }

}


OBJ_Data.prototype.boundingBox = function(){

    var minX = this.modVerts[0][0];
    var maxX = this.modVerts[0][0];
    var minY = this.modVerts[0][1];
    var maxY = this.modVerts[0][1];
    var minZ = this.modVerts[0][2];
    var maxZ = this.modVerts[0][2];

    for(var i=0; i<this.modVerts.length; i++){

        if(this.modVerts[i][0]<minX){ minX = this.modVerts[i][0]}
        if(this.modVerts[i][0]>maxX){ maxX = this.modVerts[i][0]}

        if(this.modVerts[i][1]<minX){ minY = this.modVerts[i][1]}
        if(this.modVerts[i][1]>maxY){ maxY = this.modVerts[i][1]}

        if(this.modVerts[i][2]<minZ){ minZ = this.modVerts[i][2]}
        if(this.modVerts[i][2]>maxZ){ maxZ = this.modVerts[i][2]}

    }

    this.bounds = [[minX,minY,minZ],[minX,maxY,minZ],[maxX,maxY,minZ],[maxX,minY,minZ],[minX,minY,maxZ],[minX,maxY,maxZ],[maxX,maxY,maxZ],[maxX,minY,maxZ]]

}


OBJ_Data.prototype.exportFile = function (fileName,token,callBack) {

    this.output = ['# RHINO',''];

    this.output.push('o object_1');

    //this.computeNormals();

    for(var i=0; i<this.modVerts.length;i++){

        var entry = 'v ';

        for(var j=0; j<this.modVerts[i].length; j++){

            entry = entry + this.modVerts[i][j].toString();

            if(j<this.modVerts[i].length-1){ entry = entry + ' '}

        }

        this.output.push(entry);

    }

    for(var i=0; i<this.vTxt.length;i++){

        var entry = 'vt ';

        for(var j=0; j<this.vTxt[i].length; j++){

            entry = entry + this.vTxt[i][j].toString();

            if(j<this.vTxt[i].length-1){ entry = entry + ' '}

        }

        this.output.push(entry);

    }

    for(var i=0; i<this.modVNorms.length;i++){

        var entry = 'vn ';

        for(var j=0; j<this.modVNorms[i].length; j++){

            entry = entry + this.modVNorms[i][j].toString();

            if(j<this.modVNorms[i].length-1){ entry = entry + ' '}

        }

        this.output.push(entry);

    }

    for (var i=0; i<this.faces.length; i++){

        var entry = 'f ';

        for (var j=0; j<this.faces[i].length; j++){

            entry = entry + this.faces[i][j].toString(); // + '/' + this.faceTxt[i][j].toString() + '/' + this.faceNorm[i][j].toString();

            if(j<this.faces[i].length-1){ entry = entry + ' '}

        }

        this.output.push(entry);

    }


    var finalStr = '';

    for (var i=0; i<this.output.length; i++){finalStr = finalStr + this.output[i] + '\n'}

    var formData = new FormData();
    var blob = new Blob([finalStr], { type: "application/octet-stream"});

    formData.append("file", blob, fileName);
    // "file" blob "save as"
    formData.append("t", token);

    $.ajax({
        type: 'POST',
        cache: false,
        processData: false,
        contentType: false,
        data: formData,
        url: 'https://studiobitonti.appspot.com/storage/upload',
        success: (response)=> {
        //alert('upload success');
        //console.log('response',response);
        callBack()
    },
        error: (err)=>{
        console.warn(err)
    }
    });


};