const BuildCCArray = (id) => {
    let initialModel = ModelArray[id];
    let attacker = initialModel.player;
    let defender = (attacker === 0) ? 1:0;

    let unmatchedIDs = UnitArray[initialModel.unitID].modelIDs;
    let unitIDs = [initialModel.unitID];
    let attackerIDs = [];
    let defenderIDs = [];

    do {
        let id = unmatchedIDs.shift();
        let model = ModelArray[id];
        _.each(model.hex.neighbours(),hex => {
            let nids = hexMap[hex.label()].modelIDs;
            if (nids.length > 0) {
                _.each(nids,id2 => {
                    let model2 = ModelArray[id2];
                    if (model.player === attacker && model2.player === defender) {
                        if (attackerIDs.includes(id) === false) {
                            attackerIDs.push(id);
                            if (unitIDs.includes(model.unitID) === false) {
                                unitIDs.push(model.unitID);
                                unmatchedIDs = unmatchedIDs.concat(UnitArray[model.unitID].modelIDs);
                            }
                        }
                        if (defenderIDs.includes(id2) === false) {
                            defenderIDs.push(id2);
                            if (unitIDs.includes(model2.unitID) === false) {
                                unitIDs.push(model2.unitID);
                                unmatchedIDs = unmatchedIDs.concat(UnitArray[model2.unitID].modelIDs);
                            }
                        }
                    } else if (model.player === defender && model2.player === attacker) {
                        if (attackerIDs.includes(id2) === false) {
                            attackerIDs.push(id2);
                            if (unitIDs.includes(model2.unitID) === false) {
                                unitIDs.push(model2.unitID);
                                unmatchedIDs = unmatchedIDs.concat(UnitArray[model2.unitID].modelIDs);
                            }
                        }
                        if (defenderIDs.includes(id) === false) {
                            defenderIDs.push(id);
                            if (unitIDs.includes(model.unitID) === false) {
                                unitIDs.push(model.unitID);
                                unmatchedIDs = unmatchedIDs.concat(UnitArray[model.unitID].modelIDs);
                            }
                        }
                    }
                });
            }
        });
    } while (unmatchedIDs.length > 0);

    let CCArray = [];
    for (let i=0;i<attackerIDs.length;i++) {
        let id1 = attackerIDs[i];
        let model1 = ModelArray[id1];
    log(model1.name)
        let group = {
            attackerIDs: [id1],
            defenderIDs: [],
        };
        for (let j=0;j<defenderIDs.length;j++) {
            let id2 = defenderIDs[j];
            let model2 = ModelArray[id2];
        log(model2.name)
            let dist = ModelDistance(model1,model2).distance;
        log(dist)
            if (dist < 1) {
                group.defenderIDs.push(id2);
            }
        }
        CCArray.push(group);
    }
    CCArray.sort((a,b) => {
        return (a.defenderIDs.length - b.defenderIDs.length);
    })
    let dRatio = defenderIDs.length/attackerIDs.length;
    if (dRatio >= 1) {
        dRatio = Math.floor(dRatio);
        aRatio = 1;
    } else {
        dRatio = 1;
        aRatio = Math.floor(1/dRatio);
    }

    let defenderInfo = {};
    _.each(CCArray,group => {
        for (let i=0;i<group.defenderIDs.length;i++) {
            let id = group.defenderIDs[i];
            if (defenderInfo[id]) {
                defenderInfo[id]++;
            } else {
                defenderInfo[id] = 1;
            }
        }
    });

    SetupCard("Pre Sort","",initialModel.faction);
    for (let i=0;i<CCArray.length;i++) {
        let group = CCArray[i];
        if (i > 0) {
            outputCard.body.push("[hr]");
        }
        outputCard.body.push("Group " + (i+1));
        _.each(group.attackerIDs,id => {
            outputCard.body.push(ModelArray[id].name);
        })
        _.each(group.defenderIDs,id => {
            outputCard.body.push(ModelArray[id].name);
        })
    }
    outputCard.body.push("[hr]");
    let keys = Object.keys(defenderInfo);
    for (let i=0;i<keys.length;i++) {
        let line = ModelArray[keys[i]].name + ": " + defenderInfo[keys[i]];
        outputCard.body.push(line);
    }

    PrintCard();

    

    
    











}