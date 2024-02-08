const Shooting = (msg) => {
    let Tag = msg.content.split(";");
    let weaponType = Tag[1];
    let shooterID = Tag[2];
    let targetID = Tag[3];
    let ignoreCover = (Tag[4] === "Yes") ? true:false;
    let weaponNum = Tag[5] || 0; //weapon numbers if firing a single weapon eg. Titans
    let targetOnlyVisible = (Tag[6] === "Yes") ? true:false;//place a query in weapon macro, with "Target Only Visible Models|No|Yes"

    let shooter = ModelArray[shooterID];
    let shooterUnit = UnitArray[shooter.unitID];
    let results;

    SetupCard(shooterUnit.name,"Hits",shooterUnit.faction);

    if (weaponType === "Blast") {
        results = Blast(shooterID,targetID,weaponNum);
    } else if (weaponType === "Beam") {
        results = Beam(shooterID,targetID,weaponNum);
    } else if (weaponType === "Firestorm") {
        results = Firestorm(shooterID,targetID,weaponNum);
    } else {
        results = Regular(shooterID,targetID,weaponNum);
    }
    let shooterIDs = results.shooterIDs; //eligible shooters
    let shooterNotes = results.notes;
    let error = results.error;
    let targetUnitResults = results.targetUnitResults; //eligible targets organized into their units


    if (error) {
        outputCard.body.push(error); //already fired, out of arc etc
        PrintCard();
        return;
    }


    log(results)




















}





const Regular = (shooterID,targetID,weaponNum) => {
    let shooterIDs = [];
    let shooterUnit = UnitArray[ModelArray[shooterID].unitID];
    let targetUnits = [];

    //Range, Arc, LOS












}

//amend below for multiple templates
const Blast = (shooterID,targetID,weaponNum) => {
    let shooterIDs = [];
    let weapon = ModelArray[shooterID].weaponArray[weaponNum];
    let shooterUnit = UnitArray[ModelArray[shooterID].unitID];
    let shooterExceptions = "";
    //Range, Arc, LOS to the blast target
    _.each(shooterUnit.modelIDs,id => {
        let shooter = ModelArray[id];
        let losResult = LOS(id,targetID);
        let exception;
        if (losResult.los === false) {
            exception = "<br>" + shooter.name + ": No LOS to Target";
        }
        if (losResult.distance < weapon.minRange || losResult.distance > weapon.maxRange) {
            exception = "<br>" + shooter.name + ": No Range to Target";
        }
        if ((weapon.arc === "Front" && losResult.arc !== "Front") || (weapon.arc === "Rear" && losResult.arc !== "Rear")) {
            exception = "<br>" + shooter.name + ": Target Out of Arc";
        };
        if (exception) {
            shooterExceptions.push(exception);
        } else {
            shooterIDs.push(id);
        }
    })
    if (shooterIDs.length === 0) {
        let tip = '[😡](#" class="showtip" title="Shooters without Targets' + shooterExceptions + ')';
        results = {
            shooterIDs: [],
            shooterNotes: "",
            error: tip + " Blast Target No Eligible",
            targetUnitResults: [],
            buildingHit: {},
        }
        return results;
    } 

    //now check for scatter
    let target = ModelArray[targetID];
    let traits = weapon.traits.split(",");
    let radius;
    _.each(traits,trait => {
        if (trait.includes("Blast")) {
            radius = trait;
        }
    });
    radius = radius.replace(/\D/g,'');
    let scatter = (radius === 5) ? (randomInteger(6) + 1):(randomInteger(3) + 1);
    scatter *= 80;
    let scatterRoll = randomInteger(3);
    if (scatterRoll > 1) {
        //scatters
        let centre = hexMap[target.hexLabel].centre;
        outputCard.body.push("Blast Scatters");
        let theta = randomInteger(360) * Math.PI / 180;
        let newCentre = new Point(( Math.cos(theta) * scatter + centre.x),(Math.sin(theta) * scatter + centre.y));
        let newHex = pointToHex(newCentre);
        newCentre = hexMap[newHex.label()];
        target.token.set({
            left: newCentre.x,
            top: newCentre.y,
        });
        target.hex = newHex;
        target.location = newCentre;
        target.hexLabel = newHex.label();
    }

    //find targets and sort into units
    let targetUnits = {};
    let buildingHit = {};

    //if NOT, ignores garrison but still hits the building and any units outside
    if (hexMap[target.hexLabel].structureID !== "" && weapon.traits.includes("Skyfire") === false) {
        //Centre of blast is on a building, hits building and those within ONLY
        buildingHit[hexMap[target.hexLabel].structureID] = weapon.dice;
        let garrisonUnitIDs = Garrisons[hexMap[target.hexLabel].structureID];
        _.each(garrisonUnitIDs,unitID => {
            let unit = UnitArray[unitID];
            let ids = [];
            let hits = 0;
            //each model in garrison generates hit 50/50 and becomes legal target
            _.each(unit.modelIDs,id => {
                if (randomInteger(2) === 1) {
                    ids.push(id);
                }
            });
            targetUnits[unit.id] = {
                ids: ids,
                hits: parseInt(weapon.dice) * ids.length,
            }
        });
    } else {
        //if NOT, ignores garrison but still hits the building and any units outside unless skyfire
        let targetHexes = target.hex.radius(radius-1); //as target hex is 1;
        let ids = [];
        _.each(targetHexes,targetHex => {
            let HEX = hexMap[targetHex.label()];
            _.each(HEX.modelIDs,id => {
                let model = ModelArray[id];
                if (weapon.traits.includes("Skyfire") && model.special.includes("Flyer")) {
                    ids.push(id);
                } else if (weapon.traits.includes("Skyfire") === false && model.special.includes("Flyer") === false) {
                    ids.push(id);
                }
            })
            if (Hex.structureID !== "") {
                buildingHit[Hex.structureID] = weapon.dice;
            }
        });
        ids = [...new Set(ids)];
    
        for (let m=0;m<ids.length;m++) {
            let id = ids[m];
            let model = ModelArray[id];
            if (weapon.traits.includes("Skyfire") && model.special.includes("Flyer") === false) {continue};
            if (weapon.traits.includes("Skyfire") === false && model.special.includes("Flyer")) {continue};
            if (model.large === true) {
                //rather than 50/50, base it on % of hexes under blast
                let numberHexes = 0;
                _each(model.largeHexList,hex => {
                    for (let i=0;i<targetHexes.length;i++) {
                        if (hex.label() === targetHexes[i].label()) {
                            numberHexes++;
                            break;
                        }
                    }
                });
                let roll = randomInteger(model.largehexList.length);
                if (roll <= numberHexes) {
                    if (!targetUnits[model.unitID]) {
                        targetUnits[model.unitID] = {
                            hits: weapon.dice,
                            ids: [id],
                        }
                    } else {
                        targetUnits[model.unitID].hits += weapon.dice;
                        targetUnits[model.unitID].ids.push(id);
                    }
                }
            } else {
                if (!targetUnits[model.unitID]) {
                    targetUnits[model.unitID] = {
                        hits: weapon.dice,
                        ids: [id],
                    }
                } else {
                    targetUnits[model.unitID].hits += weapon.dice;
                    targetUnits[model.unitID].ids.push(id);
                }
            }
        }
    
        let tip = '[🎲](#" class="showtip" title="Shooters without Targets' + shooterExceptions + ')';
        results = {
            shooterIDs: shooterIDs,
            shooterNotes: tip,
            error: "",
            targetUnitResults: targetUnits,
            buildingHit: buildingHit,
        }
        return results;
    }
}