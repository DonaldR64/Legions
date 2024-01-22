const LI = (()=> {
    const version = '2024.1.21';
    const rules = '1.0'
    if (!state.LI) {state.LI = {}};
    const pageInfo = {name: "",page: "",gridType: "",scale: 0,width: 0,height: 0};
    const rowLabels = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","AA","BB","CC","DD","EE","FF","GG","HH","II","JJ","KK","LL","MM","NN","OO","PP","QQ","RR","SS","TT","UU","VV","WW","XX","YY","ZZ","AAA","BBB","CCC","DDD","EEE","FFF","GGG","HHH","III","JJJ","KKK","LLL","MMM","NNN","OOO","PPP","QQQ","RRR","SSS","TTT","UUU","VVV","WWW","XXX","YYY","ZZZ"];

    let TerrainArray = {};
    let edgeArray = [];

    let TraitorForces = ["Deathguard"];
    let BuildingNames = ["Civitas","Militas","Imperialis","Grandus","Fortification"];

    let ModelArray = {}; //Individual Models, Tanks etc
    let UnitArray = {}; //Units of Models - Detachments
    let FormationArray = {}; //Formations of Detachments
    let nameArray = {}; //used to track #s of each type of unit

    let unitCreationInfo = {};
    let hexMap = {}; 
    let xSpacing = 75.1985619844599;
    let ySpacing = 66.9658278242677;

    const DIRECTIONS = ["Northeast","East","Southeast","Southwest","West","Northwest"];

    const colours = {
        red: "#ff0000",
        blue: "#00ffff",
        yellow: "#ffff00",
        green: "#00ff00",
        purple: "#800080",
        black: "#000000",
    }

    const TurnMarkers = ["","https://s3.amazonaws.com/files.d20.io/images/361055772/zDURNn_0bbTWmOVrwJc6YQ/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055766/UZPeb6ZiiUImrZoAS58gvQ/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055764/yXwGQcriDAP8FpzxvjqzTg/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055768/7GFjIsnNuIBLrW_p65bjNQ/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055770/2WlTnUslDk0hpwr8zpZIOg/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055771/P9DmGozXmdPuv4SWq6uDvw/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055765/V5oPsriRTHJQ7w3hHRBA3A/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055767/EOXU3ujXJz-NleWX33rcgA/thumb.png?1695998303","https://s3.amazonaws.com/files.d20.io/images/361055769/925-C7XAEcQCOUVN1m1uvQ/thumb.png?1695998303"];

    const SM = {
        fired: "status_Shell::5553215",
        moved: "status_Advantage-or-Up::2006462", //if unit moved
        fallback: "6534650::Fall-Back",
        charge: "6534651::Charge",
        firstfire: "6534652::First-Fire",
        advance: "6534653::Advance",
        march: "6534654::March",
    };

    let outputCard = {title: "",subtitle: "",faction: "",body: [],buttons: [],};

    const Factions = {
        "Ultramarines": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/353049529/KtPvktw8dgMFRyHJIW-i6w/thumb.png?1690989195",
            "dice": "Ultramarines",
            "backgroundColour": "#0437F2",
            "titlefont": "Arial",
            "fontColour": "#000000",
            "borderColour": "#FFD700",
            "borderStyle": "5px ridge",  
        },
        "Deathguard": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/353239057/GIITPAhD-JdRRD2D6BREWw/thumb.png?1691112406",
            "dice": "Deathguard",
            "backgroundColour": "#B3CF99",
            "titlefont": "Anton",
            "fontColour": "#000000",
            "borderColour": "#000000",
            "borderStyle": "5px ridge",
        },
        "Blood Angels": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/354261572/BMAsmC28Ap91qYIfra71yw/thumb.png?1691796541",
            "dice": "BloodAngels",
            "backgroundColour": "#be0b07",
            "titlefont": "Arial",
            "fontColour": "#000000",
            "borderColour": "#000000",
            "borderStyle": "5px ridge",
        },
        "Space Wolves": {
            "image": "https://s3.amazonaws.com/files.d20.io/images/360961940/GOg8nIXa8AfvA3v69KT-Vw/thumb.png?1695929748",
            "dice": "SpaceWolves",
            "backgroundColour": "#dae6ef",
            "titlefont": "Arial",
            "fontColour": "#000000",
            "borderColour": "#000000",
            "borderStyle": "5px groove",
        },



        "Neutral": {
            "image": "",
            "dice": "Neutral",
            "backgroundColour": "#FFFFFF",
            "titlefont": "Arial",
            "fontColour": "#000000",
            "borderColour": "#00FF00",
            "borderStyle": "5px ridge",
        },

    };

    let specialInfo = {
        
    }

    //LOS: true = doesnt block, false = blocks unless within same terrain then 6"
    //Cover: cover save
    //Class: Difficult, Obstructing, Dangerous, Obstacle, Impassable, Open, Structure

    const TerrainInfo = {
        "#000000": {name: "Hill 1", height: 1,los: true,cover: 7,class: "Open"},
        "#434343": {name: "Hill 2", height: 2,los: true,cover: 7,class: "Open"},  
        "#666666": {name: "Hill 3",height:3,los: true,cover: 7,class: "Open"},
        "#c0c0c0": {name: "Hill 4",height:4,los: true,cover: 7,class: "Open"},
        "#d9d9d9": {name: "Hill 5",height:5,los: true,cover: 7,class: "Open"},
    
        "#ffffff": {name: "Spire", height: 2,los: false,cover: 7,class: "Impassable"}, 
        "#00ff00": {name: "Woods",height: 2,los: false,cover: 5,class: "Obstructing"},
        "#b6d7a8": {name: "Scrub",height: 0,los: true,cover: 6,class: "Difficult"},
        "#fce5cd": {name: "Craters",height: 0,los: true,cover: 6,class: "Difficult"},
        "#980000": {name: "Ruins",height: 1,los: false,cover: 5,class: "Obstructing"},



    };

    //generally obstacles and such, maybe look at being able to burn woods
    const MapTokenInfo = {
        "wall": {name: "Wall",height: 0,los: true,cover: 7,class: "Obstacle"},
        "woods": {name: "Woods",height: 2,los: false,cover: 5,class: "Obstructing"},
    }

    const simpleObj = (o) => {
        let p = JSON.parse(JSON.stringify(o));
        return p;
    };

    const getCleanImgSrc = (imgsrc) => {
        let parts = imgsrc.match(/(.*\/images\/.*)(thumb|med|original|max)([^?]*)(\?[^?]+)?$/);
        if(parts) {
            return parts[1]+'thumb'+parts[3]+(parts[4]?parts[4]:`?${Math.round(Math.random()*9999999)}`);
        }
        return;
    };

    const tokenImage = (img) => {
        if (!img) {return};
        //modifies imgsrc to fit api's requirement for token
        img = getCleanImgSrc(img);
        img = img.replace("%3A", ":");
        img = img.replace("%3F", "?");
        img = img.replace("med", "thumb");
        return img;
    };

    const stringGen = () => {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 6; i++) {
            text += possible.charAt(Math.floor(randomInteger(possible.length)));
        }
        return text;
    };

    const findCommonElements = (arr1,arr2) => {
        //iterates through array 1 and sees if array 2 has any of its elements
        //returns true if the arrays share an element
        return arr1.some(item => arr2.includes(item));
    };

    const DeepCopy = (variable) => {
        variable = JSON.parse(JSON.stringify(variable))
        return variable;
    };

    const PlaySound = (name) => {
        let sound = findObjs({type: "jukeboxtrack", title: name})[0];
        if (sound) {
            sound.set({playing: true,softstop:false});
        }
    };

    const FX = (fxname,model1,model2) => {
        //model2 is target, model1 is shooter
        //if its an area effect, model1 isnt used
        if (fxname.includes("System")) {
            //system fx
            fxname = fxname.replace("System-","");
            if (fxname.includes("Blast")) {
                fxname = fxname.replace("Blast-","");
                spawnFx(model2.location.x,model2.location.y, fxname);
            } else {
                spawnFxBetweenPoints(model1.location, model2.location, fxname);
            }
        } else {
            let fxType =  findObjs({type: "custfx", name: fxname})[0];
            if (fxType) {
                spawnFxBetweenPoints(model1.location, model2.location, fxType.id);
            }
        }
    }

    const Naming = (name,faction) => {
        name = name.replace(faction + " ","");
        name = name.replace("Primaris ","");
        if (name.includes("w/")) {
            name = name.split("w/")[0];
        } else if (name.includes("//")) {
            name = name.split("//")[0];
        }
        name = name.trim();
        if (nameArray[name]) {
            nameArray[name]++;
        } else {
            nameArray[name] = 1;
        }
        name += " " + nameArray[name];

        return name;
    }

    //Retrieve Values from Character Sheet Attributes
    const Attribute = (character,attributename) => {
        //Retrieve Values from Character Sheet Attributes
        let attributeobj = findObjs({type:'attribute',characterid: character.id, name: attributename})[0]
        let attributevalue = "";
        if (attributeobj) {
            attributevalue = attributeobj.get('current');
        }
        return attributevalue;
    };

    const AttributeArray = (characterID) => {
        let aa = {}
        let attributes = findObjs({_type:'attribute',_characterid: characterID});
        for (let j=0;j<attributes.length;j++) {
            let name = attributes[j].get("name")
            let current = attributes[j].get("current")   
            if (!current || current === "") {current = " "} 
            aa[name] = current;

        }
        return aa;
    };

    const AttributeSet = (characterID,attributename,newvalue,max) => {
        if (!max) {max = false};
        let attributeobj = findObjs({type:'attribute',characterid: characterID, name: attributename})[0]
        if (attributeobj) {
            if (max === true) {
                attributeobj.set("max",newvalue)
            } else {
                attributeobj.set("current",newvalue)
            }
        } else {
            if (max === true) {
                createObj("attribute", {
                    name: attributename,
                    current: newvalue,
                    max: newvalue,
                    characterid: characterID,
                });            
            } else {
                createObj("attribute", {
                    name: attributename,
                    current: newvalue,
                    characterid: characterID,
                });            
            }
        }
    };

    const DeleteAttribute = (characterID,attributeName) => {
        let attributeObj = findObjs({type:'attribute',characterid: characterID, name: attributeName})[0]
        if (attributeObj) {
            attributeObj.remove();
        }
    }

    const ButtonInfo = (phrase,action) => {
        let info = {
            phrase: phrase,
            action: action,
        }
        outputCard.buttons.push(info);
    };

    const SetupCard = (title,subtitle,faction) => {
        outputCard.title = title;
        outputCard.subtitle = subtitle;
        outputCard.faction = faction;
        outputCard.body = [];
        outputCard.buttons = [];
        outputCard.inline = [];
    };

    const DisplayDice = (roll,tablename,size) => {
        roll = roll.toString();
        if (!tablename) {
            tablename = "Neutral";
        }
        let table = findObjs({type:'rollabletable', name: tablename})[0];
        let obj = findObjs({type:'tableitem', _rollabletableid: table.id, name: roll })[0];        
        let avatar = obj.get('avatar');
        let out = "<img width = "+ size + " height = " + size + " src=" + avatar + "></img>";
        return out;
    };

    const HexInfo = {
        size: {
            x: 75.1985619844599/Math.sqrt(3),
            y: 66.9658278242677 * 2/3,
        },
        pixelStart: {
            x: 37.5992809922301,
            y: 43.8658278242683,
        },
        //xSpacing: 75.1985619844599,
        halfX: 75.1985619844599/2,
        //ySpacing: 66.9658278242677,
        width: 75.1985619844599,
        height: 89.2877704323569,
        directions: {},
    };

    const M = {
            f0: Math.sqrt(3),
            f1: Math.sqrt(3)/2,
            f2: 0,
            f3: 3/2,
            b0: Math.sqrt(3)/3,
            b1: -1/3,
            b2: 0,
            b3: 2/3,
    };

    class Point {
        constructor(x,y) {
            this.x = x;
            this.y = y;
        }
    };

    class Hex {
        constructor(q,r,s) {
            this.q = q;
            this.r =r;
            this.s = s;
        }

        add(b) {
            return new Hex(this.q + b.q, this.r + b.r, this.s + b.s);
        }
        subtract(b) {
            return new Hex(this.q - b.q, this.r - b.r, this.s - b.s);
        }
        static direction(direction) {
            return HexInfo.directions[direction];
        }
        neighbour(direction) {
            //returns a hex (with q,r,s) for neighbour, specify direction eg. hex.neighbour("NE")
            return this.add(HexInfo.directions[direction]);
        }
        neighbours() {
            //all 6 neighbours
            let results = [];
            for (let i=0;i<DIRECTIONS.length;i++) {
                results.push(this.neighbour(DIRECTIONS[i]));
            }
            return results;
        }



        len() {
            return (Math.abs(this.q) + Math.abs(this.r) + Math.abs(this.s)) / 2;
        }
        distance(b) {
            return this.subtract(b).len();
        }
        round() {
            var qi = Math.round(this.q);
            var ri = Math.round(this.r);
            var si = Math.round(this.s);
            var q_diff = Math.abs(qi - this.q);
            var r_diff = Math.abs(ri - this.r);
            var s_diff = Math.abs(si - this.s);
            if (q_diff > r_diff && q_diff > s_diff) {
                qi = -ri - si;
            }
            else if (r_diff > s_diff) {
                ri = -qi - si;
            }
            else {
                si = -qi - ri;
            }
            return new Hex(qi, ri, si);
        }
        lerp(b, t) {
            return new Hex(this.q * (1.0 - t) + b.q * t, this.r * (1.0 - t) + b.r * t, this.s * (1.0 - t) + b.s * t);
        }
        linedraw(b) {
            //returns array of hexes between this hex and hex 'b'
            var N = this.distance(b);
            var a_nudge = new Hex(this.q + 1e-06, this.r + 1e-06, this.s - 2e-06);
            var b_nudge = new Hex(b.q + 1e-06, b.r + 1e-06, b.s - 2e-06);
            var results = [];
            var step = 1.0 / Math.max(N, 1);
            for (var i = 0; i <= N; i++) {
                results.push(a_nudge.lerp(b_nudge, step * i).round());
            }
            return results;
        }
        label() {
            //translate hex qrs to Roll20 map label
            let doubled = DoubledCoord.fromCube(this);
            let label = rowLabels[doubled.row] + (doubled.col + 1).toString();
            return label;
        }

        radius(rad) {
            //returns array of hexes in radius rad
            //Not only is x + y + z = 0, but the absolute values of x, y and z are equal to twice the radius of the ring
            let results = [];
            let h;
            for (let i = 0;i <= rad; i++) {
                for (let j=-i;j<=i;j++) {
                    for (let k=-i;k<=i;k++) {
                        for (let l=-i;l<=i;l++) {
                            if((Math.abs(j) + Math.abs(k) + Math.abs(l) === i*2) && (j + k + l === 0)) {
                                h = new Hex(j,k,l);
                                results.push(this.add(h));
                            }
                        }
                    }
                }
            }
            return results;
        }
        angle(b) {
            //angle between 2 hexes
            let origin = hexToPoint(this);
            let destination = hexToPoint(b);

            let x = Math.round(origin.x - destination.x);
            let y = Math.round(origin.y - destination.y);
            let phi = Math.atan2(y,x);
            phi = phi * (180/Math.PI);
            phi = Math.round(phi);
            phi -= 90;
            phi = Angle(phi);
            return phi;
        }        
    };

    class DoubledCoord {
        constructor(col, row) {
            this.col = col;
            this.row = row;
        }
        static fromCube(h) {
            var col = 2 * h.q + h.r;
            var row = h.r;
            return new DoubledCoord(col, row);//note will need to use rowLabels for the row, and add one to column to translate from 0
        }
        toCube() {
            var q = (this.col - this.row) / 2; //as r = row
            var r = this.row;
            var s = -q - r;
            return new Hex(q, r, s);
        }
    };

    class Model {
        constructor(tokenID,unitID,formationID){
            let token = findObjs({_type:"graphic", id: tokenID})[0];
            let name = token.get("name");
            let hp = parseInt(token.get("bar1_value"));
            let char = getObj("character", token.get("represents")); 
            let attributeArray = AttributeArray(char.id);
            let faction = attributeArray.faction;
            let player = (TraitorForces.includes(faction)) ? 1:0;
            let type = attributeArray.type;
            let buildingInfo;
            let wounds = parseInt(attributeArray.wounds) || 1;

            if (!faction) {
                faction = "Neutral";
                player = 2;
            }
            if (type !== "Building" && type !== "System Unit") {
                if (!state.LI.models[tokenID]) {
                    name = Naming(char.get("name"),faction);
                    state.LI.models[tokenID] = {
                        unitID: unitID,
                        formationID: formationID,
                        faction: faction,
                    }
                } else {
                    unitID = state.LI.models[tokenID].unitID;
                    formationID = state.LI.models[tokenID].formationID;
                }
            } else {
                let height = char.get("name").replace(/\D/g,'');
                let as,gn,w,caf,save;
                if (name.includes("Militas")) {
                    name = "Militas Imperialis";
                    as = 3;
                    gn = 2;
                    wounds = 3;
                    caf = 3;
                    save = 4;
                } else if (name.includes("Grandus")){
                    name = "Imperialis Grandus";
                    as = 4;
                    gn = 3;
                    wounds = 2;
                    caf = 2;
                    save = 4;
                } else if (name.includes("Fortification")) {
                    name = "Fortification";
                    as = 2;
                    gn = 1;
                    wounds = 2;
                    caf = 3;
                    save = 3;
                } else {
                    name = "Civitas Imperialis";
                    as = 5;
                    gn = 1;
                    wounds = 2;
                    caf = 2;
                    save = 4;
                }
                buildingInfo = {
                    height: height,
                    armourSave: as,
                    garrisonNumber: gn,
                    cafBonus: caf,
                    coverSave: save,
                }

            }

            let location = new Point(token.get("left"),token.get("top"));
            let hex = pointToHex(location);
            let hexLabel = hex.label();

            let size = parseInt(attributeArray.size);
            let radius = 1;
            let large = false;
            let vertices = TokenVertices(token);

            if (token.get("width") > 100 || token.get("height") > 100) {
                large = true;
                let w = token.get("width")/2;
                let h = token.get("height")/2;
                radius = Math.ceil(Math.sqrt(w*w + h*h)/70);
            }

            //weapons
            let weaponArray = [];
            let infoArray = [];

            for (let i=1;i<6;i++) {
                let wname = attributeArray["weapon"+i+"name"];
                let wequipped = attributeArray["weapon"+i+"equipped"];
                if (wequipped !== "Equipped") {continue};
                if (!wname || wname === "" || wname === undefined || wname === " ") {continue};
                let r = attributeArray["weapon"+i+"range"];
                let minRange = 0;
                let maxRange;
                if (r === "Template") {
                    maxRange = "Template";
                } else if (r.includes("-")) {
                    r = r.split("-")
                    minRange = parseInt(r[0]);
                    maxRange = parseInt(r[1]);
                } else {
                    maxRange= parseInt(r);
                }
                let dice = attributeArray["weapon"+i+"dice"];
                let tohit = parseInt(attributeArray["weapon"+i+"tohit"]) || 0;
                let ap = attributeArray["weapon"+i+"ap"] || 0;
                if (ap !== "Special") {
                    ap = parseInt(ap);
                }
                let traits = attributeArray["weapon"+i+"traits"] || " ";
                let fx = attributeArray["weapon"+i+"fx"];
                let sound = attributeArray["weapon"+i+"sound"];

                let weapon = {
                    name: wname,
                    minRange: minRange,
                    maxRange: maxRange,
                    dice: dice,
                    tohit: tohit,
                    ap: ap,
                    traits: traits,
                    fx: fx,
                    sound: sound,
                }

                weaponArray.push(weapon);

                traits = traits.split(",");
                _.each(traits,trait => {
                    trait = trait.trim();
                    infoArray.push(trait);
                });
            }

            //update sheet with info
            let specials = attributeArray.special;
            if (!specials || specials === "") {
                specials = " ";
            }
            specials = specials.split(",");
            for (let i=0;i<specials.length;i++) {
                let special = specials[i].trim();
                let attName = "special" + i;
                AttributeSet(char.id,attName,special);
                infoArray.push(special);
            }

            infoArray = [...new Set(infoArray)];

            infoArray.sort(function (a,b) {
                let a1 = a.charAt(0).toLowerCase();
                let b1 = b.charAt(0).toLowerCase();
                if (a1<b1) {return -1};
                if (a1>b1) {return 1};
                return 0;
            });
   
            for (let i=0;i<10;i++) {
                let specName = infoArray[i];
                if (!specName || specName === "") {continue}
                if (specName.includes("(")) {
                    let index = specName.indexOf("(");
                    specName = specName.substring(0,index);
                    specName += "(X)";
                }
                if (specName.includes("+")) {
                    let index = specName.indexOf("+");
                    specName = specName.substring(0,index);
                    specName += "+X";
                }
                let specInfo = specialInfo[specName];
                if (specName) {
                    specName += ": ";
                }
                if (!specInfo && specName) {
                    specInfo = "Not in Database Yet";
                }
                let atName = "spec" + (i+1) + "Name";
                let atText = "spec" + (i+1) + "Text";

                if (!specName) {
                    DeleteAttribute(char.id,atName);
                } else {
                    AttributeSet(char.id,atName,specName);
                    AttributeSet(char.id,atText,specInfo);
                }
            }

            let special = infoArray.toString();
            if (!special || special === "" || special === " ") {
                special = " ";
            }

            this.name = name;
            this.type = type;
            this.id = tokenID;
            this.unitID = unitID;
            this.formationID = formationID;
            this.rank = parseInt(attributeArray.rank) || 1;
            this.player = player;
            this.faction = faction;
            this.location = location;
            this.hex = hex;
            this.hexLabel = hexLabel;
            this.startHex = hex;
            this.special = special;
            this.wounds = wounds;
            this.token = token;

            this.save = parseInt(attributeArray.save) || 7;
            this.caf = parseInt(attributeArray.caf) || 0;
            this.morale = parseInt(attributeArray.morale) || 0;

            this.weaponArray = weaponArray;
            this.buildingInfo = buildingInfo;
            this.size = size;
            this.radius = radius;
            this.vertices = vertices;
            this.large = large;
            this.largeHexList = []; //hexes that have parts of larger token, mainly for LOS 
            hexMap[hexLabel].tokenIDs.push(token.id);
            if (this.large === true) {
                LargeTokens(this); 
            }
            ModelArray[tokenID] = this;

            let unit = UnitArray[this.unitID];
            if (unit) {
                unit.add(this);
            }
        }




    }

    class Unit {
        constructor(faction,unitID,unitName,formationID) {
            if (!state.LI.units[unitID]) {
                state.LI.units[unitID] = {
                    name: unitName,
                    formationID: formationID,
                }
            } else {
                unitName = state.LI.units[unitID].name;
                formationID = state.LI.units[unitID].formationID;
            }

            let player = (TraitorForces.includes(faction)) ? 1:0;

            this.id = unitID;
            this.formationID = formationID;
            this.name = unitName;
            this.modelIDs = [];
            this.player = player;
            this.faction = faction;
            this.order = "";
            this.hitArray = []; //used to track hits
            UnitArray[unitID] = this;

            let formation = FormationArray[this.formationID];
            formation.add(this);
        }

        add(model) {
            if (this.modelIDs.includes(model.id) === false) {
//add COmmanders?
                if (model.token.get("aura1_color") === colours.green) {
                    this.modelIDs.unshift(model.id);
                } else {
                    this.modelIDs.push(model.id);
                    this.modelIDs.sort((a,b) => {
                        return parseInt(ModelArray[b].rank) - parseInt(ModelArray[a].rank);
                    })
                }
            }
        }

        remove(model) {
            let index = this.modelIDs.indexOf(model.id);
            if (index > -1) {
                this.modelIDs.splice(index,1);
                if (index === 0 && this.modelIDs.length > 0) {
                    let ac = model.token.get("aura1_color");
                    let stm = model.token.get("statusmarkers");
                    ModelArray[this.modelIDs[0]].token.set({
                        aura1_color: ac,
                        statusmarkers: stm,
                    })
                }
            }
            if (this.modelIDs.length === 0) {
                //Unit Destroyed
                delete UnitArray[this.id];
            }
        }

        halfStrength() {
///change needed
            let result = false;
            if (((this.modelIDs.length <= Math.floor(state.LI.unitStrength[this.id] / 2)) || (state.LI.unitStrength[this.id] === 1 && parseInt(ModelArray[this.modelIDs[0]].token.get("bar1_value")) <= Math.floor(parseInt(ModelArray[this.modelIDs[0]].token.get("bar1_max")))/2))) {
                result = true;
            }
            return result;
        }

       

    }

    class Formation {
        constructor(faction,id,name) {
            let breakPoint = 0;
            if (!state.LI.formations[id]) {
                state.LI.formations[id] = {
                    name: name,
                    breakPoint: 0,
                }
            } else {
                name = state.LI.formations[id].name;
                breakPoint = state.LI.formations[id].breakPoint;
            }
            this.name = name;
            this.breakPoint = breakPoint
            this.id = id;
            this.faction = faction;
            this.unitIDs = [];

            FormationArray[id] = this;
        }

        add(unit) {
            if (this.unitIDs.includes(unit.id) === false) {
                this.unitIDs.push(unit.id);
                unit.formationID = this.id;
            }
        }




    }




    const UnitMarkers = ["Plus-1d4::2006401","Minus-1d4::2006429","Plus-1d6::2006402","Minus-1d6::2006434","Plus-1d20::2006409","Minus-1d20::2006449","Hot-or-On-Fire-2::2006479","Animal-Form::2006480","Red-Cloak::2006523","A::6001458","B::6001459","C::6001460","D::6001461","E::6001462","F::6001463","G::6001464","H::6001465","I::6001466","J::6001467","L::6001468","M::6001469","O::6001471","P::6001472","Q::6001473","R::6001474","S::6001475"];


    const ModelDistance = (model1,model2) => {



        let hexes1 = [model1.hex];
        let hexes2 = [model2.hex];
        if (model1.size === "Large") {
            hexes1 = hexes1.concat(model1.largeHexList);
        }
        if (model2.size === "Large") {
            hexes2 = hexes2.concat(model2.largeHexList);
        }
        let closestDist = Infinity;
        let closestHex1 = model1.hex;
        let closestHex2 = model2.hex;

        for (let i=0;i<hexes1.length;i++) {
            let hex1 = hexes1[i];
            for (let j=0;j<hexes2.length;j++) {
                let hex2 = hexes2[j];
                let dist = hex1.distance(hex2);
                if (dist < closestDist) {
                    closestDist = dist;
                    closestHex1 = hex1;
                    closestHex2 = hex2;
                }
            }
        }
        closestDist -= 1; //as its distance between bases
        let arc = Arc(model1,model2);

        let info = {
            distance: closestDist,
            arc: arc,
            hex1: closestHex1,
            hex2: closestHex2,
        }
        return info;
    }

    const pointToHex = (point) => {
        let x = (point.x - HexInfo.pixelStart.x)/HexInfo.size.x;
        let y = (point.y - HexInfo.pixelStart.y)/HexInfo.size.y;
        let q = M.b0 * x + M.b1 * y;
        let r = M.b2 * x + M.b3 * y;
        let s = -q-r;
        let hex = new Hex(q,r,s);
        hex = hex.round();
        return hex;
    }

    const hexToPoint = (hex) => {
        let q = hex.q;
        let r = hex.r;
        let x = (M.f0 * q + M.f1 * r) * HexInfo.size.x;
        x += HexInfo.pixelStart.x;
        let y = (M.f2 * r + M.f3 * r) * HexInfo.size.y;
        y += HexInfo.pixelStart.y;
        let point = new Point(x,y);
        return point;
    }


    const getAbsoluteControlPt = (controlArray, centre, w, h, rot, scaleX, scaleY) => {
        let len = controlArray.length;
        let point = new Point(controlArray[len-2], controlArray[len-1]);
        //translate relative x,y to actual x,y 
        point.x = scaleX*point.x + centre.x - (scaleX * w/2);
        point.y = scaleY*point.y + centre.y - (scaleY * h/2);
        point = RotatePoint(centre.x, centre.y, rot, point);
        return point;
    }

    const XHEX = (pts) => {
        //makes a small group of points for checking around centre
        let points = pts;
        points.push(new Point(pts[0].x - 20,pts[0].y - 20));
        points.push(new Point(pts[0].x + 20,pts[0].y - 20));
        points.push(new Point(pts[0].x + 20,pts[0].y + 20));
        points.push(new Point(pts[0].x - 20,pts[0].y + 20));
        return points;
    }

    const Angle = (theta) => {
        while (theta < 0) {
            theta += 360;
        }
        while (theta > 360) {
            theta -= 360;
        }
        return theta
    }   

    const RotatePoint = (cX,cY,angle, p) => {
        //cx, cy = coordinates of the centre of rotation
        //angle = clockwise rotation angle
        //p = point object
        let s = Math.sin(angle);
        let c = Math.cos(angle);
        // translate point back to origin:
        p.x -= cX;
        p.y -= cY;
        // rotate point
        let newX = p.x * c - p.y * s;
        let newY = p.x * s + p.y * c;
        // translate point back:
        p.x = Math.round(newX + cX);
        p.y = Math.round(newY + cY);
        return p;
    }

    const pointInPolygon = (point,polygon) => {
        //evaluate if point is in the polygon
        px = point.x
        py = point.y
        collision = false
        vertices = polygon.vertices
        len = vertices.length - 1
        for (let c=0;c<len;c++) {
            vc = vertices[c];
            vn = vertices[c+1]
            if (((vc.y >= py && vn.y < py) || (vc.y < py && vn.y >= py)) && (px < (vn.x-vc.x)*(py-vc.y)/(vn.y-vc.y)+vc.x)) {
                collision = !collision
            }
        }
        return collision
    }

    const ClearLarge = (model) => {
        //clear Old hexes, if any
        for (let h=0;h<model.largeHexList.length;h++) {
            let chlabel = model.largeHexList[h].label();
            let index = hexMap[chlabel].tokenIDs.indexOf(model.id);
            if (index > -1) {
                hexMap[chlabel].tokenIDs.splice(index,1);
            }                    
        }        
        model.largeHexList = [];
    }


    const LargeTokens = (model) => {
        ClearLarge(model);
        //adds tokenID to hexMap for LOS purposes
        let radiusHexes = model.hex.radius(model.radius);
        for (let i=0;i<radiusHexes.length;i++) {
            let radiusHex = radiusHexes[i];
            let radiusHexLabel = radiusHex.label();
            if (radiusHexLabel === model.hexLabel) {continue};
            if (!hexMap[radiusHexLabel]) {continue};
            let c = hexMap[radiusHexLabel].centre;
            let check = false;
            let num = 0;
            let pts = [];
            pts.push(c);
            pts = XHEX(pts);
            for (let i=0;i<5;i++) {
                check = pointInPolygon(pts[i],model);
                if (check === true) {num ++};
            }
            if (num > 2) {
                if (hexMap[radiusHexLabel].tokenIDs.includes(model.id) === false) {
                    hexMap[radiusHexLabel].tokenIDs.push(model.id);
                }
                model.largeHexList.push(radiusHex);
            }
        }
    }


    const TokenVertices = (tok) => {
      //Create corners with final being the first
      let corners = []
      let tokX = tok.get("left")
      let tokY = tok.get("top")
      let w = tok.get("width")
      let h = tok.get("height")
      let rot = tok.get("rotation") * (Math.PI/180)
      //define the four corners of the target token as new points
      //also rotate those corners around the target tok centre
      corners.push(RotatePoint(tokX, tokY, rot, new Point( tokX-w/2, tokY-h/2 )))     //Upper left
      corners.push(RotatePoint(tokX, tokY, rot, new Point( tokX+w/2, tokY-h/2 )))     //Upper right
      corners.push(RotatePoint(tokX, tokY, rot, new Point( tokX+w/2, tokY+h/2 )))     //Lower right
      corners.push(RotatePoint(tokX, tokY, rot, new Point( tokX-w/2, tokY+h/2 )))     //Lower left
      corners.push(RotatePoint(tokX, tokY, rot, new Point( tokX-w/2, tokY-h/2 )))     //Upper left
      return corners
    }


    const PrintCard = (id) => {
        let output = "";
        if (id) {
            let playerObj = findObjs({type: 'player',id: id})[0];
            let who = playerObj.get("displayname");
            output += `/w "${who}"`;
        } else {
            output += "/desc ";
        }

        if (!outputCard.faction || !Factions[outputCard.faction]) {
            outputCard.faction = "Neutral";
        }

        //start of card
        output += `<div style="display: table; border: ` + Factions[outputCard.faction].borderStyle + " " + Factions[outputCard.faction].borderColour + `; `;
        output += `background-color: #EEEEEE; width: 100%; text-align: centre; `;
        output += `border-radius: 1px; border-collapse: separate; box-shadow: 5px 3px 3px 0px #aaa;;`;
        output += `"><div style="display: table-header-group; `;
        output += `background-color: ` + Factions[outputCard.faction].backgroundColour + `; `;
        output += `background-image: url(` + Factions[outputCard.faction].image + `), url(` + Factions[outputCard.faction].image + `); `;
        output += `background-position: left,right; background-repeat: no-repeat, no-repeat; background-size: contain, contain; align: centre,centre; `;
        output += `border-bottom: 2px solid #444444; "><div style="display: table-row;"><div style="display: table-cell; padding: 2px 2px; text-align: centre;"><span style="`;
        output += `font-family: ` + Factions[outputCard.faction].titlefont + `; `;
        output += `font-style: normal; `;

        let titlefontsize = "1.4em";
        if (outputCard.title.length > 12) {
            titlefontsize = "1em";
        }

        output += `font-size: ` + titlefontsize + `; `;
        output += `line-height: 1.2em; font-weight: strong; `;
        output += `color: ` + Factions[outputCard.faction].fontColour + `; `;
        output += `text-shadow: none; `;
        output += `">`+ outputCard.title + `</span><br /><span style="`;
        output += `font-family: Arial; font-variant: normal; font-size: 13px; font-style: normal; font-weight: bold; `;
        output += `color: ` +  Factions[outputCard.faction].fontColour + `; `;
        output += `">` + outputCard.subtitle + `</span></div></div></div>`;

        //body of card
        output += `<div style="display: table-row-group; ">`;

        let inline = 0;

        for (let i=0;i<outputCard.body.length;i++) {
            let out = "";
            let line = outputCard.body[i];
            if (!line || line === "") {continue};
            if (line.includes("[INLINE")) {
                let end = line.indexOf("]");
                let substring = line.substring(0,end+1);
                let num = substring.replace(/[^\d]/g,"");
                if (!num) {num = 1};
                line = line.replace(substring,"");
                out += `<div style="display: table-row; background: #FFFFFF;; `;
                out += `"><div style="display: table-cell; padding: 0px 0px; font-family: Arial; font-style: normal; font-weight: normal; font-size: 14px; `;
                out += `"><span style="line-height: normal; color: #000000; `;
                out += `"> <div style='text-align: centre; display:block;'>`;
                out += line + " ";

                for (let q=0;q<num;q++) {
                    let info = outputCard.inline[inline];
                    out += `<a style ="background-color: ` + Factions[outputCard.faction].backgroundColour + `; padding: 5px;`
                    out += `color: ` + Factions[outputCard.faction].fontColour + `; text-align: centre; vertical-align: middle; border-radius: 5px;`;
                    out += `border-color: ` + Factions[outputCard.faction].borderColour + `; font-family: Tahoma; font-size: x-small; `;
                    out += `"href = "` + info.action + `">` + info.phrase + `</a>`;
                    inline++;                    
                }
                out += `</div></span></div></div>`;
            } else {
                line = line.replace(/\[hr(.*?)\]/gi, '<hr style="width:95%; align:centre; margin:0px 0px 5px 5px; border-top:2px solid $1;">');
                line = line.replace(/\[\#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})\](.*?)\[\/[\#]\]/g, "<span style='color: #$1;'>$2</span>"); // [#xxx] or [#xxxx]...[/#] for color codes. xxx is a 3-digit hex code
                line = line.replace(/\[[Uu]\](.*?)\[\/[Uu]\]/g, "<u>$1</u>"); // [U]...[/u] for underline
                line = line.replace(/\[[Bb]\](.*?)\[\/[Bb]\]/g, "<b>$1</b>"); // [B]...[/B] for bolding
                line = line.replace(/\[[Ii]\](.*?)\[\/[Ii]\]/g, "<i>$1</i>"); // [I]...[/I] for italics
                let lineBack = (i % 2 === 0) ? "#D3D3D3" : "#EEEEEE";
                out += `<div style="display: table-row; background: ` + lineBack + `;; `;
                out += `"><div style="display: table-cell; padding: 0px 0px; font-family: Arial; font-style: normal; font-weight: normal; font-size: 14px; `;
                out += `"><span style="line-height: normal; color: #000000; `;
                out += `"> <div style='text-align: centre; display:block;'>`;
                out += line + `</div></span></div></div>`;                
            }
            output += out;
        }

        //buttons
        if (outputCard.buttons.length > 0) {
            for (let i=0;i<outputCard.buttons.length;i++) {
                let out = "";
                let info = outputCard.buttons[i];
                out += `<div style="display: table-row; background: #FFFFFF;; `;
                out += `"><div style="display: table-cell; padding: 0px 0px; font-family: Arial; font-style: normal; font-weight: normal; font-size: 14px; `;
                out += `"><span style="line-height: normal; color: #000000; `;
                out += `"> <div style='text-align: centre; display:block;'>`;
                out += `<a style ="background-color: ` + Factions[outputCard.faction].backgroundColour + `; padding: 5px;`
                out += `color: ` + Factions[outputCard.faction].fontColour + `; text-align: centre; vertical-align: middle; border-radius: 5px;`;
                out += `border-color: ` + Factions[outputCard.faction].borderColour + `; font-family: Tahoma; font-size: x-small; `;
                out += `"href = "` + info.action + `">` + info.phrase + `</a></div></span></div></div>`;
                output += out;
            }
        }

        output += `</div></div><br />`;
        sendChat("",output);
        outputCard = {title: "",subtitle: "",faction: "",body: [],buttons: [],};
    }

    const LoadPage = () => {
        //build Page Info and flesh out Hex Info
        pageInfo.page = getObj('page', Campaign().get("playerpageid"));
        pageInfo.name = pageInfo.page.get("name");
        pageInfo.scale = pageInfo.page.get("snapping_increment");
        pageInfo.width = pageInfo.page.get("width") * 70;
        pageInfo.height = pageInfo.page.get("height") * 70;

        pageInfo.page.set("gm_opacity",1);

        HexInfo.directions = {
            "Northeast": new Hex(1, -1, 0),
            "East": new Hex(1, 0, -1),
            "Southeast": new Hex(0, 1, -1),
            "Southwest": new Hex(-1, 1, 0),
            "West": new Hex(-1, 0, 1),
            "Northwest": new Hex(0, -1, 1),
        }

        let edges = findObjs({_pageid: Campaign().get("playerpageid"),_type: "path",layer: "map",stroke: "#d5a6bd",});
        let c = pageInfo.width/2;
        for (let i=0;i<edges.length;i++) {
            edgeArray.push(edges[i].get("left"));
        }
        if (edgeArray.length === 0) {
            sendChat("","Add Edge(s) to map and reload API");
            return;
        } else if (edgeArray.length === 1) {
            if (edgeArray[0] < c) {
                edgeArray.push(pageInfo.width)
            } else {
                edgeArray.unshift(0);
            }
        } else if (edgeArray.length === 2) {
            edgeArray.sort((a,b) => parseInt(a) - parseInt(b));
        } else if (edgeArray.length > 2) {
            sendChat("","Error with > 2 edges, Fix and Reload API");
            return
        }
    }

    const BuildMap = () => {
        let startTime = Date.now();
        hexMap = {};
        //builds a hex map, assumes Hex(V) page setting
        let halfToggleX = HexInfo.halfX;
        let rowLabelNum = 0;
        let columnLabel = 1;
        let startX = xSpacing/2;
        let startY = 43.8658278242683;

        for (let j = startY; j <= pageInfo.height;j+=ySpacing){
            let rowLabel = rowLabels[rowLabelNum];
            for (let i = startX;i<= pageInfo.width;i+=xSpacing) {
                let point = new Point(i,j);     
                let label = (rowLabel + columnLabel).toString(); //id of hex
                let hexInfo = {
                    id: label,
                    centre: point,
                    terrain: [], //array of names of terrain in hex
                    buildingID: [],
                    tokenIDs: [], //ids of tokens in hex
                    elevation: 0, //based on hills, in metres
                    height: 0, //height of top of terrain over elevation, in metres
                    nonHillHeight: 0,//height of trees etc above hills
                    cover: 7,
                    los: true,
                    obstructingTerrain: false,
                };
                hexMap[label] = hexInfo;
                columnLabel += 2;
            }
            startX += halfToggleX;
            halfToggleX = -halfToggleX;
            rowLabelNum += 1;
            columnLabel = (columnLabel % 2 === 0) ? 1:2; //swaps odd and even
        }
    
        BuildTerrainArray();

        let taKeys = Object.keys(TerrainArray);

        let keys = Object.keys(hexMap);
        const burndown = () => {
            let key = keys.shift();
            if (key){
                let c = hexMap[key].centre;
                if (c.x >= edgeArray[1] || c.x <= edgeArray[0]) {
                    //Offboard
                    hexMap[key].terrain = ["Offboard"];
                } else {
                    let temp = DeepCopy(hexMap[key]);
                    for (let t=0;t<taKeys.length;t++) {
                        let polygon = TerrainArray[taKeys[t]];
                        if (!polygon) {continue};
                        if (temp.terrain.includes(polygon.name)) {continue};
                        let check = false;
                        let pts = [];
                        pts.push(c);
                        pts = XHEX(pts);
                        let num = 0;
                        for (let i=0;i<5;i++) {
                            check = pointInPolygon(pts[i],polygon);
                            if (i === 0 && check === true) {
                                //centre pt is in hex, can skip rest
                                num = 3;
                                break;
                            }
                            if (check === true) {num ++};
                        }
                        if (num > 2) {
                            temp.terrain.push(polygon.name);
                            let bflag = polygon.name.split(" ");
                            bflag = findCommonElements(BuildingNames,bflag);
                            if (bflag === true) {
                                temp.buildingID = polygon.id;
                            }
                            temp.cover = Math.min(temp.cover,polygon.cover);
                            if (polygon.los === false) {
                                temp.los = false;
                            }
                            if (polygon.class === "Obstructing") {
                                temp.obstructingTerrain = true;
                            }
                            if (polygon.name.includes("Hill")) {
                                temp.elevation = Math.max(temp.elevation,polygon.height);
                                temp.height = Math.max(temp.height,(polygon.height + temp.nonHillHeight));
                            } else {
                                temp.nonHillHeight = Math.max(temp.nonHillHeight,polygon.height);
                                temp.height = Math.max(temp.height,(temp.nonHillHeight + temp.elevation));
                            };
                        };
                    };
                    if (temp.terrain.length === 0) {
                        temp.terrain.push("Open Ground");
                    }
                    hexMap[key] = temp;
                }
                setTimeout(burndown,0);
            }
        }
        burndown();

        let elapsed = Date.now()-startTime;
        log("Hex Map Built in " + elapsed/1000 + " seconds");
        //add tokens to hex map, rebuild team/Unit Arrays
        RebuildArrays();
    }

    const BuildTerrainArray = () => {
        TerrainArray = {};
        //first look for graphic lines outlining hills etc
        let paths = findObjs({_pageid: Campaign().get("playerpageid"),_type: "path",layer: "map"});
        paths.forEach((pathObj) => {
            let vertices = [];
            toFront(pathObj);
            let colour = pathObj.get("stroke").toLowerCase();
            let t = TerrainInfo[colour];
            if (!t) {return};  
            let path = JSON.parse(pathObj.get("path"));
            let centre = new Point(pathObj.get("left"), pathObj.get("top"));
            let w = pathObj.get("width");
            let h = pathObj.get("height");
            let rot = pathObj.get("rotation");
            let scaleX = pathObj.get("scaleX");
            let scaleY = pathObj.get("scaleY");

            //covert path vertices from relative coords to actual map coords
            path.forEach((vert) => {
                let tempPt = getAbsoluteControlPt(vert, centre, w, h, rot, scaleX, scaleY);
                if (isNaN(tempPt.x) || isNaN(tempPt.y)) {return}
                vertices.push(tempPt);            
            });
            let id = stringGen();
            if (TerrainArray[id]) {
                id += stringGen();
            }

            let info = {
                name: t.name,
                pathID: pathObj.id,
                id: id,
                vertices: vertices,
                centre: centre,
                height: t.height,
                cover: t.cover,
                class: t.class,
                los: t.los,
            };
            TerrainArray[id] = info;
        });
        //add tokens on map eg woods, crops
        let mta = findObjs({_pageid: Campaign().get("playerpageid"),_type: "graphic",_subtype: "token",layer: "map"});
        mta.forEach((token) => {
            let truncName = token.get("name").toLowerCase();
            truncName = truncName.trim();
            let t = MapTokenInfo[truncName];
            if (!t) {
                return;
            };
            let vertices = TokenVertices(token);
            let centre = new Point(token.get('left'),token.get('top'));
            let info = {
                name: t.name,
                id: token.id,
                vertices: vertices,
                centre: centre,
                height: t.height,
                cover: t.cover,
                move: t.move,
                los: t.los,
            };
            TerrainArray[id] = info;
        });
    };

    const RebuildArrays = () => {
        FormationArray = {}
        UnitArray = {};
        TeamArray = {};
        let startTime = Date.now();
        let tokenArray = findObjs({_pageid: Campaign().get("playerpageid"),_type: "graphic",_subtype: "token",layer: "objects",});
        _.each(tokenArray,token => {
            let char = getObj("character", token.get("represents")); 
            let unitID,formationID;
            if (char) {
                let modelInfo = state.LI.models[token.id];
                let formation,unit,model;
                if (modelInfo) {
                    formation = FormationArray[modelInfo.formationID];
                    if (!formation) {
                        formation = new Formation(modelInfo.faction,modelInfo.formationID);
                    }
                    unit = UnitArray[modelInfo.unitID];
                    if (!unit) {
                        unit = new Unit(modelInfo.faction,modelInfo.unitID);
                    }
                    model = new Model(token.id,unit.id,formation.id);
                }
                let type = Attribute(char,"type");
                if (type === "Building") {
                    model = new Model(token.id)
//add back into terrain array, based on side
                    AddBuilding(model);
                }




            }
        });
        let elapsed = Date.now()-startTime;
        log(tokenArray.length + " Teams added to array in " + elapsed/1000 + " seconds");
    }

    const modelHeight = (model) => {
        let hex = hexMap[model.hexLabel];
        let height = parseInt(hex.elevation);
        if (hex.terrain.includes("Building") && model.type === "Infantry") {
            height = parseInt(hex.height);
        }
        if (model.type === "Aircraft") {
            height = 20;
        }
        if (model.size === 3) {height += .5};
        if (model.size === 4) {height += 1};
        if (model.size === 5) {height += 2};
        return height;
    }

    const LOS = (id1,id2,special) => {
        if (!special) {special = " "};
        let model1 = ModelArray[id1];
        let unit1 = UnitArray[model1.unitID];
        let model2 = ModelArray[id2];
        let los = true;
        if (!model1 || !model2) {
            let info = (!model1) ? "Model 1":"Model2";
            sendChat("",info + " is not in Model Array");
            let result = {
                
            }
            return result
        }
        let model1Hex = hexMap[model1.hexLabel];
        let targetHexes = [];
        if (model2.large === true) {
            targetHexes = model2.largeHexList;
        } else if (model2.type === "Infantry" && model2Hex.buildingID !== "") {
            //Infantry in building, use building for LOS
            targetHexes = ModelArray[model2Hex.buildingID].largeHexList;
        } else {
            targetHexes.push(model2.hex);
        }

        let finalLOS,losReason,percent;
        let finalCover = model2Hex.cover;
        let model1Height = modelHeight(model1);
        let model2Height = modelHeight(model2);
        let md = ModelDistance(model1,model2);
        let finalArc = md.arc;
        let distanceT1T2 = md.distance; 
      
log("Team1 H: " + model1Height)
log("Team2 H: " + model2Height)
        let modelLevel = Math.min(model1Height,model2Height);
        model1Height -= modelLevel;
        model2Height -= modelLevel;

        //Flyers see all and are seen by all
        if (model1.special.includes("Flyer") || model2.special.includes("Flyer")) {
            if (model2.special.includes("Flyer")) {
                cover = 7
            }
            let result = {
                distance: distanceT1T2,
                arc: finalArc,
                los: true,
                cover: finalCover,
                losReason: losReason,
                percent: 1,
            }
            return result;
        }
        //Otherwise run through targetHexes and check LOS
        //for all but Titans/Knights, if have LOS to one hex is good
        targetHexesWithLOS = 0; //used to track obscuring for Titans, Knights
        
        for (let h=0;h<targetHexes.length;h++) {
            let targetHex = targetHexes[h];
            let targetLOS = true;
            let interHexes = md.hex1.linedraw(targetHex); 
            //interHexes will be hexes between shooter and target,  including their hexes or closest hexes for large tokens
            let lastElevation = model1Height;
            let flag = model1Hex.obstructingTerrain;
            let obstructingHexes = 0;
    log("Model 1 in Obstructing Terrain: " + flag);
    log("Obstructing Hexes: " + obstructingHexes);
            losloop1:
            for (let i=1;i<interHexes.length;i++) {
                let qrs = interHexes[i];
                let qrsLabel = qrs.label();
                let interHex = hexMap[qrsLabel];
            log(i + ": " + qrsLabel)
            log(interHex.terrain)
                let interHexElevation = parseInt(interHex.elevation) - modelLevel;
                let interHexHeight = parseInt(interHex.height) - modelLevel;
                let B;
                if (model1Height > model2Height) {
                    B = (distanceT1T2 - i) * model1Height / distanceT1T2;
                } else if (model1Height <= model2Height) {
                    B = i * model2Height / distanceT1T2;
                }
            log("InterHex Height: " + interHexHeight);
            log("InterHex Elevation: " + interHexElevation);
            log("Last Elevation: " + lastElevation);
            log("B: " + B)

                if (interHexElevation < lastElevation && lastElevation > model1Height && lastElevation > model2Height) {
                    targetLOS = false;
                    losReason = "Terrain Drops Off";
                    break losloop1;
                }         
                //check for something in way
                if (interHex.tokenIDs.length > 0) {
                    let id3s = interHex.tokenIDs;
                    for (let i=0;i<id3s.length;i++) {
                        let id3 = id3s[i];
                        if (id3 === id1 || id3 === id2) {continue};
                        let model3 = ModelArray[id3];
            log(model3.name)
                        if (model3.unitID === model1.unitID || model3.unitID === model2.unitID) {continue};
                        let model3Height = modelHeight(model3) - modelLevel;
            log(model3Height)
                        if (interHexElevation + interHexHeight + model3Height >= B) {
                            if (model3.size > 1) {
                                targetLOS = false;
                                losReason = "LOS blocked by another Model";
                                break losloop1;
                            }
                        }
                    }
                }
                if (interHexHeight + interHexElevation >= B && i > 0) {
            log("LOS goes through Terrain")
                    if (interHex.los === false) {
                        //hex blocks los
                        obstructingHexes += 1;
            log("Obstructing Hexes: " + obstructingHexes);
                        if ((flag === true && obstructingHexes > 6) || (flag === false && obstructingHexes > 1)) {
                            targetLOS = false;
                            losReason = "Too Deep into Terrain";
                            break losloop1;
                        }
                    } else if (interHex.los === true && flag === true) {
                        if (obstructingHexes > 0) {
                            //breaking out into open, so if > 0 then is deep in terrain
                            targetLOS = false;
                            losReason = "Too Deep into Terrain";
                            break losloop1;
                        } else {
                            flag = false;
                        }
                    } 
            log("Flag: " + flag)
                } else {
            log("Overloooks")
                }
                lastElevation = interHexElevation;
            }
            if (model.size > 3 && targetLOS === true) {
                targetHexesWithLOS++;
            } else if (targetLOS === true) {
                finalLOS = true;
                break;
            }
        }

        if (model.size > 3) {
            if (targetHexesWithLOS === 0) {
                finalLOS = false;
                percent = 0;
            } else {
                finalLOS = true;
                percent = targetHexesWithLOS/targetHexes.length;
            }
        } else {
            percent = 1;
        }
        let result = {
            distance: distanceT1T2,
            arc: finalArc,
            los: finalLOS,
            cover: finalCover,
            losReason: losReason,
            percent: percent,
        }
        return result;
    }




    const RollD6 = (msg) => {
        let Tag = msg.content.split(";");
        PlaySound("Dice");
        let roll = randomInteger(6);
        if (Tag.length === 1) {
            let playerID = msg.playerid;
            let side = "Neutral";
            if (!state.LI.players[playerID] || state.LI.players[playerID] === undefined) {
                if (msg.selected) {
                    let id = msg.selected[0]._id;
                    if (id) {
                        let tok = findObjs({_type:"graphic", id: id})[0];
                        let char = getObj("character", tok.get("represents")); 
                        faction = Attribute(char,"faction");
                        side = (TraitorForces.includes(faction)) ? "Traitor":"Loyalist";
                        state.LI.players[playerID] = side;
                    }
                } else {
                    sendChat("","Click on one of your tokens then select Roll again");
                    return;
                }
            } else {
                side = state.LI.players[playerID];
            }
            let res = "/direct " + DisplayDice(roll,side,40);
            sendChat("player|" + playerID,res);
        } else {
            


        }
    }

    const ClearState = () => {
        //clear arrays
        ModelArray = {};
        UnitArray = {};
        FormationArray = {};
        //clear token info
        let tokens = findObjs({
            _pageid: Campaign().get("playerpageid"),
            _type: "graphic",
            _subtype: "token",
            layer: "objects",
        })
        tokens.forEach((token) => {
            if (token.get("name").includes("Objective") === true) {return};

            token.set({
                name: "",
                tint_color: "transparent",
                aura1_color: "transparent",
                aura1_radius: 0,
                showplayers_bar1: true,
                showname: true,
                showplayers_aura1: true,
                bar1_value: 0,
                bar1_max: "",
                gmnotes: "",
                statusmarkers: "",
                tooltip: "",
                lockMovement: false,
            });                
        });
    
        RemoveDead("All");
        RemoveDepLines();

        let tmID = (edgeArray[0] === 0) ? [""]:["",""];

        state.LI = {
            players: {}, //keyed by playerID, shows which side
            markers: [[],[]],
            turn: 0,
            lineArray: [],
            models: {}, //unitIDs, formationIDs
            units: {}, //unitIDs -> names, formationIDs
            formations: {}, //names and starting strength
            objectives: [],
            deployLines: [],
            mission: '1',
            turnMarkerIDs: tmID,
            buildings: {},
        }
        for (let i=0;i<UnitMarkers.length;i++) {
            state.LI.markers[0].push(i);
            state.LI.markers[1].push(i);
        }
        sendChat("","Cleared State/Arrays");
    }

    const RemoveDepLines = () => {
        for (let i=0;i<state.LI.deployLines.length;i++) {
            let id = state.LI.deployLines[i];
            let path = findObjs({_type: "path", id: id})[0];
            if (path) {
                path.remove();
            }
        }
    }

    const UnitCreation = (msg) => {
        let Tag = msg.content.split(";");
        let unitName = Tag[1];
        let tokenIDs = [];
        for (let i=0;i<msg.selected.length;i++) {
            tokenIDs.push(msg.selected[i]._id);
        }
        if (tokenIDs.length === 0) {return};
        let refToken = findObjs({_type:"graphic", id: tokenIDs[0]})[0];
        let refChar = getObj("character", refToken.get("represents")); 
        let faction = Attribute(refChar,"faction");

        let formationKeys = Object.keys(FormationArray);
        SetupCard("Unit Creation","",faction);
        let newID = stringGen();
        outputCard.body.push("Select Existing Formation or New");
        ButtonInfo("New","!UnitCreation2;" + newID + ";?{Formation Name}");
        for (let i=0;i<formationKeys.length;i++) {
            let formation = FormationArray[formationKeys[i]];
            if (formation.faction !== faction) {continue};
            let action = "!UnitCreation2;" + formation.id;
            ButtonInfo(formation.name,action);
        }

        PrintCard();

        unitCreationInfo = {
            faction: faction,
            tokenIDs: tokenIDs,
            unitName: unitName,
        }
    }

    const UnitCreation2 = (msg) => {
        let Tag = msg.content.split(";");
        let unitName = unitCreationInfo.unitName;
        let faction = unitCreationInfo.faction;
        let player = (TraitorForces.includes(faction)) ? 1:0;
        let tokenIDs = unitCreationInfo.tokenIDs;
        let formationID = Tag[1];
        let formation = FormationArray[formationID];
        if (!formation) {
            formation = new Formation(faction,formationID,Tag[2]);
        }

        SetupCard("Unit Creation","",faction);
        let unitID = stringGen();
        let unit = new Unit(faction,unitID,unitName,formationID);
        let markerNumber = state.LI.markers[player].length;
        if (!markerNumber || markerNumber === 0) {
            markerNumber = 1;   
        } else {
            markerNumber = randomInteger(markerNumber);
            state.LI.markers[player].splice(markerNumber-1,1);
        }
        unit.symbol = UnitMarkers[markerNumber-1];
        for (let i=0;i<tokenIDs.length;i++) {
            let tokenID = tokenIDs[i];
            let model = new Model(tokenID,unitID,formationID);
            model.token.set({
                name: model.name,
                tint_color: "transparent",
                showplayers_bar1: true,
                showname: true,
                bar1_value: model.wounds,
            })
            if (parseInt(model.wounds) > 1) {
                model.token.set("bar1_max",model.wounds);
            }
            if (parseInt(model.size) > 3) {
                formation.breakPoint += model.wounds;
                state.LI.formations[formationID].breakPoint += model.wounds;
            } else {
                formation.breakPoint += 1;
                state.LI.formations[formationID].breakPoint += 1;
            }
            model.token.set("statusmarkers","");
            model.token.set("status_"+unit.symbol,true);
        }

        ModelArray[unit.modelIDs[0]].token.set({
            aura1_color: colours.green,
            aura1_radius: 0.2,
        })
        sendChat("",unitName + " Created");





    }


    const TokenInfo = (msg) => {
        if (!msg.selected) {
            sendChat("","No Token Selected");
            return;
        };
        let id = msg.selected[0]._id;
        let model = ModelArray[id];
        if (!model) {
            sendChat("","Not in Model Array Yet");
            return;
        };
        let faction = model.faction;
        if (!faction) {faction = "Neutral"};

        if (model.type === "Building") {
            SetupCard(model.name,"",faction);
            let side = parseInt(model.token.get("currentSide"));
            if (side === 0) {
                outputCard.body.push("Wounds: " + model.token.get("bar1_value"));
                outputCard.body.push("Height: " + model.buildingInfo.height);
                outputCard.body.push("Armour Save: " + model.buildingInfo.armourSave + "+");
                outputCard.body.push("Garrison Number: " + model.buildingInfo.garrisonNumber);
                outputCard.body.push("CAF Bonus: +" + model.buildingInfo.cafBonus);
                outputCard.body.push("Cover Save: " + model.buildingInfo.coverSave + "+");
            } else {
                outputCard.body.push("Building is in Ruins");
                outputCard.body.push("Height: 1");
                outputCard.body.push("Cover Save: 5+");
            }


        } else if (model.type !== "System Unit" && model.type !== "Building") {
            SetupCard(model.name,"Hex: " + model.hexLabel,faction);
            let h = hexMap[model.hexLabel];
            let terrain = h.terrain;
            terrain = terrain.toString();
            let elevation = modelHeight(model);
            let cover = h.cover;
            let unit = UnitArray[model.unitID];
            let save = parseInt(model.save);
    
            outputCard.body.push("Terrain: " + terrain);
            if (cover < 7) {
                if (cover < save) {
                    outputCard.body.push("Cover Save: " + cover + "+");
                } else {
                    outputCard.body.push("No Benefit from Cover Save");
                }
            } 
            outputCard.body.push("Height: " + elevation);
            if (unit) {
                outputCard.body.push("[hr]");
                outputCard.body.push("Unit: " + unit.name);
                if (unit.order !== "") {
                    outputCard.body.push("Order: " + unit.order);
                } else {
                    outputCard.body.push("No Order");
                }
                for (let i=0;i<unit.modelIDs.length;i++) {
                    let m = ModelArray[unit.modelIDs[i]];
                    let name = m.name;
                    if (i===0) {
                        name += " (Leader)"
                    }
                    outputCard.body.push(name);
                }
            }


        }
        PrintCard();
    }

    const DrawLine = (id1,id2,w,layer) => {
        let ColourCodes = ["#00ff00","#ffff00","#ff0000","#00ffff","#000000"];
        let colour = ColourCodes[w];


        let x1 = hexMap[ModelArray[id1].hexLabel].centre.x + w*15;
        let x2 = hexMap[ModelArray[id2].hexLabel].centre.x + w*15;
        let y1 = hexMap[ModelArray[id1].hexLabel].centre.y + w*15;
        let y2 = hexMap[ModelArray[id2].hexLabel].centre.y + w*15;

        let width = (x1 - x2);
        let height = (y1 - y2);
        let left = width/2;
        let top = height/2;

        let path = [["M",x1,y1],["L",x2,y2]];
        path = path.toString();

        let newLine = createObj("path", {   
            _pageid: Campaign().get("playerpageid"),
            _path: path,
            layer: layer,
            fill: colour,
            stroke: colour,
            stroke_width: 5,
            left: left,
            top: top,
            width: width,
            height: height,
        });

        let id = newLine.id;
        return id;
    }

    const DeploymentLines = (x1,x2,y1,y2) => {
        let width = (x1 - x2);
        let height = (y1 - y2);
        let left = width/2;
        let top = height/2;

        let path = [["M",x1,y1],["L",x2,y2]];
        path = path.toString();

        let newLine = createObj("path", {   
            _pageid: Campaign().get("playerpageid"),
            _path: path,
            layer: "map",
            fill: "#FF0000",
            stroke: "#FF0000",
            stroke_width: 5,
            left: left,
            top: top,
            width: width,
            height: height,
        });
        toFront(newLine);
        let id = newLine.id;
        return id;
    }


    const RemoveLines = () => {
        let lineIDArray = state.LI.lineArray;
        if (!lineIDArray) {
            state.LI.lineArray = [];
            return;
        }
        for (let i=0;i<lineIDArray.length;i++) {
            let id = lineIDArray[i];
            let path = findObjs({_type: "path", id: id})[0];
            if (path) {
                path.remove();
            }
        }
        state.LI.lineArray = [];  
    }



    const AddAbility = (abilityName,action,charID) => {
        createObj("ability", {
            name: abilityName,
            characterid: charID,
            action: action,
            istokenaction: true,
        })
    }    

    const AddAbilities = (msg) => {
        if (!msg) {return}
        let id = msg.selected[0]._id;
        if (!id) {return};
        let token = findObjs({_type:"graphic", id: id})[0];
        let char = getObj("character", token.get("represents"));
        if (!char) {return};
        let model = ModelArray[id];
        if (!model) {return};

        let abilityName,action;
        let abilArray = findObjs({_type: "ability", _characterid: char.id});
        //clear old abilities
        for(let a=0;a<abilArray.length;a++) {
            abilArray[a].remove();
        } 

    }


    const Objectives = () => {
        let count = [0,0,0];
        for (let i=0;i<state.LI.objectives.length;i++) {
            let objective = state.LI.objectives[i];
            let keys = Object.keys(ModelArray);
            let modelsInRange = [false,false];
            let objToken = findObjs({_type:"graphic", id: objective.id})[0];
            for (let k=0;k<keys.length;k++) {
                let model = ModelArray[keys[k]];
                if (model.type === "Aircraft") {continue};
                let unit = UnitArray[model.unitID];
                if (unit.shakenCheck() === true) {continue};
                if (model.special.includes("Ambush") && unit.deployed === state.LI.turn) {
                    continue;
                }
                let distance = ModelDistance(model,objective).distance;
                if (distance > 3) {continue};
                modelsInRange[model.player] = true;
            }
            let side;
            if (modelsInRange[0] === true && modelsInRange[1] === true) {
                side = 2;
            } else if (modelsInRange[0] === true && modelsInRange[1] === false) {
                side = 0;
            } else if (modelsInRange[0] === false && modelsInRange[1] === true) {
                side = 1;
            } else if (modelsInRange[0] === false && modelsInRange[1] === false) {
                side = parseInt(objToken.get("currentSide"));
            }
            let img = objToken.get("sides").split("|");
            img = img[side];
            objToken.set({
                currentSide: side,
                imgsrc: img,
            });
            count[side]++;
        }
        return count;
    } 

    const StartGame = () => {
        let tokens = findObjs({
            _pageid: Campaign().get("playerpageid"),
            _type: "graphic",
            _subtype: "token",
            layer: "objects",
        });
        for (let i=0;i<tokens.length;i++) {
            let token = tokens[i];
            let char = getObj("character", token.get("represents"));
            let name = char.get("name").split(" ");
log(name)
            if (name.includes("Objective")) {
                sides = [];
                for (let i=0;i<2;i++) {
                    let faction = state.LI.factions[i][0];
                    let tablename = Factions[faction].dice;
                    let table = findObjs({type:'rollabletable', name: tablename})[0];
                    let obj = findObjs({type:'tableitem', _rollabletableid: table.id, name: '6' })[0];        
                    let image = tokenImage(obj.get('avatar'));                    
                    sides.push(image);
                }
                let objNum = name.replace(/\D/g,'') - 1;
                let images = ["https://s3.amazonaws.com/files.d20.io/images/306331520/L67AAVS8GOrbFdWQMcg6JA/thumb.png?1664136875","https://s3.amazonaws.com/files.d20.io/images/306333377/ujCJ26GwCQblS4YxGtTJGA/thumb.png?1664137412","https://s3.amazonaws.com/files.d20.io/images/306334101/tByHNVqk10c0Rw2WX9pJpw/thumb.png?1664137597","https://s3.amazonaws.com/files.d20.io/images/306334428/y1rD_5GiD6apA9VOppxDcA/thumb.png?1664137681","https://s3.amazonaws.com/files.d20.io/images/306335099/fru3LTmrDslxAbHI-ALPUg/thumb.png?1664137844"];
                let neutral = tokenImage(images[objNum]);
                sides.push(neutral);
                sides = sides.toString();
                sides = sides.replace(/,/g,"|");
                token.set({
                    sides: sides,
                    currentSide: 2,
                    imgsrc: neutral,
                    height: 140,
                    width: 140,
                    layer: "map",
                });
                let location = new Point(token.get("left"),token.get('top'));
                let hex = pointToHex(location);
                let obj = {
                    id: token.id,
                    hex: hex,
                }
                state.LI.objectives.push(obj);
            } else if (findCommonElements(BuildingNames,name) === true) {
                //reset buildings
                let buildingModel = new Model(token.id);
                let sides = token.get("sides").split("|");
                if (sides[0] !== "") {
                    img = tokenImage(sides[0]);
                    if (img) {
                        token.set({
                            currentSide: 0,
                            imgsrc: img,
                        });
                    }
                }
                token.set({
                    bar1_value: buildingModel.wounds,
                    bar1_max: buildingModel.wounds,
                    lockMovement: true,
                    name: buildingModel.name,
                });
                toBack(token);
                AddBuilding(buildingModel); //adds to map
            }



        }
        state.LI.turn = 1;
        let tmIDs = state.LI.turnMarkerIDs;
        for (let i=0;i<tmIDs.length;i++) {
            let tmID = tmIDs[i];
            let turnMarker = findObjs({_type:"graphic", id: tmID})[0];
            if (!turnMarker) {
                PlaceTurnMarker(i);
            } else {
                let newImg = getCleanImgSrc(TurnMarkers[state.LI.turn]);
                turnMarker.set("imgsrc",newImg);
            }
        }        
        SetupCard("Turn 1","","Neutral");
        outputCard.body.push("Start Game Placeholder");
        PrintCard();
    }
    const PlaceTurnMarker = (num) => {
        let turnMarker = getCleanImgSrc(TurnMarkers[state.LI.turn]);        
        let alt = (num === 0) ? 1:0
        let x = Math.floor(((pageInfo.width * alt) + edgeArray[alt]) / 2);
        let y = Math.floor((pageInfo.height/2));
        let newToken = createObj("graphic", {   
            left: x,
            top: y,
            width: 210, 
            height: 210,  
            name: "Turn",
            pageid: Campaign().get("playerpageid"),
            imgsrc: turnMarker,
            layer: "map",
        });
        toFront(newToken);
        state.LI.turnMarkerIDs[num] = newToken.id;
    }

    const AddBuilding = (model) => {
        let hexes = model.largeHexList;
        let side = parseInt(model.token.get("currentSide"));
        let cover = model.buildingInfo.coverSave;
        let height = model.height;
        let name = model.name;
        if (side > 0) {
            name = "Ruins";
            cover = 5;
            height = 1;
        } 
    
        _.each(hexes,hex => {
            if (hexMap[hex.label()].terrain.includes(name) === false) {
                hexMap[hex.label()].terrain.push(model.name);
                hexMap[hex.label()].cover = cover;
                hexMap[hex.label()].los = false;
                hexMap[hex.label()].obstructingTerrain = true;
                hexMap[hex.label()].nonHillHeight = Math.max(hexMap[hex.label()].nonHillHeight,height);
                hexMap[hex.label()].height = Math.max(hexMap[hex.label()].height,(hexMap[hex.label()].elevation + hexMap[hex.label()].nonHillHeight));
            }
        })
    }

    const Arc = (model1,model2) => { //which arc target b is in relative to shooter a
        let arc = "Front";
        let alpha = model1.hex.angle(model2.hex); //angle from shooter to target
        let beta = Angle(model1.token.get("rotation")); //rotational angle of shooter
        let theta = Angle(alpha - beta);
        if (theta > 90 && theta < 270) {arc = "Rear"};
        return arc;
    }

    const RemoveDead = (info) => {
        let tokens = findObjs({
            _pageid: Campaign().get("playerpageid"),
            _type: "graphic",
            _subtype: "token",
            layer: "map",
        });
        tokens.forEach((token) => {
            if (token.get("status_dead") === true) {
                token.remove();
            }
            let removals = ["Objective","Turn"];
            for (let i=0;i<removals.length;i++) {
                if (token.get("name").includes(removals[i]) && info === "All") {
                    token.remove();
                }
            }
        });
    }

    const destroyGraphic = (tok) => {
        if (tok.get('subtype') === "token") {
            let model = ModelArray[tok.id];
            if (!model) {return};
            if (model.type === "Building") {
                if (model.token.get("lockMovement") === true) {
                    t = simpleObj(tok);
                    delete t.id
                    let sides = tok.get("sides").split("|");
                    let side = tok.get("currentSide") || 0;
                    if (sides[side] !== "") {
                        img = tokenImage(sides[side]);
                        if (img) {
                            t.imgsrc = img;
                            t.currentSide = side;
                        }
                    }
                    newTok = createObj('graphic',t);
                    delete ModelArray[tok.id];
                    new Model(newTok.id);
                }

            } else if (model.type !== "System Unit" && model.type !== "Building") {
                            //model.kill();

            }            
        }
    }

    const CheckLOS = (msg) => {
        let Tag = msg.content.split(";");
        let shooterID = Tag[1];
        let shooter = ModelArray[shooterID];
        let targetID = Tag[2];
        let target = ModelArray[targetID];
        let checkLOS = LOS(shooterID,targetID);
        SetupCard(shooter.name,target.name,shooter.faction);
        if (checkLOS.los === false) {
            outputCard.body.push("No LOS to Target");
            outputCard.body.push(checkLOS.losReason);
        } else {
            outputCard.body.push("Shooter has LOS");
            outputCard.body.push("Distance: " + checkLOS.distance);
            outputCard.body.push("Target is in " + checkLOS.arc + " Arc");
            if (parseInt(checkLOS.cover) < 7) {
                outputCard.body.push("Cover Save of " + checkLOS.cover + "+");
            }
        }
        PrintCard();
    }

    const DeploymentZones = () => {
        return

        let type = randomInteger(6).toString();
        if (state.LI.options[0] === false) {
            type = '1';
        }
        let x0,y0,x1,x2,y1,y2,m,b1,b2,lineID;
        switch(type) {
            case '1':
                outputCard.body.push("Front Line");
                outputCard.body.push("Dice Roll, Winner picks top or bottom and deploys first");
                x1 = 0;
                x2 = pageInfo.width;
                //top line
                y1 = Math.round(pageInfo.height/2) - (12*ySpacing);
                y2 = y1;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.LI.deployLines.push(lineID);
                y1 = Math.round(pageInfo.height/2) + (12*ySpacing);
                y2 = y1;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.LI.deployLines.push(lineID);
                break;
            case '2':
                outputCard.body.push("Long Haul");
                outputCard.body.push("Dice Roll, Winner picks left or right and deploys first");
                x1 = EDGE/2 - (12*xSpacing);
                x2 = x1;
                y1 = 0;
                y2 = pageInfo.height;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.LI.deployLines.push(lineID);
                x1 = EDGE/2 + (12*xSpacing);
                x2 = x1;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.LI.deployLines.push(lineID);
                break;
            case '3':
                outputCard.body.push("Side Battle");
                outputCard.body.push("Dice Roll, Winner picks a corner and deploys first");
                x1 = 0;
                y1 = 0;
                x2 = EDGE;
                y2 = pageInfo.height;
                x0 = x2 - x1;
                y0 = y2 - y1;
                m = y0/x0;//slope of line
                b1 = 0;
                b2 = 12*140*1.414*((m*m)-1);
                y1 = b2;
                y2 = x2 * m + b2;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.LI.deployLines.push(lineID);
                y1 = -b2;
                y2 = x2 * m - b2;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.LI.deployLines.push(lineID);

                break;
            case '4':
                outputCard.body.push("Ambush");
                outputCard.body.push("Dice Roll, Winner can choose to deploy in centre or in corners");
                x1 = 0;
                y1 = 0;
                x2 = EDGE;
                y2 = pageInfo.height;
                x0 = x2 - x1;
                y0 = y2 - y1;
                m = y0/x0;//slope of line
                b1 = 0;
                b2 = 6*140*1.414*((m*m)-1);
                y1 = b2;
                y2 = x2 * m + b2;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.LI.deployLines.push(lineID);
                y1 = -b2;
                y2 = x2 * m - b2;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.LI.deployLines.push(lineID);
                b2 = 24*140*1.414*((m*m)-1);
                y1 = b2;
                y2 = x2 * m + b2;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.LI.deployLines.push(lineID);
                y1 = -b2;
                y2 = x2 * m - b2;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.LI.deployLines.push(lineID);
                break;
            case '5':
                outputCard.body.push("Spearhead");
                outputCard.body.push("Dice Roll, Winner can choose to deploy on left or right");
                x1 = EDGE/2 - (12*xSpacing);
                y1 = Math.round(pageInfo.height/2);
                x2 = 0;
                y2 = 0;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.LI.deployLines.push(lineID);
                y2 = pageInfo.height;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.LI.deployLines.push(lineID);
                x1 = EDGE/2 + (12*xSpacing);
                x2 = EDGE;
                y2 = 0;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.LI.deployLines.push(lineID);
                y2 = pageInfo.height;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.LI.deployLines.push(lineID);
                break;
            case '6':
                outputCard.body.push("Flank Attack");
                outputCard.body.push("Dice Roll, Winner can choose to deploy on left or right");
                x1 = EDGE/2 - (12*xSpacing);
                y1 = Math.round(pageInfo.height/2);
                x2 = 0;
                y2 = y1;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.LI.deployLines.push(lineID);
                x2 = x1;
                y2 = 0;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.LI.deployLines.push(lineID);
                x1 = EDGE/2 + (12*xSpacing);
                x2 = EDGE;
                y2 = y1;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.LI.deployLines.push(lineID);
                x2 = x1;
                y2 = pageInfo.height;
                lineID = DeploymentLines(x1,x2,y1,y2);
                state.LI.deployLines.push(lineID);
                break;
        }
    }


    const changeGraphic = (tok,prev) => {
        if (tok.get('subtype') === "token") {
            RemoveLines();
            log(tok.get("name") + " moving");
            if ((tok.get("left") !== prev.left) || (tok.get("top") !== prev.top)) {
                let model = ModelArray[tok.id];
                if (!model) {return};
                let oldHex = model.hex;
                let oldHexLabel = model.hexLabel;
                
                let newLocation = new Point(tok.get("left"),tok.get("top"));
                let newHex = pointToHex(newLocation);
                let newHexLabel = newHex.label();
                newLocation = hexToPoint(newHex); //centres it in hex
                
                tok.set({
                    left: newLocation.x,
                    top: newLocation.y,
                });
                model.hex = newHex;
                model.hexLabel = newHexLabel;
                model.location = newLocation;
                let index = hexMap[oldHexLabel].tokenIDs.indexOf(tok.id);
                if (index > -1) {
                    hexMap[oldHexLabel].tokenIDs.splice(index,1);
                }
                hexMap[newHexLabel].tokenIDs.push(tok.id);
                if (model.size === "Large") {
                    model.vertices = TokenVertices(tok);
                    LargeTokens(model);
                }
            };
        };
    };



    const handleInput = (msg) => {
        if (msg.type !== "api") {
            return;
        }
        let args = msg.content.split(";");
        log(args);
        switch(args[0]) {
            case '!Dump':
                log("STATE");
                log(state.LI);
                log("Terrain Array");
                log(TerrainArray);
                log("Model Array");
                log(ModelArray);
                log("Unit Array");
                log(UnitArray)
                log("Formation Array");
                log(FormationArray);
                break;
            case '!StartNew':
                ClearState();
                break;
            case '!Roll':
                RollD6(msg);
                break;
            case '!UnitCreation':
                UnitCreation(msg);
                break;
            case '!UnitCreation2':
                UnitCreation2(msg);
                break;
            case '!TokenInfo':
                TokenInfo(msg);
                break;
            case '!CheckLOS':
                CheckLOS(msg);
                break;
            case '!AddAbilities':
                AddAbilities(msg);
                break;
            case '!RemoveLines':
                RemoveLines();
                break;
            case '!StartGame':
                StartGame();
                break;
            
    
        }
    };
    const registerEventHandlers = () => {
        on('chat:message', handleInput);
        on('change:graphic',changeGraphic);
        on('destroy:graphic',destroyGraphic);
    };
    on('ready', () => {
        log("===> Legions Imperialis Rules: " + rules + " <===");
        log("===> Software Version: " + version + " <===");
        LoadPage();
        BuildMap();
        registerEventHandlers();
        sendChat("","API Ready, Map Loaded")
        log("On Ready Done")
    });
    return {
        // Public interface here
    };




})();